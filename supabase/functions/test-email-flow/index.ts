// ============================================================
// Edge Function: test-email-flow
// Purpose: End-to-end test of purchase receipt + registration
//          emails via Resend to matthew@schoolconex.com
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { sendEmail, generateMoodleUsername, generateTempPassword } from '../_shared/resend-client.ts'
import { buildPurchaseReceiptEmail, buildRegistrationEmail, buildAdminNotificationEmail } from '../_shared/email-templates.ts'

const TEST_EMAIL = 'matthew@schoolconex.com'
const ADMIN_EMAIL = 'admin@canadaemcs.com'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabase = createServiceClient()
    const results: Record<string, unknown> = {}

    // Allow overriding test email via request body
    let targetEmail = TEST_EMAIL
    try {
      const body = await req.json()
      if (body?.email) targetEmail = body.email
    } catch {
      // No body or invalid JSON — use default
    }

    console.log(`[test-email-flow] Starting full e2e test → ${targetEmail}`)

    // ── Step 1: Generate test data ──
    const testStudentFirst = 'Matthew'
    const testStudentLast = 'Test'
    const testOrderNumber = `EMCS-TEST-${Date.now()}`
    const testOrderDate = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const testCourses = [
      { course_code: 'ENG4U', course_title: 'English, Grade 12, University', price: 1500, is_bundled: false },
      { course_code: 'MHF4U', course_title: 'Advanced Functions, Grade 12', price: 1500, is_bundled: false },
      { course_code: 'MCV4U', course_title: 'Calculus and Vectors, Grade 12', price: 0, is_bundled: true },
    ]

    const moodleUsername = generateMoodleUsername(testStudentFirst, testStudentLast)
    const moodlePassword = generateTempPassword()

    results.generated_credentials = { username: moodleUsername, password: moodlePassword }

    // ── Step 2: Send Purchase Receipt ──
    console.log('[test-email-flow] Sending purchase receipt...')
    const receiptHtml = buildPurchaseReceiptEmail({
      parentFirstName: testStudentFirst,
      orderNumber: testOrderNumber,
      orderDate: testOrderDate,
      courses: testCourses,
      subtotal: 3000,
      discount: 0,
      total: 3000,
      currency: 'CAD',
    })

    const receiptResult = await sendEmail({
      to: targetEmail,
      subject: `EMCS Purchase Confirmed — Order ${testOrderNumber}`,
      html: receiptHtml,
      tags: [
        { name: 'email_type', value: 'purchase_receipt' },
        { name: 'test', value: 'true' },
      ],
    })

    results.purchase_receipt = {
      success: receiptResult.success,
      resend_id: receiptResult.resend_id,
      error: receiptResult.error,
    }

    // Log to email_log
    await supabase.from('email_log').insert({
      recipient: targetEmail,
      template: 'purchase_receipt',
      email_type: 'purchase_receipt',
      subject: `EMCS Purchase Confirmed — Order ${testOrderNumber}`,
      status: receiptResult.success ? 'sent' : 'failed',
      resend_id: receiptResult.resend_id || null,
      error_message: receiptResult.error || null,
      metadata: {
        test: true,
        order_number: testOrderNumber,
        course_count: testCourses.length,
      },
    })

    // ── Step 3: Send Registration Email ──
    console.log('[test-email-flow] Sending registration email...')
    const registrationHtml = buildRegistrationEmail({
      studentFirstName: testStudentFirst,
      studentLastName: testStudentLast,
      courseName: 'English, Grade 12, University',
      courseCode: 'ENG4U',
      moodleUsername,
      moodlePassword,
    })

    const regResult = await sendEmail({
      to: targetEmail,
      subject: 'Welcome to EMCS — Your LMS Login Credentials',
      html: registrationHtml,
      tags: [
        { name: 'email_type', value: 'registration' },
        { name: 'test', value: 'true' },
      ],
    })

    results.registration = {
      success: regResult.success,
      resend_id: regResult.resend_id,
      error: regResult.error,
    }

    // Log to email_log
    await supabase.from('email_log').insert({
      recipient: targetEmail,
      template: 'registration',
      email_type: 'registration',
      subject: 'Welcome to EMCS — Your LMS Login Credentials',
      status: regResult.success ? 'sent' : 'failed',
      resend_id: regResult.resend_id || null,
      error_message: regResult.error || null,
      metadata: {
        test: true,
        student_name: `${testStudentFirst} ${testStudentLast}`,
        moodle_username: moodleUsername,
        course: 'ENG4U',
      },
    })

    // ── Step 4: Send Admin Notification ──
    console.log('[test-email-flow] Sending admin notification...')
    const adminHtml = buildAdminNotificationEmail({
      studentFirstName: testStudentFirst,
      studentLastName: testStudentLast,
      studentEmail: targetEmail,
      courseName: 'English, Grade 12, University',
      courseCode: 'ENG4U',
      moodleUsername,
      orderNumber: testOrderNumber,
      registeredAt: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }),
    })

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || ADMIN_EMAIL
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `[EMCS Admin] New Registration — ${testStudentFirst} ${testStudentLast}`,
      html: adminHtml,
      tags: [
        { name: 'email_type', value: 'admin_notification' },
        { name: 'test', value: 'true' },
      ],
    })

    results.admin_notification = {
      success: adminResult.success,
      resend_id: adminResult.resend_id,
      recipient: adminEmail,
      error: adminResult.error,
    }

    // Log to email_log
    await supabase.from('email_log').insert({
      recipient: adminEmail,
      template: 'admin_notification',
      email_type: 'admin_notification',
      subject: `[EMCS Admin] New Registration — ${testStudentFirst} ${testStudentLast}`,
      status: adminResult.success ? 'sent' : 'failed',
      resend_id: adminResult.resend_id || null,
      error_message: adminResult.error || null,
      metadata: {
        test: true,
        student_name: `${testStudentFirst} ${testStudentLast}`,
      },
    })

    // ── Summary ──
    const allSuccess =
      receiptResult.success && regResult.success && adminResult.success

    console.log(`[test-email-flow] Complete. All succeeded: ${allSuccess}`)
    console.log(`  Purchase receipt: ${receiptResult.success ? '✓' : '✗'} ${receiptResult.resend_id || ''}`)
    console.log(`  Registration:    ${regResult.success ? '✓' : '✗'} ${regResult.resend_id || ''}`)
    console.log(`  Admin copy:      ${adminResult.success ? '✓' : '✗'} ${adminResult.resend_id || ''}`)

    return new Response(
      JSON.stringify({
        success: allSuccess,
        test_email: targetEmail,
        admin_email: adminEmail,
        results,
        email_log_count: 3,
        message: allSuccess
          ? `All 3 emails sent successfully to ${targetEmail} (+ admin copy to ${adminEmail})`
          : 'Some emails failed — check results for details',
      }),
      {
        status: allSuccess ? 200 : 207,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('test-email-flow error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
