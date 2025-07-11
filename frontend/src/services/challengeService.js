import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const getAllChallenges = () => API.get('/api/challenges');
export const getWeeklyChallenges = () => API.get('/api/challenges/weekly');
export const getChallengeById = id => API.get(`/api/challenges/${id}`);
export const updateUserProgress = async (userId, points, type = 'quiz') => {
    const res = await axios.put(`http://localhost:5000/api/auth/update-progress/${userId}`, {
        points,
        type
      });
    return res.data;
  };