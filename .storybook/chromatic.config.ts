/**
 * Chromatic Configuration
 * 
 * Visual regression testing configuration for game development IDE
 */

import type { ChromaticParameters } from '@storybook/react';

export const chromatic: ChromaticParameters = {
  // Visual regression settings
  diffThreshold: 0.01, // 1% pixel difference tolerance
  
  // Animation handling
  delay: 1000, // Wait 1s for animations
  pauseAnimationAtEnd: true,
  
  // Viewports for responsive testing
  viewports: [
    375,   // Mobile
    768,   // Tablet
    1280,  // Desktop
    1920,  // Wide
  ],
  
  // Disable snapshots for complex interactive stories
  disableSnapshot: false,
  
  // Story-specific overrides
  storybook: {
    // Disable for stories that are too dynamic
    disable: false,
  },
};

// Story-specific Chromatic settings
export const chromaticStoryConfig = {
  // Editor components - high precision
  editor: {
    diffThreshold: 0.005, // 0.5% for editor precision
    delay: 1500, // Longer delay for editor initialization
  },
  
  // Game dev components - standard precision
  gameDev: {
    diffThreshold: 0.01,
    delay: 1000,
  },
  
  // Runtime components - allow more variance
  runtime: {
    diffThreshold: 0.02, // 2% for runtime variability
    delay: 2000, // Longer delay for runtime initialization
  },
  
  // Interactive components - disable snapshots
  interactive: {
    disableSnapshot: true,
  },
};

export default chromatic;

