// ============================================================
// Edge Function: process-payment
// Purpose: Validate cart, apply coupon, create Stripe PaymentIntent
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseAdmin = createServiceClient()

    const {
      cart_items,
      parent_details,
      student_details,
      coupon_code,
      payment_method = 'card',
    } = await req.json()

    if (!cart_items || cart_items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Cart is empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ── Step 1: Validate courses exist and get current prices ──
    const courseCodes = cart_items.map((item: any) => item.code || item.course_code)
    const { data: courses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('id, code, title, list_price, base_price, sale_price, per_course_price, storefront, grade_level')
      .in('code', courseCodes)

    if (coursesError) throw coursesError

    // ── Step 2: Calculate pricing ──
    let subtotal = 0
    const lineItems = cart_items.map((item: any) => {
      const course = courses?.find((c: any) => c.code === (item.code || item.course_code))
      const price = item.is_bundled ? 0 : (
        course?.per_course_price || course?.sale_price || course?.base_price || course?.list_price || item.price || 0
      )
      subtotal += price
      return {
        course_code: item.code || item.course_code,
        course_title: course?.title || item.title,
        course_id: course?.id,
        storefront: course?.storefront || item.storefront,
        grade_level: course?.grade_level ?? null,
        pathway: item.pathway || 'self-paced',
        price,
        is_bundled: item.is_bundled || false,
        bundle_reason: item.bundle_reason || null,
      }
    })

    // ── Step 2b: Apply G9-12 Academic Ontario Record self-paced cart rule ──
    //   1 credit:  +$50 surcharge (=$450 standalone)
    //   2-5:       $400 each (no adjustment)
    //   6+:        cap at $1,800 bundle total
    const hsSelfPacedLines = lineItems.filter((li: any) =>
      !li.is_bundled &&
      (li.storefront === 'credit' || li.storefront === 'official-ontario') &&
      Number(li.grade_level) >= 9 && Number(li.grade_level) <= 12 &&
      String(li.pathway).toLowerCase() !== 'live-teacher'
    )
    let hsAdjustment = 0
    let hsRule = 'none'
    if (hsSelfPacedLines.length === 1) {
      hsAdjustment = 50
      hsRule = 'single-credit-standalone'
    } else if (hsSelfPacedLines.length >= 6) {
      const currentSum = hsSelfPacedLines.reduce((s: number, li: any) => s + Number(li.price || 0), 0)
      hsAdjustment = 1800 - currentSum
      hsRule = 'bundle-6-cap'
    }
    subtotal += hsAdjustment

    // ── Step 3: Validate coupon ──
    let discount = 0
    let validatedCoupon = null
    let agentCode = null

    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (coupon) {
        // Check expiry
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
          // Coupon expired, skip
        }
        // Check max uses
        else if (coupon.max_uses && coupon.use_count >= coupon.max_uses) {
          // Max uses reached, skip
        } else {
          validatedCoupon = coupon
          if (coupon.type === 'percent') {
            const effectivePercent = Math.min(coupon.value, coupon.max_discount || 60)
            discount = subtotal * (effectivePercent / 100)
          } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, subtotal * 0.6) // Cap at 60%
          }

          // Extract agent code if agent-linked
          if (coupon.agent_id) {
            const { data: agent } = await supabaseAdmin
              .from('agents')
              .select('agent_code')
              .eq('id', coupon.agent_id)
              .single()
            agentCode = agent?.agent_code
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discount)

    // ── Step 4: Create order ──
    // Get or identify user
    let parentId = null
    try {
      const supabaseUser = createUserClient(req)
      const { data: { user } } = await supabaseUser.auth.getUser()
      parentId = user?.id
    } catch {
      // Guest checkout — no user ID
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: '', // Auto-generated by trigger
        parent_id: parentId,
        status: 'pending',
        subtotal,
        discount,
        total,
        currency: 'CAD',
        coupon_code: validatedCoupon?.code || null,
        agent_code: agentCode,
        payment_method,
        parent_details: parent_details || {},
        student_details: student_details || [],
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    for (const item of lineItems) {
      await supabaseAdmin
        .from('order_items')
        .insert({
          order_id: order.id,
          course_id: item.course_id,
          course_code: item.course_code,
          course_title: item.course_title,
          price: item.price,
          is_bundled: item.is_bundled,
          bundle_reason: item.bundle_reason,
        })
    }

    // Increment coupon use count
    if (validatedCoupon) {
      await supabaseAdmin
        .from('coupons')
        .update({ use_count: (validatedCoupon.use_count || 0) + 1 })
        .eq('id', validatedCoupon.id)
    }

    // ── Step 5: Create Stripe PaymentIntent (if card payment) ──
    let clientSecret = null
    let paymentIntentId = null

    if (payment_method === 'card' && total > 0) {
      const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
      if (!stripeKey) {
        throw new Error('Stripe is not configured')
      }

      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(total * 100).toString(),
          currency: 'cad',
          'metadata[order_id]': order.id,
          'metadata[order_number]': order.order_number,
          automatic_payment_methods: 'true',
        }).toString(),
      })

      const paymentIntent = await stripeResponse.json()
      if (paymentIntent.error) {
        throw new Error(paymentIntent.error.message)
      }

      clientSecret = paymentIntent.client_secret
      paymentIntentId = paymentIntent.id

      // Save PaymentIntent ID to order
      await supabaseAdmin
        .from('orders')
        .update({ payment_intent_id: paymentIntentId })
        .eq('id', order.id)
    }

    // If total is 0 (fully discounted), mark as paid immediately
    if (total === 0) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', payment_method: 'free' })
        .eq('id', order.id)
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
        subtotal,
        discount,
        total,
        payment_method,
        client_secret: clientSecret,
        requires_payment: total > 0,
        hs_self_paced_rule: hsRule,
        hs_self_paced_adjustment: hsAdjustment,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('process-payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
