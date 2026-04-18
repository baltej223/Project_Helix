import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  corsOrigin: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export default config;