// src/pages/AboutUs.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  useEffect(() => {
    // Crear partículas para el fondo
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 5 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      const startX = Math.random() * 100;
      const startY = Math.random() * 100 + 100;
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;

      const colors = ['#0ff0fc', '#ff00ff', '#39ff14', '#bc13fe'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;

      const duration = Math.random() * 20 + 10;
      particle.style.animationDuration = `${duration}s`;

      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;

      particlesContainer.appendChild(particle);
    }

    // Efecto de escritura en el título
    const title = document.querySelector('.neon-title');
    if (title) {
      const originalText = title.textContent;
      title.textContent = '';

      let i = 0;
      const typeWriter = setInterval(() => {
        if (i < originalText.length) {
          title.textContent += originalText.charAt(i);
          i++;
        } else {
          clearInterval(typeWriter);
        }
      }, 100);
    }
  }, []);

  return (
    <>
      {/* Partículas de fondo */}
      <div className="particles" id="particles"></div>

      {/* Header Hero */}
      <header className="hero-header">
        <h1 className="neon-title">Sobre Nosotros</h1>
        <p className="subtitle">
          En <span className="highlight">English Gamify</span> transformamos el aprendizaje del inglés en una aventura épica donde cada punto ganado acerca a los estudiantes a oportunidades educativas reales. Conectamos el esfuerzo con resultados tangibles a través de nuestros programas asociados.
        </p>
      </header>

      {/* Sección de programas asociados */}
      <section className="programs-section">
        <h2 className="section-title">Nuestros Programas Asociados</h2>
        <div className="cards-container">
          {/* Tarjeta WTL Programs */}
          <div className="program-card">
            <div className="card-header">
              <div className="card-logo">
                <i className="fas fa-globe-americas"></i>
              </div>
              <h3 className="card-title">WTL Programs</h3>
            </div>
            <p className="card-content">Programas de inmersión internacional que combinan aprendizaje del inglés con experiencias culturales únicas y desarrollo de liderazgo.</p>
            <ul className="benefits-list">
              <li>Campamentos de verano en el extranjero</li>
              <li>Programas de intercambio cultural</li>
              <li>Talleres de liderazgo juvenil</li>
              <li>Experiencias educativas transformadoras</li>
            </ul>
            <p className="card-content"><strong>Beneficio especial:</strong> 500 puntos = 15% de descuento en cualquier programa internacional</p>
            <a href="https://www.wtlprograms.com/" target="_blank" rel="noopener noreferrer" className="visit-button">
              <i className="fas fa-external-link-alt"></i> Visitar Sitio Web
            </a>
          </div>

          {/* Tarjeta Novatrail Careers */}
          <div className="program-card">
            <div className="card-header">
              <div className="card-logo">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="card-title">Novatrail Careers</h3>
            </div>
            <p className="card-content">Orientación vocacional y preparación para carreras internacionales con énfasis en dominio del inglés profesional.</p>
            <ul className="benefits-list">
              <li>Asesoría para universidades en el extranjero</li>
              <li>Preparación para exámenes TOEFL/IELTS</li>
              <li>Programas de pasantías internacionales</li>
              <li>Desarrollo de habilidades profesionales</li>
            </ul>
            <p className="card-content"><strong>Beneficio especial:</strong> 700 puntos = 20% de descuento en programas de preparación</p>
            <a href="https://novatrailcareers.com/" target="_blank" rel="noopener noreferrer" className="visit-button">
              <i className="fas fa-external-link-alt"></i> Visitar Sitio Web
            </a>
          </div>

          {/* Tarjeta InTraining Programs */}
          <div className="program-card">
            <div className="card-header">
              <div className="card-logo">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3 className="card-title">InTraining Programs</h3>
            </div>
            <p className="card-content">Programas de capacitación técnica con certificaciones internacionales que requieren dominio del inglés técnico.</p>
            <ul className="benefits-list">
              <li>Cursos de inglés para negocios y tecnología</li>
              <li>Certificaciones profesionales internacionales</li>
              <li>Programas de mentoría con expertos</li>
              <li>Preparación para el mercado laboral global</li>
            </ul>
            <p className="card-content"><strong>Beneficio especial:</strong> 400 puntos = 10% de descuento en certificaciones</p>
            <a href="https://www.intrainingprograms.com/" target="_blank" rel="noopener noreferrer" className="visit-button">
              <i className="fas fa-external-link-alt"></i> Visitar Sitio Web
            </a>
          </div>
        </div>
      </section>

      {/* Sección de nuestra misión */}
      <section className="mission-section">
        <div className="mission-statement">
          <h3 className="mission-title">Nuestra Misión</h3>
          <p className="mission-text">
            En English Gamify creemos que aprender inglés debe ser tan emocionante como jugar tu videojuego favorito. Hemos creado un ecosistema donde cada actividad completada, cada punto ganado y cada insignia desbloqueada representa un paso hacia oportunidades educativas reales.
          </p>
          <p className="mission-text">
            Nuestra plataforma gamificada no es solo un método de aprendizaje, es un puente hacia programas educativos de calidad que pueden transformar el futuro de nuestros estudiantes.
          </p>
          <div className="mission-highlight">
            <i className="fas fa-gamepad"></i> APRENDE - JUEGA - CRECE <i className="fas fa-rocket"></i>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gamer-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/nosotros">Sobre Nosotros</Link>
            <Link to="/terms">Términos y Condiciones</Link>
            <Link to="/privacy">Política de Privacidad</Link>
            <Link to="/contact">Contacto</Link>
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
              <span className="sr-only">YouTube</span>
            </a>
          </div>
          <p className="copyright">© 2023 English Gamify Platform. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;