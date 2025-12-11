import { useEffect, useState } from 'react';
import { sessionStorage as safeSessionStorage } from '../utils/storage';

export type Theme = 'dark' | 'light' | 'system';

export function useTheme(initialTheme: Theme = 'system') {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return initialTheme;
    const stored = safeSessionStorage.get<Theme>('theme-preference');
    if (stored) return stored;
    return initialTheme;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    safeSessionStorage.set('theme-preference', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    handler();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme };
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
