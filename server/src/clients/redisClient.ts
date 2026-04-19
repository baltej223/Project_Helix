import { createClient } from 'redis';
import config from '../config/index.js';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function connectRedis() {
  if (redisClient) {
    console.log('Redis already connected');
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: config.redisUrl,
    });

    redisClient.on('error', (err) => console.error('Redis error:', err));
    redisClient.on('connect', () => console.log('✓ Redis connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('✗ Redis connection failed:', error);
    throw error;
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis not connected. Call connectRedis() first');
  }
  return redisClient;
}

export async function disconnectRedis() {
  if (!redisClient) return;
  try {
    await redisClient.disconnect();
    redisClient = null;
    console.log('✓ Redis disconnected');
  } catch (error) {
    console.error('✗ Redis disconnection failed:', error);
    throw error;
  }
}
