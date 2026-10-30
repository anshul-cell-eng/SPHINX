import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export const isSupabaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
export const isSupabaseAdminConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Standard public Supabase client (scoped to Anon Key)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Privileged administrative Supabase client (scoped to Service Role Key)
 * SERVER-SIDE ONLY: Never expose to frontend clients.
 */
export const supabaseAdmin: SupabaseClient | null = isSupabaseAdminConfigured
  ? createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Diagnostic function to test live Supabase connection status
 */
export async function checkSupabaseConnection(): Promise<{
  status: "connected" | "unconfigured" | "error";
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      status: "unconfigured",
      message: "Supabase credentials (SUPABASE_URL / SUPABASE_ANON_KEY) are not set in .env",
    };
  }

  try {
    // Probe Supabase Auth health endpoint
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: env.SUPABASE_ANON_KEY!,
      },
    });

    if (response.ok) {
      return {
        status: "connected",
        message: "Supabase service is reachable and responsive",
      };
    }

    return {
      status: "error",
      message: `Supabase returned HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to connect to Supabase",
    };
  }
}
