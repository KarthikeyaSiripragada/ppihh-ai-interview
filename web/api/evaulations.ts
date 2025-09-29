const EVALUATIONS_STORAGE_KEY = 'interview_evaluations';

export async function insertEvaluation(payload: {
  answer_id: number;
  correctness: number;
  efficiency: number;
  clarity: number;
  problem_solving: number;
  notes?: string;
}) {
  try {
    // Get existing evaluations from localStorage
    const existing = JSON.parse(localStorage.getItem(EVALUATIONS_STORAGE_KEY) || '[]');
    
    // Create new evaluation with timestamp
    const newEvaluation = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    
    // Add to existing evaluations
    const updated = [...existing, newEvaluation];
    
    // Save back to localStorage
    localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(updated));
    
    return newEvaluation;
  } catch (error) {
    console.error('Error saving evaluation locally:', error);
    throw error;
  }
}

export async function getEvaluationsByAnswer(answerId: number) {
  try {
    // Get evaluations from localStorage
    const evaluations = JSON.parse(localStorage.getItem(EVALUATIONS_STORAGE_KEY) || '[]');
    
    // Filter by answer_id
    return evaluations.filter((evaluation: any) => evaluation.answer_id === answerId);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return [];
  }
}