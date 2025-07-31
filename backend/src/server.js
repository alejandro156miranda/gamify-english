require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// --- Configuración CORRECTA de CORS ---
const allowedOrigins = [
    'https://gamify-english-kgz3.onrender.com', // Tu frontend
    'http://localhost:3000' // Desarrollo local
];

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilitar preflight para todas las rutas

// --- Middleware adicional ---
app.use(express.json());

// --- Conexión a MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// --- Ruta raíz ---
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

// --- Error handler genérico ---
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Manejar errores CORS específicamente
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ msg: 'Origen no permitido' });
    }

    res.status(500).json({ msg: err.message });
});

// --- Puerto de escucha ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server escuchando en puerto ${PORT}`));