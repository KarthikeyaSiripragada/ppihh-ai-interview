import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwmrbfglgcdkncusmdrd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logs
console.log("Supabase URL:", supabaseUrl)
console.log("Supabase Key:", supabaseKey ? "Exists" : "MISSING")

if (!supabaseKey) {
  throw new Error("Missing Supabase key. Check .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)