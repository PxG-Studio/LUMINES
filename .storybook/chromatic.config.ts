/**
 * Chromatic Configuration - StackBlitz Parity Visual Regression
 * METRIC 6: Visual Regression Coverage
 */

import type { ChromaticParameters } from '@storybook/addon-chromatic';

export const chromatic: ChromaticParameters = {
  // Pixel-perfect baseline (StackBlitz standard)
  diffThreshold: 0.01,
  
  // Pause animations for deterministic snapshots
  pauseAnimationAtEnd: true,
  
  // Disable animations unless explicitly needed
  disableAnimation: true,
  
  // Viewports to test
  viewports: [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1920, height: 1080, name: 'Desktop' },
  ],
  
  // Themes to test
  themes: ['dark', 'light', 'high-contrast'],
  
  // No jitter tolerance
  jitterTolerance: 0,
  
  // Full page snapshots for IDE components
  fullPage: true,
};
