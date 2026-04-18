import morgan from 'morgan';
import config from '../config/index.js';

export const requestLogger = morgan(config.isDevelopment ? 'dev' : 'combined');
