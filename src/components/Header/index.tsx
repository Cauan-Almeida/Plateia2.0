import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  HeaderContainer,
  HeaderContent,
  Logo,
  NavMenu,
  AuthButtons,
  MenuToggle,
  MobileMenu
} from './styles';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer className={isMenuOpen ? 'menu-open' : ''}>
      <HeaderContent>
        <Logo>
          <Link to="/">
            <img src="/images/logo2.0.png" alt="Logo Plateia" />
          </Link>
        </Logo>
        <NavMenu>
          <ul>
            <li><Link to="/" className="active">Início</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/recursos">Recursos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </NavMenu>
        <AuthButtons>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-primary">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Entrar</Link>
              <Link to="/registro" className="btn btn-primary">Inscreva-se</Link>
            </>
          )}
        </AuthButtons>
        <MenuToggle onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </MenuToggle>
        <MobileMenu isOpen={isMenuOpen}>
          <ul>
            <li><Link to="/" className="active">Início</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/recursos">Recursos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={handleLogout}>Sair</button></li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </MobileMenu>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 