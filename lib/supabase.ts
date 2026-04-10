import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Server routes will fall back to the public anon key.');
}

const createSupabase = (key: string) =>
  createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

export const supabase = createSupabase(supabaseAnonKey);
export const supabaseAdmin = createSupabase(supabaseServiceRoleKey || supabaseAnonKey);
