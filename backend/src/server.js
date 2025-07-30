require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// 1. Configuración CORS mejorada
const corsOptions = {
    origin: 'https://gamify-english-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// 2. Middleware para agregar headers CORS manualmente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://gamify-english-frontend.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

app.use('/auth', authRoutes);
app.use('/challenges', challengesRoutes);

app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

// 3. Middleware de errores con headers CORS
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Agregar headers CORS incluso en errores
    res.header('Access-Control-Allow-Origin', 'https://gamify-english-frontend.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(500).json({ msg: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server en puerto ${PORT}`));