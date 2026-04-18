import { Router } from 'express';
import healthRouter from './health.js';

const router = Router();

router.use('/health', healthRouter);

export default router;