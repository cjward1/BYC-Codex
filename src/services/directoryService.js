import { memberProfiles, users } from '../models/dataStore.js';

const maskProfile = (profile, requester) => {
  const owner = users.find((u) => u.id === profile.userId);
  const visible = { id: profile.id, displayName: profile.displayName, boatName: profile.boatName, slip: profile.slip };
  const isSelf = requester?.id === profile.userId;
  if (!profile.privacy.phone || isSelf) visible.phone = profile.phone;
  if (!profile.privacy.email || isSelf) visible.email = owner?.email;
  if (!profile.privacy.boat || isSelf) visible.boatName = profile.boatName;
  return visible;
};

export const listDirectory = (requester) => memberProfiles.map((p) => maskProfile(p, requester));

export const getProfileByUserId = (userId) => memberProfiles.find((p) => p.userId === userId);

export const updateProfile = (userId, updates) => {
  const profile = getProfileByUserId(userId);
  if (!profile) return null;
  Object.assign(profile, updates);
  return profile;
};
