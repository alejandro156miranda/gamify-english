import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RaffleWheel = ({ user }) => {
  const [raffleStatus, setRaffleStatus] = useState({
    canPlay: false,
    badgeCount: 0,
    attemptsUsed: 0,
    attemptsLeft: 0
  });
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [discount, setDiscount] = useState(null);

  // Obtener estado de rifa
  const fetchRaffleStatus = async () => {
    try {
      const response = await axios.get('/api/raffle/status');
      setRaffleStatus(response.data);
    } catch (error) {
      console.error('Error fetching raffle status:', error);
    }
  };

  useEffect(() => {
    fetchRaffleStatus();
  }, [user]);

  // Girar ruleta
  const handleSpin = async () => {
    if (spinning || !raffleStatus.canPlay) return;
    
    setSpinning(true);
    setResult(null);
    setDiscount(null);

    try {
      const response = await axios.post('/api/raffle/play');
      
      if (response.data.success) {
        setResult(response.data.result);
        if (response.data.discount) {
          setDiscount(response.data.discount);
        }
        fetchRaffleStatus(); // Actualizar estado
      }
    } catch (error) {
      console.error('Error spinning wheel:', error);
      setResult('Error al jugar');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="raffle-container">
      <h2>Ruleta de Premios</h2>
      
      <div className="stats">
        <p>Insignias: {raffleStatus.badgeCount}</p>
        <p>Intentos este mes: {raffleStatus.attemptsUsed}/2</p>
      </div>

      {!raffleStatus.canPlay && raffleStatus.badgeCount < 5 && (
        <div className="alert">
          Necesitas al menos 5 insignias para jugar
        </div>
      )}

      {!raffleStatus.canPlay && raffleStatus.badgeCount >= 5 && (
        <div className="alert">
          Has agotado tus intentos este mes
        </div>
      )}

      <div className="wheel-container">
        {/* Aquí iría tu implementación visual de la ruleta */}
        <button 
          onClick={handleSpin} 
          disabled={!raffleStatus.canPlay || spinning}
          className="spin-button"
        >
          {spinning ? 'Girando...' : '¡Girar Ruleta!'}
        </button>
      </div>

      {result && (
        <div className={`result ${result.includes('Lo siento') ? 'lose' : 'win'}`}>
          <h3>{result}</h3>
          {discount && (
            <div className="discount">
              <p>Código: {discount.code}</p>
              <p>Válido hasta: {new Date(discount.expiresAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaffleWheel;