import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: { 'Content-Type': 'application/json' }
});

export const register = data => API.post('/register', data);

// LOGIN CON AXIOS Y GUARDADO EN LOCALSTORAGE
export async function login(data) {
  const res = await API.post('/login', data);

  const result = res.data;

  if (!result.token || !result.user) {
    throw new Error('Respuesta inválida del servidor');
  }

  localStorage.setItem('token', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));

  return result;
}

  