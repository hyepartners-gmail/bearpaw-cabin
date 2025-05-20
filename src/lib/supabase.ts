import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key must be set in environment variables.");
  // You might want to throw an error or handle this more gracefully in a real app
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);