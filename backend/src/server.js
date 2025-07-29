require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// --- CORS: debe ir antes de las rutas ---
app.use(cors({
    origin: [
        'https://gamify-english-frontend.onrender.com',
        'https://gamify-english-backend.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Responder preflight para todas las rutas
app.options('*', cors());

// --- Parseo de JSON ---
app.use(express.json());

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// --- Ruta raíz de prueba ---
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

// --- Manejador global de errores ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

// --- Arranque del servidor ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`🔊 Server escuchando en puerto ${PORT}`)
);