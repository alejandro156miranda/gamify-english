// src/components/LayoutUserProfile.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './LayoutUserProfile.css';  // <-- IMPORTA AQUÍ

export default function LayoutUserProfile() {
  return (
    <div className="user-layout">
      <header>
        <nav>
          <Link to="/principal">Principal</Link>
          <Link to="/activities">Actividades</Link>
          <Link to="/weekly_challenges">Retos</Link>
          <Link to="/user_badges">Insignias</Link>
          <Link to="/user_profile">Perfil</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>© 2025 Gamify English</footer>
    </div>
  );
}
