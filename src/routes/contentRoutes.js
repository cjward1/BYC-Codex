import { Router } from 'express';
import { body } from 'express-validator';
import { getAnnouncements, getPages, saveAnnouncement } from '../controllers/contentController.js';
import { authenticate, maybeAuthenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/announcements', maybeAuthenticate, getAnnouncements);
router.post(
  '/announcements',
  authenticate,
  requireRole('admin'),
  [body('title').notEmpty(), body('body').notEmpty(), body('visibility').isIn(['public', 'member'])],
  validateRequest,
  saveAnnouncement
);
router.get('/pages', getPages);

export default router;
