import type { Meta, StoryObj } from '@storybook/react';
import SparkPage from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'WISSIL/Spark/AI Component Generator',
  component: SparkPage,
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
# SPARK - IDE Experience

Full-featured integrated development environment with Monaco editor.

## Features
- **AI-Powered Generation**: Context-aware component creation
- **Mixture of Experts**: Specialized AI models for different aspects
  - **Design Expert**: Visual design, SLATE tokens, responsive layout
  - **Logic Expert**: Business logic, state management, data flow
  - **Performance Expert**: Optimization, memoization, best practices
- **Quick Examples**: Pre-built prompts for common components
- **WISSIL Standards**: Generated code follows design patterns
- **MCP Integration**: Model Context Protocol for intelligent routing

## Network Information
- **Domain**: spark.lumenforge.io
- **Location**: Helios Compute (192.168.86.115)
- **Port**: 3000
- **Purpose**: IDE Experience
- **Integration**: LUNA (AI Assistant), IGNIS (Code Execution), WebSocket HMR

## Design Tokens
Uses the \`spark\` color system from SLATE:
- Primary: #FBBF24 (Yellow)
- Secondary: #F59E0B (Amber)
- Accent: #FCD34D (Light Yellow)

## How It Works
1. Enter a natural language description of your component
2. SPARK analyzes your prompt and routes to relevant experts
3. Multiple experts collaborate to generate optimal code
4. Code follows WISSIL patterns and uses SLATE tokens
5. Ready to integrate into your project
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SparkPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SparkPage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="spark"
      title="SPARK"
      description="AI-Powered Component Creation"
      showHeader
    >
      <SparkPage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  render: () => <SparkPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
