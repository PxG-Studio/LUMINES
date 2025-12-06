import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Lumenforge.io',
  brandUrl: 'https://lumenforge.io',
  brandImage: undefined,
  brandTarget: '_self',

  // UI
  appBg: '#0A0E27',
  appContentBg: '#1A1F3A',
  appBorderColor: '#2D3561',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: '"JetBrains Mono", monospace',

  // Text colors
  textColor: '#F9FAFB',
  textInverseColor: '#0A0E27',

  // Toolbar default and active colors
  barTextColor: '#9CA3AF',
  barSelectedColor: '#6366F1',
  barBg: '#1A1F3A',

  // Form colors
  inputBg: '#2D3561',
  inputBorder: '#4A5578',
  inputTextColor: '#F9FAFB',
  inputBorderRadius: 6,

  // Color palette
  colorPrimary: '#6366F1',
  colorSecondary: '#8B5CF6',
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
