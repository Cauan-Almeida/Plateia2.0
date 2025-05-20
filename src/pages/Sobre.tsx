import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sobre.css';

const Sobre: React.FC = () => {
  return (
    <div className="sobre-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Sobre a Plateia</h1>
            <p>Conheça nossa missão e visão para transformar a comunicação em público</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Nossa Missão</h2>
            <p>
              A Plateia nasceu com o objetivo de democratizar o acesso a técnicas e ferramentas
              que ajudam pessoas a melhorarem suas habilidades de comunicação em público.
              Acreditamos que a comunicação efetiva é uma habilidade essencial para o sucesso
              pessoal e profissional.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Nossos Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Colaboração</h3>
              <p>
                Acreditamos no poder da colaboração e do feedback construtivo para o
                desenvolvimento pessoal e profissional.
              </p>
            </div>

            <div className="value-card">
              <i className="fas fa-chart-line"></i>
              <h3>Melhoria Contínua</h3>
              <p>
                Buscamos constantemente aprimorar nossas ferramentas e metodologias para
                oferecer a melhor experiência possível.
              </p>
            </div>

            <div className="value-card">
              <i className="fas fa-lightbulb"></i>
              <h3>Inovação</h3>
              <p>
                Utilizamos tecnologia de ponta para criar soluções inovadoras que facilitam
                o aprendizado e o desenvolvimento.
              </p>
            </div>

            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h3>Empatia</h3>
              <p>
                Entendemos os desafios de falar em público e criamos um ambiente seguro e
                acolhedor para o desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Nossa Equipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member1.jpg" alt="Membro da Equipe" />
              </div>
              <h3>João Silva</h3>
              <p className="member-role">CEO & Fundador</p>
              <p className="member-bio">
                Especialista em comunicação e oratória com mais de 15 anos de experiência
                em treinamento e desenvolvimento.
              </p>
            </div>

            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member2.jpg" alt="Membro da Equipe" />
              </div>
              <h3>Maria Santos</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Desenvolvedora apaixonada por criar soluções tecnológicas que facilitam
                o aprendizado e o desenvolvimento pessoal.
              </p>
            </div>

            <div className="team-member">
              <div className="member-image">
                <img src="/images/team-member3.jpg" alt="Membro da Equipe" />
              </div>
              <h3>Pedro Oliveira</h3>
              <p className="member-role">Head de Produto</p>
              <p className="member-bio">
                Especialista em experiência do usuário e design de produtos digitais
                focados em educação e desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Junte-se à Nossa Jornada</h2>
            <p>
              Faça parte da nossa comunidade e transforme sua comunicação em público
              com a Plateia.
            </p>
            <Link to="/registro" className="btn btn-primary">Começar Agora</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre; 