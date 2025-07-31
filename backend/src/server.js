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
            console.warn(`⚠️ Origen bloqueado por CORS: ${origin}`);
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400
};

// 2. Middlewares esenciales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Conexión robusta a MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000
    })
    .then(() => console.log('✅ MongoDB conectado exitosamente'))
    .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        console.error('⚠️ Asegúrate de que:');
        console.error('1. La URL de MongoDB es correcta');
        console.error('2. La base de datos está accesible desde internet');
        console.error('3. El firewall permite conexiones desde Render.com');
    });

// 4. Registrar rutas con prefijo /api
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

// 5. Middleware para registrar todas las solicitudes (para depuración)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// 6. Ruta de verificación de salud
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'OK',
        dbStatus,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 7. Ruta raíz
app.get('/', (req, res) => {
    res.send(`
        <h1>🚀 API Gamify English</h1>
        <p>Estado: <strong>Operativo</strong></p>
        <p>Versión: 1.1.0</p>
        <p>DB: ${mongoose.connection.readyState === 1 ? '✅ Conectado' : '❌ Desconectado'}</p>
    `);
});

// 8. Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`,
        suggestedActions: [
            'Verifica la URL solicitada',
            'Revisa los métodos HTTP permitidos',
            'Consulta la documentación de la API'
        ]
    });
});

// 9. Manejo centralizado de errores
app.use((err, req, res, next) => {
    console.error('🔥 Error global:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        body: req.body
    });

    // Manejo especial de errores CORS
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'Acceso prohibido',
            message: 'Origen no permitido',
            allowedOrigins,
            requestedOrigin: req.headers.origin
        });
    }

    // Respuesta de error
    res.status(err.status || 500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'production' ?
            'Por favor contacta al soporte técnico' :
            err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 10. Configuración de puerto
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`🔊 Servidor escuchando en puerto ${PORT}`);
    console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🛡️  Orígenes permitidos: ${allowedOrigins.join(', ')}`);
});

// 11. Manejo de cierre de servidor
const shutdown = (signal) => {
    console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor...`);
    server.close(() => {
        console.log('👋 Servidor cerrado');
        mongoose.connection.close(false, () => {
            console.log('🔌 Conexión a MongoDB cerrada');
            process.exit(0);
        });
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));