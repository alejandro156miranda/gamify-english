const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Definición de insignias con IDs
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

// Mapa para convertir nombres a IDs
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

// Login con conversión de insignias
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

        // Convertir insignias de nombres a IDs
        let needsSave = false;
        const convertedBadges = user.badges.map(badgeName => {
            return badgeNameToIdMap[badgeName] || badgeName;
        });

        // Filtrar IDs duplicados
        const uniqueBadges = [...new Set(convertedBadges)];

        // Verificar si hubo cambios
        if (uniqueBadges.length !== user.badges.length ||
            !uniqueBadges.every(b => user.badges.includes(b))) {
            user.badges = uniqueBadges;
            needsSave = true;
        }

        // Agregar insignias faltantes por puntos
        for (const badge of badgeThresholds) {
            if (user.points >= badge.points && !user.badges.includes(badge.id)) {
                user.badges.push(badge.id);
                needsSave = true;
            }
        }

        // Eliminar duplicados nuevamente
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
                role: user.role,
            },
        });
    } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

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
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar perfil' });
    }
});

// CORRECCIÓN: Operadores de fusión nula sin espacios
router.put('/users/:id', async(req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });


        // Actualizar solo los campos proporcionados
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;


        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error('❌ Error al actualizar usuario:', err);
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
});

// Actualizar progreso con insignias por ID
router.put('/update-progress/:id', async(req, res) => {
    const { points, type } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        user.points += points;
        user.level = Math.floor(user.points / 100) + 1;

        const newBadges = [];

        // Verificar cada insignia
        for (const badge of badgeThresholds) {
            if (user.points >= badge.points && !user.badges.includes(badge.id)) {
                newBadges.push(badge.id);
            }
        }

        // Agregar nuevas insignias si existen
        if (newBadges.length > 0) {
            user.badges = [...new Set([...user.badges, ...newBadges])];
            console.log(`🎉 Nuevas insignias: ${newBadges.join(', ')}`);
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

// Ruta para reparar insignias manualmente
router.get('/fix-badges/:userId', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Agregar todas las insignias que correspondan por puntos
        const allBadges = badgeThresholds
            .filter(badge => user.points >= badge.points)
            .map(badge => badge.id);

        user.badges = [...new Set(allBadges)];

        await user.save();
        res.json({ msg: 'Insignias reparadas', badges: user.badges });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Obtener todos los usuarios
router.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});

// Obtener un usuario por ID
router.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

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
        console.error('❌ Error al obtener usuario:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

router.delete('/users/:id', async(req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json({ msg: 'Usuario eliminado', deletedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
});

module.exports = router;