const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Use environment variable in production (Vercel)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Use local file in development
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (err) {
    console.warn('Firebase key file not found. Set FIREBASE_SERVICE_ACCOUNT env var for production.');
  }
}

if (serviceAccount) {
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('🔥 Firebase Admin initialized successfully');
    }
  } catch (err) {
    console.error('❌ Firebase initialization error:', err.message);
  }
} else {
  console.warn('⚠️ No service account provided. Firestore operations will fail.');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;

module.exports = db;
