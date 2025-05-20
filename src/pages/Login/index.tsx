import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LoginForm,
  FormGroup,
  RememberMe,
  ForgotPassword,
  SubmitButton,
  Divider,
  SocialLogin,
  RegisterLink
} from './styles';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError('Email ou senha inválidos');
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Bem-vindo de volta!</h1>
          <p>Entre para continuar sua jornada musical</p>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <RememberMe>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </RememberMe>
            <ForgotPassword to="/recuperar-senha">Esqueceu a senha?</ForgotPassword>
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </LoginForm>

        <Divider>
          <span>ou</span>
        </Divider>

        <SocialLogin>
          <button type="button">
            <i className="fab fa-google"></i>
            Google
          </button>
          <button type="button">
            <i className="fab fa-facebook"></i>
            Facebook
          </button>
        </SocialLogin>

        <RegisterLink>
          Não tem uma conta? <Link to="/registro">Inscreva-se</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 