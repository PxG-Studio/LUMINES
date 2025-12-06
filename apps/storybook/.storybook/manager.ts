import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'LumenForge Design System',
  brandUrl: 'https://lumenforge.io',
  // TODO: Future - Add brand image once assets are ready
  // brandImage: './lumenforge-logo.svg',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
});

