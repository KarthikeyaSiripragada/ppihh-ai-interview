import { Request } from 'express';

export interface SupabaseUser {
  id: string;
  email?: string | null;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: SupabaseUser | null;
}
