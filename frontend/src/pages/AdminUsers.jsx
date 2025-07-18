import React, { useState, useEffect } from 'react';
import { getUsers, getUserById, updateUser, deleteUser, register } from '../services/authService';
import './AdminUsers.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'child', // Valor predeterminado
    });
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Obtener todos los usuarios
    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error('❌ Error al obtener usuarios:', err);
        }
    };

    // Crear o actualizar usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUserId) {
                // Actualizar usuario
                await updateUser(editingUserId, formData);
                alert('✅ Usuario actualizado correctamente');
            } else {
                // Crear usuario
                await register(formData);
                alert('✅ Usuario creado correctamente');
            }
            setFormData({ name: '', email: '', password: '', role: 'child' });
            setEditingUserId(null);
            fetchUsers();
        } catch (err) {
            console.error('❌ Error al guardar usuario:', err);
        }
    };

    // Eliminar usuario
    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            alert('✅ Usuario eliminado correctamente');
            fetchUsers();
        } catch (err) {
            console.error('❌ Error al eliminar usuario:', err);
        }
    };

    // Editar usuario
    const handleEdit = async (id) => {
        try {
            const user = await getUserById(id);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // ⚠️ nunca llenes la contraseña en edición
                role: user.role || 'child',
            });
            setEditingUserId(id);
        } catch (err) {
            console.error('❌ Error al obtener usuario para edición:', err);
        }
    };
    

    return (
        <div className="admin-users-container">
            <h2 className="admin-title">Gestión de Usuarios</h2>

            {/* Formulario para crear/editar usuarios */}
            <form className="user-form" onSubmit={handleSubmit}>
                <h3>{editingUserId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                {!editingUserId && (
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                )}
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                >
                    <option value="child">Niño</option>
                    <option value="parent">Padre</option>
                    <option value="admin">Administrador</option>
                </select>
                <button type="submit">{editingUserId ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
            </form>

            {/* Lista de usuarios */}
            <div className="user-table-container">
                <h3>Usuarios Registrados</h3>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(user._id)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleDelete(user._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}