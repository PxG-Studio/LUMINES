/**
 * Percy Configuration for WISSIL Storybook
 * 
 * Percy provides cross-browser visual regression testing
 * alongside Chromatic for comprehensive coverage.
 */

module.exports = {
  version: 2,
  
  discovery: {
    allowedHostnames: ['localhost', '127.0.0.1'],
    networkIdleTimeout: 750,
    disableCache: true,
  },
  
  snapshot: {
    widths: [375, 768, 1280, 1920], // Mobile, Tablet, Desktop, Wide
    minHeight: 1024,
    percyCSS: `
      /* Freeze animations for consistent snapshots */
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      
      /* Ensure consistent rendering */
      canvas,
      iframe,
      video {
        visibility: visible !important;
      }
    `,
    enableJavaScript: true,
    waitForTimeout: 1000,
  },
  
  // Storybook-specific configuration
  storybook: {
    buildDir: 'storybook-static',
    staticDir: 'public',
  },
};

