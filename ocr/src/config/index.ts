import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  corsOrigin: string;
  maxFileSizeBytes: number;
  requestTimeoutMs: number;
  isProduction: boolean;
  isDevelopment: boolean;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxFileSizeBytes: parseInt(process.env.OCR_MAX_FILE_SIZE || '10485760', 10),
  requestTimeoutMs: parseInt(process.env.OCR_REQUEST_TIMEOUT_MS || '30000', 10),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export default config;
