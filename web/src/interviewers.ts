import { Router } from 'express';
import { supabaseAdmin } from '../db';
import { AuthRequest } from '../types';
import { Response } from 'express';
import { requireAuth } from '../middleware/auth';

const router = Router();

// create interviewer profile
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, email, expertise = [], user_id } = req.body;
    const payload = { full_name, email, expertise, user_id };

    const { data, error } = await supabaseAdmin
      .from('interviewer_profiles')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message || err });
  }
});

// list all
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('interviewer_profiles').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

// get by id
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from('interviewer_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(404).json({ error: 'Interviewer not found' });
  }
});

// update
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabaseAdmin
      .from('interviewer_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
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
    const { error } = await supabaseAdmin.from('interviewer_profiles').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || err });
  }
});

export default router;
