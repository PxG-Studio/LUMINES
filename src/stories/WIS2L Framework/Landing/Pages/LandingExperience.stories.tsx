import type { Meta, StoryObj } from '@storybook/nextjs';
import LandingPage from '@/app/landing/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Landing/Pages/Landing Experience',
  id: 'wis2l-landing-landing-stories',
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

The main marketing landing page for LumenForge.io ecosystem

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: Production Landing Page

## Design Tokens
Uses the \`landing\` color system from SLATE.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Landing page
 */
export const Default: Story = {
  render: () => <LandingPage />,
};

/**
 * Landing page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="landing"
      title="LANDING"
      description="Production Landing Page"
      showHeader
    >
      <LandingPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
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
      defaultViewport: 'wideScreen',
    },
  },
};
