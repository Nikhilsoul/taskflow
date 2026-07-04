import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`TaskFlow API running on http://localhost:${PORT}`));

export default app;
