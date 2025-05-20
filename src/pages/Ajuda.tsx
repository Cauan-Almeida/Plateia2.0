import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Ajuda.css';

const Ajuda: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Como posso começar a usar o Plateia?',
      answer: 'Para começar a usar o Plateia, você precisa criar uma conta gratuita. Após o registro, você terá acesso a todas as funcionalidades básicas da plataforma, incluindo salas de tópicos, recursos de aprendizado e feedback da comunidade.'
    },
    {
      question: 'Quais são os benefícios de uma conta premium?',
      answer: 'A conta premium oferece acesso a recursos exclusivos como feedback personalizado de especialistas, cursos avançados de oratória, análise detalhada de suas apresentações e acesso prioritário a eventos especiais.'
    },
    {
      question: 'Como posso receber feedback sobre minhas apresentações?',
      answer: 'Você pode receber feedback de duas maneiras: 1) Compartilhando suas apresentações na comunidade para receber comentários de outros usuários, ou 2) Solicitando feedback personalizado de nossos especialistas (recurso disponível para contas premium).'
    },
    {
      question: 'Posso participar de salas de tópicos sem ter experiência?',
      answer: 'Sim! O Plateia é uma plataforma inclusiva que acolhe pessoas de todos os níveis de experiência. As salas de tópicos são espaços seguros para aprender e praticar, independentemente do seu nível de habilidade.'
    },
    {
      question: 'Como funciona o sistema de avaliação?',
      answer: 'O sistema de avaliação é baseado em diferentes aspectos da comunicação, como clareza, confiança, gestos e postura. Você recebe avaliações tanto da comunidade quanto de especialistas, que ajudam a identificar áreas de melhoria.'
    }
  ];

  return (
    <div className="ajuda-page">
      <section className="ajuda-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Como podemos ajudar?</h1>
          <p>Encontre respostas para suas dúvidas ou entre em contato conosco</p>
        </div>
      </section>

      <section className="ajuda-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
            >
              <div
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <i className={`fas fa-chevron-${activeFaq === index ? 'up' : 'down'}`}></i>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h3>Não encontrou o que procura?</h3>
        <p>Nossa equipe está pronta para ajudar você. Entre em contato conosco e responderemos o mais breve possível.</p>
        <Link to="/contato" className="contact-button">
          <i className="fas fa-envelope"></i> Fale Conosco
        </Link>
      </section>
    </div>
  );
};

export default Ajuda; 