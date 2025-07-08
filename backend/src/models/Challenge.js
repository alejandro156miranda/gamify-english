const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true }
});

const ChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [QuestionSchema], required: true },
    rewardPoints: { type: Number, default: 10 },
    isWeekly: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);