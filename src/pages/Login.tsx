import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../styles/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError('Email ou senha inválidos. Por favor, tente novamente.');
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error: any) {
      setError('Erro ao fazer login com Google. Por favor, tente novamente.');
      console.error('Erro ao fazer login com Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Bem-vindo de volta!</h1>
          <p>Entre para continuar sua jornada de desenvolvimento</p>
        </div>
      </section>

      <section className="login-section">
        <div className="login-container">
          <h2>Login</h2>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="social-login">
            <p>Ou entre com</p>
            <div className="social-buttons">
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <i className="fab fa-google"></i>
                Google
              </button>
              <button
                type="button"
                className="facebook-btn"
                disabled={loading}
              >
                <i className="fab fa-facebook-f"></i>
                Facebook
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/registro">Registre-se</Link>
            </p>
            <Link to="/esqueci-senha" className="forgot-password">
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login; 