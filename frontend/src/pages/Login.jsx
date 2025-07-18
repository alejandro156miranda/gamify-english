import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(form); // esto ya guarda el usuario en localStorage
  
      const user = JSON.parse(localStorage.getItem('user')); // obtenemos el user actualizado
  
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/Principal');
      }
  
    } catch {
      setError('Email o contraseña incorrectos');
    }
  };
  
  return (
    <main className="container">
      <h1>Iniciar Sesión</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label>Correo Electrónico</label>
          <input type="email" name="email" onChange={onChange} required />
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" name="password" onChange={onChange} required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
