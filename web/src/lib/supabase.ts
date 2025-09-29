import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

console.log("DEBUG: VITE_SUPABASE_URL ->", url);
console.log("DEBUG: VITE_SUPABASE_ANON_KEY exists ->", !!anonKey);

if (!url || !anonKey) {
  // stops app early so you can see the message in browser console
  throw new Error("Missing Supabase env vars. Check .env and restart dev server.");
}

export const supabase = createClient(url, anonKey);
