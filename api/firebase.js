const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let db = null;

try {
  // Only initialize once (important for serverless warm restarts)
  if (admin.apps.length === 0) {
    let serviceAccount = null;

    // 1. Try environment variable (production on Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('🔑 Using FIREBASE_SERVICE_ACCOUNT env var');
      } catch (e) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
      }
    }

    // 2. Fall back to local file (both dev and Vercel if file is committed)
    if (!serviceAccount) {
      const keyPath = path.join(__dirname, 'serviceAccountKey.json');
      if (fs.existsSync(keyPath)) {
        try {
          const raw = fs.readFileSync(keyPath, 'utf8');
          serviceAccount = JSON.parse(raw);
          console.log('🔑 Using serviceAccountKey.json file');
        } catch (e) {
          console.error('❌ Failed to read serviceAccountKey.json:', e.message);
        }
      } else {
        console.warn('⚠️ serviceAccountKey.json not found at:', keyPath);
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized successfully');
      db = admin.firestore();
    } else {
      console.error('❌ No Firebase credentials available. DB will be null.');
    }
  } else {
    // Already initialized (warm serverless instance)
    db = admin.firestore();
    console.log('♻️ Reusing existing Firebase Admin instance');
  }
} catch (err) {
  console.error('❌ Fatal Firebase initialization error:', err.message);
  db = null;
}

module.exports = db;
