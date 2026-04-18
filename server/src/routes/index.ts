import { Router } from 'express';
import healthRouter from './health.js';
import documentRouter from './document.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.use('/health', healthRouter);

// Protected routes (middleware applied below this line)
router.use(authenticate);

// Document routes
router.use('/documents', documentRouter);

// Example protected route
router.get('/me', (req: any, res) => {
  res.json({
    success: true,
    message: 'Authenticated successfully',
    data: {
      userId: req.userId,
      user: req.user,
    },
  });
});

export default router;