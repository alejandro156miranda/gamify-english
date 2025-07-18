import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ role:'child', name:'', email:'', password:'', confirmPassword:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('¡Las contraseñas no coinciden!');
      return;
    }
    try {
      await register({ role:form.role, name:form.name, email:form.email, password:form.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al registrarse');
    }
  };

  return (
    <main className="container">
      <h1>Crear Cuenta</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label>Rol</label>
          <select name="role" onChange={onChange} value={form.role}>
            <option value="child">Niño</option>
            <option value="parent">Padre</option>
            <option value="admin">Administrador</option>

          </select>
        </div>
        <div className="form-field">
          <label>Nombre Completo</label>
          <input name="name" onChange={onChange} required />
        </div>
        <div className="form-field">
          <label>Correo Electrónico</label>
          <input type="email" name="email" onChange={onChange} required />
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input type="password" name="password" onChange={onChange} required />
        </div>
        <div className="form-field">
          <label>Confirmar Contraseña</label>
          <input type="password" name="confirmPassword" onChange={onChange} required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </main>
  );
}
