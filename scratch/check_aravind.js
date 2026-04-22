const mongoose = require('mongoose');
const Report = require('./backend/models/Report');

async function checkReports() {
  try {
    await mongoose.connect('mongodb://localhost:27017/smart-civic');
    const reports = await Report.find({ name: /Aravind/i });
    console.log('Aravind reports:', reports);
    if (reports.length === 0) {
      console.log('Aravind report not found. Creating one...');
      const newReport = new Report({
        name: 'Aravind',
        mobile: '9876543210',
        location: 'Anna Nagar, Chennai',
        category: 'Road & Transport Issues',
        problemType: 'Potholes (road holes)',
        issue: 'Large pothole near the main junction causing traffic delay.',
        status: 'In Progress'
      });
      await newReport.save();
      console.log('Aravind report created.');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkReports();
