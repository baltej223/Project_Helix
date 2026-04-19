import mongoose from 'mongoose';
import config from '../config/index.js';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(config.mongodbUri);
    isConnected = true;
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    throw error;
  }
}

export function getMongoConnection() {
  if (!isConnected) {
    throw new Error('MongoDB not connected. Call connectMongo() first');
  }
  return mongoose.connection;
}

export async function disconnectMongo() {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
    throw error;
  }
}
