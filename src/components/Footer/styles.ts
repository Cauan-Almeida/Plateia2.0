import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FooterContainer = styled.footer`
  background-color: ${theme.colors.primaryDark};
  color: ${theme.colors.light};
  padding: ${theme.spacing.xl} 0;
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.secondary};
  }

  ul {
    list-style: none;
  }

  li {
    margin-bottom: ${theme.spacing.sm};
  }

  a {
    color: ${theme.colors.light};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.secondary};
    }
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};

  a {
    color: ${theme.colors.light};
    font-size: 1.5rem;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.secondary};
      transform: translateY(-3px);
    }
  }
`;

export const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    color: ${theme.colors.light};
    opacity: 0.8;
  }
`; 