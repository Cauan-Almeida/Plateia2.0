import { useState, useEffect, useCallback } from 'react';

export const useMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (mobileMenu && menuToggle) {
        if (!mobileMenu.contains(event.target as Node) && !menuToggle.contains(event.target as Node)) {
          closeMenu();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeMenu]);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu
  };
}; 