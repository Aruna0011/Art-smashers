import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Now uses env variable
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Now uses env variable
export const supabase = createClient(supabaseUrl, supabaseKey); 