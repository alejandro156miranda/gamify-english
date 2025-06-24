import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    headers: { 'Content-Type': 'application/json' }
});

export const register = data => API.post('/register', data);
export const login = data => API.post('/login', data);
export const principal = data => API.post('/Principal', data);

export async function UsersName({ email, password }) {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (!res.ok) throw new Error(data.msg || 'Error al iniciar sesión');
  
    // Guarda todo el usuario y token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  
    return data;
  }
  