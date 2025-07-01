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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, role: user.role, name: user.name, email } });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});


// Ruta protegida para editar perfil
router.put('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
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

    // Devuelve datos actualizados
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



module.exports = router;