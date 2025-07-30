require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const challengesRoutes = require('./routes/challenges');

const app = express();

app.use(cors({
    origin: 'https://gamify-english-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

app.use('/auth', authRoutes);
app.use('/challenges', challengesRoutes);

app.get('/', (req, res) => res.send('🚀 API funcionando correctamente'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔊 Server en puerto ${PORT}`));