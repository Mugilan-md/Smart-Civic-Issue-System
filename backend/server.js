const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Persistent data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

let mongoServer;

const startServer = async () => {
  try {
    // Check for lock file and remove it if it exists (prevents startup issues)
    const lockFile = path.join(dataDir, 'mongod.lock');
    if (fs.existsSync(lockFile)) {
      try {
        fs.unlinkSync(lockFile);
        console.log('Removed old MongoDB lock file.');
      } catch (err) {
        console.warn('Could not remove lock file, it might be in use:', err.message);
      }
    }

    // Use a fixed dbPath so data persists across restarts
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dataDir,
        storageEngine: 'wiredTiger',
      },
    });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, { dbName: 'civic_db' });
    console.log('--------------------------------------------------');
    console.log(`🚀 MongoDB connected (PERSISTENT)`);
    console.log(`📂 Data directory: ${dataDir}`);
    console.log(`🔗 URI: ${mongoUri}`);
    console.log('--------------------------------------------------');

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};

startServer();
