import { useEffect } from 'react';

export const useKeyHandler = (handler: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Strict preventDefault() on Enter — browser must never submit forms
      if (e.key === 'Enter') {
        e.preventDefault();
      }

      handler(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler]);
};
