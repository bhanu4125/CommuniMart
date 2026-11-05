import { useEffect } from 'react';

export const useKeyPress = (targetKey: string, handler: () => void) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [targetKey, handler]);
};
