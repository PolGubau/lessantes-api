import { createClient } from "@supabase/supabase-js";
import type { Bindings } from "../env";

/**
 * Factory to create a Supabase client using environment bindings.
 * Using a factory instead of a singleton because bindings vary by request in Workers.
 */
export function getSupabase(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "x-client-info": "les-santes-api/0.1.0",
      },
    },
  });
}
