import React, { useState, useRef, useEffect } from 'react';
import './Raffle.css';

export default function Raffle() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const wheelRef = useRef(null);
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const loseSoundRef = useRef(null);
  const copySoundRef = useRef(null);

  // Premios con nombres completos
  const prizes = [
    { name: "5% de descuento", value: 5, probability: 0.40, color: "#00c9ff" },
    { name: "10% de descuento", value: 10, probability: 0.25, color: "#92fe9d" },
    { name: "15% de descuento", value: 15, probability: 0.15, color: "#ffde00" },
    { name: "20% de descuento", value: 20, probability: 0.10, color: "#ff8a00" },
    { name: "25% de descuento", value: 25, probability: 0.05, color: "#da1b60" },
    { name: "Inténtalo de nuevo", value: 0, probability: 0.05, color: "#8f94fb" },
  ];

  // Generar los segmentos de la ruleta con nombres completos
  const generateWheelSegments = () => {
    const segments = [];
    const segmentAngle = 360 / prizes.length;
    
    for (let i = 0; i < prizes.length; i++) {
      segments.push({
        name: prizes[i].name,
        short: prizes[i].value > 0 ? `${prizes[i].value}%` : "Suerte",
        color: prizes[i].color,
        angle: i * segmentAngle
      });
    }
    
    // Duplicar los segmentos para una ruleta más completa
    return [...segments, ...segments];
  };

  const wheelSegments = generateWheelSegments();

  const handleSpin = () => {
    if (spinning || attempts >= 2) return;
    
    // Reproducir sonido de giro
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }
    
    setSpinning(true);
    setResult(null);
    setDiscount(null);
    setHasWon(false);
    
    // Generar un resultado aleatorio basado en probabilidades
    setTimeout(() => {
      const random = Math.random();
      let cumulative = 0;
      let selectedPrize = null;
      
      for (const prize of prizes) {
        cumulative += prize.probability;
        if (random <= cumulative) {
          selectedPrize = prize;
          break;
        }
      }
      
      // Calcular el ángulo de parada
      const prizeIndex = prizes.findIndex(p => p === selectedPrize);
      const segmentAngle = 360 / prizes.length;
      const stopAngle = 3600 + (prizeIndex * segmentAngle) + Math.random() * segmentAngle;
      
      // Aplicar la animación
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        wheelRef.current.style.transform = `rotate(${stopAngle}deg)`;
      }
      
      // Esperar a que termine la animación
      setTimeout(() => {
        setSpinning(false);
        
        if (selectedPrize.value > 0) {
          setResult(selectedPrize.name);
          setDiscount({
            value: selectedPrize.value,
            code: `GAMER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          setHasWon(true);
          
          // Reproducir sonido de victoria
          if (winSoundRef.current) {
            winSoundRef.current.currentTime = 0;
            winSoundRef.current.play();
          }
        } else {
          setResult(selectedPrize.name);
          
          // Reproducir sonido de derrota
          if (loseSoundRef.current) {
            loseSoundRef.current.currentTime = 0;
            loseSoundRef.current.play();
          }
        }
        
        setAttempts(prev => prev + 1);
      }, 4000);
    }, 100);
  };

  const copyCode = () => {
    if (discount?.code) {
      navigator.clipboard.writeText(discount.code);
      setShowCopied(true);
      
      // Reproducir sonido de copia
      if (copySoundRef.current) {
        copySoundRef.current.currentTime = 0;
        copySoundRef.current.play();
      }
      
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  // Resetear la ruleta cuando no está girando
  useEffect(() => {
    if (!spinning) {
      resetWheel();
    }
  }, [spinning]);

  return (
    <div className="raffle-container">
      {/* Elementos de audio */}
      <audio ref={spinSoundRef} src="/sounds/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/sounds/win-sound.mp3" preload="auto" />
      <audio ref={loseSoundRef} src="/sounds/lose-sound.mp3" preload="auto" />
      <audio ref={copySoundRef} src="/sounds/copy-sound.mp3" preload="auto" />
      
      {/* Modal de código copiado */}
      {showCopied && (
        <div className="copied-modal">
          <div className="copied-content">
            <div className="copied-icon">✓</div>
            <div className="copied-text">¡Código copiado!</div>
          </div>
        </div>
      )}
      
      <div className="raffle-header">
        <h1 className="raffle-title">🎮 RIFA DE DESCUENTOS GAMER</h1>
        <div className="attempts-display">
          <div className="attempts-badge">
            <span className="attempts-count">{2 - attempts}</span>
            <span className="attempts-text">INTENTOS RESTANTES</span>
          </div>
        </div>
      </div>
      
      <div className="wheel-container">
        <div
          ref={wheelRef}
          className="wheel"
        >
          {wheelSegments.map((segment, i) => (
            <div
              key={i}
              className="wheel-item"
              style={{ 
                transform: `rotate(${segment.angle}deg)`,
                backgroundColor: segment.color
              }}
            >
              <div className="wheel-item-content">
                <div className="prize-short">{segment.short}</div>
                <div className="prize-name">{segment.name}</div>
              </div>
            </div>
          ))}
          <div className="wheel-center">
            <div className="wheel-logo">GAMIFY</div>
          </div>
        </div>
        <div className="wheel-pointer">
          <div className="pointer-triangle">▼</div>
          <div className="pointer-base"></div>
        </div>
      </div>
      
      <div className="controls">
        <button
          className={`spin-button ${spinning ? 'spinning' : ''}`}
          disabled={spinning || attempts >= 2}
          onClick={handleSpin}
        >
          {spinning ? 'GIRANDO...' : '¡GIRAR RULETA!'}
        </button>
      </div>
      
      <div className="attempts-info">
        <div className="info-icon">ⓘ</div>
        <p>Solo tienes <strong>2 intentos</strong> este mes. ¡Úsalos sabiamente!</p>
      </div>

      {result && (
        <div className={`result-container ${discount ? 'win' : 'lose'}`}>
          <h2 className="result-title">
            {discount ? '¡FELICIDADES, GANADOR!' : '¡BUENA SUERTE PARA LA PRÓXIMA!'}
          </h2>
          <div className={`result-badge ${discount ? 'win-badge' : 'lose-badge'}`}>
            {result}
          </div>
          
          {discount && (
            <div className="discount-card">
              <h3 className="discount-title">TU CÓDIGO DE DESCUENTO</h3>
              <div className="discount-code" onClick={copyCode}>
                {discount.code}
                <span className="copy-hint">(Haz clic para copiar)</span>
              </div>
              <div className="discount-details">
                <div className="discount-value">Descuento del {discount.value}%</div>
                <div className="discount-expiry">Válido hasta: {new Date(discount.expiresAt).toLocaleDateString()}</div>
              </div>
              
              <div className="discount-instructions">
                <p>Usa este código al pagar en nuestra tienda para obtener tu descuento</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}