// ============================================================
// EMCS Shared: Supabase client factory for Edge Functions
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Create a Supabase client with the service_role key.
 * For use in Edge Functions where we need to bypass RLS.
 */
export function createServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Create a Supabase client from the user's JWT (respects RLS).
 */
export function createUserClient(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Missing Authorization header')
  }

  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
