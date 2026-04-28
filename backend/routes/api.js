const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../firebase');

// Use memory storage (no disk writes — Vercel is read-only)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Create a new report
router.post('/reports', upload.single('image'), async (req, res) => {
  try {
    const { name, mobile, location, category, problemType, issue } = req.body;
    let imageBase64 = null;

    if (req.file) {
      // Convert to base64 string so it can be stored in Firestore
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const reportData = {
      name,
      mobile,
      location,
      category,
      problemType,
      issue,
      image: imageBase64,
      status: 'Pending',
      createdAt: new Date()
    };

    const docRef = await db.collection('reports').add(reportData);
    res.status(201).json({
      message: 'Report submitted successfully',
      report: { id: docRef.id, ...reportData }
    });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get all reports (for Admin Dashboard)
router.get('/reports', async (req, res) => {
  try {
    const snapshot = await db.collection('reports').orderBy('createdAt', 'desc').get();
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt
    }));
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update report status (for Admin Dashboard)
router.put('/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const reportRef = db.collection('reports').doc(req.params.id);
    const doc = await reportRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await reportRef.update({ status });
    res.json({ id: doc.id, ...doc.data(), status });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Delete a report (Admin only)
router.delete('/reports/:id', async (req, res) => {
  try {
    const reportRef = db.collection('reports').doc(req.params.id);
    const doc = await reportRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await reportRef.delete();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'mugi123' && password === '123456789') {
    res.json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Public (community) login
router.post('/public-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'publicorg' && password === 'public777') {
    res.json({ message: 'Public login successful', token: 'public-access-token' });
  } else {
    res.status(401).json({ message: 'Invalid community credentials' });
  }
});

module.exports = router;
