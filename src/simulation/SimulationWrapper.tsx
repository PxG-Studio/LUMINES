/**
 * Simulation Wrapper Component
 * 
 * Orchestrates IDE simulation with runtime mocks
 */

import React from 'react';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export interface SimulationWrapperProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light' | 'high-contrast'; // Note: design-system ThemeProvider uses fixed dark theme
}

export const SimulationWrapper: React.FC<SimulationWrapperProps> = ({
  children,
  theme = 'dark', // Currently unused - design-system ThemeProvider is fixed to dark
}) => {
  return (
    <ThemeProvider>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'var(--slate-bg, #0f1115)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  );
};

export default SimulationWrapper;

