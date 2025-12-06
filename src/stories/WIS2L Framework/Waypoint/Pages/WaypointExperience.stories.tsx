import type { Meta, StoryObj } from '@storybook/nextjs';
import WaypointPage from '@/app/waypoint/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Waypoint/Pages/Waypoint Experience',
  id: 'wis2l-waypoint-waypoint-stories',
  component: WaypointPage,
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
# WAYPOINT - Unity Visual Scripting

Visual node-based programming interface for Unity WebGL

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: Unity Visual Scripting

## Design Tokens
Uses the \`waypoint\` color system from SLATE.

## UI/UX DNA Consistency

This page follows the **Landing UI/UX DNA** for consistency across Storybook:

- **Nocturna CSS Variables**: Uses \`var(--nv-bg-*)\`, \`var(--nv-text-*)\`, \`var(--nv-border)\` for theming
- **Button Component**: Uses \`@/design-system/primitives/Button\` with variants (accent, default, ghost)
- **ThemeProvider**: Wrapped with ThemeProvider via Storybook decorators
- **Consistent Spacing**: Uses \`--nv-space-*\` variables for spacing
- **Accessibility**: WCAG AA compliant colors and focus indicators

See \`docs/LANDING_UI_UX_DNA.md\` for full design system guidelines.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WaypointPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Waypoint page
 */
export const Default: Story = {
  render: () => <WaypointPage />,
};

/**
 * Waypoint page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="waypoint"
      title="WAYPOINT"
      description="Unity Visual Scripting"
      showHeader
    >
      <WaypointPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <WaypointPage />,
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
  render: () => <WaypointPage />,
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
  render: () => <WaypointPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
