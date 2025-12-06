import type { Meta, StoryObj } from '@storybook/react';
import IgnitionPage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Pages/Project Bootstrap',
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

Project creation wizard, template gallery, and project initialization.

## Features
- **Project Templates**: Pre-configured templates for common project types
- **Smart Configuration**: 5-step initialization wizard
- **Best Practices**: Built-in linting, testing, and CI/CD setup
- **WISSIL Integration**: Automatic integration with other subsystems
- **Template Selection**: Choose from Next.js apps, component libraries, or API services

## Network Information
- **Domain**: ignition.lumenforge.io, ignite.lumenforge.io
- **Location**: Helios Control (192.168.86.114)
- **Port**: 3005
- **Purpose**: Project Bootstrap
- **Integration**: Template service, MCP tools, GitHub integration

## Design Tokens
Uses the \`ignition\` color system from SLATE:
- Primary: #EF4444 (Red)
- Secondary: #F97316 (Orange)
- Accent: #FB923C (Light Orange)

## Templates Available
1. **Next.js Application**: Full-stack with App Router, TypeScript, Tailwind
2. **Component Library**: Storybook, Jest, Atomic Design
3. **API Service**: Express, PostgreSQL, nocturnaID Auth
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IgnitionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <IgnitionPage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="ignition"
      title="IGNITION"
      description="Spark Your Next Project"
      showHeader
    >
      <IgnitionPage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  render: () => <IgnitionPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <IgnitionPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const WideScreen: Story = {
  render: () => <IgnitionPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
