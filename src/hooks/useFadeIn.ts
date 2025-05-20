import { useEffect, useRef } from 'react';

interface UseFadeInProps {
  threshold?: number;
  rootMargin?: string;
}

export const useFadeIn = ({ threshold = 0.1, rootMargin = '0px' }: UseFadeInProps = {}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return elementRef;
}; 