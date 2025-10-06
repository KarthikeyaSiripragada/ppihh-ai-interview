// src/types.ts
export interface Interviewee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  skills?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateIntervieweePayload {
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  skills?: string[];
}

export interface UpdateIntervieweePayload {
  name?: string | null;
  phone?: string | null;
  resume_url?: string | null;
  skills?: string[] | null;
}
  