import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMobileMenu } from '../hooks/useMobileMenu';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();

  return (
    <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Plateia Logo" />
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
        </button>

        <nav className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
            <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
            <li><Link to="/ajuda" onClick={closeMenu}>Ajuda</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                <li>
                  <button 
                    className="logout-btn"
                    onClick={() => {
                      // Implementar logout
                      closeMenu();
                    }}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                <li><Link to="/registro" onClick={closeMenu}>Registro</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 