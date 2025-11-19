import { Router } from 'express';
import { body } from 'express-validator';
import { getDirectory, getMyProfile, updateMyProfile } from '../controllers/directoryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate, requireRole('member', 'admin'));
router.get('/', getDirectory);
router.get('/me', getMyProfile);
router.put(
  '/me',
  [body('displayName').optional().notEmpty(), body('privacy').optional().isObject()],
  validateRequest,
  updateMyProfile
);

export default router;
