import { Application } from 'express';
import { errorHandler } from '../middleware/errorHandler.js';

export function registerErrorHandlers(app: Application): void {
  app.use(errorHandler);
}
