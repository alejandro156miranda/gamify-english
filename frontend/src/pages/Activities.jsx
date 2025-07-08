// frontend/src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import './Activities.css';

export default function Activities() {
  // --- Definición de los quizzes (4 quizzes de 10 preguntas cada uno) ---
  const quizzes = [
    {
      id: 'quiz-colors',
      title: 'Colores en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'What color is grass?',            options: ['Green','Blue','Red','Yellow'],         answerIndex: 0 },
        { question: 'What color is the sun?',           options: ['Purple','Yellow','Orange','Black'],    answerIndex: 1 },
        { question: 'What color is a ripe banana?',     options: ['Blue','Green','Yellow','Pink'],        answerIndex: 2 },
        { question: 'What color are strawberries?',     options: ['Red','Blue','Green','Black'],          answerIndex: 0 },
        { question: 'What color are clouds on a rainy day?', options: ['White','Grey','Yellow','Brown'],    answerIndex: 1 },
        { question: 'What color is chocolate?',         options: ['Brown','Green','Red','Purple'],        answerIndex: 0 },
        { question: 'What color is an emerald?',        options: ['Green','Yellow','Blue','Red'],         answerIndex: 0 },
        { question: 'What color is coal?',              options: ['White','Black','Blue','Orange'],       answerIndex: 1 },
        { question: 'What color is lavender?',          options: ['Purple','Green','Yellow','Brown'],     answerIndex: 0 },
        { question: 'What color is the ocean?',         options: ['Blue','Red','Brown','Grey'],           answerIndex: 0 }
      ]
    },
    {
      id: 'quiz-numbers',
      title: 'Números en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'How do you say "1"?',   options: ['One','Two','Three','Four'],   answerIndex: 0 },
        { question: 'How do you say "5"?',   options: ['Seven','Five','Nine','Six'],    answerIndex: 1 },
        { question: 'How do you say "10"?',  options: ['Ten','Eleven','Twelve','Eight'],answerIndex: 0 },
        { question: 'How do you say "12"?',  options: ['Ten','Twelve','Eight','Nine'],   answerIndex: 1 },
        { question: 'How do you say "20"?',  options: ['Twenty','Two','Twelve','Thirteen'],answerIndex:0 },
        { question: 'How do you say "100"?', options: ['Hundred','Thousand','Ten','Zero'], answerIndex:0 },
        { question: 'How do you say "3"?',   options: ['Four','Three','Two','One'],      answerIndex:1 },
        { question: 'How do you say "15"?',  options: ['Fifteen','Fifty','Five','None'], answerIndex:0 },
        { question: 'How do you say "8"?',   options: ['Eight','Eighteen','Eighty','Eightteen'],answerIndex:0 },
        { question: 'How do you say "7"?',   options: ['Six','Sixteen','Seven','Seventeen'],answerIndex:2 }
      ]
    },
    {
      id: 'quiz-animals',
      title: 'Animales en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'What animal says "moo"?',    options: ['Cow','Dog','Cat','Horse'], answerIndex: 0 },
        { question: 'What animal says "oink"?',   options: ['Pig','Sheep','Bird','Fish'],answerIndex:0 },
        { question: 'What animal says "neigh"?',  options: ['Horse','Donkey','Lion','Tiger'],answerIndex:0 },
        { question: 'What animal says "quack"?',  options: ['Duck','Crow','Frog','Elephant'],answerIndex:0 },
        { question: 'What animal says "meow"?',   options: ['Cat','Cow','Pig','Sheep'],answerIndex:0 },
        { question: 'What animal says "woof"?',   options: ['Cat','Dog','Mouse','Bee'],answerIndex:1 },
        { question: 'Which is a big cat?',        options: ['Lion','Rabbit','Mouse','Sheep'],answerIndex:0 },
        { question: 'Which animal hops?',         options: ['Elephant','Lion','Kangaroo','Cow'],answerIndex:2 },
        { question: 'Which animal lives in water?',options:['Fish','Horse','Bird','Snake'],answerIndex:0 },
        { question: 'Which animal has stripes?',  options: ['Zebra','Pig','Cow','Cat'],answerIndex:0 }
      ]
    },
    {
      id: 'quiz-food',
      title: 'Comida en Inglés',
      rewardPoints: 20,
      questions: [
        { question: 'How do you say "pan"?',    options: ['Bread','Butter','Milk','Egg'],answerIndex:0 },
        { question: 'How do you say "manzana"?',options: ['Apple','Grape','Orange','Pear'],answerIndex:0 },
        { question: 'How do you say "queso"?',  options: ['Cheese','Ice','Rice','Tea'],answerIndex:0 },
        { question: 'How do you say "tomate"?', options: ['Tomato','Potato','Carrot','Onion'],answerIndex:0 },
        { question: 'How do you say "pollo"?',  options: ['Chicken','Beef','Pork','Fish'],answerIndex:0 },
        { question: 'How do you say "arroz"?',  options: ['Rice','Bread','Cake','Soup'],answerIndex:0 },
        { question: 'How do you say "uva"?',    options: ['Grape','Banana','Apple','Cherry'],answerIndex:0 },
        { question: 'How do you say "helado"?', options: ['Ice cream','Juice','Bread','Butter'],answerIndex:0 },
        { question: 'How do you say "huevo"?',  options: ['Egg','Milk','Cheese','Rice'],answerIndex:0 },
        { question: 'How do you say "vino"?',   options: ['Wine','Water','Oil','Juice'],answerIndex:0 }
      ]
    }
  ];

  // --- Estado global ---
  const [view, setView]   = useState('menu');    // 'menu' | 'quiz' | 'match' | 'modal'
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  // --- Modal de fin de quiz ---
  const [showModal, setShowModal] = useState(false);
  const [lastResult, setLastResult] = useState({ title: '', points: 0 });

  // --- Iniciar quiz ---
  const startQuiz = quiz => {
    setCurrentQuiz(quiz);
    setQIndex(0);
    setQuizScore(0);
    setFeedback(null);
    setView('quiz');
  };

  // --- Responder pregunta ---
  const answerQuestion = idx => {
    const correct = currentQuiz.questions[qIndex].answerIndex;
    const isCorrect = idx === correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setQuizScore(s => s + currentQuiz.rewardPoints);
  };

  // --- Siguiente o finalizar ---
  const nextQuestion = () => {
    setFeedback(null);
    if (qIndex + 1 < currentQuiz.questions.length) {
      setQIndex(i => i + 1);
    } else {
      // Fin del quiz: mostrar modal
      setTotalPoints(tp => tp + quizScore);
      setLevel(lv => Math.floor((lv + quizScore) / 100) + 1);
      setLastResult({ title: currentQuiz.title, points: quizScore });
      setShowModal(true);
    }
  };

  // --- Manejo del modal ---
  const closeModal = () => {
    setShowModal(false);
    setView('menu');
  };

  // --- Mini-juego Match English–Spanish ---
  const pairs = [
    { en: 'CAT', es: 'GATO' },
    { en: 'DOG', es: 'PERRO' },
    { en: 'BOOK', es: 'LIBRO' },
    { en: 'HOUSE', es: 'CASA' }
  ];
  const [leftWords, setLeftWords] = useState([]);
  const [rightWords, setRightWords] = useState([]);
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [matched, setMatched] = useState([]);
  const [matchMsg, setMatchMsg] = useState('');

  useEffect(() => {
    if (view === 'match') {
      setLeftWords([...pairs.map(p => p.en)].sort(() => Math.random() - .5));
      setRightWords([...pairs.map(p => p.es)].sort(() => Math.random() - .5));
      setSelLeft(null);
      setSelRight(null);
      setMatched([]);
      setMatchMsg('');
    }
  }, [view]);

  const tryMatch = () => {
    if (selLeft && selRight) {
      const correct = pairs.find(p => p.en === selLeft).es === selRight;
      if (correct) {
        setMatched(m => [...m, selLeft]);
        setTotalPoints(tp => tp + 15);
        setLevel(lv => Math.floor((lv + 15) / 100) + 1);
        setMatchMsg('✅ ¡Correcto! +15 pts');
      } else {
        setMatchMsg('❌ Incorrecto, inténtalo de nuevo');
      }
      setSelLeft(null);
      setSelRight(null);
    }
  };

  // --- Renderizado ---
  // 1) Modal final de quiz
  if (showModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h2>🎉 ¡Quiz Completado!</h2>
          <p>
            Ganaste <strong>{lastResult.points}</strong> puntos en<br/>
            <span className="quiz-name">{lastResult.title}</span>
          </p>
          <button className="next-btn" onClick={closeModal}>
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  // 2) Quiz
  if (view === 'quiz' && currentQuiz) {
    const { question, options, answerIndex } = currentQuiz.questions[qIndex];
    return (
      <div className="actg-container">
        <h2 className="title neon">{currentQuiz.title}</h2>
        <div className="status">
          Pregunta {qIndex+1}/{currentQuiz.questions.length} · Nivel {level} · Pts {totalPoints}
        </div>
        <p className="question">{question}</p>
        <div className="opts-grid">
          {options.map((opt, i) => (
            <button
              key={i}
              className={
                feedback === 'correct' && i === answerIndex
                  ? 'opt correct'
                  : feedback === 'wrong' && i !== answerIndex
                    ? 'opt wrong'
                    : 'opt'
              }
              onClick={() => feedback === null && answerQuestion(i)}
              disabled={feedback !== null}
            >
              {opt}
            </button>
          ))}
        </div>
        {feedback && (
          <button className="next-btn" onClick={nextQuestion}>
            {qIndex + 1 < currentQuiz.questions.length ? 'Siguiente' : 'Finalizar'}
          </button>
        )}
      </div>
    );
  }

  // 3) Match game
  if (view === 'match') {
    return (
      <div className="actg-container">
        <h2 className="title neon">Match English - Español</h2>
        <div className="status">Nivel {level} · Pts {totalPoints}</div>
        <div className="match-grid">
          <div className="col">
            {leftWords.map(w => (
              <div
                key={w}
                className={`cell ${matched.includes(w)? 'matched':''} ${selLeft===w?'sel':''}`}
                onClick={()=> !matched.includes(w) && setSelLeft(w)}
              >{w}</div>
            ))}
          </div>
          <div className="col">
            {rightWords.map(w => (
              <div
                key={w}
                className={`cell ${matched.includes(pairs.find(p=>p.es===w).en)? 'matched':''} ${selRight===w?'sel':''}`}
                onClick={()=> !matched.includes(pairs.find(p=>p.es===w).en) && setSelRight(w)}
              >{w}</div>
            ))}
          </div>
        </div>
        <button className="match-btn" onClick={tryMatch}>Emparejar</button>
        {matchMsg && <p className="match-msg">{matchMsg}</p>}
        {matched.length === pairs.length && (
          <button className="next-btn" onClick={()=> setView('menu')}>
            ¡Completado! Volver al menú
          </button>
        )}
      </div>
    );
  }

  // 4) Menú principal
  return (
    <div className="actg-container">
      <h1 className="title neon">ACTIVIDADES GAMER</h1>
      <div className="menu-grid">
        {quizzes.map(q => (
          <button key={q.id} className="menu-btn" onClick={()=> startQuiz(q)}>
            Quiz: {q.title}
          </button>
        ))}
        <button className="menu-btn game-btn" onClick={()=> setView('match')}>
          Juego: Empareja Palabras
        </button>
      </div>
      <div className="footer-status">Nivel {level} · Puntos totales: {totalPoints}</div>
    </div>
  );
}
