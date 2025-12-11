/**
 * Keyboard Navigation Hook
 * 
 * Comprehensive keyboard navigation for game development IDE
 * Supports VS Code-style keyboard shortcuts
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

export interface UseKeyboardNavigationOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardNavigation = ({
  shortcuts,
  enabled = true,
  preventDefault = true,
}: UseKeyboardNavigationOptions) => {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key, ctrlKey, shiftKey, altKey, metaKey } = event;

      // Find matching shortcut
      const shortcut = shortcutsRef.current.find((s) => {
        const keyMatch = s.key.toLowerCase() === key.toLowerCase();
        const ctrlMatch = (s.ctrl || false) === (ctrlKey || metaKey);
        const shiftMatch = (s.shift || false) === shiftKey;
        const altMatch = (s.alt || false) === altKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        shortcut.action();
      }
    },
    [enabled, preventDefault]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
};

// Common keyboard shortcuts for game dev IDE
export const commonShortcuts: KeyboardShortcut[] = [
  // File operations
  { key: 's', ctrl: true, action: () => {}, description: 'Save file' },
  { key: 'o', ctrl: true, action: () => {}, description: 'Open file' },
  { key: 'n', ctrl: true, action: () => {}, description: 'New file' },
  { key: 'w', ctrl: true, action: () => {}, description: 'Close tab' },
  
  // Editor operations
  { key: 'f', ctrl: true, action: () => {}, description: 'Find' },
  { key: 'h', ctrl: true, action: () => {}, description: 'Replace' },
  { key: 'g', ctrl: true, action: () => {}, description: 'Go to line' },
  { key: 'b', ctrl: true, action: () => {}, description: 'Toggle sidebar' },
  
  // Game dev specific
  { key: 'p', ctrl: true, action: () => {}, description: 'Play game' },
  { key: 'p', ctrl: true, shift: true, action: () => {}, description: 'Stop game' },
  { key: 'r', ctrl: true, action: () => {}, description: 'Reload scene' },
];

export default useKeyboardNavigation;

