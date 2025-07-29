import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/challenges`,
    headers: { 'Content-Type': 'application/json' }
});


export const getAllChallenges = () => API2.get('/api/challenges');
export const getWeeklyChallenges = () => API2.get('/api/challenges/weekly');
export const getChallengeById = id => API2.get(`/api/challenges/${id}`);
export const getWeeklyChallenge = async() => {
    try {
        const res = await API2.get('/api/challenges');
        return res.data;
    } catch (err) {
        console.error('❌ Error al obtener el reto semanal:', err);
        throw err;
    }
};
export const completeChallenge = async(challengeId, userId) => {
    const res = await API2.post(`/api/challenges/weekly/complete/${challengeId}`, { userId });
    return res.data;
};

// FUNCIÓN ACTUALIZADA PARA MANEJAR INSIGNIAS
export const updateUserProgress = async(userId, points, type = 'quiz') => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/update-progress/${userId}`, {
            points,
            type
        });

        // ACTUALIZAR LOCALSTORAGE CON NUEVAS INSIGNIAS
        if (res.data && res.data.user) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const updatedUser = {
                    ...user,
                    points: res.data.user.points,
                    level: res.data.user.level,
                    badges: res.data.user.badges // INSIGNIAS ACTUALIZADAS
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        }

        return res.data;
    } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
};