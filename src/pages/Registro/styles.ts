import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.light};
  margin-top: 80px;
`;

export const RegisterCard = styled.div`
  background-color: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

export const RegisterHeader = styled.div`
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

export const RegisterForm = styled.form`
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

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.sm};

  input[type="checkbox"] {
    width: auto;
    margin-top: 0.3rem;
  }

  label {
    font-size: 0.9rem;
    color: ${theme.colors.gray};
    text-align: left;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primaryDark};
    }
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

export const SocialRegister = styled.div`
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

export const LoginLink = styled.div`
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