import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://gamify-english-backend.onrender.com';
const API = axios.create({
    baseURL: `${baseURL}/api/auth`,
    headers: { 'Content-Type': 'application/json' }
});

export const register = async (data) => {
    try {
        const response = await API.post('/register', data);
        return response.data;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};
// LOGIN ACTUALIZADO PARA MANEJAR INSIGNIAS
export async function login(data) {
    const res = await API.post('/login', data);
    const result = res.data;

    if (!result.token || !result.user) {
        throw new Error('Respuesta inválida del servidor');
    }

    // Verificar si hay insignias faltantes
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

    // Agregar insignias que faltan
    const newBadges = badgeThresholds
        .filter(b => puntos >= b.points)
        .map(b => b.id)
        .filter(id => !user.badges.includes(id));

    if (newBadges.length > 0) {
        user.badges = [...user.badges, ...newBadges];
        localStorage.setItem('user', JSON.stringify(user));
    }

    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(user));
    return result;
}

// Leer todos los usuarios
export const getUsers = async() => {
    const res = await API.get('/users');
    return res.data;
};

// Leer un usuario por ID
export const getUserById = async id => {
    const res = await API.get(`/users/${id}`);
    return res.data;
};

// Actualizar usuario
export const updateUser = async(id, data) => {
    const res = await API.put(`/users/${id}`, data);
    return res.data;
};

// Eliminar usuario
export const deleteUser = async id => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
};

// REPARAR INSIGNIAS MANUALMENTE
export const fixUserBadges = async(userId) => {
    try {
        const res = await API.get(`/fix-badges/${userId}`);
        return res.data;
    } catch (err) {
        console.error('Error reparando insignias:', err);
        throw err;
    }
};