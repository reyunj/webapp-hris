import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Type helper to bypass strict Supabase typing issues
export type TypedSupabaseClient = SupabaseClient<Database>;

// Helper to cast Supabase client to any for operations that have type inference issues
export function getTypedClient(client: SupabaseClient<Database>) {
  return client as any as TypedSupabaseClient;
}
