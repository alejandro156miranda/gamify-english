const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const router = express.Router();

// ── LIST ALL ────────────────────────────────────────────────────────────────
router.get('/', async(req, res, next) => {
    try {
        const list = await Challenge.find();
        res.json(list);
    } catch (err) {
        next(err);
    }
});

// ── WEEKLY FIRST (PRECEDENCE) ───────────────────────────────────────────────
router.get('/weekly', async(req, res, next) => {
    try {
        const weekly = await Challenge.find({ isWeekly: true });
        res.json(weekly);
    } catch (err) {
        next(err);
    }
});

// ── BY ID ───────────────────────────────────────────────────────────────────
router.get('/:id', async(req, res, next) => {
    try {
        const ch = await Challenge.findById(req.params.id);
        if (!ch) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json(ch);
    } catch (err) {
        next(err);
    }
});

// ── CREATE ─────────────────────────────────────────────────────────────────
router.post('/', async(req, res, next) => {
    try {
        const newCh = new Challenge(req.body);
        await newCh.save();
        res.status(201).json(newCh);
    } catch (err) {
        next(err);
    }
});

// ── UPDATE ─────────────────────────────────────────────────────────────────
router.put('/:id', async(req, res, next) => {
    try {
        const up = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!up) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json(up);
    } catch (err) {
        next(err);
    }
});

// ── DELETE ─────────────────────────────────────────────────────────────────
router.delete('/:id', async(req, res, next) => {
    try {
        const del = await Challenge.findByIdAndDelete(req.params.id);
        if (!del) return res.status(404).json({ msg: 'Reto no encontrado' });
        res.json({ msg: 'Reto eliminado', deletedChallenge: del });
    } catch (err) {
        next(err);
    }
});

// ── MARK COMPLETE ──────────────────────────────────────────────────────────
router.post('/weekly/complete/:id', async(req, res) => {
    try {
        const { userId } = req.body;
        const chId = req.params.id;
        const user = await User.findById(userId);
        const ch = await Challenge.findById(chId);
        if (!user || !ch) return res.status(404).json({ msg: 'Usuario o reto no encontrado' });

        if (user.completedChallenges.includes(chId)) {
            return res.status(400).json({ msg: 'Reto ya completado' });
        }

        user.points += ch.reward;
        user.level = Math.floor(user.points / 100) + 1;
        user.completedChallenges.push(chId);
        await user.save();

        res.json({ msg: 'Reto completado', user });
    } catch (err) {
        res.status(500).json({ msg: 'Error al completar reto' });
    }
});

// ── ADMIN ACTIVITIES ────────────────────────────────────────────────────────
router.get('/activities', async(req, res) => {
    try { res.json(await Challenge.find()); } catch (err) { res.status(500).json({ error: 'Error al obtener activities' }); }
});
router.post('/activities', async(req, res) => {
    try {
        const c = new Challenge(req.body);
        await c.save();
        res.status(201).json(c);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/activities/:id', async(req, res) => {
    try {
        const u = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(u);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/activities/:id', async(req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Challenge eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

module.exports = router;