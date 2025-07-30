import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const register = data => API.post('/auth/register', data);

export async function login(data) {
    const res = await API.post('/auth/login', data);
    const result = res.data;

    if (!result.token || !result.user) {
        throw new Error('Respuesta inválida del servidor');
    }

    const badgeThresholds = [
        { id: 'primeros-pasos', points: 30 },
        { id: 'explorador', points: 100 },
        { id: 'aprendiz', points: 300 },
        { id: 'vocabulario', points: 500 },
        { id: 'gramatica', points: 700 },
        { id: 'conversacion', points: 1000 },
        { id: 'maestro', points: 1500 },
        { id: 'leyenda', points: 2000 },
        { id: 'heroe', points: 3500 },
        { id: 'gran-maestro', points: 5000 }
    ];

    const user = result.user;
    const puntos = user.points || 0;
    const newBadges = badgeThresholds
        .filter(b => puntos >= b.points)
        .map(b => b.id)
        .filter(id => !user.badges.includes(id));

    if (newBadges.length) {
        user.badges = [...user.badges, ...newBadges];
    }

    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token: result.token, user };
}

export const getUsers = () => API.get('/auth/users').then(res => res.data);
export const getUserById = id => API.get(`/auth/users/${id}`).then(res => res.data);
export const updateUser = (id, data) => API.put(`/auth/users/${id}`, data).then(res => res.data);
export const deleteUser = id => API.delete(`/auth/users/${id}`).then(res => res.data);
export const fixUserBadges = userId => API.get(`/auth/fix-badges/${userId}`).then(res => res.data);