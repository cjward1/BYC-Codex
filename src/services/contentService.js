import { announcements, pages } from '../models/dataStore.js';

export const listAnnouncements = (user) => {
  const isMember = user?.roles?.includes('member') || user?.roles?.includes('admin');
  return announcements.filter((a) => a.visibility === 'public' || isMember);
};

export const upsertAnnouncement = (announcement) => {
  const existing = announcements.find((a) => a.id === announcement.id);
  if (existing) {
    Object.assign(existing, announcement);
    return existing;
  }
  announcements.push(announcement);
  return announcement;
};

export const listPages = () => pages;
