const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./firebase'); // Import Firestore
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.send('Smart Civic API is running with Firestore');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔥 Connected to Google Firestore`);
    console.log(`--------------------------------------------------`);
  });
}

module.exports = app;

