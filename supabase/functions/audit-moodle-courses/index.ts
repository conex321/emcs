// ============================================================
// Edge Function: audit-moodle-courses
// Purpose: One-shot audit. For every course in the EMCS catalog,
//          looks up the matching Moodle course by idnumber=code.
//          Caches matches into courses.moodle_course_id so future
//          enrolments skip the lazy lookup.
//
// Auth: Bearer SUPABASE_SERVICE_ROLE_KEY (or SYNC_SECRET if you set one)
//
// Usage:
//   curl -X POST "$SUPABASE_URL/functions/v1/audit-moodle-courses" \
//     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
//
//   Optional body: { "dry_run": true } to skip writes.
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { getMoodleClient } from '../_shared/moodle-provisioning.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // The Supabase Edge gateway already verifies the JWT before forwarding;
    // we additionally require role=service_role so anon JWTs cannot run this audit.
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace(/^Bearer\s+/i, '').trim()
    let role: string | null = null
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      role = payload?.role || null
    } catch (_) {
      role = null
    }
    if (role !== 'service_role') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', detail: 'service_role JWT required', role }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { dry_run = false } = await req.json().catch(() => ({}))

    const moodle = getMoodleClient()
    if (!moodle) {
      return new Response(
        JSON.stringify({ error: 'MOODLE_WS_ENDPOINT or MOODLE_WS_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createServiceClient()
    const { data: courses, error: coursesErr } = await supabase
      .from('courses')
      .select('id, code, title, moodle_course_id')
      .order('code', { ascending: true })

    if (coursesErr) throw coursesErr

    const matched: Array<{ code: string; title: string; moodle_course_id: number; previously_cached: boolean }> = []
    const missing: Array<{ code: string; title: string }> = []
    const errors: Array<{ code: string; error: string }> = []
    let updated = 0

    for (const course of (courses || [])) {
      if (!course.code) continue

      try {
        const found = await moodle.getCourseByIdnumber(course.code)
        if (found?.id) {
          matched.push({
            code: course.code,
            title: course.title,
            moodle_course_id: found.id,
            previously_cached: course.moodle_course_id === found.id,
          })

          if (!dry_run && course.moodle_course_id !== found.id) {
            await supabase
              .from('courses')
              .update({ moodle_course_id: found.id })
              .eq('id', course.id)
            updated++
          }
        } else {
          missing.push({ code: course.code, title: course.title })
        }
      } catch (err) {
        errors.push({
          code: course.code,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dry_run,
        summary: {
          total_catalog: courses?.length || 0,
          matched: matched.length,
          missing: missing.length,
          errors: errors.length,
          newly_cached: updated,
        },
        matched,
        missing,
        errors,
      }, null, 2),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('audit-moodle-courses error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
