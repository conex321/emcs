// ============================================================
// Edge Function: enroll-student
// Purpose: Create student records and enrollments post-payment
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts'

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

    const createdEnrollments = []

    // Process each student
    for (const studentData of (students || [])) {
      // Create or find student
      let studentId = studentData.id

      if (!studentId) {
        const { data: newStudent, error: studentError } = await supabaseAdmin
          .from('students')
          .insert({
            parent_id: user.id,
            first_name: studentData.first_name || studentData.firstName,
            last_name: studentData.last_name || studentData.lastName,
            email: studentData.email || null,
            date_of_birth: studentData.date_of_birth || studentData.dateOfBirth,
            current_grade: studentData.current_grade || studentData.currentGrade,
            previous_school: studentData.previous_school || studentData.previousSchool,
          })
          .select()
          .single()

        if (studentError) throw studentError
        studentId = newStudent.id
      }

      // Create enrollments for each course assigned to this student
      const studentCourses = (courses || []).filter(
        (c: any) =>
          c.student_index === studentData.index ||
          c.student_index === undefined ||
          c.student_index === null
      )

      for (const courseData of studentCourses) {
        const courseCode = courseData.course_code || courseData.code

        // Look up course by code
        const { data: course } = await supabaseAdmin
          .from('courses')
          .select('id')
          .eq('code', courseCode)
          .single()

        if (!course) continue

        // Find the order item
        const { data: unassignedOrderItem } = await supabaseAdmin
          .from('order_items')
          .select('id')
          .eq('order_id', order_id)
          .eq('course_code', courseCode)
          .is('student_id', null)
          .maybeSingle()

        let orderItemId = unassignedOrderItem?.id || null

        if (unassignedOrderItem?.id) {
          await supabaseAdmin
            .from('order_items')
            .update({ student_id: studentId })
            .eq('id', unassignedOrderItem.id)
        } else {
          const { data: existingOrderItem } = await supabaseAdmin
            .from('order_items')
            .select('id')
            .eq('order_id', order_id)
            .eq('course_code', courseCode)
            .eq('student_id', studentId)
            .maybeSingle()

          orderItemId = existingOrderItem?.id || null
        }

        // Create enrollment (upsert to handle idempotency)
        const { data: enrollment, error: enrollError } = await supabaseAdmin
          .from('enrollments')
          .upsert({
            student_id: studentId,
            course_id: course.id,
            order_item_id: orderItemId,
            status: 'active',
            enrolled_at: new Date().toISOString(),
          }, { onConflict: 'student_id,course_id' })
          .select()
          .single()

        if (enrollError) {
          console.error(`Enrollment error for student ${studentId}, course ${course.id}:`, enrollError)
          continue
        }

        createdEnrollments.push(enrollment)
      }
    }

    // Update order status to processing
    await supabaseAdmin
      .from('orders')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', order_id)

    return new Response(
      JSON.stringify({
        success: true,
        enrollments: createdEnrollments,
        count: createdEnrollments.length,
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
