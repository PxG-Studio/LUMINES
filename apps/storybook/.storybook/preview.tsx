import type { Preview } from '@storybook/react';

// TODO: Future migration - Import theme tokens from packages/tokens once migrated
// import { lumenForgeTheme } from '@lumines/tokens';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
      },
    },
    // TODO: Future - Add Chromatic and Percy parameters once integrated
    // chromatic: {
    //   viewports: [375, 768, 1920],
    //   pauseAnimationAtEnd: true,
    // },
  },
  // TODO: Future migration - Add global decorators once packages are ready
  // decorators: [
  //   (Story) => (
  //     <ThemeProvider>
  //       <Story />
  //     </ThemeProvider>
  //   ),
  // ],
  tags: ['autodocs'],
};

export default preview;

