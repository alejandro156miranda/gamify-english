const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Insignias
const badgeThresholds = [
    { id: 'primeros-pasos', name: 'Primeros Pasos', points: 10 },
    { id: 'explorador', name: 'Explorador', points: 20 },
    { id: 'aprendiz', name: 'Aprendiz', points: 30 },
    { id: 'vocabulario', name: 'Maestro de Vocabulario', points: 50 },
    { id: 'gramatica', name: 'Experto en Gramática', points: 80 },
    { id: 'conversacion', name: 'Conversador Fluido', points: 120 },
    { id: 'maestro', name: 'Maestro del Inglés', points: 180 },
    { id: 'leyenda', name: 'Leyenda de Novatrail', points: 250 },
    { id: 'heroe', name: 'Héroe del Conocimiento', points: 350 },
    { id: 'gran-maestro', name: 'Gran Maestro', points: 500 }
];

const badgeNameToIdMap = {
    'Primeros Pasos': 'primeros-pasos',
    'Explorador': 'explorador',
    'Aprendiz': 'aprendiz',
    'Maestro de Vocabulario': 'vocabulario',
    'Experto en Gramática': 'gramatica',
    'Conversador Fluido': 'conversacion',
    'Maestro del Inglés': 'maestro',
    'Leyenda de Novatrail': 'leyenda',
    'Héroe del Conocimiento': 'heroe',
    'Gran Maestro': 'gran-maestro'
};

// ── REGISTER ───────────────────────────────────────────────────────────────
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

// ── LOGIN ──────────────────────────────────────────────────────────────────
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
        if (!await bcrypt.compare(password, user.passwordHash)) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        // normalizar badges
        let needsSave = false;
        const converted = user.badges.map(b => badgeNameToIdMap[b] || b);
        const uniqueBadges = [...new Set(converted)];
        if (uniqueBadges.length !== user.badges.length ||
            !uniqueBadges.every(b => user.badges.includes(b))) {
            user.badges = uniqueBadges;
            needsSave = true;
        }
        for (const b of badgeThresholds) {
            if (user.points >= b.points && !user.badges.includes(b.id)) {
                user.badges.push(b.id);
                needsSave = true;
            }
        }
        if (needsSave) {
            user.badges = [...new Set(user.badges)];
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
                role: user.role
            }
        });
    } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// ── UPDATE PROFILE ─────────────────────────────────────────────────────────
router.put('/update-profile', async(req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'Token no proporcionado' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const { name, avatar, password } = req.body;
        if (name !== undefined) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            points: user.points,
            createdAt: user.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar perfil' });
    }
});

// ── ADMIN: UPDATE ANY USER ─────────────────────────────────────────────────
router.put('/users/:id', async(req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        user.name = name !== undefined ? name : user.name;
        user.email = email !== undefined ? email : user.email;
        user.role = role !== undefined ? role : user.role;
        await user.save();

        res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        console.error('❌ Error al actualizar usuario:', err);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

// ── UPDATE PROGRESS ────────────────────────────────────────────────────────
router.put('/update-progress/:id', async(req, res) => {
    const { points } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        user.points += points;
        user.level = Math.floor(user.points / 100) + 1;

        const newBadges = badgeThresholds
            .filter(b => user.points >= b.points && !user.badges.includes(b.id))
            .map(b => b.id);

        if (newBadges.length > 0) {
            user.badges = [...new Set([...user.badges, ...newBadges])];
            console.log('🎉 Nuevas insignias:', newBadges);
        }
        await user.save();

        res.json({
            msg: 'Progreso actualizado',
            user: {
                id: user._id,
                points: user.points,
                level: user.level,
                badges: user.badges
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// ── FIX BADGES ─────────────────────────────────────────────────────────────
router.get('/fix-badges/:userId', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const all = badgeThresholds
            .filter(b => user.points >= b.points)
            .map(b => b.id);

        user.badges = [...new Set(all)];
        await user.save();
        res.json({ msg: 'Insignias reparadas', badges: user.badges });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// ── LIST / GET USERS ───────────────────────────────────────────────────────
router.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});
router.get('/users/:id', async(req, res) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            avatar: u.avatar,
            points: u.points,
            createdAt: u.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

router.delete('/users/:id', async(req, res) => {
    try {
        const d = await User.findByIdAndDelete(req.params.id);
        if (!d) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json({ msg: 'Usuario eliminado', deletedUser: d });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
});

module.exports = router;