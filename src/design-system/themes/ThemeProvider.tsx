/**
 * Theme Provider
 * Provides Nocturna theme context to all components
 */

'use client';

import React, { createContext, useContext } from "react";
import { NocturnaDarkTheme, type NocturnaDarkTheme as ThemeType } from "./nocturna-dark";

const ThemeContext = createContext<ThemeType>(NocturnaDarkTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={NocturnaDarkTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

