import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'FATAL: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. ' +
    'Create a .env.local file or configure in your hosting dashboard.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
