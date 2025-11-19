import { createId } from '../models/dataStore.js';
import { listAnnouncements, listPages, upsertAnnouncement } from '../services/contentService.js';

export const getAnnouncements = (req, res) => res.json({ announcements: listAnnouncements(req.user) });

export const saveAnnouncement = (req, res) => {
  const announcement = { id: req.body.id || createId(), ...req.body };
  const updated = upsertAnnouncement(announcement);
  return res.status(201).json({ announcement: updated });
};

export const getPages = (req, res) => res.json({ pages: listPages() });
