import { supabase } from "../src/lib/supabase";

export async function startInterview(interviewerId: number, intervieweeId: number) {
  const { data, error } = await supabase.from("interviews").insert([
    {
      interviewer_id: interviewerId,
      interviewee_id: intervieweeId,
      started_at: new Date().toISOString(),
    },
  ]);
  if (error) throw error;
  return data?.[0];
}

export async function endInterview(interviewId: number) {
  const { data, error } = await supabase
    .from("interviews")
    .update({ ended_at: new Date().toISOString() })
    .eq("id", interviewId);
  if (error) throw error;
  return data?.[0];
}
