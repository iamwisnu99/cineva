import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-Side Supabase Client for Cineva
 * 
 * SECURITY COMPLIANCE:
 * 1. This client must ONLY ever be invoked on the server (Server Components, Server Actions, Route Handlers).
 * 2. It accesses private environment variables (without NEXT_PUBLIC_ prefix).
 * 3. As a result, the Supabase URL and Service Role Key are NEVER bundled into client JavaScript 
 *    and remain completely invisible in browser DevTools.
 * 4. Queries run via Supabase's PostgREST query builder which automatically parameterizes all inputs,
 *    preventing SQL Injection attacks.
 */

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  )?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClient;
}
