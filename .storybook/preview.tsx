/**
 * Storybook Preview Configuration
 * Enforces 8-Point StackBlitz Parity Metrics
 */

import type { Preview } from '@storybook/react';
import { chromatic } from './chromatic.config';
import { a11y } from './a11y.config';

const preview: Preview = {
  parameters: {
    // METRIC 6: Visual Regression Coverage
    chromatic,
    
    // METRIC 5: Accessibility Coverage
    a11y,
    
    // Actions (METRIC 3: Action Emission Coverage)
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    
    // Controls (METRIC 2: Controls Coverage)
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    
    // Layout
    layout: 'padded',
    
    // Backgrounds (METRIC 1: Component State Parity)
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f1115' },
        { name: 'light', value: '#ffffff' },
        { name: 'high-contrast', value: '#000000' },
      ],
    },
    
    // Viewports (METRIC 1: Component State Parity)
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    
    // Docs (METRIC 7: API Contract Coverage)
    docs: {
      toc: true,
      source: {
        type: 'code',
      },
    },
  },
  
  // Global decorators
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  
  // Global argTypes (METRIC 2: Controls Coverage)
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    style: {
      control: 'object',
      description: 'Inline styles',
    },
  },
};

export default preview;
