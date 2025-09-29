import { supabase } from "../src/lib/supabase";// relative from src/api to src/lib


export async function insertEvaluation(payload: {
  answer_id: number;
  correctness: number;
  efficiency: number;
  clarity: number;
  problem_solving: number;
  notes?: string;
}) {
  const { data, error } = await supabase.from("evaluations").insert([
    {
      answer_id: payload.answer_id,
      correctness: payload.correctness,
      efficiency: payload.efficiency,
      clarity: payload.clarity,
      problem_solving: payload.problem_solving,
      notes: payload.notes ?? null,
    },
  ]);
  if (error) throw error;
  return data?.[0];
}

export async function getEvaluationsByAnswer(answerId: number) {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("answer_id", answerId);
  if (error) throw error;
  return data;
}
