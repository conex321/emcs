// ============================================================
// Edge Function: seed-k8-from-moodle
// Purpose: One-shot K-8 catalog seed.
//
//   Pulls every course from the linked Moodle (excluding the site course
//   id=1) and produces TWO rows in public.courses for each:
//     A) storefront='academic-prep'   — Non-Academic Ontario Record, $50
//     B) storefront='official-ontario' — Academic Ontario Record self-paced, $350
//
//   Both rows share the same moodle_course_id so future enrolments skip
//   the lazy lookup. Code → subject + grade is derived from the Moodle
//   `idnumber` (e.g. MAT05 → Mathematics, Grade 5).
//
// Auth: service_role JWT (decoded; gateway also gates).
//
// Body:
//   { dry_run?: boolean = false, prefix_filter?: string[] }
//
//     dry_run       → return the proposed rows without writing
//     prefix_filter → only seed Moodle courses whose idnumber starts with
//                     one of these prefixes. Useful for pilot runs
//                     (e.g. ["MAT","LAN"] to seed Math + Language only).
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { getMoodleClient } from '../_shared/moodle-provisioning.ts'

const SUBJECT_BY_PREFIX: Record<string, string> = {
  MAT: 'Mathematics',
  LAN: 'Language',
  SCI: 'Science and Technology',
  CFR: 'Core French',
  GEO: 'Geography',
  HIS: 'History',
  ART: 'The Arts',
  HPE: 'Health and Physical Education',
  SST: 'Social Studies',
}

interface ParsedCode {
  prefix: string
  gradeNum: number
  subject: string
}

function parseCode(idnumber: string): ParsedCode | null {
  // Expected shape: 3 letters + 2 digits, e.g. MAT05, LAN07, SST03
  const m = /^([A-Z]{3})(\d{1,2})$/.exec(idnumber.trim())
  if (!m) return null
  const prefix = m[1]
  const gradeNum = parseInt(m[2], 10)
  if (gradeNum < 1 || gradeNum > 8) return null
  const subject = SUBJECT_BY_PREFIX[prefix]
  if (!subject) return null
  return { prefix, gradeNum, subject }
}

interface SeedRow {
  code: string
  title: string
  grade: string
  subject: string
  storefront: 'academic-prep' | 'official-ontario'
  course_type: 'Elementary' | 'Academic Preparation' | 'Official Ontario Program'
  credit_value: number
  is_ossd: boolean
  list_price: number
  base_price: number
  per_course_price: number
  status: 'published'
  moodle_course_id: number
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Require a service_role JWT — same gate as audit-moodle-courses
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    let role: string | null = null
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      role = payload?.role || null
    } catch (_) { role = null }

    if (role !== 'service_role') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', detail: 'service_role JWT required', role }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { dry_run = false, prefix_filter } = await req.json().catch(() => ({}))
    const prefixes: string[] | null = Array.isArray(prefix_filter) && prefix_filter.length > 0
      ? prefix_filter.map((p: string) => p.toUpperCase())
      : null

    const moodle = getMoodleClient()
    if (!moodle) {
      return new Response(
        JSON.stringify({ error: 'MOODLE_WS_ENDPOINT or MOODLE_WS_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createServiceClient()
    const moodleCourses = await moodle.getCourses()

    const candidates = (moodleCourses || []).filter((c: any) => c.id && c.id !== 1)

    const rows: SeedRow[] = []
    const skipped: Array<{ moodle_id: number; idnumber: string; reason: string }> = []

    for (const m of candidates) {
      const idnumber = (m.idnumber || '').trim()
      if (!idnumber) {
        skipped.push({ moodle_id: m.id, idnumber: '(empty)', reason: 'no idnumber set on Moodle course' })
        continue
      }
      if (prefixes && !prefixes.some((p) => idnumber.startsWith(p))) continue

      const parsed = parseCode(idnumber)
      if (!parsed) {
        skipped.push({ moodle_id: m.id, idnumber, reason: 'idnumber does not match SUBJECT(3)+GRADE(1-2) pattern, or unknown subject prefix, or grade outside 1-8' })
        continue
      }

      const courseType: SeedRow['course_type'] = 'Elementary'
      const titleBase = m.fullname?.trim() || `${parsed.subject} Grade ${parsed.gradeNum}`

      const baseRow = {
        code: idnumber,
        title: titleBase,
        grade: `Grade ${parsed.gradeNum}`,
        subject: parsed.subject,
        course_type: courseType,
        status: 'published' as const,
        moodle_course_id: m.id,
      }

      // Row A — Non-Academic Ontario Record (Academic Prep storefront)
      rows.push({
        ...baseRow,
        storefront: 'academic-prep',
        credit_value: 0,
        is_ossd: false,
        list_price: 50,
        base_price: 50,
        per_course_price: 50,
      })

      // Row B — Academic Ontario Record self-paced (Official Ontario storefront)
      rows.push({
        ...baseRow,
        storefront: 'official-ontario',
        credit_value: 0,            // K-8 don't carry OSSD credit value
        is_ossd: false,             // not an OSSD-credit course (OSSD starts G9)
        list_price: 350,
        base_price: 350,
        per_course_price: 350,
      })
    }

    let inserted = 0
    let updated = 0
    if (!dry_run && rows.length > 0) {
      // Upsert by (code, storefront) — composite unique from migration 015.
      const { data, error } = await supabase
        .from('courses')
        .upsert(rows, { onConflict: 'code,storefront', ignoreDuplicates: false })
        .select('id, code, storefront, created_at, updated_at')
      if (error) throw error
      // Best-effort split: rows whose created_at == updated_at are new
      for (const r of (data || [])) {
        if (r.created_at === r.updated_at) inserted++
        else updated++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dry_run,
        moodle_total: candidates.length,
        proposed_rows: rows.length,
        inserted: dry_run ? null : inserted,
        updated: dry_run ? null : updated,
        skipped,
        sample: rows.slice(0, 6),
      }, null, 2),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('seed-k8-from-moodle error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
