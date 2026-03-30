import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Gracefully initialize Firebase — server won't crash if key is missing
let firebaseInitialized = false;

try {
  if (existsSync('./serviceAccountKey.json')) {
    const serviceAccount = JSON.parse(
      readFileSync('./serviceAccountKey.json', 'utf-8')
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️ serviceAccountKey.json not found — FCM push notifications disabled');
  }
} catch (error) {
  console.error('⚠️ Firebase initialization failed:', error.message);
}

export { firebaseInitialized };
export default admin;
