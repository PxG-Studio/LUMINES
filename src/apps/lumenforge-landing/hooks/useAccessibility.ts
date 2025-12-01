/**
 * Accessibility Hooks
 * EC-LAND-251 to EC-LAND-350: Accessibility hooks
 */
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardNavigation,
  ARIAManager,
  ContrastChecker,
  FormAccessibility,
} from '../utils/accessibility';

/**
 * Hook for focus trap in modals
 * EC-LAND-252
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const cleanup = KeyboardNavigation.trapFocus(containerRef.current);
    return cleanup;
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for arrow key navigation
 * EC-LAND-256
 */
export function useArrowKeyNavigation(
  orientation: 'horizontal' | 'vertical' | 'both' = 'both'
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = KeyboardNavigation.handleArrowKeys(
      containerRef.current,
      orientation
    );
    return cleanup;
  }, [orientation]);

  return containerRef;
}

/**
 * Hook for ARIA announcements
 * EC-LAND-264, EC-LAND-268, EC-LAND-269, EC-LAND-270
 */
export function useAriaAnnounce() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    ARIAManager.announce(message, politeness);
  };

  return { announce };
}

/**
 * Hook for focus management
 * EC-LAND-259, EC-LAND-260
 */
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  return { saveFocus, restoreFocus };
}

/**
 * Hook for form accessibility
 * EC-LAND-281 to EC-LAND-290
 */
export function useFormAccessibility() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = (fieldId: string, errorMessage: string) => {
    setErrors(prev => ({ ...prev, [fieldId]: errorMessage }));
    
    const input = document.getElementById(fieldId);
    if (input) {
      FormAccessibility.announceValidation(input, errorMessage);
    }
  };

  const clearFieldError = (fieldId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });

    const input = document.getElementById(fieldId);
    if (input) {
      input.setAttribute('aria-invalid', 'false');
    }
  };

  return { errors, setFieldError, clearFieldError };
}

/**
 * Hook for reduced motion
 * EC-LAND-291
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for contrast checking
 * EC-LAND-271 to EC-LAND-273
 */
export function useContrastCheck(
  foreground: string,
  background: string,
  isLargeText: boolean = false
) {
  const [meetsWCAGAA, setMeetsWCAGAA] = useState(false);
  const [meetsWCAGAAA, setMeetsWCAGAAA] = useState(false);
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);

  useEffect(() => {
    const ratio = ContrastChecker.getContrastRatio(foreground, background);
    setContrastRatio(ratio);
    setMeetsWCAGAA(ContrastChecker.meetsWCAGAA(foreground, background, isLargeText));
    setMeetsWCAGAAA(ContrastChecker.meetsWCAGAAA(foreground, background, isLargeText));
  }, [foreground, background, isLargeText]);

  return { contrastRatio, meetsWCAGAA, meetsWCAGAAA };
}

/**
 * Hook for keyboard shortcut handling
 * EC-LAND-255
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {},
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    // Check for conflicts
    if (KeyboardNavigation.checkShortcutConflict(key, modifiers)) {
      console.warn(`Keyboard shortcut ${key} conflicts with browser shortcut`);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === key &&
        (modifiers.ctrl ? e.ctrlKey : !e.ctrlKey) &&
        (modifiers.alt ? e.altKey : !e.altKey) &&
        (modifiers.shift ? e.shiftKey : !e.shiftKey) &&
        (modifiers.meta ? e.metaKey : !e.metaKey)
      ) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifiers, enabled]);
}

