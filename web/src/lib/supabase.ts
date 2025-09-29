import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qwmrbfglgcdkncusmdrd.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bXJiZmdsZ2Nka25jdXNtZHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjg3MzEsImV4cCI6MjA3NDcwNDczMX0.MMTpiXIt1SkE-BAxARdP6h0CQLStk_s-pphq4UmSXAw";

export const supabase = createClient(supabaseUrl, supabaseKey);