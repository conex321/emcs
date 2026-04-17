// ============================================================
// Edge Function: sync-school
// Purpose: Twice-daily Moodle data sync (SISConex pattern)
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { MoodleClient } from '../_shared/moodle-client.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Verify sync secret (cron authorization)
    const authHeader = req.headers.get('Authorization')
    const syncSecret = Deno.env.get('SYNC_SECRET')

    if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
      // Also allow service_role JWT
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      if (!authHeader?.includes(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '___')) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const supabase = createServiceClient()
    const { school_slug } = await req.json().catch(() => ({}))

    // Get school(s) to sync
    let query = supabase.from('schools').select('*').eq('is_active', true)
    if (school_slug) {
      query = query.eq('slug', school_slug)
    }

    const { data: schools, error: schoolsErr } = await query
    if (schoolsErr) throw schoolsErr

    const results = []

    for (const school of (schools || [])) {
      console.log(`[sync] Starting sync for: ${school.name} (${school.slug})`)

      // Update sync status
      await supabase
        .from('schools')
        .update({ sync_status: 'syncing' })
        .eq('id', school.id)

      try {
        if (!school.moodle_url || !school.moodle_token) {
          throw new Error('Missing Moodle URL or token')
        }

        const moodle = new MoodleClient(school.moodle_url, school.moodle_token)

        // ── Step 1: Fetch courses ──
        const courses = await moodle.getCourses()
        const activeCourses = courses.filter((c: any) => c.id !== 1) // Exclude site course
        console.log(`[sync] Found ${activeCourses.length} courses`)

        let totalStudents = 0
        let totalSubmissions = 0

        // ── Step 2: For each course, fetch enrolled users ──
        for (const course of activeCourses) {
          const enrolled = await moodle.getEnrolledUsers(course.id)
          const students = enrolled.filter((u: any) =>
            u.roles?.some((r: any) => r.shortname === 'student')
          )

          // Upsert enrolled students
          for (const student of students) {
            await supabase.from('enrolled_students').upsert({
              school_id: school.id,
              moodle_user_id: student.id,
              first_name: student.firstname,
              last_name: student.lastname,
              full_name: `${student.firstname} ${student.lastname}`,
              username: student.username,
              email: student.email,
              courses: [course.shortname],
              course_ids: [course.id],
              roles: student.roles?.map((r: any) => r.shortname) || [],
              last_access: student.lastaccess
                ? new Date(student.lastaccess * 1000).toISOString()
                : null,
              profile_image: student.profileimageurl,
              synced_at: new Date().toISOString(),
            }, { onConflict: 'school_id,moodle_user_id' })

            totalStudents++
          }

          // ── Step 3: Fetch assignments and submissions ──
          try {
            const assignmentData = await moodle.getAssignments([course.id])
            const assignments = assignmentData?.courses?.[0]?.assignments || []

            if (assignments.length > 0) {
              const assignmentIds = assignments.map((a: any) => a.id)
              const submissionData = await moodle.getSubmissions(assignmentIds)

              for (const assignment of (submissionData?.assignments || [])) {
                const assignmentInfo = assignments.find((a: any) => a.id === assignment.assignmentid)

                for (const submission of (assignment.submissions || [])) {
                  await supabase.from('student_submissions').upsert({
                    school_id: school.id,
                    moodle_user_id: submission.userid,
                    course_code: course.shortname,
                    course_name: course.fullname,
                    moodle_course_id: course.id,
                    assignment_name: assignmentInfo?.name || 'Unknown',
                    assignment_cmid: assignmentInfo?.cmid,
                    activity_type: 'assign',
                    submitted_at: submission.timecreated
                      ? new Date(submission.timecreated * 1000).toISOString()
                      : null,
                    status: submission.status,
                    synced_at: new Date().toISOString(),
                  }, { onConflict: 'school_id,moodle_user_id,assignment_cmid' })

                  totalSubmissions++
                }
              }
            }
          } catch (assignErr) {
            console.warn(`[sync] Assignment fetch failed for course ${course.shortname}:`, assignErr)
            await supabase.from('sync_errors').insert({
              school_id: school.id,
              sync_type: 'submissions',
              severity: 'warning',
              message: `Assignment fetch failed for ${course.shortname}: ${assignErr.message}`,
            })
          }
        }

        // ── Step 4: Update daily metrics ──
        const today = new Date().toISOString().split('T')[0]
        await supabase.from('school_daily_metrics').upsert({
          school_id: school.id,
          metric_date: today,
          total_students: totalStudents,
          total_submissions: totalSubmissions,
        }, { onConflict: 'school_id,metric_date' })

        // ── Step 5: Mark sync complete ──
        await supabase
          .from('schools')
          .update({
            sync_status: 'success',
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', school.id)

        results.push({
          school: school.slug,
          status: 'success',
          courses: activeCourses.length,
          students: totalStudents,
          submissions: totalSubmissions,
        })

        console.log(`[sync] Completed: ${school.slug} — ${totalStudents} students, ${totalSubmissions} submissions`)

      } catch (schoolErr) {
        console.error(`[sync] Failed for ${school.slug}:`, schoolErr)

        await supabase
          .from('schools')
          .update({ sync_status: 'error' })
          .eq('id', school.id)

        await supabase.from('sync_errors').insert({
          school_id: school.id,
          sync_type: 'full',
          severity: 'error',
          message: schoolErr.message,
          details: { stack: schoolErr.stack },
        })

        results.push({
          school: school.slug,
          status: 'error',
          error: schoolErr.message,
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('sync-school error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
