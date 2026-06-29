import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Browser Client for Client Components (completely safe to load in browser bundles)
export function getClientSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
