import mongoose from 'mongoose';
import createApp from '../app/createApp.js';
import config from '../config/index.js';

export async function startServer(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`Server running in ${config.env} mode on port ${config.port}`);
    });

    const shutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed and process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
