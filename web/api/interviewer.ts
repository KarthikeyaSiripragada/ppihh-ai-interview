const INTERVIEWERS_STORAGE_KEY = 'interviewers';

export async function insertInterviewer(payload: {
  name: string;
  email: string;
  company?: string;
}) {
  try {
    // Get existing interviewers from localStorage
    const existing = JSON.parse(localStorage.getItem(INTERVIEWERS_STORAGE_KEY) || '[]');
    
    // Check if interviewer already exists
    const existingIndex = existing.findIndex((item: any) => item.email === payload.email);
    
    let newInterviewer;
    
    if (existingIndex >= 0) {
      // Update existing
      newInterviewer = {
        ...existing[existingIndex],
        ...payload,
        updated_at: new Date().toISOString(),
      };
      existing[existingIndex] = newInterviewer;
    } else {
      // Create new interviewer
      newInterviewer = {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      existing.push(newInterviewer);
    }
    
    // Save back to localStorage
    localStorage.setItem(INTERVIEWERS_STORAGE_KEY, JSON.stringify(existing));
    
    return newInterviewer;
  } catch (error) {
    console.error('Error saving interviewer locally:', error);
    throw error;
  }
}

export async function getInterviewers() {
  try {
    // Get interviewers from localStorage
    const interviewers = JSON.parse(localStorage.getItem(INTERVIEWERS_STORAGE_KEY) || '[]');
    
    return interviewers;
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return [];
  }
}