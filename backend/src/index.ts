import { onRequest } from 'firebase-functions/v2/https';
import app from './app.js';

// Export Express REST API as a Firebase Cloud Function (v2)
export const api = onRequest(
  {
    region: 'asia-south1',
    cors: true,
    maxInstances: 10,
    memory: '512MiB',
    timeoutSeconds: 60,
  },
  app
);

export default app;

