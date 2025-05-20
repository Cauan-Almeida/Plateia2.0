import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${theme.colors.primaryDark};
  box-shadow: ${theme.shadows.small};
  z-index: 1000;
  padding: 1.2rem 0;
  transition: ${theme.transitions.default};

  &.menu-open {
    background-color: ${theme.colors.primaryDark};
    box-shadow: ${theme.shadows.medium};
    padding: 1.3rem 0;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.div`
  a {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${theme.colors.light};
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: ${theme.borderRadius.default};
    box-shadow: ${theme.shadows.small};
  }

  img {
    width: 110px;
  }
`;

export const NavMenu = styled.nav`
  ul {
    display: flex;
    gap: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.light};
    font-weight: 500;
    padding: 0.5rem 0.8rem;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: ${theme.colors.secondary};
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }

    &:hover:after,
    &.active:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }

    &.active {
      color: ${theme.colors.secondary};
    }
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

export const MenuToggle = styled.div`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.light};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${theme.colors.primaryDark};
  padding: ${theme.spacing.lg};
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  ${props => props.isOpen && css`
    transform: translateX(0);
  `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
  }

  li {
    text-align: center;
  }

  a {
    color: ${theme.colors.light};
    font-size: 1.2rem;
    font-weight: 500;
    display: block;
    padding: ${theme.spacing.sm};

    &:hover,
    &.active {
      color: ${theme.colors.secondary};
    }
  }
`; 