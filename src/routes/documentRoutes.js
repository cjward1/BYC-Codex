import { Router } from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import { getDocuments, uploadDocumentController } from '../controllers/documentController.js';
import { authenticate, maybeAuthenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { env } from '../config/env.js';
import fs from 'fs';

const router = Router();
fs.mkdirSync(env.uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: env.uploadDir,
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', maybeAuthenticate, getDocuments);
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  upload.single('file'),
  [body('title').notEmpty(), body('category').notEmpty(), body('visibility').isIn(['public', 'member'])],
  validateRequest,
  uploadDocumentController
);

export default router;
