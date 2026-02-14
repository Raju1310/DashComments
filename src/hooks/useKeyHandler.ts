import { useEffect } from 'react';

export const useKeyHandler = (handler: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // We removed strict preventDefault here to allow component-level logic to decide.
      // Components using this hook should prevent default if necessary to stop form submission.
      handler(e);
    };

    // Use Capture to intervene early? Or Bubble?
    // If we use bubble (default), React's event delegation (which happens at root)
    // might fire BEFORE or AFTER depending on React version.
    // React 17+ attaches to root.

    // We want our global handler to respect stopImmediatePropagation from React events?
    // React events are synthetic. Calling stopPropagation on React event stops React bubbling,
    // but might not stop native bubbling if it's already bubbling up.

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler]);
};
