// ============================================================
// Edge Function: send-purchase-receipt
// Purpose: Send purchase confirmation email via Resend
// Trigger: Called after order status → paid
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
    const { order_id } = await req.json()

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Fetch order with items ──
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
        JSON.stringify({ error: 'Order not found', details: orderErr?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const recipientEmail = order.parent_details?.email
    const parentFirstName = order.parent_details?.firstName || order.parent_details?.first_name || 'Parent'

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email found in order' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Build email ──
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

    // ── Send via Resend ──
    const result = await sendEmail({
      to: recipientEmail,
      subject: `EMCS Purchase Confirmed — Order ${order.order_number}`,
      html,
      tags: [
        { name: 'email_type', value: 'purchase_receipt' },
        { name: 'order_id', value: order_id },
      ],
    })

    // ── Log in email_log ──
    await supabase.from('email_log').insert({
      recipient: recipientEmail,
      template: 'purchase_receipt',
      email_type: 'purchase_receipt',
      subject: `EMCS Purchase Confirmed — Order ${order.order_number}`,
      status: result.success ? 'sent' : 'failed',
      resend_id: result.resend_id || null,
      error_message: result.error || null,
      metadata: {
        order_id,
        order_number: order.order_number,
        course_count: courses.length,
      },
    })

    // ── Update student receipt flags ──
    const studentIds = (order.order_items || [])
      .map((item: any) => item.student_id)
      .filter(Boolean)

    if (studentIds.length > 0) {
      await supabase
        .from('students')
        .update({ receipt_email_sent: true })
        .in('id', studentIds)
    }

    console.log(`[send-purchase-receipt] ${result.success ? 'Sent' : 'Failed'} to ${recipientEmail} for order ${order.order_number}`)

    return new Response(
      JSON.stringify({
        success: result.success,
        resend_id: result.resend_id,
        recipient: recipientEmail,
        order_number: order.order_number,
        error: result.error,
      }),
      { status: result.success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('send-purchase-receipt error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
