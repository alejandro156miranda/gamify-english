// backend/src/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Rutas
const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');
const raffleRoutes = require('./routes/raffle'); // Asegúrate de tener este archivo

const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cors({
    origin: [
        'https://gamify-english.onrender.com',
        'https://gamify-english-frontend.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
        // estas opciones quedan obsoletas en v4+, pero no hacen daño
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/raffle', raffleRoutes);

// --- Ruta raíz ---
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

// --- Manejador de errores global ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

// --- Arranque del servidor ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🔊 Server escuchando en puerto ${PORT}`);
});