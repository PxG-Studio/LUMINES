import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within, userEvent, waitFor, fn } from "@storybook/test";
import { LandingLayout } from "@/wis2l/Landing/LandingLayout";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta<typeof LandingLayout> = {
  title: "Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/LandingComponents",
  id: "wis2l-landing-components-stories",
  component: LandingLayout,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
    actions: {
      handles: ['click', 'keydown', 'keyup', 'focus', 'blur'],
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
            reviewOnFail: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof LandingLayout>;

/**
 * Full Landing Page Layout
 * 
 * Complete landing page with all sections:
 * - Navigation
 * - Hero Section
 * - Stats Section
 * - Feature Grid
 * - CTA Sections
 * - Detailed Features
 * - Product Demo
 * - Benefits Section
 * - Use Cases
 * - Social Proof
 * - Integrations
 * - Comparison Table
 * - Pricing
 * - FAQ
 * - Footer
 * - Sticky CTA
 */
export const Default: Story = {
  render: () => <LandingLayout />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // ==== STEP 1: STRUCTURAL VERIFICATION ====
    await step('1. Verify complete page structure', async () => {
      // Hero section
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
      
      // Verify all major sections exist
      // Note: StatsSection does not render a literal "Stats" heading, so we
      // assert on one of its metric labels instead (e.g. "Active Developers").
      // StatsSection - verify via one of its labels
      const statsLabel = canvas.getByText(/Active Developers/i);
      expect(statsLabel).toBeInTheDocument();
      expect(statsLabel).toBeVisible();

      // FeatureGrid - there can be multiple \"Instant Preview\" matches across stories,
      // so be explicit: look for a heading that contains this text.
      const instantPreviewHeadings = canvas.getAllByRole('heading', {
        name: /Instant Preview/i,
      });
      expect(instantPreviewHeadings.length).toBeGreaterThanOrEqual(1);
      expect(instantPreviewHeadings[0]).toBeVisible();

      // DetailedFeatures
      const detailedFeaturesHeading = canvas.getByText(/Everything You Need to Build Faster/i);
      expect(detailedFeaturesHeading).toBeInTheDocument();
      expect(detailedFeaturesHeading).toBeVisible();

      // Benefits
      const benefitsHeading = canvas.getByText(/Why Choose Lumenforge.io/i);
      expect(benefitsHeading).toBeInTheDocument();
      expect(benefitsHeading).toBeVisible();

      // Use Cases
      const useCasesHeading = canvas.getByText(/Perfect for Teams Like Yours/i);
      expect(useCasesHeading).toBeInTheDocument();
      expect(useCasesHeading).toBeVisible();

      // Comparison
      const comparisonHeading = canvas.getByText(/Compare to Alternatives/i);
      expect(comparisonHeading).toBeInTheDocument();
      expect(comparisonHeading).toBeVisible();

      // Pricing
      const pricingHeading = canvas.getByText(/Simple, Transparent Pricing/i);
      expect(pricingHeading).toBeInTheDocument();
      expect(pricingHeading).toBeVisible();

      // FAQ
      const faqHeading = canvas.getByText(/Frequently Asked Questions/i);
      expect(faqHeading).toBeInTheDocument();
      expect(faqHeading).toBeVisible();
    });

    // ==== STEP 2: NAVIGATION TESTING ====
    await step('2. Test navigation buttons', async () => {
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);

      // Find "Open Editor" button (first instance in nav)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0];
      await userEvent.click(openEditorButton);
    });

    // ==== STEP 3: HERO BUTTONS ====
    await step('3. Test hero CTA buttons', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeInTheDocument();
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeInTheDocument();
      await userEvent.click(tryAIGeneratorButton);
    });

    // ==== STEP 4: CTA SECTIONS ====
    await step('4. Test CTA section buttons', async () => {
      // Some CTA buttons call window.open (e.g. PricingSection). In Storybook / test
      // context we don't actually want to open new tabs, so temporarily stub it.
      const originalWindowOpen = window.open;
      const openSpy = fn();
      // @ts-ignore - allow assignment for test environment
      window.open = openSpy;

      try {
        const ctaButtons = canvas.getAllByRole('button', { name: /start coding now|get started free|view demo|schedule demo/i });
        expect(ctaButtons.length).toBeGreaterThan(0);
        
        for (const button of ctaButtons.slice(0, 2)) { // Test first 2 CTA buttons
          expect(button).toBeVisible();
          await userEvent.click(button);
        }

        // Ensure our stub was called at least once
        expect(openSpy).toHaveBeenCalled();
      } finally {
        // Restore original window.open so we don't affect other stories
        window.open = originalWindowOpen;
      }
    });

    // ==== STEP 5: KEYBOARD NAVIGATION ====
    await step('5. Test keyboard navigation', async () => {
      const firstButton = canvas.getByRole('button', { name: /^docs$/i });
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      // Tab through interactive elements
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
      
      // Enter key activation
      const focusedElement = document.activeElement as HTMLElement;
      if (focusedElement && focusedElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
      }
    });

    // ==== STEP 6: SCROLL AND VIEWPORT ====
    await step('6. Test scroll behavior', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      
      await waitFor(() => {
        expect(footer).toBeInTheDocument();
      }, { timeout: 2000 });

      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      await waitFor(() => {
        const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
        expect(heading).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    // ==== STEP 7: ACCESSIBILITY VERIFICATION ====
    await step('7. Verify accessibility features', async () => {
      // All buttons should have accessible names
      const allButtons = canvas.getAllByRole('button');
      allButtons.forEach(button => {
        const name = button.textContent || button.getAttribute('aria-label');
        expect(name?.trim().length).toBeGreaterThan(0);
        expect(button).toBeVisible();
      });

      // All links should have hrefs
      const allLinks = canvas.getAllByRole('link');
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });

      // Verify heading hierarchy
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(1);
      const h1 = headings.find(h => h.tagName === 'H1');
      expect(h1).toBeInTheDocument();
    });

    // ==== STEP 8: FEATURE SECTIONS INTERACTION ====
    await step('8. Test feature section interactions', async () => {
      // Verify feature cards are present (3 or more)
      const featureCards = canvasElement.querySelectorAll('article[role="article"]');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);

      // Test FAQ accordion if visible
      const faqButtons = canvasElement.querySelectorAll('[aria-expanded]');
      if (faqButtons.length > 0) {
        const firstFAQ = faqButtons[0] as HTMLElement;
        await userEvent.click(firstFAQ);
        await waitFor(() => {
          expect(firstFAQ.getAttribute('aria-expanded')).toBe('true');
        });
      }
    });
  },
};

/**
 * Mobile Viewport
 */
export const Mobile: Story = {
  ...Default,

  parameters: {
    ...Default.parameters
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify mobile layout', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      
      // Verify responsive behavior
      const navButtons = canvas.getAllByRole('button');
      expect(navButtons.length).toBeGreaterThan(0);
      
      // Test mobile interactions
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      await userEvent.click(startCodingButton);
    });
  },

  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
};

/**
 * Tablet Viewport
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
 * Desktop/Wide Screen Viewport
 */
export const WideScreen: Story = {
  ...Default,

  parameters: {
    ...Default.parameters
  },

  globals: {
    viewport: {
      value: 'wideScreen',
      isRotated: false
    }
  }
};
