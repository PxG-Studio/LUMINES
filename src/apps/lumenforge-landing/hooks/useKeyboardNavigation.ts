/**
 * Keyboard Navigation Hook
 * EC-103, EC-104, EC-105: Keyboard navigation support
 */
import { useEffect, useCallback } from 'react';

export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onTab,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key) {
      case 'Escape':
        if (onEscape && !e.defaultPrevented) {
          e.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter && !e.defaultPrevented && !e.shiftKey) {
          e.preventDefault();
          onEnter();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp && !e.defaultPrevented) {
          e.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown && !e.defaultPrevented) {
          e.preventDefault();
          onArrowDown();
        }
        break;
      case 'Tab':
        if (onTab && !e.defaultPrevented) {
          onTab();
        }
        break;
    }
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onTab]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);
}

