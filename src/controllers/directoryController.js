import { getProfileByUserId, listDirectory, updateProfile } from '../services/directoryService.js';

export const getDirectory = (req, res) => res.json({ directory: listDirectory(req.user) });

export const getMyProfile = (req, res) => {
  const profile = getProfileByUserId(req.user.id);
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json({ profile });
};

export const updateMyProfile = (req, res) => {
  const profile = updateProfile(req.user.id, req.body);
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  return res.json({ profile });
};
