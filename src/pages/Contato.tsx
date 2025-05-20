import React, { useState } from 'react';
import '../styles/Contato.css';

const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário
    console.log('Form data:', formData);
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="contato-page">
      <section className="contato-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais breve possível.</p>
        </div>
      </section>

      <section className="contato-section">
        <h2>Fale Conosco</h2>
        <form className="contato-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              required
            />
          </div>
          <div className="form-group">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o assunto</option>
              <option value="suporte">Suporte Técnico</option>
              <option value="parceria">Proposta de Parceria</option>
              <option value="feedback">Feedback</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Sua mensagem"
              required
            ></textarea>
          </div>
          <button type="submit">Enviar Mensagem</button>
          {success && (
            <div className="contato-sucesso">
              Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}
        </form>
      </section>

      <section className="contact-info">
        <div className="info-card">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Endereço</h3>
          <p>Av. Paulista, 1000</p>
          <p>São Paulo - SP</p>
        </div>
        <div className="info-card">
          <i className="fas fa-phone"></i>
          <h3>Telefone</h3>
          <p>(11) 9999-9999</p>
          <p>(11) 8888-8888</p>
        </div>
        <div className="info-card">
          <i className="fas fa-envelope"></i>
          <h3>E-mail</h3>
          <p>contato@plateia.com</p>
          <p>suporte@plateia.com</p>
        </div>
      </section>
    </div>
  );
};

export default Contato; 