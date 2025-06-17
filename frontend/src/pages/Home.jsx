import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <h1 className="titulo-animado"> GAMIFY ENGLISH </h1>
      <p className="parrafo-animado">¡Aprende Inglés con Retos Semanales y Premios Épicos!</p>
      <div className="botonera">
        <Link to="/register">
          <button className="btn-mario">Comenzar Ahora</button>
        </Link>
        <Link to="/login">
          <button className="btn-mario">Ya Tengo Cuenta</button>
        </Link>
      </div>
    </main>
  );
}
