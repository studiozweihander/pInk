import { createClient } from "@supabase/supabase-js";

export interface RuntimeEnv {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  NODE_ENV?: string;
}

export function readRuntimeEnv(env?: RuntimeEnv): RuntimeEnv {
  if (env) return env;

  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };
}

export function createSupabaseClient(env?: RuntimeEnv) {
  const runtime = readRuntimeEnv(env);

  if (!runtime.SUPABASE_URL || !runtime.SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  return createClient(runtime.SUPABASE_URL, runtime.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: "public",
    },
  });
}
