// This file helps verify environment variables in the browser
console.log('Environment Variables Test:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

export function testSupabaseConnection() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not set',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    isConfigured: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  };
}
