import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auditLogs, users } from '../models/dataStore.js';
import { env } from '../config/env.js';

export const authenticateUser = async (email, password) => {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
};

export const issueToken = (user) => {
  const payload = { sub: user.id, roles: user.roles };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '2h' });
};

export const recordAudit = (userId, action) => {
  auditLogs.push({ id: auditLogs.length + 1, userId, action, timestamp: new Date().toISOString() });
};
