import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
} from '../utils/tokens.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none' ,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

  const result = db
    .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hashed, role);

  const user = { id: result.lastInsertRowid, email, role };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(201).json({ accessToken, user: { id: user.id, name, email, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.json({
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// Uses the httpOnly refresh cookie to mint a new access token, rotating the refresh token
router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token missing' });
  if (!isRefreshTokenValid(token)) {
    return res.status(403).json({ message: 'Refresh token revoked or invalid' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });

    revokeRefreshToken(token); // rotation: old token can never be reused
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
});

router.post('/logout', (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) revokeRefreshToken(token);
  res.clearCookie('refreshToken', cookieOptions);
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, (req, res) => {
  const user = db
    .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
    .get(req.user.sub);
  res.json({ user });
});

export default router;
