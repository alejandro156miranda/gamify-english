// backend/src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');


const app = express();

// --- Middlewares ---
app.use(cors());
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
    res.status(500).json({ msg: err.message });
});

// --- Puerto de escucha ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server escuchando en puerto ${PORT}`));