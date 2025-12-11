/**
 * Theme Provider Component
 * 
 * Provides theme context for components
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
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
      const stored = localStorage.getItem('wissil-theme') as Theme;
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('wissil-theme', newTheme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

