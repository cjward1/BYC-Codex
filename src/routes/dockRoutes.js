import { Router } from 'express';
import { body } from 'express-validator';
import { assignDock, getDocks } from '../controllers/dockController.js';
import { authenticate, maybeAuthenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', maybeAuthenticate, getDocks);
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  [body('slip').notEmpty(), body('boatName').notEmpty(), body('ownerId').notEmpty()],
  validateRequest,
  assignDock
);

export default router;
