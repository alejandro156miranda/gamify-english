// src/pages/Activities.jsx
import React, { useState, useEffect, useRef } from 'react';
import { updateUserProgress } from '../services/challengeService';
import cocodriloFeliz from '../assets/cocodrilo_feliz.gif';
import cocodriloTriste from '../assets/cocodrilo_triste.gif';
import estrellas from '../assets/estrellas.gif';
import './Activities.css';

export default function Activities() {
  // ────────────────────────────────
  // 1) Definición de los quizzes
  // ────────────────────────────────
  const quizzes = [
    {
      id: 'quiz-colors',
      title: 'Colores en Inglés',
      rewardPoints: 50,
      questions: [
        { 
          question: '¿Qué color obtienes al mezclar red y blue?', 
          options: ['Purple', 'Green', 'Orange', 'Pink'], 
          answerIndex: 0,
          explanation: 'Red + Blue = Purple!'
        },
        { 
          question: '¿Qué color es un plátano maduro?', 
          options: ['Yellow', 'Green', 'Brown', 'Red'], 
          answerIndex: 0,
          explanation: 'Los plátanos maduros son amarillos'
        },
        { 
          question: '¿Qué color tiene el cielo despejado?', 
          options: ['Blue', 'Gray', 'White', 'Black'], 
          answerIndex: 0,
          explanation: 'En días soleados, el cielo es azul'
        },
        { 
          question: '¿Qué color se asocia con el amor?', 
          options: ['Red', 'Blue', 'Green', 'Yellow'], 
          answerIndex: 0,
          explanation: 'El rojo es el color del corazón'
        },
        { 
          question: '¿Qué color tiene la señal de STOP?', 
          options: ['Red', 'Blue', 'Yellow', 'Green'], 
          answerIndex: 0,
          explanation: 'Las señales de stop son rojas'
        },
        { 
          question: '¿Qué color tiene un autobús escolar?', 
          options: ['Yellow', 'Orange', 'Blue', 'Green'], 
          answerIndex: 0,
          explanation: 'Los school buses son amarillos'
        },
        { 
          question: '¿Qué color tiene el chocolate?', 
          options: ['Brown', 'Black', 'White', 'Pink'], 
          answerIndex: 0,
          explanation: 'El chocolate es marrón'
        },
        { 
          question: '¿Qué color tiene un flamenco?', 
          options: ['Pink', 'White', 'Black', 'Blue'], 
          answerIndex: 0,
          explanation: 'Los flamencos son rosados'
        },
        { 
          question: '¿Qué color tiene una cebra?', 
          options: ['Black and White', 'Gray', 'Brown', 'Black and Yellow'], 
          answerIndex: 0,
          explanation: '¡Las cebras tienen rayas blancas y negras!'
        },
        { 
          question: '¿Qué color tiene un elefante?', 
          options: ['Gray', 'Black', 'Brown', 'White'], 
          answerIndex: 0,
          explanation: 'Los elefantes son grises'
        }
      ]
    },
    {
      id: 'quiz-animals',
      title: 'Animales en Inglés',
      rewardPoints: 50,
      questions: [
        { 
          question: '¿Qué animal es conocido como el "rey de la selva"?', 
          options: ['Lion', 'Tiger', 'Elephant', 'Giraffe'], 
          answerIndex: 0,
          explanation: '¡El león es el rey de la selva!'
        },
        { 
          question: '¿Qué animal puede cambiar su color para camuflarse?', 
          options: ['Chameleon', 'Frog', 'Butterfly', 'Fish'], 
          answerIndex: 0,
          explanation: 'El camaleón cambia de color'
        },
        { 
          question: '¿Qué animal es el más alto del mundo?', 
          options: ['Giraffe', 'Elephant', 'Kangaroo', 'Bear'], 
          answerIndex: 0,
          explanation: 'La jirafa puede medir hasta 5.5 metros'
        },
        { 
          question: '¿Qué animal puede volar pero no es un pájaro?', 
          options: ['Bat', 'Butterfly', 'Bee', 'Dragonfly'], 
          answerIndex: 0,
          explanation: 'El murciélago es un mamífero que vuela'
        },
        { 
          question: '¿Qué animal hiberna durante el invierno?', 
          options: ['Bear', 'Tiger', 'Monkey', 'Lion'], 
          answerIndex: 0,
          explanation: 'Los osos hibernan en invierno'
        },
        { 
          question: '¿Qué animal tiene una trompa larga?', 
          options: ['Elephant', 'Rhino', 'Hippo', 'Anteater'], 
          answerIndex: 0,
          explanation: 'Los elefantes usan su trompa para beber'
        },
        { 
          question: '¿Qué animal salta y lleva a su bebé en una bolsa?', 
          options: ['Kangaroo', 'Koala', 'Platypus', 'Ostrich'], 
          answerIndex: 0,
          explanation: 'Los canguros saltan y tienen marsupios'
        },
        { 
          question: '¿Qué animal es el más rápido en tierra?', 
          options: ['Cheetah', 'Lion', 'Tiger', 'Horse'], 
          answerIndex: 0,
          explanation: '¡El guepardo corre hasta 120 km/h!'
        },
        { 
          question: '¿Qué animal tiene rayas blancas y negras?', 
          options: ['Zebra', 'Tiger', 'Panda', 'Skunk'], 
          answerIndex: 0,
          explanation: 'Las cebras tienen rayas únicas'
        },
        { 
          question: '¿Qué animal nada pero no es un pez?', 
          options: ['Dolphin', 'Shark', 'Whale', 'Octopus'], 
          answerIndex: 0,
          explanation: '¡El delfín es un mamífero marino!'
        }
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
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastResult, setLastResult] = useState({ 
    title: '', 
    points: 0,
    correctAnswers: 0,
    totalQuestions: 0
  });
  const [matchResult, setMatchResult] = useState({
    points: 0,
    time: 0
  });

  const [totalPoints, setTotalPoints] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.points || 0;
  });
  const [level, setLevel] = useState(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    return u?.level || 1;
  });
  const [practiceMode, setPracticeMode] = useState(false);

  // ────────────────────────────────
  // 3) Match Game mejorado
  // ────────────────────────────────
  const pairs = [
    { en: 'SUN', es: 'SOL', image: '☀️' },
    { en: 'MOON', es: 'LUNA', image: '🌙' },
    { en: 'STAR', es: 'ESTRELLA', image: '⭐' },
    { en: 'WATER', es: 'AGUA', image: '💧' },
    { en: 'FIRE', es: 'FUEGO', image: '🔥' },
    { en: 'TREE', es: 'ÁRBOL', image: '🌳' },
    { en: 'FLOWER', es: 'FLOR', image: '🌸' },
    { en: 'BOOK', es: 'LIBRO', image: '📖' },
    { en: 'HEART', es: 'CORAZÓN', image: '❤️' },
    { en: 'CLOUD', es: 'NUBE', image: '☁️' }
  ];
  
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [matchMsg, setMatchMsg] = useState('');
  const matchTimerRef = useRef(null);
  const [matchTime, setMatchTime] = useState(0);
  const matchStartTimeRef = useRef(0);

  // ────────────────────────────────
  // 4) Efectos
  // ────────────────────────────────
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) { 
      setTotalPoints(u.points); 
      setLevel(u.level); 
    }
  }, []);

  useEffect(() => {
    if (view === 'match') {
      resetMatchGame();
      matchStartTimeRef.current = Date.now();
      
      // Iniciar temporizador
      matchTimerRef.current = setInterval(() => {
        setMatchTime(Math.floor((Date.now() - matchStartTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (matchTimerRef.current) {
        clearInterval(matchTimerRef.current);
        matchTimerRef.current = null;
      }
    }
    
    return () => {
      if (matchTimerRef.current) {
        clearInterval(matchTimerRef.current);
      }
    };
  }, [view]);

  // Función para reiniciar el juego de emparejamiento
  const resetMatchGame = () => {
    setLeftWords(pairs.map(p => ({...p, side: 'left'})).sort(() => Math.random() - 0.5));
    setRightWords(pairs.map(p => ({...p, side: 'right'})).sort(() => Math.random() - 0.5));
    setSelLeft(null); 
    setSelRight(null); 
    setMatched([]); 
    setMatchMsg('');
    setMatchTime(0);
  };

  // ────────────────────────────────
  // 5) Funciones de Quiz
  // ────────────────────────────────
  const startQuiz = quiz => {
    const idx = quizzes.findIndex(q => q.id === quiz.id);
    if (idx > 0 && localStorage.getItem(quizzes[idx - 1].id) !== 'done') {
      return setShowLockModal(true);
    }
    setCurrentQuiz(quiz);
    setQIndex(0);
    setQuizScore(0);
    setFeedback(null);
    setView('quiz');
  };

  const answerQuestion = idx => {
    const currentQuestion = currentQuiz.questions[qIndex];
    const ok = idx === currentQuestion.answerIndex;
    setFeedback({
      status: ok ? 'correct' : 'wrong',
      selectedOption: idx,
      explanation: currentQuestion.explanation
    });
    if (ok) setQuizScore(s => s + 5);
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
      
      // Calcular respuestas correctas
      const correctAnswers = Math.floor(quizScore / 5);
      
      setLastResult({ 
        title: currentQuiz.title, 
        points: pts,
        correctAnswers,
        totalQuestions: currentQuiz.questions.length
      });
      setShowQuizModal(true);

      const u = JSON.parse(localStorage.getItem('user'));
      if (u?.id && pts > 0) {
        updateUserProgress(u.id, pts, 'quiz')
          .then(res => {
            const oldUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...oldUser, ...res.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setTotalPoints(updatedUser.points);
            setLevel(updatedUser.level);
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
  // 6) Funciones de Match mejoradas
  // ────────────────────────────────
  const startMatch = () => {
    const alreadyDone = localStorage.getItem('done-match') === 'true';
    setPracticeMode(alreadyDone);
    setView('match');
  };
  
  const tryMatch = () => {
    if (!selLeft || !selRight) return;

    const ok = selLeft.en === selRight.en;
    
    if (ok) {
      const updatedMatched = [...matched, selLeft.en];
      setMatched(updatedMatched);
      
      // Solo otorgar puntos si no estamos en modo práctica
      if (!practiceMode) {
        setMatchMsg('✅ ¡Bien! +10 pts');

        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?.id;

        if (userId) {
          updateUserProgress(userId, 10, 'match')
            .then(res => {
              const updatedUser = res.user;
              const oldUser = JSON.parse(localStorage.getItem('user'));
              const mergedUser = { ...oldUser, ...updatedUser };
              localStorage.setItem('user', JSON.stringify(mergedUser));
              setTotalPoints(mergedUser.points);
              setLevel(mergedUser.level);
            })
            .catch(err => console.error('❌ Error al subir puntos match:', err));
        }
      } else {
        setMatchMsg('✅ ¡Correcto! (Práctica)');
      }

      if (updatedMatched.length === pairs.length) {
        if (!practiceMode) {
          localStorage.setItem('done-match', 'true');
          const timeTaken = Math.floor((Date.now() - matchStartTimeRef.current) / 1000);
          const timeBonus = Math.max(0, 300 - timeTaken); // Bonus por tiempo
          const totalPoints = (pairs.length * 10) + timeBonus;
          
          setMatchResult({
            points: totalPoints,
            time: timeTaken,
            timeBonus
          });
          setShowMatchModal(true);
        } else {
          // En modo práctica, simplemente reiniciamos el juego
          setTimeout(() => {
            resetMatchGame();
            setMatchMsg('🎉 ¡Completado! (Práctica)');
          }, 1000);
        }
      }

    } else {
      setMatchMsg('❌ ¡Ups! Intenta otra combinación');
    }

    setSelLeft(null);
    setSelRight(null);
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setView('menu');
  };

  // ────────────────────────────────
  // 7) Renderizado Condicional
  // ────────────────────────────────

  // 7.1) Modal de bloqueo
  if (showLockModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box unlock-modal">
          <div className="lock-icon">🔒</div>
          <h2>¡Actividad Bloqueada!</h2>
          <p>Completa la actividad anterior para desbloquear esta.</p>
          <p className="hint">¡Sigue aprendiendo para ganar acceso!</p>
          <button 
            className="neon-button"
            onClick={() => setShowLockModal(false)}
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // 7.2) Modal fin de quiz
  if (showQuizModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box result-modal">
          <img src={estrellas} alt="Estrellas" className="stars-bg" />
          
        
          <h2>¡Quiz Completado!</h2>
          
          <div className="result-details">
            <p className="quiz-title">{lastResult.title}</p>
            <div className="score-container">
              <div className="score-circle">
                <span className="points">{lastResult.correctAnswers}</span>
                <span className="divider">/</span>
                <span className="total">{lastResult.totalQuestions}</span>
              </div>
              <p>Respuestas correctas</p>
            </div>
            
            <div className="points-earned">
              +{lastResult.points} puntos
            </div>
          </div>
          
          <button 
            className="neon-button"
            onClick={closeQuizModal}
          >
            ¡Continuar Aprendiendo!
          </button>
        </div>
      </div>
    );
  }

  // 7.3) Modal fin de match
  if (showMatchModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box match-result-modal">
          <div className="celebration">🎉</div>
          <h2>¡Emparejamiento Completo!</h2>
          
          <div className="match-stats">
            <div className="stat">
              <div className="stat-value">{matchResult.time}s</div>
              <div className="stat-label">Tiempo</div>
            </div>
            
            <div className="stat">
              <div className="stat-value">+{matchResult.timeBonus}</div>
              <div className="stat-label">Bonus tiempo</div>
            </div>
            
            <div className="stat">
              <div className="stat-value main-points">+{matchResult.points}</div>
              <div className="stat-label">Puntos totales</div>
            </div>
          </div>
          
          <button 
            className="neon-button"
            onClick={closeMatchModal}
          >
            ¡Continuar!
          </button>
        </div>
      </div>
    );
  }

  // 7.4) Vista Quiz
  if (view === 'quiz' && currentQuiz) {
    const q = currentQuiz.questions[qIndex];
    return (
      <div className="actg-container quiz-view">
        <div className="quiz-header">
          <h2 className="title neon">{currentQuiz.title}</h2>
          <div className="status">
            <span>Pregunta {qIndex + 1} de {currentQuiz.questions.length}</span>
            <span>Nivel {level}</span>
            <span>{totalPoints} pts</span>
          </div>
        </div>
        
        <div className="question-container">
          <p className="question">{q.question}</p>
          <div className="opts-grid">
            {q.options.map((opt, i) => {
              const isCorrect = feedback?.status === 'correct' && i === q.answerIndex;
              const isWrong = feedback?.status === 'wrong' && i === feedback.selectedOption;
              
              return (
                <button
                  key={i}
                  className={`opt ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                  disabled={feedback !== null}
                  onClick={() => answerQuestion(i)}
                >
                  {opt}
                  {isCorrect && <span className="feedback-icon">✓</span>}
                  {isWrong && <span className="feedback-icon">✗</span>}
                </button>
              );
            })}
          </div>
        </div>
        
        {feedback && (
          <div className={`feedback ${feedback.status}`}>
            <div className="feedback-content">
              <img
                src={feedback.status === 'correct' ? cocodriloFeliz : cocodriloTriste}
                alt={feedback.status}
              />
              
              <div className="feedback-text">
                <h3>{feedback.status === 'correct' ? '¡Correcto!' : '¡Ups! Incorrecto'}</h3>
                <p className="explanation">{feedback.explanation}</p>
                
                <button 
                  className="next-button"
                  onClick={nextQuestion}
                >
                  {qIndex + 1 < currentQuiz.questions.length ? 'Siguiente Pregunta →' : 'Ver Resultados'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 7.5) Vista Match - Estructura mejorada
  if (view === 'match') {
    return (
      <div className="actg-container match-view">
        <div className="match-header">
          <h2 className="title neon">Empareja las Palabras</h2>
          <div className="match-status">
            <span>Tiempo: {matchTime}s</span>
            <span>Nivel {level}</span>
            <span>{totalPoints} pts</span>
          </div>
          {practiceMode && (
            <div className="practice-mode-badge">Modo Práctica</div>
          )}
        </div>
        
        <div className="instructions">
          <p>Selecciona una palabra en inglés y luego su equivalente en español</p>
        </div>
        
        <div className="match-game-container">
          {/* Columna de palabras en inglés */}
          <div className="word-column english-column">
            <h3>Inglés</h3>
            <div className="words-container">
              {leftWords.map((word, index) => (
                <div
                  key={`left-${index}`}
                  className={`word-card ${matched.includes(word.en) ? 'matched' : ''} ${selLeft?.en === word.en ? 'selected' : ''}`}
                  onClick={() => !matched.includes(word.en) && setSelLeft(word)}
                >
                  <div className="word-image">{word.image}</div>
                  <div className="word-text">{word.en}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Área central para las selecciones */}
          <div className="match-center">
            <div className="selection-area">
              <div className="selection-box">
                <div className="selection-label">Selección Inglés</div>
                <div className="selected-word">
                  {selLeft ? selLeft.en : '---'}
                </div>
              </div>
              
              <button 
                className="match-button"
                onClick={tryMatch}
                disabled={!selLeft || !selRight}
              >
                {selLeft && selRight ? '¡Intentar Emparejar!' : 'Selecciona dos palabras'}
              </button>
              
              <div className="selection-box">
                <div className="selection-label">Selección Español</div>
                <div className="selected-word">
                  {selRight ? selRight.es : '---'}
                </div>
              </div>
            </div>
            
            {matchMsg && (
              <div className={`match-feedback ${matchMsg.includes('✅') || matchMsg.includes('🎉') ? 'correct' : 'wrong'}`}>
                {matchMsg}
              </div>
            )}
          </div>
          
          {/* Columna de palabras en español */}
          <div className="word-column spanish-column">
            <h3>Español</h3>
            <div className="words-container">
              {rightWords.map((word, index) => (
                <div
                  key={`right-${index}`}
                  className={`word-card ${matched.includes(word.en) ? 'matched' : ''} ${selRight?.en === word.en ? 'selected' : ''}`}
                  onClick={() => !matched.includes(word.en) && setSelRight(word)}
                >
                  <div className="word-image">{word.image}</div>
                  <div className="word-text">{word.es}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(matched.length / pairs.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {matched.length} de {pairs.length} emparejados
          </div>
        </div>
        
        <div className="match-footer">
          <button 
            className="back-button"
            onClick={() => setView('menu')}
          >
            Volver al Menú
          </button>
          <button 
            className="restart-button"
            onClick={resetMatchGame}
          >
            Reiniciar Juego
          </button>
        </div>
      </div>
    );
  }

  // 7.6) Menú Principal
  return (
    <div className="actg-container menu-view">
      <div className="header">
        <h1 className="title neon">ACTIVIDADES DE APRENDIZAJE</h1>
        <div className="level-display">
          <span>Nivel {level}</span>
          <div className="points-badge">{totalPoints} pts</div>
        </div>
      </div>
      
      <div className="activities-intro">
        <p>¡Desafía tu conocimiento y gana puntos para subir de nivel!</p>
        <p>Cada actividad completada te acerca a dominar el inglés.</p>
      </div>
      
      <div className="activities-grid">
        <div className="quizzes-section">
          <h2>Quizzes de Vocabulario</h2>
          <div className="quizzes-container">
            {quizzes.map((q, idx) => {
              const locked = idx > 0 && localStorage.getItem(quizzes[idx - 1].id) !== 'done';
              const completed = localStorage.getItem(q.id) === 'done';
              
              return (
                <div 
                  key={q.id} 
                  className={`quiz-card ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => !locked && startQuiz(q)}
                >
                  {locked && <div className="lock-overlay">🔒</div>}
                  {completed && <div className="completed-badge">✓ Completado</div>}
                  
                  <h3>{q.title}</h3>
                  <div className="quiz-info">
                    <span>10 preguntas</span>
                    <span className="points-reward">+{q.rewardPoints} pts</span>
                  </div>
                  
                  {!locked && !completed && (
                    <button className="start-button">Comenzar</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="games-section">
          <h2>Juegos Interactivos</h2>
          <div 
            className={`game-card ${localStorage.getItem('done-match') === 'true' ? 'completed' : ''}`}
            onClick={startMatch}
          >
            {localStorage.getItem('done-match') === 'true' && (
              <div className="completed-badge">✓ Completado</div>
            )}
            
            <h3>Empareja las Palabras</h3>
            <div className="game-description">
              <p>Relaciona palabras en inglés con su traducción en español</p>
              <p className="points-info">+10 pts por cada pareja correcta</p>
            </div>
            
            <button className="play-button">Jugar</button>
          </div>
        </div>
      </div>
      
      <div className="footer-motivation">
        <p>¡Cada respuesta correcta te acerca a dominar el inglés!</p>
      </div>
    </div>
  );
}