import { Router } from 'express';
import { body } from 'express-validator';
import { login, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 8 })], validateRequest, login);
router.get('/me', authenticate, me);

export default router;
