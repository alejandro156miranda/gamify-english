import React, { useEffect, useState } from 'react';
import './UserBadges.css'; // Crea un archivo para estilos si gustas

const badgeImages = {
  'Explorador': '🥾',
  'Aprendiz Destacado': '📘',
  'Maestro del Inglés': '👑',
};

export default function UserBadges() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.badges) {
      setBadges(user.badges);
    }
  }, []);

  return (
    <div className="badges-container">
      <h2>🏅 Mis Insignias</h2>
      {badges.length === 0 ? (
        <p>No has desbloqueado insignias aún. ¡Sigue jugando! 🚀</p>
      ) : (
        <div className="badges-grid">
          {badges.map((badge, i) => (
            <div key={i} className="badge-card">
              <div className="badge-icon">{badgeImages[badge] || '🏆'}</div>
              <div className="badge-name">{badge}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
