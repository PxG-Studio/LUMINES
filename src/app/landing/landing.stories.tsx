import type { Meta, StoryObj } from '@storybook/react';
import LandingPage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'WISSIL/Landing/Main Gateway',
  component: LandingPage,
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
# LANDING - Production Landing Page

The main marketing landing page for LumenForge.io ecosystem.

## Features
- **Hero Section**: Main value proposition and CTAs
- **WISSIL Systems**: Overview cards for all 5 subsystems
- **Features Section**: Key platform benefits
- **Navigation**: Links to /about, /demo, /projects
- **Responsive Design**: Optimized for all screen sizes

## Network Information
- **Domain**: lumenforge.io, www.lumenforge.io
- **Location**: Helios Control (192.168.86.114)
- **Port**: 3000
- **Access**: Public facing with Cloudflare Zero Trust + nocturnaID

## Design Tokens
Uses the Luminera design system:
- Primary: #F5B914 (Amber)
- Secondary: #47E0FF (Cyan)
- Accent: #A64DFF (Purple)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // No props for this page component
  },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Landing page showing all WISSIL subsystems
 */
export const Default: Story = {
  render: () => <LandingPage />,
};

/**
 * Landing page wrapped in WISSILLayout for consistency testing
 */
export const WithLayout: Story = {
  render: () => (
    <WISSILLayout system="landing" showHeader={false}>
      <LandingPage />
    </WISSILLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Wide screen viewport
 */
export const WideScreen: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wide',
    },
  },
};
