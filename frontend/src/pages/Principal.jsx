import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage({ user }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  // Oculta el mensaje de bienvenida después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      {showWelcome && (
        <div className="welcome-message animated fadeIn">
          <h2>¡Hola, !</h2>
          <p>¿List@ para un nuevo reto semanal? 🧠🔥</p>
        </div>
      )}

      {!showWelcome && (
        <div className="main-content">
          <h1>Gamify English</h1>
          <p>Tu progreso: Nivel  puntos</p>

          <div className="buttons">
            <button onClick={() => navigate('/weekly-challenge')}>
              Ver Reto Semanal
            </button>
            <button onClick={() => navigate('/activities')}>
              Explorar Actividades
            </button>
            <button onClick={() => navigate('/badges')}>
              Ver Mis Insignias
            </button>
          </div>

          <div className="raffle-highlight">
            🎁 ¡Participa en la rifa de este mes y gana premios!
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
