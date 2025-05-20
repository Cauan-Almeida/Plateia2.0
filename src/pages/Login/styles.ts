import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.light};
  margin-top: 80px;
`;

export const LoginCard = styled.div`
  background-color: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

export const LoginHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};

  h1 {
    font-size: 2rem;
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    color: ${theme.colors.gray};
  }
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const FormGroup = styled.div`
  text-align: left;

  label {
    display: block;
    margin-bottom: ${theme.spacing.xs};
    color: ${theme.colors.dark};
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid ${theme.colors.lightGray};
    border-radius: ${theme.borderRadius.default};
    font-size: 1rem;
    transition: ${theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px ${theme.colors.secondary}40;
    }
  }
`;

export const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};

  input[type="checkbox"] {
    width: auto;
    margin-top: 0.3rem;
  }

  label {
    margin-bottom: 0;
    font-size: 0.9rem;
  }
`;

export const ForgotPassword = styled(Link)`
  color: ${theme.colors.primary};
  font-size: 0.9rem;
  text-decoration: none;
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;

export const SubmitButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 1rem;
  border: none;
  border-radius: ${theme.borderRadius.default};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${theme.colors.gray};
    cursor: not-allowed;
    transform: none;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${theme.spacing.lg} 0;
  color: ${theme.colors.gray};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${theme.colors.lightGray};
  }

  span {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const SocialLogin = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  button {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid ${theme.colors.lightGray};
    border-radius: ${theme.borderRadius.default};
    background-color: white;
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
      background-color: ${theme.colors.light};
    }

    i {
      margin-right: ${theme.spacing.xs};
    }
  }
`;

export const RegisterLink = styled.div`
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.gray};

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }
`; 