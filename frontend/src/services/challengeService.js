import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const getAllChallenges = () => API.get('/api/challenges');
export const getWeeklyChallenges = () => API.get('/api/challenges/weekly');
export const getChallengeById = id => API.get(`/api/challenges/${id}`);