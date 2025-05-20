import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-newsletter">
            <h3>Fique por dentro das novidades</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Seu e-mail" required />
              <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Plateia</h4>
              <ul>
                <li><a href="#">Preços</a></li>
                <li><a href="#sobre">Sobre nós</a></li>
                <li><a href="#recursos">Recursos</a></li>
                <li><Link to="/ajuda">Central de Ajuda</Link></li>
              </ul>
            </div>

            <div className="link-group">
              <h4>Suporte</h4>
              <ul>
                <li><Link to="/ajuda">FAQ</Link></li>
                <li><Link to="/contato">Contato</Link></li>
                <li><a href="#">Comunidade</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Plateia. Todos os direitos reservados.</p>
          </div>
          <div className="social-links">
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 