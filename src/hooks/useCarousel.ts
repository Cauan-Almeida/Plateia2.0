import { useState, useEffect, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
  autoPlayInterval?: number;
}

export const useCarousel = ({ totalItems, autoPlayInterval = 5000 }: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev === totalItems - 1 ? 0 : prev + 1));
  }, [totalItems]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? totalItems - 1 : prev - 1));
  }, [totalItems]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(goToNext, autoPlayInterval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, goToNext, autoPlayInterval]);

  const pauseCarousel = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeCarousel = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseCarousel,
    resumeCarousel
  };
}; 