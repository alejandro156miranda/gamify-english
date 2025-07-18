// src/components/LayoutUser.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import mascota from '../assets/cocoprofe.gif';
import './LayoutUser.css';

export default function LayoutUser({ children }) {
  const location = useLocation();
  const [mascotaMessage, setMascotaMessage] = useState("¡Aprende inglés con Novatrail!");
  
  // Mensajes aleatorios para la mascota
  const mascotaMessages = [
    "¡Vamos a aprender inglés!",
    "Cada día es una nueva oportunidad para mejorar",
    "¿Listo para tu próxima lección?",
    "¡La práctica hace al maestro!",
    "¡Descubre nuevas palabras hoy!",
    "¡Tu progreso es impresionante!",
    "¡Retos nuevos te esperan!"
  ];
  
  // Cambiar mensaje cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mascotaMessages.length);
      setMascotaMessage(mascotaMessages[randomIndex]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout-user-container">
      {/* Fondo animado con partículas */}
      <div className="particles-background">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              '--size': `${Math.random() * 8 + 2}px`,
              '--left': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 3}s`,
              '--duration': `${Math.random() * 3 + 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Header con efecto neón */}
      <header className="gamer-header">
        <div className="header-content">
          <Link to="/principal" className="logo">
            <span className="logo-text">NOVATRAIL</span>
            <span className="logo-subtitle">English Adventure</span>
          </Link>
          
          <nav className="nav-menu">
            <Link 
              to="/principal" 
              className={`nav-link ${location.pathname === '/principal' ? 'active' : ''}`}
            >
              <span className="link-icon">🏠</span>
              <span className="link-text">Inicio</span>
            </Link>
            <Link 
              to="/activities" 
              className={`nav-link ${location.pathname === '/activities' ? 'active' : ''}`}
            >
              <span className="link-icon">🎮</span>
              <span className="link-text">Actividades</span>
            </Link>
            <Link 
              to="/challenges" 
              className={`nav-link ${location.pathname === '/challenges' ? 'active' : ''}`}
            >
              <span className="link-icon">🏆</span>
              <span className="link-text">Retos</span>
            </Link>
            <Link 
              to="/user_profile" 
              className={`nav-link ${location.pathname === '/user_profile' ? 'active' : ''}`}
            >
              <span className="link-icon">👤</span>
              <span className="link-text">Perfil</span>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Contenedor de mascota con animación */}
      <div className="mascota-container">
        <div className="mascota-card">
          <img 
            src={mascota} 
            alt="Mascota Chango" 
            className="mascota-img"
          />
          <div className="speech-bubble">
            <p className="mascota-text">{mascotaMessage}</p>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer con efecto neón */}
      <footer className="gamer-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/terms">Términos y Condiciones</Link>
            <Link to="/privacy">Política de Privacidad</Link>
            <Link to="/contact">Contacto</Link>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">💬</a>
            <a href="#" className="social-icon">🎮</a>
          </div>
          
          <div className="copyright">
            © 2025 Gamify English - Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}