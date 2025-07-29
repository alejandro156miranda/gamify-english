// src/services/authService.js

import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
    headers: { 'Content-Type': 'application/json' }
});

/**
 * Registrar un nuevo usuario.
 * @param {{ role:string, name:string, email:string, password:string, childId?:string }} data 
 */
export const register = data => API.post('/register', data);

/**
 * Iniciar sesión y gestionar token + badges.
 * @param {{ email:string, password:string }} data
 * @returns {Promise<{ token:string, user:object }>}
 */
export async function login(data) {
    const res = await API.post('/login', data);
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

    // Extraer usuario y puntos actuales
    const user = result.user;
    const puntos = user.points || 0;

    // Calcular qué insignias le faltan
    const newBadges = badgeThresholds
        .filter(b => puntos >= b.points)
        .map(b => b.id)
        .filter(id => !user.badges.includes(id));

    if (newBadges.length > 0) {
        // Añadir nuevas insignias al objeto y al localStorage
        user.badges = [...user.badges, ...newBadges];
    }

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token: result.token, user };
}

/**
 * Obtener todos los usuarios.
 */
export const getUsers = () =>
    API.get('/users').then(res => res.data);

/**
 * Obtener un usuario por su ID.
 * @param {string} id 
 */
export const getUserById = id =>
    API.get(`/users/${id}`).then(res => res.data);

/**
 * Actualizar un usuario.
 * @param {string} id 
 * @param {object} data 
 */
export const updateUser = (id, data) =>
    API.put(`/users/${id}`, data).then(res => res.data);

/**
 * Eliminar un usuario.
 * @param {string} id 
 */
export const deleteUser = id =>
    API.delete(`/users/${id}`).then(res => res.data);

/**
 * Forzar reparación de insignias (recalcula según puntos).
 * @param {string} userId 
 */
export const fixUserBadges = async userId => {
    const res = await API.get(`/fix-badges/${userId}`);
    return res.data;
};