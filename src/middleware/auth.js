import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { users } from '../models/dataStore.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = users.find((u) => u.id === decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const maybeAuthenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = users.find((u) => u.id === decoded.sub);
    if (user) req.user = user;
  } catch (error) {
    // ignore invalid tokens for public access
  }
  return next();
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  return next();
};
