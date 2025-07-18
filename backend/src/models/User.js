const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    role: { type: String, enum: ['parent', 'child', 'admin'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: {
        type: [String],
        enum: [
            'primeros-pasos',
            'explorador',
            'aprendiz',
            'vocabulario',
            'gramatica',
            'conversacion',
            'maestro',
            'leyenda',
            'heroe',
            'gran-maestro'
        ],
        default: []
    },
    avatar: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    completedChallenges: { type: [String], default: [] }
});

module.exports = mongoose.model('User', UserSchema);