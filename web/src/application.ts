import { Router } from 'express';
import { supabaseAdmin } from '../db';
import { AuthRequest } from '../types';
import { Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// create application
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { interviewee_id, position, notes } = req.body;
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([{ interviewee_id, position, notes }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || err });
  }
});

// list
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('applications').select('*, interviewee_profiles(*)');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

// update
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabaseAdmin.from('applications').update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || err });
  }
});

export default router;
