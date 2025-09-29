const STORAGE_KEY = 'interview_answers';

export async function saveAnswer(payload: {
  interview_id: number;
  question_idx: number;
  question_text: string;
  answer_text: string;
  skills?: string[];
}) {
  try {
    // Get existing answers from localStorage
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Create new answer with timestamp
    const newAnswer = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    
    // Add to existing answers
    const updated = [...existing, newAnswer];
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newAnswer;
  } catch (error) {
    console.error('Error saving answer locally:', error);
    throw error;
  }
}

export async function getAnswersForInterview(interviewId: number) {
  try {
    // Get answers from localStorage
    const answers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Filter by interview_id
    return answers.filter((answer: any) => answer.interview_id === interviewId);
  } catch (error) {
    console.error('Error fetching answers:', error);
    return [];
  }
}