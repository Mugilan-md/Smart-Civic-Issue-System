const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/auth');

// Use memory storage (Vercel filesystem is read-only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Lazy-load db so a Firebase init error doesn't crash the whole module
function getDb() {
  try {
    return require('../firebase');
  } catch (e) {
    console.error('Failed to load firebase module:', e.message);
    return null;
  }
}

// ── POST /api/reports ─────────────────────────────────────────────────────────
router.post('/reports', verifyToken, upload.single('image'), async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ message: 'Database not initialized. Please set FIREBASE_SERVICE_ACCOUNT in Vercel environment variables.' });
  }
  try {
    const { name, mobile, location, category, problemType, issue } = req.body;
    let imageBase64 = null;

    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      console.log(`Image received: ${req.file.originalname} (${req.file.size} bytes)`);
    }

    const reportData = {
      name: name || '',
      mobile: mobile || '',
      location: location || '',
      category: category || '',
      problemType: problemType || '',
      issue: issue || '',
      image: imageBase64,
      status: 'Pending',
      createdAt: new Date(),
    };

    const docRef = await db.collection('reports').add(reportData);
    console.log('Report saved:', docRef.id);
    res.status(201).json({ message: 'Report submitted successfully', report: { id: docRef.id, ...reportData } });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ── GET /api/reports ──────────────────────────────────────────────────────────
router.get('/reports', verifyToken, async (req, res) => {
  const db = getDb();
  if (!db) {
    return res.status(503).json({ message: 'Database not initialized.' });
  }
  try {
    const snapshot = await db.collection('reports').orderBy('createdAt', 'desc').get();
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
    }));
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ── PUT /api/reports/:id/status ───────────────────────────────────────────────
router.put('/reports/:id/status', verifyToken, async (req, res) => {
  const db = getDb();
  if (!db) return res.status(503).json({ message: 'Database not initialized.' });
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const reportRef = db.collection('reports').doc(req.params.id);
    const doc = await reportRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Report not found' });
    await reportRef.update({ status });
    res.json({ id: doc.id, ...doc.data(), status });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ── DELETE /api/reports/:id ───────────────────────────────────────────────────
router.delete('/reports/:id', verifyToken, async (req, res) => {
  const db = getDb();
  if (!db) return res.status(503).json({ message: 'Database not initialized.' });
  try {
    const reportRef = db.collection('reports').doc(req.params.id);
    const doc = await reportRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Report not found' });
    await reportRef.delete();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
module.exports = router;
