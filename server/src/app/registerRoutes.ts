import type { Application } from 'express';
import router from '../routes/index.js';

export function registerRoutes(app: Application): void {
  app.use(router);
}
