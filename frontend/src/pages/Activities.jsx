// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import { updateUserProgress } from '../services/challengeService';
import cocodriloFeliz from '../assets/cocodrilo_feliz.gif';
import cocodriloTriste from '../assets/cocodrilo_triste.gif';
import './Activities.css';

export default function Activities() {
  // ────────────────────────────────
  // 1) Definición de los quizzes (5 quizzes, 2 preguntas cada uno)
  // ────────────────────────────────
  const quizzes = [
    {
      id: 'quiz-colors',
      title: 'Colores en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'What color is grass?', options: ['Green', 'Blue', 'Red'], answerIndex: 0 },
        { question: 'What color is the sun?', options: ['Yellow', 'Purple', 'Black'], answerIndex: 0 }
      ]
    },
    {
      id: 'quiz-numbers',
      title: 'Números en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'How do you say "1"?', options: ['One', 'Two', 'Three'], answerIndex: 0 },
        { question: 'How do you say "5"?', options: ['Five', 'Seven', 'Nine'], answerIndex: 0 }
      ]
    },
    {
      id: 'quiz-animals',
      title: 'Animales en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'What animal says "moo"?', options: ['Cow', 'Dog', 'Cat'], answerIndex: 0 },
        { question: 'What animal says "meow"?', options: ['Cat', 'Cow', 'Pig'], answerIndex: 0 }
      ]
    },
    {
      id: 'quiz-food',
      title: 'Comida en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'How do you say "pan"?', options: ['Bread', 'Butter', 'Milk'], answerIndex: 0 },
        { question: 'How do you say "manzana"?', options: ['Apple', 'Grape', 'Orange'], answerIndex: 0 }
      ]
    },
    {
      id: 'quiz-body',
      title: 'Partes del Cuerpo',
      rewardPoints: 20,
      questions: [
        { question: 'What is "mano" in English?', options: ['Hand', 'Foot', 'Eye'], answerIndex: 0 },
        { question: 'What is "ojo" in English?', options: ['Eye', 'Ear', 'Nose'], answerIndex: 0 }
      ]
    }
  ];

  // ────────────────────────────────
  // 2) Estados globales
  // ────────────────────────────────
  const [view, setView] = useState('menu');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lastResult, setLastResult] = useState({ title: '', points: 0 });

  const [totalPoints, setTotalPoints] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.points || 0;
  });
  const [level, setLevel] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.level || 1;
  });

  // ────────────────────────────────
  // 3) Match Game
  // ────────────────────────────────
  const pairs = [{ en: 'CAT', es: 'GATO' }, { en: 'DOG', es: 'PERRO' }];
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [matchMsg, setMatchMsg] = useState('');

  // ────────────────────────────────
  // 4) Carga inicial y preparar match
  // ────────────────────────────────
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) { setTotalPoints(u.points); setLevel(u.level); }
  }, []);

  useEffect(() => {
    if (view === 'match') {
      setLeftWords(pairs.map(p => p.en).sort(() => Math.random() - 0.5));
      setRightWords(pairs.map(p => p.es).sort(() => Math.random() - 0.5));
      setSelLeft(null); setSelRight(null); setMatched([]); setMatchMsg('');
    }
  }, [view]);

  // ────────────────────────────────
  // 5) Funciones de Quiz
  // ────────────────────────────────
  const startQuiz = quiz => {
    // Comprobar bloqueo
    const idx = quizzes.findIndex(q => q.id === quiz.id);
    if (idx > 0 && localStorage.getItem(quizzes[idx - 1].id) !== 'done') {
      return setShowLockModal(true);
    }
    const alreadyDone = localStorage.getItem(`done-${quiz.id}`) === 'true';
    if (alreadyDone) {
      alert('🚫 Ya completaste este quiz');
      return;
    }
    setCurrentQuiz(quiz);
    setQIndex(0);
    setQuizScore(0);
    setFeedback(null);
    setView('quiz');
  };

  const answerQuestion = idx => {
    const ok = idx === currentQuiz.questions[qIndex].answerIndex;
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setQuizScore(s => s + 15);
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (qIndex + 1 < currentQuiz.questions.length) {
      setQIndex(i => i + 1);
    } else {
      localStorage.setItem(currentQuiz.id, 'done');

      const pts = quizScore;
      const updatedTotal = totalPoints + pts;
      const updatedLevel = Math.floor(updatedTotal / 100) + 1;

      setTotalPoints(updatedTotal);
      setLevel(updatedLevel);
      setLastResult({ title: currentQuiz.title, points: pts });
      setShowQuizModal(true);

      const u = JSON.parse(localStorage.getItem('user'));
      if (u?.id && pts > 0) {
        console.log('🎯 Enviando puntos al backend:', pts);

        updateUserProgress(u.id, pts)
          .then(res => {
            console.log('✅ Progreso actualizado:', res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            setTotalPoints(res.user.points);
            setLevel(res.user.level);
          })
          .catch(console.error);
      }
    }
  };


  const closeQuizModal = () => {
    setShowQuizModal(false);
    setView('menu');
  };

  // ────────────────────────────────
  // 6) Funciones de Match
  // ────────────────────────────────
  const startMatch = () => {
    const alreadyDone = localStorage.getItem('done-match') === 'true';
    if (alreadyDone) {
      alert('🚫 Ya completaste este juego de emparejar');
      return;
    }
    setView('match');
    // Aquí también puedes reiniciar variables si quieres
    setMatched([]);
    setMatchMsg('');
    setSelLeft(null);
    setSelRight(null);
  };
  const tryMatch = () => {
    if (!selLeft || !selRight) return;
  
    const ok = pairs.find(p => p.en === selLeft)?.es === selRight;
  
    if (ok && !matched.includes(selLeft)) {
      const updatedMatched = [...matched, selLeft];
      setMatched(updatedMatched);
      setMatchMsg('✅ ¡Bien! +10 pts');
  
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id;
  
      if (userId) {
        updateUserProgress(userId, 10, 'match')
          .then(res => {
            const updatedUser = res.user;
            console.log('✔ Puntos match subidos desde backend:', updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setTotalPoints(updatedUser.points);
            setLevel(updatedUser.level);
          })
          .catch(err => console.error('❌ Error al subir puntos match:', err));
      }
  
      if (updatedMatched.length === pairs.length) {
        localStorage.setItem('done-match', 'true');
        alert('🎉 ¡Felicidades! Completaste el juego de emparejar.');
        setView('menu');
      }
  
    } else {
      setMatchMsg('❌ Intenta de nuevo');
    }
  
    setSelLeft(null);
    setSelRight(null);
  };

  // ────────────────────────────────
  // 7) Renderizado Condicional
  // ────────────────────────────────

  // 7.1) Modal de bloqueo
  if (showLockModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>🚫 ¡Espera!</h2>
          <p>No tan rápido: desbloquea la actividad anterior primero.</p>
          <button onClick={() => setShowLockModal(false)}>Entendido</button>
        </div>
      </div>
    );
  }

  // 7.2) Modal fin de quiz
  if (showQuizModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>🎉 ¡Quiz Completado!</h2>
          <p>
            Ganaste <strong>{lastResult.points}</strong> pts en<br />
            <em>{lastResult.title}</em>
          </p>
          <button onClick={closeQuizModal}>Volver al Menú</button>
        </div>
      </div>
    );
  }

  // 7.3) Vista Quiz
  if (view === 'quiz' && currentQuiz) {
    const q = currentQuiz.questions[qIndex];
    return (
      <div className="actg-container">
        <h2 className="title neon">{currentQuiz.title}</h2>
        <div className="status">
          P {qIndex + 1}/{currentQuiz.questions.length} · Lv {level} · Pts {totalPoints}
        </div>
        <p className="question">{q.question}</p>
        <div className="opts-grid">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`opt ${feedback === 'correct' && i === q.answerIndex ? 'correct' : ''} ${feedback === 'wrong' && i !== q.answerIndex ? 'wrong' : ''}`}
              disabled={feedback !== null}
              onClick={() => answerQuestion(i)}
            >{opt}</button>
          ))}
        </div>
        {feedback && (
          <div className="feedback">
            <img
              src={feedback === 'correct' ? cocodriloFeliz : cocodriloTriste}
              alt={feedback}
              style={{ width: 120, margin: '1rem 0' }}
            />
            <p>{feedback === 'correct' ? '¡Bien hecho!' : 'Inténtalo de nuevo'}</p>
            <button onClick={nextQuestion}>
              {qIndex + 1 < currentQuiz.questions.length ? 'Siguiente' : 'Terminar'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 7.4) Vista Match
  if (view === 'match') {
    return (
      <div className="actg-container">
        <h2 className="title neon">Match English–Español</h2>
        <div className="status">Lv {level} · Pts {totalPoints}</div>
        <div className="match-grid">
          <div className="col">
            {leftWords.map(w => (
              <div
                key={w}
                className={`cell ${matched.includes(w) ? 'matched' : ''} ${selLeft === w ? 'sel' : ''}`}
                onClick={() => !matched.includes(w) && setSelLeft(w)}
              >{w}</div>
            ))}
          </div>
          <div className="col">
            {rightWords.map(w => (
              <div
                key={w}
                className={`cell ${matched.includes(pairs.find(p => p.es === w).en) ? 'matched' : ''} ${selRight === w ? 'sel' : ''}`}
                onClick={() => !matched.includes(pairs.find(p => p.es === w).en) && setSelRight(w)}
              >{w}</div>
            ))}
          </div>
        </div>
        <button className="match-btn" onClick={tryMatch}>Emparejar</button>
        {matchMsg && <p className="match-msg">{matchMsg}</p>}
        {matched.length === pairs.length && (
          <button onClick={() => setView('menu')}>¡Completado! Menú</button>
        )}
      </div>
    );
  }

  // 7.5) Menú Principal con bloqueo
  return (
    <div className="actg-container">
      <h1 className="title neon">ACTIVIDADES GAMER</h1>
      <div className="menu-grid">
        {quizzes.map((q, idx) => {
          const locked = idx > 0 && localStorage.getItem(quizzes[idx - 1].id) !== 'done';
          return (
            <button
              key={q.id}
              className={`menu-btn${locked ? ' locked' : ''}`}
              onClick={() => startQuiz(q)}
            >
              {locked ? '🔒 ' : ''}Quiz: {q.title}
            </button>
          );
        })}
        <button className="menu-btn game-btn" onClick={startMatch}>
          Juego: Empareja Palabras
        </button>
      </div>
      <div className="footer-status">Nivel {level} · Puntos: {totalPoints}</div>
    </div>
  );
}
