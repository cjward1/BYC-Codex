import { assignRoles, createUser, getUserById, listRoles, listUsers } from '../services/userService.js';

export const getUsers = (req, res) => res.json({ users: listUsers() });

export const getUser = (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
};

export const createUserController = async (req, res) => {
  const user = await createUser(req.body);
  return res.status(201).json({ user });
};

export const updateUserRoles = (req, res) => {
  const user = assignRoles(req.params.id, req.body.roles);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
};

export const getRoles = (req, res) => res.json({ roles: listRoles() });
