import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState(null);

  // Oculta el mensaje de bienvenida después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Busca usuario guardado en el local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="home-container">
      {showWelcome && user && (
        <div className="welcome-message animated fadeIn">
          <h2>¡Hola, {user.name}!</h2>
          <p>¿List@ para un nuevo reto semanal? 🧠🔥</p>
        </div>
      )}

      {!showWelcome && user && (
        <div className="main-content">
          <h1>Gamify English</h1>
          <p>Tu progreso: Nivel {user.level || 1} · {user.points || 0} puntos</p>

          <div className="buttons">
            <Link to="/weekly_challenges">
              <button>Ver Reto Semanal</button>
            </Link>
            <Link to="/activities">
              <button>Explorar Actividades</button>
            </Link>
            <Link to="/user_badges">
              <button>Ver Mis Insignias</button>
            </Link>
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
