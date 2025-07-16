const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Listar todos los retos
router.get('/', async(req, res, next) => {
    try {
        const list = await Challenge.find();
        res.json(list);
    } catch (err) {
        next(err);
    }
});

// Listar solo retos semanales
router.get('/weekly', async(req, res, next) => {
    try {
        const weekly = await Challenge.find({ isWeekly: true });
        res.json(weekly);
    } catch (err) {
        next(err);
    }
});

// Obtener un reto por ID
router.get('/:id', async(req, res, next) => {
    try {
        const ch = await Challenge.findById(req.params.id);
        if (!ch) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json(ch);
    } catch (err) {
        next(err);
    }
});

// Crear reto (solo admin)
router.post('/', async(req, res, next) => {
    try {
        const newCh = new Challenge(req.body);
        await newCh.save();
        res.status(201).json(newCh);
    } catch (err) {
        next(err);
    }
});

// Obtener reto semanal actual según mes
router.get('/weekly', async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // Ejemplo: "2025-07"
        const challenge = await Challenge.findOne({ type: 'weekly', month: currentMonth });
        if (!challenge) {
            return res.status(404).json({ msg: 'No hay reto semanal disponible' });
        }
        res.json(challenge);
    } catch (err) {
        console.error('❌ Error al obtener el reto semanal:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});
  
// Marcar reto semanal como completado por usuario
router.post('/weekly/complete/:id', async (req, res) => {
    try {
      const { userId } = req.body;
      const challengeId = req.params.id;
      const user = await User.findById(userId);
      const challenge = await Challenge.findById(challengeId);
  
      if (!user || !challenge) return res.status(404).json({ msg: 'Usuario o reto no encontrado' });
  
      if (user.completedChallenges.includes(challengeId)) {
        return res.status(400).json({ msg: 'Reto ya completado' });
      }
  
      user.points += challenge.reward;
      user.level = Math.floor(user.points / 100) + 1;
      user.completedChallenges.push(challengeId);
      await user.save();
  
      res.json({ msg: 'Reto completado', user });
    } catch (err) {
      res.status(500).json({ msg: 'Error al completar reto' });
    }
  });
  
  module.exports = router;