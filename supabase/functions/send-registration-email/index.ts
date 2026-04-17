// ============================================================
// Edge Function: send-registration-email
// Purpose: Send LMS credentials + admin notification via Resend
// Trigger: Called after student enrollment is created
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { sendEmail, generateMoodleUsername, generateTempPassword } from '../_shared/resend-client.ts'
import { buildRegistrationEmail, buildAdminNotificationEmail } from '../_shared/email-templates.ts'

const ADMIN_EMAIL = 'admin@canadaemcs.com'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabase = createServiceClient()
    const { order_id, student_id } = await req.json()

    if (!student_id) {
      return new Response(
        JSON.stringify({ error: 'student_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch student ──
    const { data: student, error: studentErr } = await supabase
      .from('students')
      .select('*')
      .eq('id', student_id)
      .single()

    if (studentErr || !student) {
      return new Response(
        JSON.stringify({ error: 'Student not found', details: studentErr?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch enrollment + course info ──
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        *,
        order_items:order_item_id (
          course_code,
          course_title,
          order_id
        )
      `)
      .eq('student_id', student_id)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })
      .limit(1)

    const enrollment = enrollments?.[0]
    const courseCode = enrollment?.order_items?.course_code || 'N/A'
    const courseTitle = enrollment?.order_items?.course_title || 'Your Course'

    // ── Fetch order for context ──
    let orderNumber = ''
    if (order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select('order_number')
        .eq('id', order_id)
        .single()
      orderNumber = order?.order_number || ''
    }

    // ── Generate Moodle credentials if first time ──
    let moodleUsername = student.moodle_username
    let moodlePassword = student.moodle_password

    if (!student.moodle_credentials_generated) {
      moodleUsername = generateMoodleUsername(student.first_name, student.last_name)

      // Check for username collisions
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('moodle_username', moodleUsername)
        .neq('id', student_id)

      if (existing && existing.length > 0) {
        // Append a number to deduplicate
        const suffix = existing.length + 1
        moodleUsername = `${moodleUsername}${suffix}`
      }

      moodlePassword = generateTempPassword()

      // Save credentials
      const { error: updateErr } = await supabase
        .from('students')
        .update({
          moodle_username: moodleUsername,
          moodle_password: moodlePassword,
          moodle_credentials_generated: true,
        })
        .eq('id', student_id)

      if (updateErr) {
        console.error('[send-registration-email] Failed to save credentials:', updateErr)
      }

      console.log(`[send-registration-email] Generated credentials for ${student.first_name}: ${moodleUsername}`)

      // TODO: When Moodle Web Services are configured, call core_user_create_users here
      // to create the actual Moodle account. For now, credentials are stored locally.
    }

    // ── Determine recipient email ──
    // Use student email if available, otherwise fall back to parent's email
    let recipientEmail = student.email
    if (!recipientEmail && order_id) {
      const { data: order } = await supabase
        .from('orders')
        .select('parent_details')
        .eq('id', order_id)
        .single()
      recipientEmail = order?.parent_details?.email
    }

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email available for student or parent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Send registration email to student/parent ──
    const registrationHtml = buildRegistrationEmail({
      studentFirstName: student.first_name,
      studentLastName: student.last_name,
      courseName: courseTitle,
      courseCode,
      moodleUsername: moodleUsername || '',
      moodlePassword: moodlePassword || '',
    })

    const regResult = await sendEmail({
      to: recipientEmail,
      subject: `Welcome to EMCS — Your LMS Login Credentials`,
      html: registrationHtml,
      tags: [
        { name: 'email_type', value: 'registration' },
        { name: 'student_id', value: student_id },
      ],
    })

    // Log registration email
    await supabase.from('email_log').insert({
      recipient: recipientEmail,
      template: 'registration',
      email_type: 'registration',
      subject: 'Welcome to EMCS — Your LMS Login Credentials',
      status: regResult.success ? 'sent' : 'failed',
      resend_id: regResult.resend_id || null,
      error_message: regResult.error || null,
      metadata: {
        student_id,
        order_id,
        student_name: `${student.first_name} ${student.last_name}`,
        moodle_username: moodleUsername,
        course: courseCode,
      },
    })

    // ── Send admin notification ──
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || ADMIN_EMAIL
    const adminHtml = buildAdminNotificationEmail({
      studentFirstName: student.first_name,
      studentLastName: student.last_name,
      studentEmail: recipientEmail,
      courseName: courseTitle,
      courseCode,
      moodleUsername: moodleUsername || '',
      orderNumber,
      registeredAt: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }),
    })

    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `[EMCS Admin] New Registration — ${student.first_name} ${student.last_name}`,
      html: adminHtml,
      tags: [
        { name: 'email_type', value: 'admin_notification' },
        { name: 'student_id', value: student_id },
      ],
    })

    // Log admin notification
    await supabase.from('email_log').insert({
      recipient: adminEmail,
      template: 'admin_notification',
      email_type: 'admin_notification',
      subject: `[EMCS Admin] New Registration — ${student.first_name} ${student.last_name}`,
      status: adminResult.success ? 'sent' : 'failed',
      resend_id: adminResult.resend_id || null,
      error_message: adminResult.error || null,
      metadata: {
        student_id,
        order_id,
        student_name: `${student.first_name} ${student.last_name}`,
      },
    })

    // ── Update student flags ──
    await supabase
      .from('students')
      .update({ registration_email_sent: true })
      .eq('id', student_id)

    console.log(`[send-registration-email] Registration: ${regResult.success ? '✓' : '✗'} → ${recipientEmail}`)
    console.log(`[send-registration-email] Admin copy:    ${adminResult.success ? '✓' : '✗'} → ${adminEmail}`)

    return new Response(
      JSON.stringify({
        success: regResult.success,
        registration: {
          sent: regResult.success,
          resend_id: regResult.resend_id,
          recipient: recipientEmail,
        },
        admin_notification: {
          sent: adminResult.success,
          resend_id: adminResult.resend_id,
          recipient: adminEmail,
        },
        credentials: {
          username: moodleUsername,
          generated: !student.moodle_credentials_generated, // was it newly generated?
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('send-registration-email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
