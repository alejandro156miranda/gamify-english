// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import mascota from '../assets/cocoprofe.gif';

export default function Layout() {
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
    <div className="gamified-layout">
      {/* Fondo con partículas animadas */}
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
        <Link to="/" className="logo">
          <span className="logo-text">NOVATRAIL</span>
          <span className="logo-subtitle">English Adventure</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/register" className="nav-link">
            <span className="link-icon">📝</span>
            <span className="link-text">Registrarse</span>
          </Link>
          <Link to="/login" className="nav-link">
            <span className="link-icon">🔑</span>
            <span className="link-text">Iniciar Sesión</span>
          </Link>
        </nav>
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
        <Outlet />
      </main>

      {/* Footer minimalista */}
      <footer className="minimal-footer">
        <div className="copyright">
          © 2025 Gamify English - Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}