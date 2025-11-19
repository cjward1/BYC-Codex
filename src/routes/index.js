import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import eventRoutes from './eventRoutes.js';
import documentRoutes from './documentRoutes.js';
import directoryRoutes from './directoryRoutes.js';
import dockRoutes from './dockRoutes.js';
import contentRoutes from './contentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/documents', documentRoutes);
router.use('/directory', directoryRoutes);
router.use('/docks', dockRoutes);
router.use('/content', contentRoutes);

export default router;
