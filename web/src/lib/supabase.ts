import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logs (temporary)
console.log("Supabase URL:", url);
console.log("Supabase Key exists:", !!anonKey);

if (!url || !anonKey) {
  throw new Error("Missing Supabase env vars. Check .env file.");
}

export const supabase = createClient(url, anonKey);
