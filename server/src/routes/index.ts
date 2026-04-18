import { Router } from 'express';
import { attachMockAuth } from '../middleware/auth.js';
import documentRouter from './document.js';
import healthRouter from './health.js';

const router = Router();

router.use('/health', healthRouter);

router.use(attachMockAuth);
router.use('/documents', documentRouter);

export default router;
