import jwt from 'jsonwebtoken';
import db from '../db.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_dev_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_dev_secret';

export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user) {
  const token = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)').run(
    token,
    user.id,
    expiresAt
  );
  return token;
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export function revokeRefreshToken(token) {
  db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
}

export function isRefreshTokenValid(token) {
  const row = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?').get(token);
  return !!row;
}

export function revokeAllUserTokens(userId) {
  db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
}
