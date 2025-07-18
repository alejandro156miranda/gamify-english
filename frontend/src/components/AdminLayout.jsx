import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css'; // Nota el cambio aquí

export default function AdminPanel() {
  return (
    <div className={styles['admin-container']}>
      <header className={styles['admin-header']}>
        <h2>Panel de Administración</h2>
      </header>
      <nav className={styles['admin-nav']}>
        <ul>
          <li> <Link to="/admin/users">Usuarios</Link></li>
          <li><Link to="/admin/weekly-challenges">Actividades</Link></li>
          <li> <Link to="/admin/weekly-challenges">Retos Semanales</Link></li>
          <li><Link to="/admin/weekly-challenges">Configuracion</Link></li>
        </ul>
      </nav>
      <main className={styles['admin-main']}>
        <Outlet />
      </main>
      <footer className={styles['admin-footer']}>
        © {new Date().getFullYear()} TuApp - Panel Administrativo
      </footer>
    </div>
  );
}