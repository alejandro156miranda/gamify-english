require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB local conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('🚀 API local funcionando'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🔊 Server en puerto ${PORT}`));

//Hola