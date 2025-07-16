// ✅ auth.js COMPLETO con insignias automáticas
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro
router.post('/register', async(req, res) => {
    const { role, name, email, password, childId } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: 'Email ya registrado' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            role,
            name,
            email,
            passwordHash,
            childId: role === 'parent' ? childId : null
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: newUser._id, role, name, email } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

// Login
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Devolver los datos completos del usuario
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                level: user.level,
                badges: user.badges,
                avatar: user.avatar,
                completedChallenges: user.completedChallenges,
            },
        });
    } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Editar perfil
router.put('/update-profile', async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const { name, avatar, password } = req.body;
        if (name) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            user.passwordHash = hash;
        }
        await user.save();
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            points: user.points,
            createdAt: user.createdAt,
            password: user.password,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar perfil' });
    }
});

// ✅ ACTUALIZAR PROGRESO CON INSIGNIAS
router.put('/update-progress/:id', async(req, res) => {
    const { points, type } = req.body;
    console.log(`Recibido update de puntos: ${points}`);
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        user.points += points;
        user.level = Math.floor(user.points / 100) + 1;
        console.log(`📥 Progreso recibido: +${points} pts (${type}) para ${user.name}`);

        const newBadges = [];
        if (user.points >= 20 && !user.badges.includes('Explorador')) {
            newBadges.push('Explorador');
        }
        if (user.points >= 50 && !user.badges.includes('Aprendiz Destacado')) {
            newBadges.push('Aprendiz Destacado');
        }
        if (user.points >= 100 && !user.badges.includes('Maestro del Inglés')) {
            newBadges.push('Maestro del Inglés');
        }
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();
        res.json({ msg: 'Progreso actualizado', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});


module.exports = router;