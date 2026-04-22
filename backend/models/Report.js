const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  problemType: { type: String, required: true },
  issue: { type: String },
  image: { type: String }, // Path to the uploaded image
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Solved']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
