const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

// Middleware para verificar métodos HTTP en rutas críticas
router.all('/register', (req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido',
            message: `El método ${req.method} no está permitido para esta ruta`,
            allowedMethods: ['POST']
        });
    }
    next();
});

router.all('/login', (req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido',
            message: `El método ${req.method} no está permitido para esta ruta`,
            allowedMethods: ['POST']
        });
    }
    next();
});

// Registro mejorado con validación completa
router.post('/register', async(req, res) => {
    const { role, name, email, password, childId } = req.body;

    // Validación de campos requeridos
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            error: 'Datos incompletos',
            message: 'Todos los campos son obligatorios',
            requiredFields: ['name', 'email', 'password', 'role']
        });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Email inválido',
            message: 'Por favor proporciona un email válido'
        });
    }

    // Validación de rol
    if (!['child', 'parent', 'admin'].includes(role)) {
        return res.status(400).json({
            success: false,
            error: 'Rol inválido',
            message: 'El rol debe ser student, parent o admin'
        });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'Email ya registrado',
                message: 'Este email ya está en uso'
            });
        }

        // Crear hash de contraseña con salt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear nuevo usuario con valores por defecto
        const newUser = new User({
            role,
            name,
            email,
            passwordHash,
            childId: role === 'parent' ? childId : null,
            points: 0,
            level: 1,
            badges: [],
            avatar: '',
            completedChallenges: []
        });

        await newUser.save();

        // Generar token JWT con expiración de 7 días
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error('❌ Error en registro:', {
            error: err.message,
            body: req.body
        });

        // Manejar errores de validación de Mongoose
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                message: 'Datos inválidos proporcionados',
                details: errors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: 'No se pudo completar el registro'
        });
    }
});

// Login mejorado con manejo de errores detallado
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    // Validación de campos requeridos
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Credenciales incompletas',
            message: 'Email y contraseña son obligatorios'
        });
    }

    try {
        // Buscar usuario incluyendo el passwordHash
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe una cuenta con este email'
            });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales incorrectas',
                message: 'La contraseña es incorrecta'
            });
        }

        // Convertir insignias de nombres a IDs
        let needsSave = false;
        try {
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
        } catch (badgeError) {
            console.error('⚠️ Error procesando insignias:', badgeError);
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
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
        console.error('❌ Error al iniciar sesión:', {
            error: err.message,
            email: req.body.email
        });

        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo completar el inicio de sesión'
        });
    }
});

// Actualización de perfil con seguridad mejorada
router.put('/update-profile', async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Autenticación requerida',
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Autenticación requerida',
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'El usuario asociado al token no existe'
            });
        }

        const { name, avatar, password } = req.body;

        // Validar datos de entrada
        if (name && typeof name === 'string' && name.trim() !== '') {
            user.name = name.trim();
        }

        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        if (password) {
            // Validar fortaleza de contraseña
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'Contraseña inválida',
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                points: user.points,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Token inválido',
                message: 'El token de autenticación es inválido'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado',
                message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo actualizar el perfil'
        });
    }
});

// Actualizar usuario por ID (Admin)
router.put('/users/:id', async(req, res) => {
    try {
        const { name, email, role } = req.body;
        const userId = req.params.id;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'El ID de usuario proporcionado es inválido'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID'
            });
        }

        // Validar y actualizar campos
        if (name !== undefined && typeof name === 'string' && name.trim() !== '') {
            user.name = name.trim();
        }

        if (email !== undefined) {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Email inválido',
                    message: 'Por favor proporciona un email válido'
                });
            }

            // Verificar si el email ya está en uso
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({
                    success: false,
                    error: 'Email ya registrado',
                    message: 'Este email ya está en uso por otro usuario'
                });
            }

            user.email = email;
        }

        if (role !== undefined && ['student', 'parent', 'admin'].includes(role)) {
            user.role = role;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        console.error('❌ Error al actualizar usuario:', err);

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                message: 'Datos inválidos proporcionados',
                details: errors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo actualizar el usuario'
        });
    }
});

// Actualizar progreso con insignias por ID
router.put('/update-progress/:id', async(req, res) => {
    const { points, type } = req.body;
    const userId = req.params.id;

    try {
        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'El ID de usuario proporcionado es inválido'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID'
            });
        }

        // Validar puntos
        if (typeof points !== 'number' || points <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Puntos inválidos',
                message: 'Los puntos deben ser un número positivo'
            });
        }

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
        }

        await user.save();

        res.json({
            success: true,
            message: 'Progreso actualizado exitosamente',
            user: {
                id: user._id,
                points: user.points,
                level: user.level,
                badges: user.badges
            }
        });
    } catch (err) {
        console.error('❌ Error al actualizar progreso:', err);
        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo actualizar el progreso'
        });
    }
});

// Ruta para reparar insignias manualmente
router.get('/fix-badges/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'El ID de usuario proporcionado es inválido'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID'
            });
        }

        // Agregar todas las insignias que correspondan por puntos
        const allBadges = badgeThresholds
            .filter(badge => user.points >= badge.points)
            .map(badge => badge.id);

        user.badges = [...new Set(allBadges)];

        await user.save();

        res.json({
            success: true,
            message: 'Insignias reparadas exitosamente',
            badges: user.badges
        });
    } catch (err) {
        console.error('❌ Error al reparar insignias:', err);
        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudieron reparar las insignias'
        });
    }
});

// Obtener todos los usuarios (sin información sensible)
router.get('/users', async(req, res) => {
    try {
        const users = await User.find().select('-passwordHash -__v');
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (err) {
        console.error('❌ Error al obtener usuarios:', err);
        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudieron obtener los usuarios'
        });
    }
});

// Obtener un usuario por ID (sin información sensible)
router.get('/users/:id', async(req, res) => {
    try {
        const userId = req.params.id;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'El ID de usuario proporcionado es inválido'
            });
        }

        const user = await User.findById(userId).select('-passwordHash -__v');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
                badges: user.badges,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('❌ Error al obtener usuario:', err);
        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo obtener el usuario'
        });
    }
});

// Eliminar usuario
router.delete('/users/:id', async(req, res) => {
    try {
        const userId = req.params.id;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'El ID de usuario proporcionado es inválido'
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            userId: deletedUser._id
        });
    } catch (err) {
        console.error('❌ Error al eliminar usuario:', err);
        res.status(500).json({
            success: false,
            error: 'Error del servidor',
            message: 'No se pudo eliminar el usuario'
        });
    }
});

module.exports = router;