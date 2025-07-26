const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number
}, { _id: false });

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'weekly', required: true }, // 'weekly', 'quiz', etc.
  reward: { type: Number, default: 150 },
  month: {
    type: String,
    match: /^[0-9]{4}-[0-9]{2}$/ // Solo si es weekly
  },
  questions: { type: [QuestionSchema], default: [] }, // Para quizzes
  options: { type: [String], default: [] },           // Solo para 1 pregunta (weekly)
  correctIndex: { type: Number, default: 0 },
  participants: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  availableFrom: { type: Date, required: true }, // Nueva propiedad requerida
  availableTo: { type: Date, required: true },   // Nueva propiedad requerida
  pointsAwarded: { type: Number, required: true }, // Nueva propiedad requerida
  status: { type: String, enum: ['active', 'inactive'], required: true } // Nueva propiedad requerida
});

module.exports = mongoose.model('Challenge', ChallengeSchema);