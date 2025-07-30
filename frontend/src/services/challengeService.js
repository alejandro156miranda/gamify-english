import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const getAllChallenges = () => API.get('/api/challenges');
export const getWeeklyChallenges = () => API.get('/api/challenges/weekly');
export const getChallengeById = id => API.get(`/api/challenges/${id}`);

export const getWeeklyChallenge = async() => {
    try {
        const res = await API.get('/api/challenges');
        return res.data;
    } catch (err) {
        console.error('❌ Error al obtener el reto semanal:', err);
        throw err;
    }
};

export const completeChallenge = async(challengeId, userId) => {
    const res = await API.post(`/api/challenges/weekly/complete/${challengeId}`, { userId });
    return res.data;
};

export const updateUserProgress = async(userId, points, type = 'quiz') => {
    try {
        const res = await API.put(`/api/auth/update-progress/${userId}`, { points, type });

        // CORRECCIÓN AQUÍ (sintaxis válida)
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