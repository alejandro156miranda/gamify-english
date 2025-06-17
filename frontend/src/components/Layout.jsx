import React from 'react';
import { Link } from 'react-router-dom';
import mascota from '../assets/chango_mascota.png'; // Asegúrate de tener la imagen en src/assets/

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <header>
        <Link to="/">Gamify English</Link>
        <nav>
          <Link to="/register">Registrarse</Link>
          <Link to="/login">Iniciar Sesión</Link>
        </nav>
      </header>

      <div className="mascota-container">
        <img src={mascota} alt="Mascota Chango" className="mascota-img" />
        <p className="mascota-text">Aprende inglés con Novatrail</p>
      </div>

      <main>{children}</main>

      <footer>© 2025 Gamify English - Todos los derechos reservados</footer>
    </div>
  );
}
