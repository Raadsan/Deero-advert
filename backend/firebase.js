import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// JSON import ES Module way (require() kuma shaqayso)
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
