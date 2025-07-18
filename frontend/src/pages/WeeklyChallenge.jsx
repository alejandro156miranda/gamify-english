import React, { useEffect, useState } from 'react';
import { getWeeklyChallenge, updateUserProgress, completeChallenge } from '../services/challengeService';

export default function WeeklyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    getWeeklyChallenge()
      .then(data => {
        console.log('📦 Datos del reto semanal:', data);
        setChallenge(data[0]); // importante para mantener tu estructura actual
        if (user?.completedChallenges?.includes(data[0]._id)) {
          setIsCompleted(true); // Marcar como completado si el usuario ya lo hizo
        }
      })
      .catch(err => {
        console.error('❌ Error cargando el reto semanal:', err);
        setChallenge(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = () => {
    if (selected == null || !challenge || isCompleted) return;

    const correct = selected === challenge.correctIndex;
    setResult(correct ? '✅ ¡Correcto! +150 pts' : '❌ Incorrecto');

    if (correct) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        updateUserProgress(user.id, challenge.reward, 'weekly')
        .then(res => {
          console.log('✔ Progreso actualizado', res.user);
          const oldUser = JSON.parse(localStorage.getItem('user'));
          const updatedUser = { ...oldUser, ...res.user };
          localStorage.setItem('user', JSON.stringify(updatedUser)); // ✅ se conserva todo
          setIsCompleted(true);
        })      
          .catch(console.error);

        completeChallenge(challenge._id, user.id)
          .then(() => console.log('✔ Reto marcado como completado'))
          .catch(console.error);
      }
    }
  };

  if (loading) return <p className="loading">⏳ Cargando reto semanal...</p>;
  if (!challenge || !challenge.options) return <p className="error">❌ No hay reto disponible.</p>;
  if (isCompleted) return <p className="completed">✅ Ya completaste este reto semanal.</p>;

  return (
    <div className="weekly-container">
      <div className="weekly-card">
        <h2>{challenge.title}</h2>
        <p className="description">{challenge.description}</p>
        <div className="content-box">
          <p>{challenge.content}</p>
        </div>
        <ul className="options-list">
          {Array.isArray(challenge.options) && challenge.options.map((opt, i) => (
            <li key={i}>
              <label className={`option ${selected === i ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="weekly"
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
        <button className="submit-btn" onClick={handleAnswer}>Responder</button>
        {result && <p className="result">{result}</p>}
      </div>
    </div>
  );
}
