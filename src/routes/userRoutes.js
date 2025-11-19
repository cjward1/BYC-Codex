import { Router } from 'express';
import { body } from 'express-validator';
import { createUserController, getRoles, getUser, getUsers, updateUserRoles } from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('admin'), getUsers);
router.get('/roles', requireRole('admin'), getRoles);
router.get('/:id', requireRole('admin'), getUser);
router.post(
  '/',
  requireRole('admin'),
  [body('email').isEmail(), body('password').isLength({ min: 8 }), body('firstName').notEmpty(), body('lastName').notEmpty()],
  validateRequest,
  createUserController
);
router.put('/:id/roles', requireRole('admin'), [body('roles').isArray()], validateRequest, updateUserRoles);

export default router;
