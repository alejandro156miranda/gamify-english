// src/pages/ChallengeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getChallengeById } from '../services/challengeService';

export default function ChallengeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const onComplete = location.state?.onComplete;

  const [challenge, setChallenge] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getChallengeById(id)
      .then(res => setChallenge(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!challenge) return <p>Cargando reto...</p>;

  // Si ya no hay más preguntas, llamamos al callback y redirigimos
  const q = challenge.questions[current];
  if (!q) {
    // Suma puntos al usuario
    if (onComplete) onComplete(score);
    return (
      <div className="quiz-complete">
        <h2>¡Felicitaciones!</h2>
        <p>Completaste el reto y obtuviste <strong>{score}</strong> puntos.</p>
        <button onClick={() => navigate('/activities')}>Volver a Actividades</button>
      </div>
    );
  }

  function handleAnswer(idx) {
    if (idx === q.correctIndex) {
      setScore(prev => prev + challenge.rewardPoints);
    }
    setCurrent(prev => prev + 1);
  }

  return (
    <div className="challenge-detail">
      <h2>{challenge.title}</h2>
      <p>{q.question}</p>
      <div className="options">
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => handleAnswer(i)}>
            {opt}
          </button>
        ))}
      </div>
      <p>Puntaje actual: {score}</p>
    </div>
  );
}
