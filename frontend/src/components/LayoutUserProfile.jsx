// src/components/LayoutUserProfile.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './LayoutUserProfile.css';

export default function LayoutUserProfile() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="user-layout">
      {/* Header con efecto neón */}
      <header className="gamer-header">
        <div className="logo-container">
          <div className="logo">GAMIFY</div>
          <div className="logo-subtitle">English Mastery</div>
        </div>
        
        {/* Menú de navegación */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/principal" 
            className={`nav-link ${isActive('/principal') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">🏠</span>
            <span className="link-text">Principal</span>
          </Link>
          <Link 
            to="/activities" 
            className={`nav-link ${isActive('/activities') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">🎮</span>
            <span className="link-text">Actividades</span>
          </Link>
          <Link 
            to="/weekly_challenges" 
            className={`nav-link ${isActive('/weekly_challenges') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">🏆</span>
            <span className="link-text">Retos</span>
          </Link>
          <Link 
            to="/user_badges" 
            className={`nav-link ${isActive('/user_badges') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">🛡️</span>
            <span className="link-text">Insignias</span>
          </Link>
          <Link 
            to="/raffle" 
            className={`nav-link ${isActive('/raffle') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">🎡</span>
            <span className="link-text">Rifa</span>
          </Link>
          <Link 
            to="/user_profile" 
            className={`nav-link ${isActive('/user_profile') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="link-icon">👤</span>
            <span className="link-text">Perfil</span>
          </Link>
        </nav>
        
        {/* Botón de menú móvil */}
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer minimalista */}
      <footer className="minimal-footer">
        <div className="footer-content">
          <div className="copyright">
            © 2025 Gamify English | Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}