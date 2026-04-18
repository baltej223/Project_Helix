import express, { Application } from 'express';
import { registerMiddlewares } from './registerMiddlewares.js';
import { registerRoutes } from './registerRoutes.js';
import { registerErrorHandlers } from './registerErrorHandlers.js';

export function createApp(): Application {
  const app = express();

  registerMiddlewares(app);
  registerRoutes(app);
  registerErrorHandlers(app);

  return app;
}

export default createApp;
