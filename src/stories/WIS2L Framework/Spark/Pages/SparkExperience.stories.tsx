import type { Meta, StoryObj } from '@storybook/react';

import SparkPage from '@/app/spark/page';
import SparkGeneratorPage from '@/app/spark/generator/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Spark/Pages/Workbench',
  id: 'wis2l-spark-workbench',
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
# SPARK — Workbench Environment

**Krug-Optimized IDE Workspace** — Editor-first, developer-focused layout.

This is a **real IDE workspace**, not a marketing page. The editor is immediately visible above the fold, following Steve Krug's "Don't Make Me Think" principles.

---

## Layout Structure

### Top Bar (IDE Chrome)
- Spark Workbench branding (small, quiet)
- Project selector dropdown
- Helios connection status indicator
- Settings button

### Left Sidebar (240px)
- **Tab Navigation**: Editor, Dashboard, Terminal, AI Chat
- **File Tree**: When Editor tab is active
- **Quick Stats**: When Dashboard tab is active
- **Terminal Output**: When Terminal tab is active
- **AI Chat Interface**: When AI Chat tab is active

### Center Editor Area (Dominant)
- **Editor Tabs Bar**: File tabs with close buttons
- **Monaco-Style Code Editor**: Full-height code editing surface
- **Status Bar**: Line/column, file info, running status

### Right Panel (280px, Optional)
- **Inspector**: Properties panel, AI suggestions
- Collapsible/optional for more editor space

---

## Design Principles Applied

✅ **Editor Above the Fold** — No scroll required to start coding  
✅ **No Marketing Content** — Removed hero sections, feature cards, CTAs  
✅ **Functional Chrome** — IDE-neutral colors, small typography (12-13px)  
✅ **Clear Hierarchy** — Editor is the primary focus  
✅ **Familiar Patterns** — VS Code/StackBlitz/Cursor-style layout  
✅ **Immediate Usability** — Start coding right away

---

## Workspace Context

- **Execution Layer:** Helios Control / Helios Compute
- **Role:** Primary coding surface for WIS2L modules  
  (Slate Nodes, Ignis Runtime Tasks, Spark Game Templates)
- **Support:** Unity, Unreal, Godot, Blender pipelines (mocked in Storybook)

## Design Tokens

Powered by the \`spark\` token group  
(utility surfaces, editor chrome, low-distraction neutral palette).

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
} satisfies Meta<typeof SparkPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default workbench view — Editor-first IDE layout
 * 
 * This is the primary working environment. The editor is immediately visible,
 * with file tree, terminal, and AI chat accessible via sidebar tabs.
 */
export const Default: Story = {
  name: 'Workbench – Default View',
  render: () => <SparkPage />,
};

/**
 * Workbench with WIS2L layout wrapper
 * 
 * Note: The workbench is designed to be standalone. The WIS2LLayout wrapper
 * adds a header, but the workbench itself is self-contained.
 */
export const WithLayout: Story = {
  name: 'Workbench – With WIS2L Layout',
  render: () => (
    <WIS2LLayout
      system="spark"
      title="SPARK Workbench"
      description="IDE workspace for game development"
      showHeader
    >
      <SparkPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport — tooling collapsed
 */
export const Mobile: Story = {
  render: () => <SparkPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport — mid-size dev workstation
 */
export const Tablet: Story = {
  render: () => <SparkPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Wide screen viewport — multi-column IDE layout
 */
export const WideScreen: Story = {
  render: () => <SparkPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};

/**
 * Unity Asset Generator — Bolt.new-style generator for Unity C# assets
 * 
 * Minimal, focused interface for generating Unity ScriptableObjects, C# scripts,
 * and other Unity assets from natural language prompts.
 */
export const GeneratorUnityAssets: Story = {
  name: 'Generator – Unity Assets',
  render: () => <SparkGeneratorPage />,
};

/**
 * Generator with WIS2L layout wrapper
 */
export const GeneratorWithLayout: Story = {
  name: 'Generator – With WIS2L Layout',
  render: () => (
    <WIS2LLayout
      system="spark"
      title="SPARK Generator"
      description="Unity C# asset generation from natural language prompts"
      showHeader
    >
      <SparkGeneratorPage />
    </WIS2LLayout>
  ),
};
