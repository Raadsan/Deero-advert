import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    // ✅ Fix for Railway newline issue in private_key
    if (serviceAccount && serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    console.log("✅ FIREBASE_SERVICE_ACCOUNT si sax ah ayaa loo akhriyay (Private Key Fixed!)");
  } catch (error) {
    console.error("❌ Cilad baa ka dhacday akhriska FIREBASE_SERVICE_ACCOUNT:");
    console.error("➡️ Value-ga ay heshay:", process.env.FIREBASE_SERVICE_ACCOUNT ? "Hadaad aragto qoraal, wuu jiraa" : "Ma jiro");
    console.log("➡️ Error details:", error.message);
  }
} 
// 2. Haddii kale, fiiri haddii uu file-ka jiro (Local)
else if (existsSync('./serviceAccountKey.json')) {
  serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey.json', 'utf-8')
  );
} 
// 3. Haddii meelna laga waayo
else {
  console.log("⚠️ Variable-ka FIREBASE_SERVICE_ACCOUNT iyo file-ka serviceAccountKey.json midna lama helin.");
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
} else if (!serviceAccount) {
  console.log("Warning: Firebase service account not found.");
}

export const firebaseInitialized = Boolean(serviceAccount);
export default admin;

