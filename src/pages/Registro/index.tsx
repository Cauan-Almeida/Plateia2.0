import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  RegisterContainer,
  RegisterCard,
  RegisterHeader,
  RegisterForm,
  FormGroup,
  FormRow,
  TermsCheckbox,
  SubmitButton,
  Divider,
  SocialRegister,
  LoginLink
} from './styles';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
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
      setError('As senhas não coincidem');
      return;
    }

    if (!termsAccepted) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      console.error('Erro ao criar conta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <h1>Crie sua conta</h1>
          <p>Junte-se à comunidade Plateia e comece sua jornada musical</p>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <label htmlFor="firstName">Nome</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="lastName">Sobrenome</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>

          <TermsCheckbox>
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms">
              Eu concordo com os <Link to="/termos">Termos de Uso</Link> e{' '}
              <Link to="/privacidade">Política de Privacidade</Link>
            </label>
          </TermsCheckbox>

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </SubmitButton>
        </RegisterForm>

        <Divider>
          <span>ou</span>
        </Divider>

        <SocialRegister>
          <button type="button">
            <i className="fab fa-google"></i>
            Google
          </button>
          <button type="button">
            <i className="fab fa-facebook"></i>
            Facebook
          </button>
        </SocialRegister>

        <LoginLink>
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 