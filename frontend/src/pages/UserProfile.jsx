import React, { useEffect, useState } from 'react';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', avatar: '', password: '' });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser(userData);
      setForm({ name: userData.name, avatar: userData.avatar || '', password: '' });
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const updatedUser = await res.json();

      // Actualiza localStorage y estado
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      alert('Perfil actualizado con éxito');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el perfil');
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h2>👤 Mi Perfil</h2>
      <div className="perfil-card">
        {editMode ? (
          <>
            <label>
              Nombre:
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            </label>
            <label>
              Avatar (emoji o URL):
              <input type="text" name="avatar" value={form.avatar} onChange={handleChange} />
            </label>
            <label>
              Nueva contraseña:
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </label>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditMode(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Avatar:</strong> {user.avatar || '🙂'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Puntos:</strong> {user.points || 0}</p>
            <p><strong>Desde:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <button onClick={() => setEditMode(true)}>Editar Perfil</button>
          </>
        )}
      </div>
    </div>
  );
}
