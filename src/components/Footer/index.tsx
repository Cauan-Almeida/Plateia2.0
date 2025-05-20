import React from 'react';
import { Link } from 'react-router-dom';
import {
  FooterContainer,
  FooterContent,
  FooterSection,
  SocialLinks,
  FooterBottom
} from './styles';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <h3>Sobre o Plateia</h3>
            <p>Transformando a prática musical através da colaboração e feedback em tempo real.</p>
            <SocialLinks>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Links Rápidos</h3>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/recursos">Recursos</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Recursos</h3>
            <ul>
              <li><Link to="/pratica">Prática Colaborativa</Link></li>
              <li><Link to="/feedback">Feedback em Tempo Real</Link></li>
              <li><Link to="/comunidade">Comunidade</Link></li>
              <li><Link to="/tutoriais">Tutoriais</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Suporte</h3>
            <ul>
              <li><Link to="/ajuda">Central de Ajuda</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contato">Contato</Link></li>
              <li><Link to="/termos">Termos de Uso</Link></li>
            </ul>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <p>&copy; 2024 Plateia. Todos os direitos reservados.</p>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

export default Footer; 