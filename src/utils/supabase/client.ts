import { createBrowserClient } from '@supabase/ssr'
import type { Database } from 'supabase'

export function createClient() {
  return createBrowserClient<Database>(
    		// biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    		// biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
