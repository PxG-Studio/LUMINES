/**
 * Shared Storybook Decorators
 * 
 * Provides consistent theming and layout for all WIS2L Framework stories
 * following the Landing UI/UX DNA
 */

import React from 'react';
import { ThemeProvider } from '../src/design-system/themes/ThemeProvider';

/**
 * Wraps stories with ThemeProvider for consistent Nocturna theming
 * This ensures all stories use CSS variables (--nv-*) for colors, spacing, etc.
 */
export const withTheme = (Story: any) => (
  <ThemeProvider>
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--nv-bg-0)',
        color: 'var(--nv-text-0)',
      }}
    >
      <Story />
    </div>
  </ThemeProvider>
);

/**
 * Wraps stories with ThemeProvider and fullscreen layout
 * Use this for page-level stories that need full viewport
 */
export const withThemeFullscreen = (Story: any) => (
  <ThemeProvider>
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--nv-bg-0)',
        color: 'var(--nv-text-0)',
        overflow: 'auto',
      }}
    >
      <Story />
    </div>
  </ThemeProvider>
);

