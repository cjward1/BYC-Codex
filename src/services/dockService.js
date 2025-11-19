import { docks } from '../models/dataStore.js';

export const getDockLayout = () => docks;

export const updateBoatAssignment = ({ slip, boatName, ownerId }) => {
  const existing = docks.boats.find((b) => b.slip === slip);
  if (existing) {
    existing.boatName = boatName;
    existing.ownerId = ownerId;
    return existing;
  }
  const boat = { slip, boatName, ownerId };
  docks.boats.push(boat);
  return boat;
};
