require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// 1. Configuración avanzada de CORS
const allowedOrigins = [
    'https://gamify-english-kgz3.onrender.com',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// 2. Middlewares esenciales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Conexión robusta a MongoDB con mejores prácticas
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
    })
    .then(() => console.log('✅ MongoDB conectado exitosamente'))
    .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1); // Salir en caso de error crítico
    });

// 4. Manejo de eventos de conexión de MongoDB
mongoose.connection.on('connected', () => {
    console.log('🔗 Conexión a MongoDB establecida');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error en conexión MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB desconectado');
});

// 5. Registrar rutas con prefijo /api
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// 6. Ruta de verificación de salud del servidor
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        dbStatus,
        timestamp: new Date().toISOString()
    });
});

// 7. Ruta raíz mejorada
app.get('/', (req, res) => {
    res.send(`
        <h1>🚀 API Gamify English</h1>
        <p>Versión: 1.0.0</p>
        <p>Estado: <strong>Operativo</strong></p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <p>Documentación: <a href="/api-docs">Swagger UI</a></p>
    `);
});

// 8. Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.path} no existe en este servidor`
    });
});

// 9. Manejo centralizado de errores
app.use((err, req, res, next) => {
    console.error('🔥 Error global:', err.stack);

    // Manejo especial de errores CORS
    if (err.message === 'Origen no permitido por CORS') {
        return res.status(403).json({
            error: 'Acceso prohibido',
            message: 'Tu origen no está permitido para acceder a este recurso'
        });
    }

    // Respuesta de error genérico
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'production' ?
            'Ocurrió un error inesperado' :
            err.message
    });
});

// 10. Configuración de puerto y arranque seguro
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`🔊 Servidor escuchando en puerto ${PORT}`);
    console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// 11. Manejo de cierre de servidor
process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal SIGINT. Cerrando servidor...');
    server.close(() => {
        console.log('👋 Servidor cerrado');
        mongoose.connection.close(false, () => {
            console.log('🔌 Conexión a MongoDB cerrada');
            process.exit(0);
        });
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recibida señal SIGTERM. Cerrando servidor...');
    server.close(() => {
        console.log('👋 Servidor cerrado');
        mongoose.connection.close(false, () => {
            console.log('🔌 Conexión a MongoDB cerrada');
            process.exit(0);
        });
    });
});

// 12. Manejo de promesas rechazadas no capturadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

// 13. Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err.stack);
    process.exit(1);
});