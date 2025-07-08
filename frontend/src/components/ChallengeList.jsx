import React, { useEffect, useState } from 'react';
import { getAllChallenges, getWeeklyChallenges } from '../services/challengeService';
import { useNavigate } from 'react-router-dom';

export default function ChallengeList({ weekly = false }) {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = weekly ? getWeeklyChallenges : getAllChallenges;
    fetch()
      .then(res => setChallenges(res.data))
      .catch(err => console.error(err));
  }, [weekly]);

  return (
    <div className="challenge-list">
      {challenges.map(ch => (
        <div key={ch._id} className="challenge-card">
          <h3>{ch.title}</h3>
          <p>{ch.description}</p>
          <button onClick={() => navigate(`/challenges/${ch._id}`)}>
            Iniciar
          </button>
        </div>
      ))}
    </div>
  );
}
