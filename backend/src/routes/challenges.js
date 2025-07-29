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

// Actualizar reto semanal
router.put('/:id', async (req, res, next) => {
    try {
        const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el reto actualizado
            runValidators: true, // Ejecuta las validaciones del modelo
        });
        if (!updatedChallenge) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json(updatedChallenge);
    } catch (err) {
        next(err);
    }
});

// Eliminar reto semanal
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
        if (!deletedChallenge) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json({ msg: 'Reto eliminado', deletedChallenge });
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
// Crear reto (solo admin)
router.post('/', async (req, res, next) => {
    try {
        const newCh = new Challenge(req.body);
        await newCh.save();
        res.status(201).json(newCh);
    } catch (err) {
        next(err);
    }
});

// POST /api/challenges/quiz
router.post('/challenges/quiz', async (req, res) => {
    try {
      const { title, description, reward, questions } = req.body;
  
      const newQuiz = new Challenge({
        title,
        description,
        content: '', // no se usa para quiz
        type: 'quiz',
        reward,
        questions // se guarda el array de preguntas
      });
  
      await newQuiz.save();
      res.status(201).json({ message: 'Quiz guardado correctamente', quiz: newQuiz });
    } catch (error) {
      console.error('Error al guardar el quiz:', error);
      res.status(500).json({ message: 'Error del servidor' });
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

  router.get('/activities', async (req, res) => {
    try {
      const challenges = await Challenge.find();
      res.json(challenges);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los challenges' });
    }
  });
  
  // POST - Crear challenge
  router.post('/activities', async (req, res) => {
    try {
      const challenge = new Challenge(req.body);
      await challenge.save();
      res.status(201).json(challenge);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // PUT - Actualizar challenge
  router.put('/activities/:id', async (req, res) => {
    try {
      const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // DELETE - Eliminar challenge
  router.delete('/activities/:id', async (req, res) => {
    try {
      await Challenge.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Challenge eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el challenge' });
    }
  });
  
  module.exports = router;