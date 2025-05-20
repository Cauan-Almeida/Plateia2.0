import { DefaultTheme } from 'styled-components';

export const theme = {
  colors: {
    primary: '#007bff',
    primaryDark: '#0056b3',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
    gray: '#6c757d',
    lightGray: '#e9ecef',
    accent: '#17a2b8'
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Montserrat', sans-serif"
  },
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    tablet: '768px',
    mobile: '576px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    default: '8px',
    large: '12px',
  },
  shadows: {
    small: '0 2px 10px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 20px rgba(0, 0, 0, 0.1)',
    large: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    default: 'all 0.3s ease',
  },
} as const;

export type Theme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 