// src/services/challengeService.js
import axios from 'axios';

// Cliente Axios para los endpoints de "challenges"
const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/challenges`,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * Obtiene todos los retos
 * GET /api/challenges
 */
export const getAllChallenges = () => API2.get('/');

/**
 * Obtiene retos semanales
 * GET /api/challenges/weekly
 */
export const getWeeklyChallenges = () => API2.get('/weekly');

/**
 * Obtiene un reto por ID
 * GET /api/challenges/:id
 */
export const getChallengeById = id => API2.get(`/${id}`);

/**
 * Función de conveniencia para obtener datos (misma ruta que getAllChallenges)
 */
export const getWeeklyChallenge = async() => {
    try {
        const res = await API.get('/');
        return res.data;
    } catch (err) {
        console.error('❌ Error al obtener el reto semanal:', err);
        throw err;
    }
};

/**
 * Marca un reto semanal como completado por usuario
 * POST /api/challenges/weekly/complete/:challengeId
 */
export const completeChallenge = async(challengeId, userId) => {
    const res = await API.post(`/weekly/complete/${challengeId}`, { userId });
    return res.data;
};

/**
 * Actualiza el progreso del usuario (puntos e insignias)
 * PUT /api/auth/update-progress/:userId
 */
export const updateUserProgress = async(userId, points, type = 'quiz') => {
    try {
        const res = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/auth/update-progress/${userId}`, { points, type }, { headers: { 'Content-Type': 'application/json' } }
        );

        // Sincronizar localStorage con los nuevos datos (puntos, nivel, badges)
        if (res.data && res.data.user) {
            const stored = JSON.parse(localStorage.getItem('user'));
            if (stored) {
                const updated = {
                    ...stored,
                    points: res.data.user.points,
                    level: res.data.user.level,
                    badges: res.data.user.badges
                };
                localStorage.setItem('user', JSON.stringify(updated));
            }
        }

        return res.data;
    } catch (error) {
        console.error('❌ Error updating progress:', error);
        throw error;
    }
};