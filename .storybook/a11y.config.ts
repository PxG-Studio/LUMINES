/**
 * Accessibility Configuration - WCAG 2.1 AA Parity
 * METRIC 5: Accessibility Coverage
 */

import type { A11yParameters } from '@storybook/addon-a11y';

export const a11y: A11yParameters = {
  config: {
    rules: [
      // Color contrast (WCAG AA: 4.5:1)
      {
        id: 'color-contrast',
        enabled: true,
        options: {
          contrastRatio: 4.5,
        },
      },
      
      // Keyboard navigation
      {
        id: 'keyboard-navigation',
        enabled: true,
      },
      
      // ARIA roles
      {
        id: 'aria-roles',
        enabled: true,
      },
      
      // ARIA attributes
      {
        id: 'aria-attributes',
        enabled: true,
      },
      
      // Focus management
      {
        id: 'focus-order-semantics',
        enabled: true,
      },
      
      // Screen reader support
      {
        id: 'aria-hidden-focus',
        enabled: true,
      },
      
      // Form labels
      {
        id: 'label',
        enabled: true,
      },
      
      // Heading hierarchy
      {
        id: 'heading-order',
        enabled: true,
      },
    ],
  },
  
  // Manual checks
  manual: true,
  
  // Options
  options: {
    checks: {
      'color-contrast': {
        options: {
          noScroll: true,
        },
      },
    },
  },
};


