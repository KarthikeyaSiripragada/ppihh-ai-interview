import { Router } from 'express';
import { supabaseAdmin } from '../db';
import { AuthRequest } from '../types';
import { Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// create an interview
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, interviewer_id, interviewee_id, scheduled_at } = req.body;
    const payload = { title, description, interviewer_id, interviewee_id, scheduled_at };

    const { data, error } = await supabaseAdmin.from('interviews').insert([payload]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || err });
  }
});

// list with optional filters
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, interviewer_id, interviewee_id } = req.query;
    let q = supabaseAdmin.from('interviews').select('*, interviewer_profiles(*), interviewee_profiles(*)');

    if (status) q = q.eq('status', String(status));
    if (interviewer_id) q = q.eq('interviewer_id', String(interviewer_id));
    if (interviewee_id) q = q.eq('interviewee_id', String(interviewee_id));

    const { data, error } = await q;
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
    const { data, error } = await supabaseAdmin.from('interviews').update(updates).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || err });
  }
});

// delete
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.from('interviews').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

export default router;
