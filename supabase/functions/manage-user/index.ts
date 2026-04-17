// ============================================================
// Edge Function: manage-user
// Purpose: Admin-only user CRUD (same pattern as SISConex)
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

    if (profile?.role !== 'admin') {
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
