import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${theme.colors.light};
  margin-top: 80px;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(2, 27, 51, 0.8);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;

    h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: ${theme.spacing.md};
      line-height: 1.2;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: ${theme.spacing.lg};
      opacity: 0.9;
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    .hero-content h1 {
      font-size: 3rem;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    .hero-content h1 {
      font-size: 2.5rem;
    }
    .hero-content p {
      font-size: 1.1rem;
    }
  }
`;

export const FeaturesSection = styled.section`
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.light};
`;

export const FeatureBlock = styled.div<{ reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  align-items: center;
  direction: ${props => props.reverse ? 'rtl' : 'ltr'};

  .feature-content,
  .feature-image {
    direction: ltr;
  }

  .feature-content {
    h3 {
      font-size: 2rem;
      color: ${theme.colors.accent};
      margin-bottom: ${theme.spacing.sm};
    }

    p {
      color: ${theme.colors.gray};
      margin-bottom: ${theme.spacing.md};
    }
  }

  .feature-image img {
    width: 100%;
    border-radius: ${theme.borderRadius.large};
    box-shadow: ${theme.shadows.medium};
    transition: ${theme.transitions.default};

    &:hover {
      transform: scale(1.02);
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};

    .feature-content,
    .feature-image {
      text-align: center;
    }
  }
`;

export const TestimonialsSection = styled.section`
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.light};
  position: relative;
`;

export const TestimonialCarousel = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
`;

export const TestimonialContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  overflow: hidden;
  padding: ${theme.spacing.md} 0;
`;

export const TestimonialCard = styled.div`
  background-color: white;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.default};
  box-shadow: ${theme.shadows.medium};
  min-width: 300px;
  transition: ${theme.transitions.default};

  &.active {
    transform: scale(1.05);
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

export const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${theme.colors.secondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserDetails = styled.div`
  h4 {
    font-size: 1.1rem;
    color: ${theme.colors.accent};
    margin-bottom: 5px;
  }
`;

export const Rating = styled.div`
  color: #ffd700;
`;

export const TestimonialText = styled.p`
  color: ${theme.colors.gray};
  font-style: italic;
  line-height: 1.8;
`;

export const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

export const CarouselButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;

export const CarouselDots = styled.div`
  display: flex;
  gap: 10px;
`;

export const Dot = styled.span<{ active?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.lightGray};
  cursor: pointer;
  transition: ${theme.transitions.default};
  transform: ${props => props.active ? 'scale(1.2)' : 'scale(1)'};
`;

export const CTASection = styled.section`
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.primaryDark};
  color: ${theme.colors.light};
  text-align: center;

  .cta-content {
    h2 {
      font-size: 2.5rem;
      margin-bottom: ${theme.spacing.sm};
    }

    p {
      font-size: 1.2rem;
      margin-bottom: ${theme.spacing.lg};
      opacity: 0.9;
    }
  }
`; 