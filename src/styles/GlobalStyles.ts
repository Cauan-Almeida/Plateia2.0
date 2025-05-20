import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.dark};
    background-color: ${({ theme }) => theme.colors.light};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  ul {
    list-style: none;
  }

  .section-header {
    text-align: center;
    margin-bottom: ${theme.spacing.lg};
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-header h2 {
    font-size: 2.5rem;
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing.sm};
  }

  .section-header p {
    color: ${theme.colors.gray};
    font-size: 1.1rem;
  }

  .btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    border-radius: ${theme.borderRadius.default};
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-size: 1rem;
  }

  .btn-primary {
    background-color: ${theme.colors.primary};
    color: white;
    border: 2px solid ${theme.colors.primary};
    box-shadow: ${theme.shadows.small};
  }

  .btn-primary:hover {
    background-color: ${theme.colors.primaryDark};
    border-color: ${theme.colors.primaryDark};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.large};
  }

  .btn-secondary {
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.dark};
    border: 2px solid ${theme.colors.secondary};
  }

  .btn-secondary:hover {
    background-color: #7ab8d4;
    border-color: #7ab8d4;
  }

  .btn-outline {
    background-color: transparent;
    color: white;
    border: 2px solid ${theme.colors.primary};
  }

  .btn-outline:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }

  .link {
    display: inline-block;
    margin-left: ${theme.spacing.sm};
    font-weight: 500;
    position: relative;
  }

  .link:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: ${theme.colors.primary};
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }

  .link:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    .section-header h2 {
      font-size: 2rem;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    .section-header h2 {
      font-size: 1.8rem;
    }
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    padding: ${({ theme }) => theme.spacing.lg} 0;
  }
`; 