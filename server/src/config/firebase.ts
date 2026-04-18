import admin from 'firebase-admin';
import config from './index.js';

// We initialize without explicit credentials if running in a Google Cloud environment,
// otherwise, we expect a service account JSON or environment variables.
// For this demo, we'll assume the environment is correctly configured or uses ADC.

if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: `${config.pineconeIndex}.appspot.com`, // Assuming bucket name matches or is similar
  });
}

export const bucket = admin.storage().bucket();
export default admin;
