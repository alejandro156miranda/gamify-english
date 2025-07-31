require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

// ► Forzar Node 18 en Render
// package.json → "engines": { "node": "18.x" }

app.use(express.json());
app.use(cors({
    origin: [
        'https://gamify-english-frontend.onrender.com',
        'https://gamify-english.onrender.com',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengesRoutes);

app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ msg: 'Origen no permitido' });
    }
    res.status(500).json({ msg: err.message || 'Algo salió mal' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server en puerto ${PORT}`));