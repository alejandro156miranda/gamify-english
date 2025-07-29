require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Rutas
const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cors({
    // Permite tu frontend en Render
    origin: [
        'https://gamify-english-frontend.onrender.com',
        'https://gamify-english.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// --- Root & Error handler ---
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

// --- Arranque ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`🔊 Server escuchando en puerto ${PORT}`)
);