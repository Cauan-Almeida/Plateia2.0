import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import '../styles/Registro.css';

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
      console.error('Erro ao criar conta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error: any) {
      setError('Erro ao criar conta com Google. Por favor, tente novamente.');
      console.error('Erro ao criar conta com Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-page">
      <section className="registro-hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Junte-se ao Plateia</h1>
          <p>Crie sua conta e comece sua jornada de desenvolvimento</p>
        </div>
      </section>

      <section className="registro-section">
        <div className="registro-container">
          <h2>Registro</h2>
          {error && <div className="registro-error">{error}</div>}
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="social-login">
            <p>Ou registre-se com</p>
            <div className="social-buttons">
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleSignup}
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
              Já tem uma conta?{' '}
              <Link to="/login">Faça login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Registro; 