const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
      const challenges = await Challenge.find();
      res.json(challenges);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los challenges' });
    }
  });
  
  // POST - Crear challenge
  router.post('/', async (req, res) => {
    try {
      const challenge = new Challenge(req.body);
      await challenge.save();
      res.status(201).json(challenge);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // PUT - Actualizar challenge
  router.put('/:id', async (req, res) => {
    try {
      const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // DELETE - Eliminar challenge
  router.delete('/:id', async (req, res) => {
    try {
      await Challenge.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Challenge eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el challenge' });
    }
  });
  
  module.exports = router;