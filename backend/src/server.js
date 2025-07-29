require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// 1) CORS abierto (mide sólo en producción si quieres restringirlo):
app.use(cors());
app.options('*', cors()); // preflight para todo

// 2) JSON parser
app.use(express.json());

// 3) Conectar a Mongo
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// 4) Rutas
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// 5) Ruta raíz
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

// 6) Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

// 7) Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server escuchando en puerto ${PORT}`));