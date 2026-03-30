import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

let serviceAccount;

// 1. Marka hore fiiri haddii uu jiro Environment Variable (Railway)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
  }
} 
// 2. Haddii kale, fiiri haddii uu file-ka jiro (Local)
else if (existsSync('./serviceAccountKey.json')) {
  serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey.json', 'utf-8')
  );
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
} else if (!serviceAccount) {
  console.log("Warning: Firebase service account not found.");
}

export default admin;
