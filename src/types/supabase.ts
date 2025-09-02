// src/types/supabase.ts

// This file is intended to hold TypeScript types generated from your Supabase schema.
// You can generate these types by running the following command in your terminal:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
//
// Replace YOUR_PROJECT_ID with your actual Supabase project ID.
// This ensures that your application's types are always in sync with your database schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // This would be populated by the generation script
}