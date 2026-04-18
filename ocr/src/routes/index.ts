import { Router } from 'express';
import healthRouter from './health.js';
import ocrRouter from './ocr.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/ocr', ocrRouter);

export default router;
