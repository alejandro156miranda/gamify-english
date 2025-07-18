import React, { useEffect, useState } from 'react';
import './UserBadges.css';

export default function UserBadges() {
  const [badges, setBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setBadges(user.badges || []);
      setUserPoints(user.points || 0);
    }
  }, []);

  const allBadges = [
    { 
      id: 'primeros-pasos',
      name: 'Primeros Pasos', 
      description: 'Comienza tu aventura de aprendizaje',
      points: 10,
      icon: '👣',
      color: '#FF9F1C'
    },
    { 
      id: 'explorador',
      name: 'Explorador', 
      description: 'Descubridor de nuevos conocimientos',
      points: 20,
      icon: '🥾',
      color: '#2EC4B6'
    },
    { 
      id: 'aprendiz',
      name: 'Aprendiz', 
      description: 'Demuestra tu compromiso con el aprendizaje',
      points: 30,
      icon: '📚',
      color: '#E71D36'
    },
    { 
      id: 'vocabulario',
      name: 'Maestro de Vocabulario', 
      description: 'Domina las palabras esenciales',
      points: 50,
      icon: '🔤',
      color: '#662E9B'
    },
    { 
      id: 'gramatica',
      name: 'Experto en Gramática', 
      description: 'Conoce las reglas del idioma',
      points: 80,
      icon: '📝',
      color: '#F86624'
    },
    { 
      id: 'conversacion',
      name: 'Conversador Fluido', 
      description: 'Puedes mantener conversaciones básicas',
      points: 120,
      icon: '💬',
      color: '#118AB2'
    },
    { 
      id: 'maestro',
      name: 'Maestro del Inglés', 
      description: 'Dominio intermedio del idioma',
      points: 180,
      icon: '👑',
      color: '#FFD166'
    },
    { 
      id: 'leyenda',
      name: 'Leyenda de Novatrail', 
      description: 'Figura destacada en la comunidad',
      points: 250,
      icon: '🏆',
      color: '#06D6A0'
    },
    { 
      id: 'heroe',
      name: 'Héroe del Conocimiento', 
      description: 'Ha alcanzado la excelencia académica',
      points: 350,
      icon: '🦸',
      color: '#EF476F'
    },
    { 
      id: 'gran-maestro',
      name: 'Gran Maestro', 
      description: 'Dominio completo del idioma inglés',
      points: 500,
      icon: '🎓',
      color: '#073B4C'
    }
  ];

  // Calcular progreso para cada insignia
  const calculateProgress = (requiredPoints) => {
    if (userPoints >= requiredPoints) return 100;
    return Math.min(100, (userPoints / requiredPoints) * 100);
  };

  return (
    <div className="badges-container">
      <div className="badges-header">
        <h1>🏆 Mis Insignias</h1>
        <div className="points-display">
          <span className="points-label">Puntos Totales:</span>
          <span className="points-value">{userPoints}</span>
        </div>
      </div>
      
      <div className="badges-grid">
        {allBadges.map((badge) => {
          const unlocked = badges.includes(badge.id);
          const progress = calculateProgress(badge.points);
          
          return (
            <div 
              key={badge.id} 
              className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
              style={{ 
                '--badge-color': badge.color,
                '--progress': `${progress}%`
              }}
            >
              <div className="badge-icon">{badge.icon}</div>
              
              <div className="badge-content">
                <h3 className="badge-name">{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <div className="progress-text">
                    {unlocked ? (
                      <span className="unlocked-text">¡Desbloqueada!</span>
                    ) : (
                      <span>{Math.min(badge.points, userPoints)}/{badge.points} puntos</span>
                    )}
                  </div>
                </div>
                
                <div className="points-requirement">
                  {unlocked ? (
                    <span className="unlocked-date">Desbloqueada al alcanzar {badge.points} puntos</span>
                  ) : (
                    <span>Requiere {badge.points} puntos</span>
                  )}
                </div>
              </div>
              
              {!unlocked && <div className="lock-overlay">🔒</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}