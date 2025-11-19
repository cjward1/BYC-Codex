import { Router } from 'express';
import { body } from 'express-validator';
import { addEvent, getEvents, rsvp } from '../controllers/eventController.js';
import { authenticate, maybeAuthenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', maybeAuthenticate, getEvents);
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  [body('title').notEmpty(), body('date').isISO8601(), body('visibility').isIn(['public', 'member'])],
  validateRequest,
  addEvent
);
router.post('/:eventId/rsvp', authenticate, requireRole('member', 'admin'), rsvp);

export default router;
