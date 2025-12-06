import type { Meta, StoryObj } from '@storybook/react';
import IgnisPage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignis/Pages/API Backend',
  component: IgnisPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        component: `
# IGNIS - API Backend

Runtime engine with WebContainer support, API documentation, and code execution.

## Features
- **Lightning Fast**: Sub-second hot-reload times
- **Performance Metrics**: Real-time build statistics
  - Build Time: ~1.2s
  - Bundle Size optimization
  - Hot Reload: <200ms
  - Component tracking
- **Build Optimizations**:
  - Tree Shaking: Remove unused code
  - Code Splitting: Faster initial load
  - Image Optimization: WebP conversion
  - CSS Purging: Remove unused Tailwind classes
- **Build History**: Track all recent builds
- **Live Preview**: Real-time component updates

## Network Information
- **Domain**: ignis.lumenforge.io
- **Location**: Helios Control (192.168.86.114)
- **Port**: 3001
- **Purpose**: API Backend
- **Integration**: WebContainer API, NPM package registry, Hot module replacement

## Design Tokens
Uses the \`ignis\` color system from SLATE:
- Primary: #FF6B35 (Coral)
- Secondary: #F7931E (Orange)
- Accent: #FFC857 (Yellow)

## Optimizations
All optimizations are enabled by default for best performance:
- **Tree Shaking** (High Impact)
- **Code Splitting** (High Impact)
- **Image Optimization** (Medium Impact)
- **CSS Purging** (Medium Impact)
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IgnisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IgnisPage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="ignis"
      title="IGNIS"
      description="Lightning-Fast Development Server"
      showHeader
    >
      <IgnisPage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  render: () => <IgnisPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <IgnisPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const WideScreen: Story = {
  render: () => <IgnisPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
