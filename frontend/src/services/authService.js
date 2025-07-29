import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * Registrar un nuevo usuario.
 * POST https://.../api/auth/register
 */
export const register = data =>
    API.post('/api/auth/register', data);

/**
 * Login y sincronización de badges + token.
 * POST https://.../api/auth/login
 */
export async function login(data) {
    const res = await API.post('/api/auth/login', data);
    const result = res.data;

    if (!result.token || !result.user) {
        throw new Error('Respuesta inválida del servidor');
    }

    // Umbrales de puntos para cada insignia
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

    // Sincronizar insignias según puntos
    const user = result.user;
    const puntos = user.points || 0;
    const newBadges = badgeThresholds
        .filter(b => puntos >= b.points)
        .map(b => b.id)
        .filter(id => !user.badges.includes(id));

    if (newBadges.length) {
        user.badges = [...user.badges, ...newBadges];
    }

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token: result.token, user };
}

/**
 * Leer todos los usuarios
 * GET /api/auth/users
 */
export const getUsers = () =>
    API.get('/api/auth/users').then(res => res.data);

/**
 * Leer usuario por ID
 * GET /api/auth/users/:id
 */
export const getUserById = id =>
    API.get(`/api/auth/users/${id}`).then(res => res.data);

/**
 * Actualizar usuario
 * PUT /api/auth/users/:id
 */
export const updateUser = (id, data) =>
    API.put(`/api/auth/users/${id}`, data).then(res => res.data);

/**
 * Eliminar usuario
 * DELETE /api/auth/users/:id
 */
export const deleteUser = id =>
    API.delete(`/api/auth/users/${id}`).then(res => res.data);

/**
 * Forzar recalcular insignias
 * GET /api/auth/fix-badges/:userId
 */
export const fixUserBadges = userId =>
    API.get(`/api/auth/fix-badges/${userId}`).then(res => res.data);