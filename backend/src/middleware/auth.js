import { verifyAccessToken } from '../utils/tokens.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
