import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const spinRaffle = (userId, prize, discount) =>
    API.post('/api/raffle/spin', { userId, prize, discount });

export const getUserRaffles = userId =>
    API.get(`/api/raffle/${userId}`);