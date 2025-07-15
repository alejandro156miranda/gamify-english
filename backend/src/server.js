require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Importar rutas
const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
// Conexión a MongoDB (local o Atlas según MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));
// Rutas de autenticación
app.use('/api/auth', authRoutes);
// Rutas del módulo de actividades interactivas
app.use('/api/challenges', challengesRoutes);
// Ruta raíz de prueba
app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));
// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

// Puesto de escucha
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server escuchando en puerto ${PORT}`));