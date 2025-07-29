import axios from 'axios';

// Cliente Axios para "/api/challenges"
const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/challenges`,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * GET /api/challenges
 */
export const getAllChallenges = () =>
    API.get('/');

/**
 * GET /api/challenges/weekly
 */
export const getWeeklyChallenges = () =>
    API.get('/weekly');

/**
 * GET /api/challenges/:id
 */
export const getChallengeById = id =>
    API.get(`/${id}`);

/**
 * POST /api/challenges/weekly/complete/:challengeId
 */
export const completeChallenge = (challengeId, userId) =>
    API.post(`/weekly/complete/${challengeId}`, { userId })
    .then(res => res.data);

/**
 * PUT /api/auth/update-progress/:userId
 * Actualiza puntos e insignias
 */
export const updateUserProgress = async(userId, points, type = 'quiz') => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update-progress/${userId}`, { points, type }, { headers: { 'Content-Type': 'application/json' } }
    );

    // Sincronizar localStorage con los nuevos datos
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
};