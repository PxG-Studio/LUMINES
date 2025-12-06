import type { Meta, StoryObj } from '@storybook/react';
import ProjectsPage from '@/app/projects/page';
import { WIS2LLayout } from '@/components/wissil/WIS2LLayout';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Projects/Projects Experience',
  id: 'wis2l-projects-experience-stories',
  component: ProjectsPage,
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
# PROJECTS - Project Management

**Project creation, configuration, and management system** for WIS2L.

## Purpose

PROJECTS provides a centralized interface for:
- **Creating New Projects** — Template-based project scaffolding
- **Project Templates** — Pre-configured Unity, WebGL, and game templates
- **Project Configuration** — Guided setup wizard
- **Project Management** — List, open, and manage existing projects

## Key Features

- ✅ **Template Gallery** — Browse and select from game project templates
- ✅ **Project Wizard** — Step-by-step project creation flow
- ✅ **GitHub Integration** — Optional repository creation
- ✅ **Unity Templates** — 2D/3D game templates with C# scripting
- ✅ **WebGL Templates** — Browser-based game templates

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
} satisfies Meta<typeof ProjectsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Projects page
 */
export const Default: Story = {
  render: () => <ProjectsPage />,
};

/**
 * Projects page wrapped in WIS2LLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WIS2LLayout
      system="projects"
      title="PROJECTS"
      description="Project Bootstrap"
      showHeader
    >
      <ProjectsPage />
    </WIS2LLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <ProjectsPage />,
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
  render: () => <ProjectsPage />,
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
  render: () => <ProjectsPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
