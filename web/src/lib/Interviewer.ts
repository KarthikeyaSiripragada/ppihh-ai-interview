// types.ts
export interface Interviewee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  skills: string[];
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
  name?: string;
  phone?: string;
  resume_url?: string;
  skills?: string[];
}

// intervieweeRepository.ts
const INTERVIEWEES_STORAGE_KEY = 'interviewees';

// Validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateIntervieweePayload(payload: CreateIntervieweePayload): void {
  if (!payload.name?.trim()) {
    throw new Error('Name is required');
  }
  
  if (!payload.email?.trim()) {
    throw new Error('Email is required');
  }
  
  if (!validateEmail(payload.email)) {
    throw new Error('Invalid email format');
  }
}

// Storage utilities
function getStoredInterviewees(): Interviewee[] {
  try {
    const stored = localStorage.getItem(INTERVIEWEES_STORAGE_KEY) || '[]';
    return JSON.parse(stored) as Interviewee[];
  } catch (error) {
    console.error('Failed to parse stored interviewees:', error);
    return [];
  }
}

function setStoredInterviewees(interviewees: Interviewee[]): void {
  try {
    localStorage.setItem(INTERVIEWEES_STORAGE_KEY, JSON.stringify(interviewees));
  } catch (error) {
    console.error('Failed to store interviewees:', error);
    throw new Error('Failed to save interviewee data');
  }
}

// Core repository functions
export async function createInterviewee(payload: CreateIntervieweePayload): Promise<Interviewee> {
  validateIntervieweePayload(payload);
  
  const interviewees = getStoredInterviewees();
  const now = new Date().toISOString();
  
  // Check for existing email
  const existingInterviewee = interviewees.find((item: Interviewee) => item.email === payload.email);
  if (existingInterviewee) {
    throw new Error(`Interviewee with email ${payload.email} already exists`);
  }
  
  const newInterviewee: Interviewee = {
    id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone?.trim(),
    resume_url: payload.resume_url?.trim(),
    skills: payload.skills || [],
    created_at: now,
    updated_at: now,
  };
  
  interviewees.push(newInterviewee);
  setStoredInterviewees(interviewees);
  
  return newInterviewee;
}

export async function updateInterviewee(
  email: string, 
  updates: UpdateIntervieweePayload
): Promise<Interviewee> {
  if (!email?.trim()) {
    throw new Error('Email is required for update');
  }
  
  const interviewees = getStoredInterviewees();
  const index = interviewees.findIndex((item: Interviewee) => item.email === email);
  
  if (index === -1) {
    throw new Error(`Interviewee with email ${email} not found`);
  }
  
  const updatedInterviewee: Interviewee = {
    ...interviewees[index],
    ...updates,
    name: updates.name?.trim() || interviewees[index].name,
    phone: updates.phone?.trim(),
    resume_url: updates.resume_url?.trim(),
    skills: updates.skills || interviewees[index].skills,
    updated_at: new Date().toISOString(),
  };
  
  interviewees[index] = updatedInterviewee;
  setStoredInterviewees(interviewees);
  
  return updatedInterviewee;
}

export async function getIntervieweeByEmail(email: string): Promise<Interviewee | null> {
  if (!email?.trim()) {
    throw new Error('Email is required');
  }
  
  const interviewees = getStoredInterviewees();
  return interviewees.find((interviewee: Interviewee) => interviewee.email === email) || null;
}

export async function getAllInterviewees(): Promise<Interviewee[]> {
  return getStoredInterviewees();
}

export async function deleteInterviewee(email: string): Promise<void> {
  if (!email?.trim()) {
    throw new Error('Email is required');
  }
  
  const interviewees = getStoredInterviewees();
  const filtered = interviewees.filter((item: Interviewee) => item.email !== email);
  
  if (filtered.length === interviewees.length) {
    throw new Error(`Interviewee with email ${email} not found`);
  }
  
  setStoredInterviewees(filtered);
}

export async function searchInterviewees(query: string): Promise<Interviewee[]> {
  if (!query?.trim()) {
    return getAllInterviewees();
  }
  
  const searchTerm = query.toLowerCase().trim();
  const interviewees = getStoredInterviewees();
  
  return interviewees.filter((interviewee: Interviewee) =>
    interviewee.name.toLowerCase().includes(searchTerm) ||
    interviewee.email.toLowerCase().includes(searchTerm) ||
    interviewee.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm))
  );
}

// Bulk operations
export async function importInterviewees(interviewees: CreateIntervieweePayload[]): Promise<Interviewee[]> {
  const results: Interviewee[] = [];
  
  for (const payload of interviewees) {
    try {
      const interviewee = await createInterviewee(payload);
      results.push(interviewee);
    } catch (error) {
      console.error(`Failed to import interviewee ${payload.email}:`, error);
      // Continue with next interviewee
    }
  }
  
  return results;
}

export async function clearAllInterviewees(): Promise<void> {
  localStorage.removeItem(INTERVIEWEES_STORAGE_KEY);
}

// Utility functions
export function getIntervieweesCount(): number {
  return getStoredInterviewees().length;
}

export function getIntervieweesBySkill(skill: string): Interviewee[] {
  const interviewees = getStoredInterviewees();
  return interviewees.filter((interviewee: Interviewee) =>
    interviewee.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
  );
}