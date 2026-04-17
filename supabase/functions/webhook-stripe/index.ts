// ============================================================
// Edge Function: webhook-stripe
// Purpose: Handle Stripe payment_intent.succeeded webhook
// Updated: Triggers Resend purchase receipt + registration emails
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createServiceClient } from '../_shared/supabase-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createServiceClient()

    // Verify Stripe signature
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const body = await req.text()

    // In production, verify the signature with Stripe SDK
    // For now, we parse the event directly
    const event = JSON.parse(body)

    console.log(`Stripe webhook received: ${event.type}`)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata?.order_id

        if (!orderId) {
          console.error('No order_id in PaymentIntent metadata')
          break
        }

        // Update order status to paid
        const { data: order, error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_intent_id: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .select('*, order_items(*)')
          .single()

        if (updateError) {
          console.error('Failed to update order:', updateError)
          break
        }

        console.log(`Order ${order.order_number} marked as paid`)

        // Auto-create enrollments from order items + student details
        const studentDetails = order.student_details || []
        const createdStudentIds: string[] = []

        for (const item of (order.order_items || [])) {
          // Try to find or create student
          for (const student of studentDetails) {
            const { data: existingStudent } = await supabase
              .from('students')
              .select('id')
              .eq('parent_id', order.parent_id)
              .eq('first_name', student.firstName || student.first_name)
              .eq('last_name', student.lastName || student.last_name)
              .single()

            let studentId = existingStudent?.id
            if (!studentId) {
              const { data: newStudent } = await supabase
                .from('students')
                .insert({
                  parent_id: order.parent_id,
                  first_name: student.firstName || student.first_name,
                  last_name: student.lastName || student.last_name,
                  date_of_birth: student.dateOfBirth || student.date_of_birth,
                  current_grade: student.currentGrade || student.current_grade,
                  previous_school: student.previousSchool || student.previous_school,
                  email: student.email || order.parent_details?.email,
                })
                .select()
                .single()
              studentId = newStudent?.id
            }

            if (studentId && item.course_id) {
              // Create enrollment
              await supabase
                .from('enrollments')
                .upsert({
                  student_id: studentId,
                  course_id: item.course_id,
                  order_item_id: item.id,
                  status: 'active',
                  enrolled_at: new Date().toISOString(),
                }, { onConflict: 'student_id,course_id' })

              // Update order item with student_id
              await supabase
                .from('order_items')
                .update({ student_id: studentId })
                .eq('id', item.id)

              // Track for email sending
              if (!createdStudentIds.includes(studentId)) {
                createdStudentIds.push(studentId)
              }
            }
          }
        }

        // ── Trigger Purchase Receipt Email ──
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL')
          const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

          await fetch(`${supabaseUrl}/functions/v1/send-purchase-receipt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({ order_id: orderId }),
          })
          console.log(`[webhook] Triggered purchase receipt for order ${order.order_number}`)
        } catch (emailErr) {
          console.error('[webhook] Failed to trigger purchase receipt:', emailErr)
        }

        // ── Trigger Registration Email for each student ──
        for (const studentId of createdStudentIds) {
          try {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

            await fetch(`${supabaseUrl}/functions/v1/send-registration-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`,
              },
              body: JSON.stringify({ order_id: orderId, student_id: studentId }),
            })
            console.log(`[webhook] Triggered registration email for student ${studentId}`)
          } catch (emailErr) {
            console.error(`[webhook] Failed to trigger registration email for ${studentId}:`, emailErr)
          }
        }

        // Handle agent commission
        if (order.agent_code) {
          const { data: agent } = await supabase
            .from('agents')
            .select('id, commission_rate_credit, commission_rate_noncredit')
            .eq('agent_code', order.agent_code)
            .eq('is_active', true)
            .single()

          if (agent) {
            let commissionAmount = 0
            for (const item of (order.order_items || [])) {
              if (!item.is_bundled) {
                // Simple: use credit rate for credit courses, non-credit for others
                commissionAmount += agent.commission_rate_credit || 52
              }
            }

            if (commissionAmount > 0) {
              await supabase.from('commissions').insert({
                agent_id: agent.id,
                order_id: orderId,
                amount: commissionAmount,
                currency: 'CAD',
                status: 'pending',
                items: order.order_items?.map((i: any) => ({
                  course_code: i.course_code,
                  price: i.price,
                })),
              })
            }
          }
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await supabase
            .from('orders')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('id', orderId)

          console.log(`Order ${orderId} marked as failed`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
