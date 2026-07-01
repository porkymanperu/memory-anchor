import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable VITE_SUPABASE_URL. Add it to .env.local at the repo root.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing environment variable VITE_SUPABASE_ANON_KEY. Add it to .env.local at the repo root.'
  );
}

if (import.meta.env.DEV) {
  // One-time diagnostic so misconfigured env vars are easy to spot. The key is
  // partially masked — never print the full value.
  const masked =
    supabaseAnonKey.length > 12
      ? `${supabaseAnonKey.slice(0, 8)}…${supabaseAnonKey.slice(-4)} (len ${supabaseAnonKey.length})`
      : `(len ${supabaseAnonKey.length})`;
  // eslint-disable-next-line no-console
  console.info('[supabase] client init', { url: supabaseUrl, key: masked });
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Attach the `apikey` header on every request. Do NOT set Authorization
  // here — supabase-js sets Authorization per-request to the signed-in user's
  // access token, and overriding it globally with the anon key would force
  // every request to evaluate RLS as the anonymous role (auth.uid() === null),
  // silently returning zero rows.
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
});

// Always expose the live client on `window` so it can be inspected from the
// browser console (e.g. `await __supabase.auth.getSession()`). Unconditional
// so HMR / production-mode flag confusion can't hide it during debugging.
(globalThis as unknown as { __supabase?: SupabaseClient }).__supabase = supabase;
// eslint-disable-next-line no-console
console.info('[supabase] module evaluated at', new Date().toISOString());
