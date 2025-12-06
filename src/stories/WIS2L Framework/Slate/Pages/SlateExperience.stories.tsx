import type { Meta, StoryObj } from '@storybook/nextjs';
import SlatePage from '@/app/slate/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Slate/Pages/Slate Experience',
  id: 'wis2l-slate-slate-stories',
  component: SlatePage,
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
# SLATE - Workspace & Identity

Workspace selector, identity management, and user settings

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: Workspace & Identity

## Design Tokens
Uses the \`slate\` color system from SLATE.

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
} satisfies Meta<typeof SlatePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Slate page
 */
export const Default: Story = {
  render: () => <SlatePage />,
};

/**
 * Slate page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="slate"
      title="SLATE"
      description="Workspace & Identity"
      showHeader
    >
      <SlatePage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <SlatePage />,
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
  render: () => <SlatePage />,
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
  render: () => <SlatePage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
