import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let bucket: any = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines if passed in env
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey && !clientEmail.includes('placeholder')) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: storageBucket || `${projectId}.appspot.com`,
      });
      console.log('✅ Firebase Admin initialized with Storage Bucket:', storageBucket);
    }
    bucket = admin.storage().bucket();
  } else {
    console.warn('⚠️ Firebase credentials not set or using placeholders. Image uploads will use local placeholder storage.');
  }
} catch (error) {
  console.error('⚠️ Firebase Admin initialization error:', error);
}

export { admin, bucket };
