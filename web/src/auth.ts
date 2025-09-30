import { NextFunction, Response } from 'express';
import { supabase } from '../db';
import { AuthRequest } from '../types';

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed Authorization header' });

  try {
    // supabase.auth.getUser(token) verifies access token server-side
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token', details: error?.message });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email ?? undefined,
      ...data.user.user_metadata
    };

    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(500).json({ error: 'Auth verification failed' });
  }
}
