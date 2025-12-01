/**
 * Click Outside Hook
 * EC-074, EC-075: Click outside detection
 */
import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  handler: () => void,
  enabled: boolean = true
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Use capture phase for better compatibility
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [handler, enabled]);

  return ref;
}

