// Go up two directories from 'api' and 'pages', then into 'lib'
import { supabase } from "../src/lib/supabase";


export async function saveAnswer(payload: {
  interview_id: number;
  question_idx: number;
  question_text: string;
  answer_text: string;
  skills?: string[];
}) {
  const { data, error } = await supabase.from("answers").insert([
    {
      interview_id: payload.interview_id,
      question_idx: payload.question_idx,
      question_text: payload.question_text,
      answer_text: payload.answer_text,
      skills: payload.skills ?? [],
    },
  ]);
  if (error) throw error;
  return data?.[0];
}

export async function getAnswersForInterview(interviewId: number) {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("interview_id", interviewId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
