import React, { useEffect, useState } from 'react';
import { getWeeklyChallenge, completeChallenge, updateUserProgress } from '../services/challengeService';

export default function WeeklyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyChallenge()
      .then(data => {
        console.log('📦 Datos del reto:', data); // <-- Asegúrate de que `options` aparece aquí
        setChallenge(data);
      })
      .catch(err => {
        console.error('❌ Error cargando reto:', err);
        setChallenge(null);
      })
      .finally(() => setLoading(false));
  }, []);
  

  const handleAnswer = () => {
    if (selected == null || !challenge) return;

    const correct = selected === challenge.correctIndex;
    setResult(correct ? '✅ ¡Correcto! +150 pts' : '❌ Incorrecto');

    if (correct) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        updateUserProgress(user.id, challenge.reward, 'weekly')
          .then(res => {
            console.log('✔ Progreso actualizado', res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          })
          .catch(console.error);

        completeChallenge(challenge._id, user.id)
          .then(() => console.log('✔ Reto marcado como completado'))
          .catch(console.error);
      }
    }
  };

  if (loading) return <p>⏳ Cargando reto semanal...</p>;
  if (!challenge) return <p>❌ No hay reto disponible.</p>;

  return (
    <div className="weekly-challenge">
      <h2>{challenge.title}</h2>
      <p>{challenge.content}</p>
      <ul>
        {challenge.options.map((opt, i) => (
          <li key={i}>
            <label>
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
      <button onClick={handleAnswer}>Responder</button>
      {result && <p>{result}</p>}
    </div>
  );
}
