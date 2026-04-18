import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  corsOrigin: string;
  uploadMaxFileSizeBytes: number;
  ocrBaseUrl: string;
  ocrRequestTimeoutMs: number;
  isProduction: boolean;
  isDevelopment: boolean;
  clerkSecretKey: string;
  mongodbUri: string;
  geminiApiKey: string;
  pineconeApiKey: string;
  pineconeIndex: string;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadMaxFileSizeBytes: parseInt(
    process.env.UPLOAD_MAX_FILE_SIZE_BYTES || '10485760',
    10
  ),
  ocrBaseUrl: process.env.OCR_BASE_URL || 'http://localhost:5000',
  ocrRequestTimeoutMs: parseInt(
    process.env.OCR_REQUEST_TIMEOUT_MS || '30000',
    10
  ),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/helix',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  pineconeApiKey: process.env.PINECONE_API_KEY || '',
  pineconeIndex: process.env.PINECONE_INDEX || 'legal-clauses',
};

export default config;