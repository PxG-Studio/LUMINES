import type { Meta, StoryObj } from '@storybook/react';
import WaypointPage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Waypoint/Pages/Unity Visual Scripting',
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

Visual node-based programming interface for Unity WebGL.

## Features
- **Environment Management**: Track Production, Staging, and Development
- **Version Control**: Semantic versioning with full history
- **Deployment History**: Complete audit trail of all deployments
- **Health Monitoring**: Real-time environment status and uptime
- **Release Management**: Automated deployment workflows

## Network Information
- **Domain**: waypoint.lumenforge.io
- **Location**: Helios Compute (192.168.86.115)
- **Port**: 3006
- **Purpose**: Unity Visual Scripting
- **Integration**: NEC (Unity Runtime) for Unity WebGL execution

## Design Tokens
Uses the \`waypoint\` color system from SLATE:
- Primary: #10B981 (Green)
- Secondary: #059669 (Dark Green)
- Accent: #34D399 (Light Green)

## Environments
1. **Production**: nocturna.network (99.98% uptime)
2. **Staging**: staging.nocturna.network (99.95% uptime)
3. **Development**: dev.nocturna.network (Active development)

## Version Types
- **Major**: Breaking changes (v1.0.0 → v2.0.0)
- **Minor**: New features (v1.0.0 → v1.1.0)
- **Patch**: Bug fixes (v1.0.0 → v1.0.1)

## Component Lifecycle
Tracks components from development through production deployment with full version history.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WaypointPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <WaypointPage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="waypoint"
      title="WAYPOINT"
      description="Navigate Your Deployment Journey"
      showHeader
    >
      <WaypointPage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  render: () => <WaypointPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  render: () => <WaypointPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const WideScreen: Story = {
  render: () => <WaypointPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
