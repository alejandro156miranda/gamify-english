const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String, 
  type: { type: String, default: 'weekly' },
  reward: { type: Number, default: 150 },
  month: {
    type: String,
    required: true,
    match: /^[0-9]{4}-[0-9]{2}$/  // formato 'YYYY-MM'
  },
  participants: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
