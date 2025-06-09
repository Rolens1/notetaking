const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: String,  // Google ID from passport
  email: String,
  displayName: String,
  avatar: String,
  preferences: {
    fontSize: { type: Number, default: 16 },
    fontColor: { type: String, default: '#000000' },
    fontFamily: { type: String, default: 'Arial' },
    noteBackground: { type: String, default: '#ffffff' },
    theme: { type: String, default: 'light', enum: ['light', 'dark'] }
  },
  lastLogin: { type: Date, default: Date.now }
});


module.exports = mongoose.model('UserProfile', userProfileSchema)