import { authenticateUser, issueToken, recordAudit } from '../services/authService.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = issueToken(user);
  recordAudit(user.id, 'login');
  return res.json({ token, user: { id: user.id, email: user.email, roles: user.roles, firstName: user.firstName } });
};

export const me = (req, res) => res.json({ user: req.user });
