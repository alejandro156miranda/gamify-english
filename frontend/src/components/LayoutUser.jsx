// src/components/LayoutUser.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import mascota from '../assets/chango_mascota.png'; // Asegúrate de tener la imagen en src/assets/


export default function LayoutUser({ children }) {
  return (
  
    <div className="layout-user">
      <header>
        <Link to="/principal">Inicio</Link>
      </header>
       <div className="mascota-container">
          <img src={mascota} alt="Mascota Chango" className="mascota-img" />
          <p className="mascota-text">Aprende inglés con Novatrail</p>
       </div>
      
      <main>{children /* o <Outlet/> si defines rutas hijas */}</main>

      <footer>© 2025 Gamify English - Todos los derechos reservados</footer>

    </div>
  );
}
