/**
 * Comprehensive Theming System
 * 
 * Multi-theme support for game development IDE
 * Dark, Light, High Contrast, and Game Dev specific themes
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light' | 'high-contrast' | 'game-dev' | 'unity';

export interface ThemeColors {
  // Backgrounds
  bg0: string;
  bg1: string;
  bg2: string;
  panel: string;
  panelHover: string;

  // Text
  text: string;
  textMuted: string;
  textSecondary: string;

  // Borders
  border: string;
  borderLight: string;

  // Accents
  accent: string;
  accentHover: string;
  accentActive: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Game dev specific
  unityPrimary?: string;
  unitySecondary?: string;
}

export interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme definitions
const themes: Record<Theme, ThemeColors> = {
  dark: {
    bg0: '#0f1115',
    bg1: '#16181d',
    bg2: '#1e2127',
    panel: '#16181d',
    panelHover: '#1e2127',
    text: '#e4e7eb',
    textMuted: '#9ba1aa',
    textSecondary: '#6b7280',
    border: '#26292f',
    borderLight: '#2d3138',
    accent: '#3f8cff',
    accentHover: '#2d6fd9',
    accentActive: '#1e4fa8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  light: {
    bg0: '#ffffff',
    bg1: '#f9fafb',
    bg2: '#f3f4f6',
    panel: '#ffffff',
    panelHover: '#f9fafb',
    text: '#1a1a1a',
    textMuted: '#6b7280',
    textSecondary: '#9ca3af',
    border: '#e5e7eb',
    borderLight: '#d1d5db',
    accent: '#3f8cff',
    accentHover: '#2d6fd9',
    accentActive: '#1e4fa8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  'high-contrast': {
    bg0: '#000000',
    bg1: '#1a1a1a',
    bg2: '#2d2d2d',
    panel: '#1a1a1a',
    panelHover: '#2d2d2d',
    text: '#ffffff',
    textMuted: '#cccccc',
    textSecondary: '#999999',
    border: '#ffffff',
    borderLight: '#cccccc',
    accent: '#00ff00',
    accentHover: '#00cc00',
    accentActive: '#009900',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#00ffff',
  },
  'game-dev': {
    bg0: '#1a1a1a',
    bg1: '#242424',
    bg2: '#2d2d2d',
    panel: '#242424',
    panelHover: '#2d2d2d',
    text: '#e4e7eb',
    textMuted: '#9ba1aa',
    textSecondary: '#6b7280',
    border: '#3a3a3a',
    borderLight: '#4a4a4a',
    accent: '#ff6b35',
    accentHover: '#e55a2b',
    accentActive: '#cc4a21',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  unity: {
    bg0: '#282c33',
    bg1: '#323842',
    bg2: '#3c4149',
    panel: '#323842',
    panelHover: '#3c4149',
    text: '#bbbbbb',
    textMuted: '#858585',
    textSecondary: '#6b7280',
    border: '#3c4149',
    borderLight: '#4a5058',
    accent: '#4ec9b0',
    accentHover: '#3da896',
    accentActive: '#2c877c',
    success: '#4ec9b0',
    warning: '#ce9178',
    error: '#f48771',
    info: '#569cd6',
    unityPrimary: '#4ec9b0',
    unitySecondary: '#569cd6',
  },
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  persist?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
  persist = true,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (persist && typeof window !== 'undefined') {
      const saved = localStorage.getItem('wissil-theme') as Theme;
      return saved && themes[saved] ? saved : defaultTheme;
    }
    return defaultTheme;
  });

  const colors = themes[theme];

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      if (persist && typeof window !== 'undefined') {
        localStorage.setItem('wissil-theme', newTheme);
      }
      // Apply CSS variables
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--slate-${key}`, value);
        });
      }
    },
    [persist, colors]
  );

  const toggleTheme = useCallback(() => {
    const themeOrder: Theme[] = ['dark', 'light', 'high-contrast', 'game-dev', 'unity'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [theme, setTheme]);

  // Apply theme on mount and change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--slate-${key}`, value);
      });
    }
  }, [colors]);

  const value: ThemeContextValue = {
    theme,
    colors,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

