import bcrypt from 'bcryptjs';
import { createId, roles, users } from '../models/dataStore.js';

export const listUsers = () => users;

export const getUserById = (id) => users.find((u) => u.id === id);

export const createUser = async ({ email, password, firstName, lastName, roleNames }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: createId(),
    email,
    passwordHash,
    firstName,
    lastName,
    roles: roleNames || ['member']
  };
  users.push(newUser);
  return newUser;
};

export const listRoles = () => roles;

export const assignRoles = (userId, roleNames) => {
  const user = getUserById(userId);
  if (!user) return null;
  user.roles = roleNames;
  return user;
};
