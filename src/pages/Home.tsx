import React from 'react';
import { Link } from 'react-router-dom';
import TestimonialCarousel from '../components/TestimonialCarousel';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Melhore suas habilidades de falar em público</h1>
            <p>Domine a arte da comunicação com a orientação especializada da Plateia.</p>
            <Link to="/registro" className="btn btn-primary">Começar</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="recursos">
        <div className="container">
          <div className="section-header">
            <h2>Visão Geral dos Recursos</h2>
            <p>Explore os principais recursos da Plateia que ajudarão a aprimorar e desenvolver suas habilidades de comunicação e apresentação para impactar seu público.</p>
          </div>

          {/* Feature Block 1 */}
          <div className="feature-block">
            <div className="feature-content">
              <h3>Prática Colaborativa</h3>
              <p>Aprimore suas habilidades de apresentação com a prática colaborativa e receba feedback construtivo dos colegas, ajudando a identificar pontos fortes e áreas de melhoria.</p>
              <div className="feature-links">
                <Link to="/registro" className="btn btn-secondary">Experimente agora</Link>
                <a href="#recursos" className="link">Saiba mais</a>
              </div>
            </div>
            <div className="feature-image">
              <img src="/images/praticacolaborativa.jpg" alt="Prática Colaborativa" />
            </div>
          </div>

          {/* Feature Block 2 */}
          <div className="feature-block reverse">
            <div className="feature-content">
              <h3>Mecanismo de Feedback</h3>
              <p>Receba um feedback detalhado e objetivo sobre suas apresentações, com métricas e sugestões personalizadas para aprimorar sua comunicação verbal.</p>
              <div className="feature-links">
                <Link to="/registro" className="btn btn-secondary">Experimente agora</Link>
                <a href="#recursos" className="link">Saiba mais</a>
              </div>
            </div>
            <div className="feature-image">
              <img src="/images/feedback.jpg" alt="Mecanismo de Feedback" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Avaliações dos nossos usuários!</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="sobre">
        <div className="container">
          <div className="cta-content">
            <h2>Junte-se à Família Plateia</h2>
            <p>Comece sua jornada hoje mesmo e transforme sua comunicação em público.</p>
            <Link to="/registro" className="btn btn-primary">Inscreva-se agora</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 