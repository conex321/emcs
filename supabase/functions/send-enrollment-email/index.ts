// ============================================================
// Edge Function: send-enrollment-email
// Purpose: Send enrollment confirmation emails via Resend
// Updated: Now uses Resend API instead of placeholder logging
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'
import { sendEmail } from '../_shared/resend-client.ts'
import { buildPurchaseReceiptEmail } from '../_shared/email-templates.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabase = createServiceClient()
    const { order_id, template = 'enrollment_confirmation' } = await req.json()

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch order with items
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          course_code,
          course_title,
          price,
          is_bundled,
          student_id
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const recipientEmail = order.parent_details?.email
    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email found in order' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build email content
    const parentFirstName = order.parent_details?.firstName || order.parent_details?.first_name || 'Parent'
    const courses = (order.order_items || []).map((item: any) => ({
      course_code: item.course_code,
      course_title: item.course_title,
      price: item.price || 0,
      is_bundled: item.is_bundled || false,
    }))

    const orderDate = new Date(order.created_at).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const html = buildPurchaseReceiptEmail({
      parentFirstName,
      orderNumber: order.order_number,
      orderDate,
      courses,
      subtotal: order.subtotal || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      currency: order.currency || 'CAD',
    })

    // Send via Resend
    const subject = `EMCS Enrollment Confirmed — Order ${order.order_number}`
    const result = await sendEmail({
      to: recipientEmail,
      subject,
      html,
      tags: [
        { name: 'email_type', value: 'enrollment_confirmation' },
        { name: 'order_id', value: order_id },
      ],
    })

    // Log in email_log table
    const { error: logErr } = await supabase.from('email_log').insert({
      recipient: recipientEmail,
      template,
      email_type: 'enrollment_confirmation',
      subject,
      status: result.success ? 'sent' : 'failed',
      resend_id: result.resend_id || null,
      error_message: result.error || null,
      metadata: {
        order_id,
        order_number: order.order_number,
        course_count: courses.length,
      },
    })

    if (logErr) console.error('Email log error:', logErr)

    console.log(`[send-enrollment-email] ${result.success ? 'Sent' : 'Failed'} to ${recipientEmail}`)

    return new Response(
      JSON.stringify({
        success: result.success,
        resend_id: result.resend_id,
        message: `Email ${template} ${result.success ? 'sent' : 'failed'} for ${recipientEmail}`,
        error: result.error,
      }),
      { status: result.success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('send-enrollment-email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
