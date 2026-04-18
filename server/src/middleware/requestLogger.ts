import { Request } from 'express';
import morgan from 'morgan';
import config from '../config/index.js';

morgan.token('body', (req: Request) => JSON.stringify(req.body));

const getFormat = () => {
  if (config.isProduction) {
    return ':method :url :status :res[content-length] - :response-time ms';
  }
  return ':method :url :status :res[content-length] - :response-time ms\\n:body';
};

export const requestLogger = morgan(getFormat());
