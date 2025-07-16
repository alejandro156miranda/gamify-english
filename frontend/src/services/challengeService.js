import axios from 'axios';

const API2 = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
});

export const getAllChallenges = () => API2.get('/api/challenges');
export const getWeeklyChallenges = () => API2.get('/api/challenges/weekly');
export const getChallengeById = id => API2.get(`/api/challenges/${id}`);
export const updateUserProgress = async (userId, points, type = 'quiz') => {
    const res = await axios.put(`http://localhost:5000/api/auth/update-progress/${userId}`, {
        points,
        type
      });
    return res.data;
  };
  export const getWeeklyChallenge = async () => {
    try {
        const res = await API2.get('/api/challenges');
        return res.data;
    } catch (err) {
        console.error('❌ Error al obtener el reto semanal:', err);
        throw err;
    }
};
  
  export const completeChallenge = async (challengeId, userId) => {
    const res = await API2.post(`/api/challenges/weekly/complete/${challengeId}`, { userId });
    return res.data;
  };
