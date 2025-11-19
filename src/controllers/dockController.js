import { getDockLayout, updateBoatAssignment } from '../services/dockService.js';

export const getDocks = (req, res) => res.json({ docks: getDockLayout() });

export const assignDock = (req, res) => {
  const boat = updateBoatAssignment(req.body);
  return res.status(200).json({ boat });
};
