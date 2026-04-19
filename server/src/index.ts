import createApp from './app/createApp.js';
import config from './config/index.js';
import { connectMongo } from './clients/mongoClient.js';
import { connectRedis } from './clients/redisClient.js';
import { initializeJobQueue } from './services/jobQueueService.js';

async function startServer(): Promise<void> {
  try {
    // Connect to databases
    await connectMongo();
    await connectRedis();
    await initializeJobQueue();

    const app = createApp();

    app.listen(config.port, () => {
      console.log(`✓ Server running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});