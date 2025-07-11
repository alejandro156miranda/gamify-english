const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ['parent', 'child'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },            // ✅ Nivel
  badges: [{ type: String }],                     // ✅ Insignias
  avatar: { type: String, default: null },        // ✅ Emoji o icono
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
