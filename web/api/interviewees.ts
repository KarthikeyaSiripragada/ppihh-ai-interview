import { supabase } from "../src/lib/supabase";

export async function insertInterviewee(payload: {
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  skills?: string[];
}) {
  const { data, error } = await supabase.from("interviewees").insert([
    {
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      resume_url: payload.resume_url ?? null,
      skills: payload.skills ?? [],
    },
  ]);
  if (error) throw error;
  return data?.[0];
}

export async function getIntervieweeByEmail(email: string) {
  const { data, error } = await supabase
    .from("interviewees")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
}
