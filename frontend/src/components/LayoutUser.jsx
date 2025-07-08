// src/components/LayoutUser.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function LayoutUser({ children }) {
  return (
    <div className="layout-user">
      <header>
        <Link to="/principal">Inicio</Link>
      </header>
      <main>{children /* o <Outlet/> si defines rutas hijas */}</main>
    </div>
  );
}
