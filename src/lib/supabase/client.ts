// lib/supabase/Client.ts

import { createClient } from '@supabase/supabase-js'

// Use "export const" on this line
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// DELETE the "export default supabase" line