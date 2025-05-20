import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="user-info">
          <img
            src="https://via.placeholder.com/100"
            alt="Avatar do usuário"
            className="user-avatar"
          />
          <h3 className="user-name">João Silva</h3>
          <p className="user-email">joao.silva@email.com</p>
        </div>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-home"></i>
                Visão Geral
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                <i className="fas fa-chart-line"></i>
                Progresso
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <i className="fas fa-history"></i>
                Atividades
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog"></i>
                Configurações
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4 className="stat-title">Palestras Realizadas</h4>
            <p className="stat-value">12</p>
            <p className="stat-description">+3 este mês</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-title">Horas de Prática</h4>
            <p className="stat-value">24.5</p>
            <p className="stat-description">+5.2 esta semana</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-title">Feedback Recebido</h4>
            <p className="stat-value">48</p>
            <p className="stat-description">+12 este mês</p>
          </div>
        </div>

        <div className="progress-section">
          <h3>Seu Progresso</h3>
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-title">Confiança ao Falar</span>
              <span className="progress-percentage">75%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-title">Gestos e Postura</span>
              <span className="progress-percentage">60%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-title">Controle de Voz</span>
              <span className="progress-percentage">85%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="activity-section">
          <h3>Atividades Recentes</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <div className="activity-details">
                <h4 className="activity-title">Palestra sobre Marketing Digital</h4>
                <p className="activity-time">Há 2 dias</p>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-comments"></i>
              </div>
              <div className="activity-details">
                <h4 className="activity-title">Feedback recebido</h4>
                <p className="activity-time">Há 3 dias</p>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="activity-details">
                <h4 className="activity-title">Curso de Oratória concluído</h4>
                <p className="activity-time">Há 1 semana</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 