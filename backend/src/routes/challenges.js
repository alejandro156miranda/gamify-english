const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

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

module.exports = router;