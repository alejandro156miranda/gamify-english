import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
    headers: { 'Content-Type': 'application/json' }
});

export const register = data => API.post('/register', data);

// LOGIN ACTUALIZADO PARA MANEJAR INSIGNIAS
export async function login(data) {
    const res = await API.post('/login', data);

    const result = res.data;

    if (!result.token || !result.user) {
        throw new Error('Respuesta inválida del servidor');
    }

    // Verificar si hay insignias faltantes
    const badgeThresholds = [
        { id: 'primeros-pasos', points: 10 },
        { id: 'explorador', points: 20 },
        { id: 'aprendiz', points: 30 },
        { id: 'vocabulario', points: 50 },
        { id: 'gramatica', points: 80 },
        { id: 'conversacion', points: 120 },
        { id: 'maestro', points: 180 },
        { id: 'leyenda', points: 250 },
        { id: 'heroe', points: 350 },
        { id: 'gran-maestro', points: 500 }
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