import { useEffect } from 'react';

type KeyHandler = () => void;
type KeyMap = Record<string, KeyHandler>;

export const useKeyboard = (keyMap: KeyMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey } = event;

      const keyString = [ctrlKey && 'ctrl', altKey && 'alt', shiftKey && 'shift', key.toLowerCase()]
        .filter(Boolean)
        .join('+');

      const handler = keyMap[keyString];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap]);
};
