// src/lib/intervieweeRepository.ts
import { Interviewee, CreateIntervieweePayload, UpdateIntervieweePayload } from '../types';



// ====== Config (adapt for your environment) ======
const INTERVIEWEES_STORAGE_KEY = 'interviewees';
const API_BASE_URL: string | undefined = (typeof window !== 'undefined' && (window as any).__env__?.API_BASE_URL) || process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL;

// ====== Helpers & Validation ======
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function requireNonEmpty(value?: string, name = 'Value'): string {
  if (!value || !value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function parseStorage(): Interviewee[] {
  try {
    const raw = localStorage.getItem(INTERVIEWEES_STORAGE_KEY) || '[]';
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Interviewee[];
  } catch (err) {
    console.error('Failed to parse stored interviewees:', err);
    return [];
  }
}

function writeStorage(items: Interviewee[]): void {
  try {
    localStorage.setItem(INTERVIEWEES_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to write interviewees to localStorage', err);
    throw new Error('Failed to save interviewee data');
  }
}

// ====== Backend helpers ======
async function callBackend<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new Error('API_BASE_URL not configured');
  const url = `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return (await res.json()) as T;
}

// ====== Core repository functions (public API) ======

export async function createInterviewee(payload: CreateIntervieweePayload): Promise<Interviewee> {
  requireNonEmpty(payload.name, 'Name');
  requireNonEmpty(payload.email, 'Email');
  if (!validateEmail(payload.email)) throw new Error('Invalid email format');

  // normalize
  const name = payload.name.trim();
  const email = payload.email.toLowerCase().trim();
  const phone = payload.phone?.trim() || undefined;
  const resume_url = payload.resume_url?.trim() || undefined;
  const skills = payload.skills ?? [];

  if (API_BASE_URL) {
    // Backend flow
    const body = { name, email, phone, resume_url, skills };
    // assumes backend returns the created Interviewee
    return callBackend<Interviewee>('/interviewees', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  } else {
    // localStorage fallback
    const interviewees = parseStorage();

    const exists = interviewees.find((i) => i.email.toLowerCase() === email);
    if (exists) throw new Error(`Interviewee with email ${email} already exists`);

    const now = new Date().toISOString();
    const newInterviewee: Interviewee = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      resume_url,
      skills,
      created_at: now,
      updated_at: now
    };

    interviewees.push(newInterviewee);
    writeStorage(interviewees);
    return newInterviewee;
  }
}

export async function updateInterviewee(idOrEmail: string, updates: UpdateIntervieweePayload): Promise<Interviewee> {
  requireNonEmpty(idOrEmail, 'Interviewee id or email');

  // normalize update fields
  const updatePayload: Partial<Interviewee> = {};
  if (updates.name !== undefined) updatePayload.name = updates.name.trim();
  if (updates.phone !== undefined) updatePayload.phone = updates.phone?.trim();
  if (updates.resume_url !== undefined) updatePayload.resume_url = updates.resume_url?.trim();
  if (updates.skills !== undefined) updatePayload.skills = updates.skills;

  if (API_BASE_URL) {
    // try treat idOrEmail as id first
    try {
      return callBackend<Interviewee>(`/interviewees/${encodeURIComponent(idOrEmail)}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload)
      });
    } catch (err) {
      // bubble up error
      throw err;
    }
  } else {
    // localStorage fallback
    const interviewees = parseStorage();
    const idx = interviewees.findIndex((i) => i.id === idOrEmail || i.email.toLowerCase() === idOrEmail.toLowerCase());

    if (idx === -1) throw new Error(`Interviewee with id/email ${idOrEmail} not found`);

    const updated: Interviewee = {
      ...interviewees[idx],
      ...updatePayload,
      updated_at: new Date().toISOString()
    };

    interviewees[idx] = updated;
    writeStorage(interviewees);
    return updated;
  }
}

export async function getIntervieweeById(idOrEmail: string): Promise<Interviewee | null> {
  requireNonEmpty(idOrEmail, 'Interviewee id or email');

  if (API_BASE_URL) {
    try {
      return callBackend<Interviewee>(`/interviewees/${encodeURIComponent(idOrEmail)}`);
    } catch (err) {
      // if backend returns 404, you might want to return null
      throw err;
    }
  } else {
    const interviewees = parseStorage();
    return interviewees.find((i) => i.id === idOrEmail || i.email.toLowerCase() === idOrEmail.toLowerCase()) ?? null;
  }
}

export async function getAllInterviewees(): Promise<Interviewee[]> {
  if (API_BASE_URL) {
    return callBackend<Interviewee[]>('/interviewees');
  } else {
    return parseStorage();
  }
}

export async function deleteInterviewee(idOrEmail: string): Promise<void> {
  requireNonEmpty(idOrEmail, 'Interviewee id or email');

  if (API_BASE_URL) {
    await callBackend<void>(`/interviewees/${encodeURIComponent(idOrEmail)}`, { method: 'DELETE' });
    return;
  } else {
    const interviewees = parseStorage();
    const filtered = interviewees.filter((i) => !(i.id === idOrEmail || i.email.toLowerCase() === idOrEmail.toLowerCase()));
    if (filtered.length === interviewees.length) throw new Error(`Interviewee with id/email ${idOrEmail} not found`);
    writeStorage(filtered);
  }
}

export async function searchInterviewees(query: string): Promise<Interviewee[]> {
  if (!query?.trim()) return getAllInterviewees();
  const term = query.toLowerCase().trim();

  if (API_BASE_URL) {
    // backend should support ?q= or ?search=
    try {
      return callBackend<Interviewee[]>(`/interviewees?q=${encodeURIComponent(term)}`);
    } catch (err) {
      // fallback to client filtering if backend doesn't support query
      console.warn('Search endpoint failed, falling back to client-side search', err);
    }
  }

  const interviewees = parseStorage();
  return interviewees.filter((iv) => {
    const inName = iv.name.toLowerCase().includes(term);
    const inEmail = iv.email.toLowerCase().includes(term);
    const inSkills = (iv.skills || []).some((s) => s.toLowerCase().includes(term));
    return inName || inEmail || inSkills;
  });
}

// Bulk operations
export async function importInterviewees(items: CreateIntervieweePayload[]): Promise<Interviewee[]> {
  const results: Interviewee[] = [];
  for (const item of items) {
    try {
      const created = await createInterviewee(item);
      results.push(created);
    } catch (err) {
      console.error(`Failed to import ${item.email}:`, err);
      // continue
    }
  }
  return results;
}

export function clearAllInterviewees(): void {
  if (API_BASE_URL) {
    console.warn('clearAllInterviewees is local-only; no-op when API_BASE_URL is present');
    return;
  }
  localStorage.removeItem(INTERVIEWEES_STORAGE_KEY);
}

export function getIntervieweesCount(): number {
  return parseStorage().length;
}

export function getIntervieweesBySkill(skill: string): Interviewee[] {
  if (!skill?.trim()) return parseStorage();
  const term = skill.toLowerCase().trim();
  return parseStorage().filter((iv) => (iv.skills || []).some((s) => s.toLowerCase().includes(term)));
}
