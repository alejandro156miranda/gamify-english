import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/raffle`,
    headers: { 'Content-Type': 'application/json' }
});

export const spinRaffle = (userId, prize, discount) =>
    API.post('/api/raffle/spin', { userId, prize, discount });

export const getUserRaffles = userId =>
    API.get(`/api/raffle/${userId}`);