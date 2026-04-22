const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');

// Setup upload directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new report
router.post('/reports', upload.single('image'), async (req, res) => {
  try {
    const { name, mobile, location, category, problemType, issue } = req.body;
    let imagePath = null;
    
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newReport = new Report({
      name,
      mobile,
      location,
      category,
      problemType,
      issue,
      image: imagePath
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully', report: newReport });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all reports (for Admin Dashboard)
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update report status (for Admin Dashboard)
router.put('/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a report (Admin only)
router.delete('/reports/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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
