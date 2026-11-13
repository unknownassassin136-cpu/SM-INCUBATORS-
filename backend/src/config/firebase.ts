import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let bucket: any = null;

try {
  const projectId =
    process.env.FB_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
  const clientEmail = process.env.FB_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines if passed in env
  const privateKey = (process.env.FB_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n');
  let storageBucket = process.env.FB_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;
  if (storageBucket) {
    storageBucket = storageBucket.replace(/^gs:\/\//, '').trim();
  }

  if (projectId && clientEmail && privateKey && !clientEmail.includes('placeholder')) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: storageBucket || `${projectId}.firebasestorage.app`,
      });
      console.log('✅ Firebase Admin initialized with Storage Bucket:', storageBucket);
    }
    bucket = admin.storage().bucket();
  } else {
    // In Google Cloud Functions/Cloud Run or when service account key isn't provided,
    // initialize using Google Cloud Application Default Credentials (ADC)
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          storageBucket: storageBucket || `${projectId || 'sm-incubators'}.firebasestorage.app`,
        });
      }
      bucket = admin.storage().bucket();
      console.log('✅ Firebase Admin initialized with Application Default Credentials');
    } catch (adcErr) {
      console.warn('⚠️ Firebase Admin ADC fallback not available:', adcErr);
    }
  }
} catch (error) {
  console.error('⚠️ Firebase Admin initialization error:', error);
}

export { admin, bucket };
