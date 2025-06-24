import React from 'react';
import { Link } from 'react-router-dom';

export default function LayoutUser({ children }) {
  return (
    <div className="wrapper">
      <header>
        <Link to="/">Gamify English</Link>
        <nav>
          <Link to="/principal">Ver mi perfil</Link>
        </nav>
      </header>


      <main>{children}</main>

      <footer>© 2025 Gamify English - Todos los derechos reservados</footer>
    </div>
  );
}