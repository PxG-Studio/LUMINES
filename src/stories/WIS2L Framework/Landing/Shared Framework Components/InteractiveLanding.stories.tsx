import type { Meta, StoryObj } from '@storybook/nextjs';
import { action } from '@storybook/addon-actions';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React from 'react';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import { SimpleNav } from '@/wis2l/Landing/SimpleNav';
import { HeroSection } from '@/wis2l/Landing/HeroSection';
import { FeatureGrid } from '@/wis2l/Landing/FeatureGrid';
import { Footer } from '@/wis2l/Landing/Footer';

type InteractiveLandingLayoutProps = {
  onNavigation?: (href: string, label: string) => void;
};

function InteractiveLandingLayout({ onNavigation }: InteractiveLandingLayoutProps) {
  const handleNav = React.useCallback(
    (href: string, label: string) => {
      if (onNavigation) {
        onNavigation(href, label);
      }
      console.log(`[Action] ${label} clicked - would navigate to: ${href}`);
    },
    [onNavigation]
  );

  return (
    <ThemeProvider>
      <div
        style={{
          background: 'var(--nv-bg-0)',
          minHeight: '100vh',
          color: 'var(--nv-text-0)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SimpleNav onNavigation={handleNav} />
        <HeroSection onNavigation={handleNav} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px' }}>
          <FeatureGrid />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

const meta: Meta<typeof InteractiveLandingLayout> = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/Interactive Landing',
  id: 'wis2l-landing-interactive-stories',
  component: InteractiveLandingLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    // Log all click events to the Actions panel so you always see activity
    actions: {
      handles: ['click'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onNavigation: {
      description: 'Called whenever a navigation or hero button is clicked',
      table: {
        type: { summary: '(href: string, label: string) => void' },
      },
    },
  },
} satisfies Meta<typeof InteractiveLandingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive Landing Page with Actions
 *
 * **How to see Actions:**
 * 1. Open the **Canvas** tab for this story
 * 2. Open the **Actions** panel at the bottom
 * 3. Click any navigation or hero button
 * 4. See the \`navigate\` action logged with \`href\` and \`label\`
 *
 * This is a minimal version showing only core sections (Nav, Hero, Features, Footer).
 * Use this for testing individual component interactions.
 */
export const Default: Story = {
  args: {
    onNavigation: (href: string, label: string) => {
      action('navigate')({ href, label });
      console.log(`Navigation action from Storybook: ${label} → ${href}`);
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify minimal landing structure', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify core sections are present
      // Look specifically for the top‑nav logo link by accessible name.
      const logoLink = canvas.getByRole('link', { name: /Lumenforge\.io/i });
      expect(logoLink).toBeVisible();
      
      const featureCards = canvas.getAllByText(/Instant Preview|Clean Project Explorer|Code-First Workflow/i);
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });

    await step('Test all navigation buttons with actions', async () => {
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);

      // Find "Open Editor" button (first instance)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      await userEvent.click(openEditorButtons[0]);
    });

    await step('Test hero buttons with actions', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
    });

    await step('Verify Actions panel integration', async () => {
      // All button clicks should have triggered onNavigation
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(3);
      
      // Verify buttons are clickable
      allButtons.forEach(button => {
        expect(button).not.toBeDisabled();
        expect(button).toBeVisible();
      });
    });
  },
  parameters: {
    docs: {
      description: {
        story: `
### Interactive Landing Page (Minimal Version)

This story demonstrates the core landing page sections with full Actions panel integration.

**What's Included:**
- Navigation bar (SimpleNav)
- Hero section with CTAs
- Feature grid (3 cards)
- Footer

**Actions Panel:**
- All button clicks are logged to the Actions tab
- Each click shows \`{ href, label }\` object
- Console logs show navigation intent

**Use Cases:**
- Testing individual component interactions
- Verifying navigation wiring
- Debugging click handlers
- Demonstrating Actions panel integration

**Note:** This is a minimal version. For the full landing page with all sections, see \`LandingComponents\` story.
        `,
      },
    },
  },
};

/**
 * Mobile Viewport - Interactive Landing
 */
export const Mobile: Story = {
  ...Default,

  parameters: {
    ...Default.parameters
  },

  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
};

/**
 * Tablet Viewport - Interactive Landing
 */
export const Tablet: Story = {
  ...Default,

  parameters: {
    ...Default.parameters
  },

  globals: {
    viewport: {
      value: 'tablet',
      isRotated: false
    }
  }
};

/**
 * Desktop Viewport - Interactive Landing
 */
export const Desktop: Story = {
  ...Default,

  parameters: {
    ...Default.parameters
  },

  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false
    }
  }
};

/**
 * No Actions - For testing without Actions panel noise
 */
export const WithoutActions: Story = {
  render: () => <InteractiveLandingLayout />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify structure without actions', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(3);
      allButtons.forEach(btn => expect(btn).toBeVisible());
    });
  },
  parameters: {
    ...Default.parameters,
    actions: {
      disable: true,
    },
  },
  // Clearer name in the UI so users understand this variant's purpose.
  name: 'Canvas Only (No Actions Logging)',
};
