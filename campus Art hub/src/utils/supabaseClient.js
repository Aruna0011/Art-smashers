import { createClient } from '@supabase/supabase-js';

// Centralized Supabase client to avoid multiple instances
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Single Supabase client instance
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export default for convenience
export default supabase;