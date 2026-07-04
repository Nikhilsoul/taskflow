import express from 'express';
import db from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.user.sub);
  res.json({ tasks });
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const result = db
    .prepare('INSERT INTO tasks (user_id, title) VALUES (?, ?)')
    .run(req.user.sub, title);

  res.status(201).json({ id: result.lastInsertRowid, title, status: 'pending' });
});

router.patch('/:id', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?').run(
    status,
    req.params.id,
    req.user.sub
  );
  res.json({ message: 'Task updated' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.sub);
  res.json({ message: 'Task deleted' });
});

// Admin-only: view every task from every user (role-based authorization demo)
router.get('/admin/all', authorize('admin'), (req, res) => {
  const tasks = db
    .prepare(
      `SELECT tasks.*, users.name, users.email FROM tasks
       JOIN users ON users.id = tasks.user_id
       ORDER BY tasks.created_at DESC`
    )
    .all();
  res.json({ tasks });
});

export default router;
