import app from './app.js';
import config from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`OCR service running in ${config.env} mode on port ${config.port}`);
});

const shutdown = () => {
  console.log('Shutting down OCR service gracefully...');
  server.close(() => {
    console.log('OCR service terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
