import type { Meta, StoryObj } from '@storybook/nextjs';
import IgnisPage from '@/app/ignis/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignis/Pages/Ignis Experience',
  id: 'wis2l-ignis-ignis-stories',
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

Runtime engine with WebContainer support, API documentation, and code execution

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: API Backend

## Design Tokens
Uses the \`ignis\` color system from SLATE.

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
} satisfies Meta<typeof IgnisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Ignis page
 */
export const Default: Story = {
  render: () => <IgnisPage />,
};

/**
 * Ignis page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="ignis"
      title="IGNIS"
      description="API Backend"
      showHeader
    >
      <IgnisPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <IgnisPage />,
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
  render: () => <IgnisPage />,
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
  render: () => <IgnisPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
