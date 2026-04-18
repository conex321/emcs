// ============================================================
// Edge Function: manage-user
// Purpose: Admin-only user CRUD (same pattern as SISConex)
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts'

function hasAdminAccess(role?: string | null) {
  return role === 'admin' || role === 'school_admin'
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseUser = createUserClient(req)
    const supabaseAdmin = createServiceClient()

    // Verify caller is admin
    const { data: { user }, error: authErr } = await supabaseUser.auth.getUser()
    if (authErr || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!hasAdminAccess(profile?.role)) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, ...payload } = await req.json()

    switch (action) {
      // ── LIST USERS ──
      case 'list': {
        const { role, page = 1, limit = 50 } = payload
        let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' })
        if (role) query = query.eq('role', role)
        query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false })
        const { data, error, count } = await query
        if (error) throw error
        return new Response(
          JSON.stringify({ users: data, total: count, page, limit }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── UPDATE ROLE ──
      case 'update_role': {
        const { user_id, new_role } = payload
        if (!user_id || !new_role) throw new Error('user_id and new_role required')

        // Log in audit
        const { data: oldProfile } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', user_id)
          .single()

        const { data, error } = await supabaseAdmin
          .from('profiles')
          .update({ role: new_role, updated_at: new Date().toISOString() })
          .eq('id', user_id)
          .select()
          .single()

        if (error) throw error

        // Audit log
        await supabaseAdmin.from('audit_log').insert({
          actor_id: user.id,
          action: 'user.role_change',
          target_type: 'profile',
          target_id: user_id,
          old_values: { role: oldProfile?.role },
          new_values: { role: new_role },
        })

        return new Response(
          JSON.stringify({ success: true, profile: data }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── DELETE USER ──
      case 'delete': {
        const { user_id } = payload
        if (!user_id) throw new Error('user_id required')

        // Delete from auth (cascades to profile via FK)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)
        if (error) throw error

        // Audit log
        await supabaseAdmin.from('audit_log').insert({
          actor_id: user.id,
          action: 'user.delete',
          target_type: 'profile',
          target_id: user_id,
        })

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── CREATE USER ──
      case 'create': {
        const { email, password, full_name, role: newRole = 'parent', phone } = payload
        if (!email || !password) throw new Error('email and password required')

        const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, role: newRole },
        })

        if (createErr) throw createErr

        // Profile will be auto-created by trigger, but ensure it's correct
        if (newUser?.user) {
          await supabaseAdmin.from('profiles').upsert({
            id: newUser.user.id,
            full_name: full_name || email.split('@')[0],
            email,
            role: newRole,
            phone: phone || null,
          }, { onConflict: 'id' })
        }

        // Audit log
        await supabaseAdmin.from('audit_log').insert({
          actor_id: user.id,
          action: 'user.create',
          target_type: 'profile',
          target_id: newUser?.user?.id,
          new_values: { email, role: newRole },
        })

        return new Response(
          JSON.stringify({ success: true, user: newUser?.user }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── APPROVE STUDENT ──
      case 'approve_student': {
        const { student_id } = payload
        if (!student_id) throw new Error('student_id required')

        const { data: student, error: studentErr } = await supabaseAdmin
          .from('students')
          .select('id, is_active')
          .eq('id', student_id)
          .single()

        if (studentErr || !student) throw studentErr || new Error('Student not found')

        const { error: studentUpdateErr } = await supabaseAdmin
          .from('students')
          .update({
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', student_id)

        if (studentUpdateErr) throw studentUpdateErr

        const { data: pendingEnrollments, error: pendingErr } = await supabaseAdmin
          .from('enrollments')
          .select('id')
          .eq('student_id', student_id)
          .eq('status', 'pending')

        if (pendingErr) throw pendingErr

        let activatedEnrollmentCount = 0

        if ((pendingEnrollments || []).length > 0) {
          activatedEnrollmentCount = pendingEnrollments.length

          const { error: enrollUpdateErr } = await supabaseAdmin
            .from('enrollments')
            .update({
              status: 'active',
              started_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('student_id', student_id)
            .eq('status', 'pending')

          if (enrollUpdateErr) throw enrollUpdateErr
        }

        await supabaseAdmin.from('audit_log').insert({
          actor_id: user.id,
          action: 'student.approve',
          target_type: 'student',
          target_id: student_id,
          old_values: {
            is_active: student.is_active,
            pending_enrollments: pendingEnrollments?.length || 0,
          },
          new_values: {
            is_active: true,
            activated_enrollments: activatedEnrollmentCount,
          },
        })

        return new Response(
          JSON.stringify({
            success: true,
            activated_enrollments: activatedEnrollmentCount,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── SEND REGISTRATION EMAIL ──
      case 'send_registration_email': {
        const { student_id, order_id } = payload
        if (!student_id) throw new Error('student_id required')

        let resolvedOrderId = order_id

        if (!resolvedOrderId) {
          const { data: latestItem, error: itemErr } = await supabaseAdmin
            .from('order_items')
            .select('order_id')
            .eq('student_id', student_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (itemErr) throw itemErr
          resolvedOrderId = latestItem?.order_id || null
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !serviceRoleKey) {
          throw new Error('Supabase environment is not configured for email dispatch')
        }

        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-registration-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({
            student_id,
            order_id: resolvedOrderId,
          }),
        })

        const emailResult = await emailResponse.json().catch(() => ({}))

        if (!emailResponse.ok) {
          throw new Error(emailResult?.error || 'Failed to send registration email')
        }

        await supabaseAdmin.from('audit_log').insert({
          actor_id: user.id,
          action: 'student.registration_email.send',
          target_type: 'student',
          target_id: student_id,
          new_values: {
            order_id: resolvedOrderId,
            recipient: emailResult?.registration?.recipient || null,
          },
        })

        return new Response(
          JSON.stringify({
            success: true,
            email: emailResult,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('manage-user error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
