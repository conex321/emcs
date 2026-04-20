// ============================================================
// Edge Function: enroll-student
// Purpose: Create student records and enrollments post-payment
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts'

function nullIfBlank(value: unknown) {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null
  }

  return value
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseUser = createUserClient(req)
    const supabaseAdmin = createServiceClient()

    // Verify the calling user
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { order_id, students, courses } = await req.json()

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify order belongs to user and is paid
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (order.status !== 'paid') {
      return new Response(
        JSON.stringify({ error: 'Order is not paid' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const normalizedOrderEmail = String(order.parent_details?.email || '').trim().toLowerCase()
    const normalizedUserEmail = String(user.email || '').trim().toLowerCase()
    const orderBelongsToUser = order.parent_id
      ? order.parent_id === user.id
      : Boolean(normalizedOrderEmail && normalizedOrderEmail === normalizedUserEmail)

    if (!orderBelongsToUser) {
      return new Response(
        JSON.stringify({ error: 'You do not have access to enroll students for this order' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!order.parent_id) {
      await supabaseAdmin
        .from('orders')
        .update({ parent_id: user.id, updated_at: new Date().toISOString() })
        .eq('id', order_id)
    }

    const createdEnrollments = []
    const touchedStudentIds = new Set<string>()
    const skippedCourses: string[] = []

    // Process each student
    for (const studentData of (students || [])) {
      // Create or find student
      let studentId = studentData.id

      if (!studentId) {
        const { data: newStudent, error: studentError } = await supabaseAdmin
          .from('students')
          .insert({
            parent_id: user.id,
            first_name: nullIfBlank(studentData.first_name || studentData.firstName),
            last_name: nullIfBlank(studentData.last_name || studentData.lastName),
            email: nullIfBlank(studentData.email),
            date_of_birth: nullIfBlank(studentData.date_of_birth || studentData.dateOfBirth),
            current_grade: nullIfBlank(studentData.current_grade || studentData.currentGrade),
            previous_school: nullIfBlank(studentData.previous_school || studentData.previousSchool),
          })
          .select()
          .single()

        if (studentError) throw studentError
        studentId = newStudent.id
      }

      touchedStudentIds.add(studentId)

      await supabaseAdmin
        .from('student_documents')
        .update({
          student_id: studentId,
          status: 'linked',
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', order_id)
        .eq('student_index', studentData.index ?? 0)

      // Create enrollments for each course assigned to this student
      const studentCourses = (courses || []).filter(
        (c: any) =>
          c.student_index === studentData.index ||
          c.student_index === undefined ||
          c.student_index === null
      )

      for (const courseData of studentCourses) {
        const courseCode = courseData.course_code || courseData.code
        const courseStorefront = courseData.storefront || null

        // Find the order item — it carries the authoritative course_id, which uniquely
        // identifies the (code, storefront) row in the catalog (course_id is unique even
        // though `code` no longer is). This avoids the storefront-ambiguity problem entirely.
        const { data: unassignedOrderItem } = await supabaseAdmin
          .from('order_items')
          .select('id, course_id')
          .eq('order_id', order_id)
          .eq('course_code', courseCode)
          .is('student_id', null)
          .maybeSingle()

        let orderItemId = unassignedOrderItem?.id || null
        let courseId: string | null = unassignedOrderItem?.course_id || null

        if (unassignedOrderItem?.id) {
          await supabaseAdmin
            .from('order_items')
            .update({ student_id: studentId })
            .eq('id', unassignedOrderItem.id)
        } else {
          const { data: existingOrderItem } = await supabaseAdmin
            .from('order_items')
            .select('id, course_id')
            .eq('order_id', order_id)
            .eq('course_code', courseCode)
            .eq('student_id', studentId)
            .maybeSingle()

          orderItemId = existingOrderItem?.id || null
          courseId = existingOrderItem?.course_id || courseId
        }

        // Fall back to courses lookup if the order_item didn't carry a course_id
        // (legacy orders, or order created before process-payment populated course_id).
        if (!courseId) {
          let q = supabaseAdmin.from('courses').select('id').eq('code', courseCode)
          if (courseStorefront) q = q.eq('storefront', courseStorefront)
          const { data: course } = await q.maybeSingle()

          if (!course) {
            skippedCourses.push(courseCode)
            continue
          }
          courseId = course.id
        }

        // Create enrollment (upsert to handle idempotency)
        const { data: enrollment, error: enrollError } = await supabaseAdmin
          .from('enrollments')
          .upsert({
            student_id: studentId,
            course_id: courseId,
            order_item_id: orderItemId,
            status: 'active',
            enrolled_at: new Date().toISOString(),
          }, { onConflict: 'student_id,course_id' })
          .select()
          .single()

        if (enrollError) {
          console.error(`Enrollment error for student ${studentId}, course ${courseId}:`, enrollError)
          continue
        }

        createdEnrollments.push(enrollment)
      }
    }

    if ((courses || []).length > 0 && createdEnrollments.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No enrollments were created for this order',
          skipped_courses: skippedCourses,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update order status to processing
    await supabaseAdmin
      .from('orders')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', order_id)

    // Trigger follow-up emails for free or fully-discounted orders.
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const emailJobs = {
      purchase_receipt_sent: false,
      registration_emails_sent_for: [] as string[],
    }

    if (supabaseUrl && serviceKey && createdEnrollments.length > 0) {
      try {
        const receiptResponse = await fetch(`${supabaseUrl}/functions/v1/send-purchase-receipt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ order_id }),
        })

        emailJobs.purchase_receipt_sent = receiptResponse.ok
      } catch (emailError) {
        console.error('[enroll-student] Failed to send purchase receipt:', emailError)
      }

      for (const studentId of touchedStudentIds) {
        try {
          const registrationResponse = await fetch(`${supabaseUrl}/functions/v1/send-registration-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({ order_id, student_id: studentId }),
          })

          if (registrationResponse.ok) {
            emailJobs.registration_emails_sent_for.push(studentId)
          }
        } catch (emailError) {
          console.error(`[enroll-student] Failed to send registration email for ${studentId}:`, emailError)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enrollments: createdEnrollments,
        count: createdEnrollments.length,
        students: Array.from(touchedStudentIds).map((studentId) => ({ id: studentId })),
        skipped_courses: skippedCourses,
        email_jobs: emailJobs,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('enroll-student error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
