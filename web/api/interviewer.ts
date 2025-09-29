// Update the import path below to the correct relative path where your supabase client is defined.
// For example, if your supabase client is in 'e:\PPIH(SWIPE)\web\lib\supabase.ts', use:
import { supabase } from "../src/lib/supabase";

export async function insertInterviewer(payload: {
  name: string;
  email: string;
  company?: string;
}) {
  const { data, error } = await supabase.from("interviewers").insert([
    {
      name: payload.name,
      email: payload.email,
      company: payload.company ?? null,
    },
  ]);
  if (error) throw error;
  return data?.[0];
}

export async function getInterviewers() {
  const { data, error } = await supabase.from("interviewers").select("*");
  if (error) throw error;
  return data;
}
