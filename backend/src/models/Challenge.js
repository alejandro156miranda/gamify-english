const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true }
});

const ChallengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String, // La lectura o instrucciones
    type: { type: String, default: 'weekly' }, // 'weekly', 'quiz', etc.
    reward: { type: Number, default: 150 },
    month: {
      type: String,
      required: true,
      match: /^[0-9]{4}-[0-9]{2}$/, // Ej. "2025-07"
    },
    options: { type: [String], default: [] },         // ✅ NECESARIO PARA .map()
    correctIndex: { type: Number, default: 0 },        // ✅ Para comparar respuestas
    participants: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);