import type { Meta, StoryObj } from '@storybook/nextjs';
import IgnitionPage from '@/app/ignition/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Pages/Ignition Experience',
  id: 'wis2l-ignition-ignition-stories',
  component: IgnitionPage,
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
# IGNITION - Project Bootstrap

Project creation wizard, template gallery, and project initialization

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: Project Bootstrap

## Design Tokens
Uses the \`ignition\` color system from SLATE.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IgnitionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Ignition page
 */
export const Default: Story = {
  render: () => <IgnitionPage />,
};

/**
 * Ignition page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="ignition"
      title="IGNITION"
      description="Project Bootstrap"
      showHeader
    >
      <IgnitionPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <IgnitionPage />,
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
  render: () => <IgnitionPage />,
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
  render: () => <IgnitionPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
