import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import router from './routes/index.js';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.use(router);

  app.use(errorHandler);

  return app;
}

export default createApp();
