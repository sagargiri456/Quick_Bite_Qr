// Browser-side Supabase client (for client components)
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Simple exported instance (use in most client components)
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Factory if you prefer isolated instances
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
