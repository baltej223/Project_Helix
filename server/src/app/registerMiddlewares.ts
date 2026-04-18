import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from '../config/index.js';
import { requestLogger } from '../middleware/requestLogger.js';

export function registerMiddlewares(app: Application): void {
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
}
