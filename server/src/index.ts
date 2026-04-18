import createApp from './app/createApp.js';
import config from './config/index.js';

async function startServer(): Promise<void> {
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});