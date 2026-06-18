const admin = require('firebase-admin');
require('../firebase');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // attaches user info (email, uid) to the request
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(403).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
}

module.exports = verifyToken;
