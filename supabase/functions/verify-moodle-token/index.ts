// ============================================================
// Edge Function: verify-moodle-token
// Purpose: One-shot diagnostic. Calls Moodle core_webservice_get_site_info
//          to surface exactly which WS functions the token can call and
//          the username/userid behind the token. Use this when provisioning
//          writes (core_user_create_users, enrol_manual_enrol_users) fail
//          silently to confirm whether the token lacks those capabilities.
//
// Auth: Bearer SUPABASE_SERVICE_ROLE_KEY
//
// Usage:
//   curl -X POST "$SUPABASE_URL/functions/v1/verify-moodle-token" \
//     -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { getMoodleClient } from '../_shared/moodle-provisioning.ts'

const REQUIRED_WRITE_FUNCTIONS = [
  'core_user_create_users',
  'enrol_manual_enrol_users',
]

const REQUIRED_READ_FUNCTIONS = [
  'core_user_get_users_by_field',
  'core_course_get_courses_by_field',
  'core_course_get_courses',
  'core_webservice_get_site_info',
]

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
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

    const moodle = getMoodleClient()
    if (!moodle) {
      return new Response(
        JSON.stringify({
          error: 'MOODLE_WS_ENDPOINT or MOODLE_WS_TOKEN not configured',
          hint: 'Set these via: supabase secrets set MOODLE_WS_ENDPOINT=... MOODLE_WS_TOKEN=...',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const info = await moodle.getSiteInfo()

    const allowedFunctions: string[] = Array.isArray(info?.functions)
      ? info.functions.map((f: any) => f?.name).filter(Boolean)
      : []

    const missingWrite = REQUIRED_WRITE_FUNCTIONS.filter(fn => !allowedFunctions.includes(fn))
    const missingRead = REQUIRED_READ_FUNCTIONS.filter(fn => !allowedFunctions.includes(fn))

    return new Response(
      JSON.stringify({
        success: true,
        token_user: {
          userid: info?.userid,
          username: info?.username,
          fullname: info?.fullname,
          sitename: info?.sitename,
          release: info?.release,
        },
        capabilities: {
          total_allowed: allowedFunctions.length,
          missing_write: missingWrite,
          missing_read: missingRead,
          has_all_required: missingWrite.length === 0 && missingRead.length === 0,
        },
        next_step: missingWrite.length > 0
          ? `Moodle admin must add [${missingWrite.join(', ')}] to this token's external service (Site admin → Server → Web services → External services → Functions).`
          : missingRead.length > 0
            ? `Moodle admin must add [${missingRead.join(', ')}] to this token's external service.`
            : 'Token has all required capabilities. If provisioning still fails, check sync_errors for the actual exception.',
        allowed_functions: allowedFunctions,
      }, null, 2),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('verify-moodle-token error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
