import type { Meta, StoryObj } from '@storybook/react';
import SlatePage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Slate/Pages/Workspace & Identity',
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
# SLATE - Workspace & Identity Management

Workspace selector, identity management, and user settings.

## Features
- **Color Systems**: Complete color palettes for all WISSIL subsystems
- **Typography Scale**: Comprehensive font size and weight system
- **Spacing System**: Consistent spacing tokens
- **Token Explorer**: Interactive token browser with copy-to-clipboard
- **Design Tokens**: Centralized visual design decisions

## Network Information
- **Domain**: slate.lumenforge.io
- **Location**: Helios Compute (192.168.86.115)
- **Port**: 3004
- **Purpose**: Workspace & Identity Management
- **Integration**: nocturnaID, Workspace service

## Design Tokens
Uses the \`slate\` color system from SLATE:
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Accent: #A78BFA (Light Purple)

## Use Cases
- Browse and copy design tokens
- Understand the WISSIL color systems
- Reference typography and spacing scales
- Ensure visual consistency across components
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SlatePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SlatePage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="slate"
      title="SLATE"
      description="Subsystem Layout & Theming Engine"
      showHeader
    >
      <SlatePage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  render: () => <SlatePage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <SlatePage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const WideScreen: Story = {
  render: () => <SlatePage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
