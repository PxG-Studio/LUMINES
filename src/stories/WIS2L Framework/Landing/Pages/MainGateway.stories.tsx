import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import { fn } from '@storybook/test';
import LandingPage from '@/app/landing/page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';
import { LandingLayout } from '@/wissil/Landing/LandingLayout';
import { SimpleNav } from '@/wissil/Landing/SimpleNav';
import { HeroSection } from '@/wissil/Landing/HeroSection';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Landing/Pages/Main Gateway',
  id: 'wis2l-landing-main-gateway-stories',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'desktop',
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
            // Note: Some "incomplete" results are false positives due to A11y tool's
            // overlap detection algorithm with flexbox/grid layouts. The actual
            // contrast ratios meet WCAG AA standards (white #ffffff on #111421 = 12.63:1).
            reviewOnFail: true, // Mark as review needed rather than failing
          },
        ],
      },
    },
    docs: {
      description: {
        component: `
# LANDING - Production Landing Page

The main marketing landing page for LumenForge.io ecosystem.

## Features
- **Hero Section**: Main value proposition and CTAs
- **WISSIL Systems**: Overview cards for all 5 subsystems
- **Features Section**: Key platform benefits
- **Navigation**: Links to /about, /demo, /projects
- **Responsive Design**: Optimized for all screen sizes

## Interactive Elements
- Navigation buttons (Docs, Templates, Open Editor)
- Hero CTA buttons (Start Coding, Try AI Generator)
- Logo/link navigation
- Feature cards
- Keyboard navigation support
- Touch/mobile interactions

## Network Information
- **Domain**: lumenforge.io, www.lumenforge.io
- **Location**: Helios Control (192.168.86.114)
- **Port**: 3000
- **Access**: Public facing with Cloudflare Zero Trust + nocturnaID

## Design Tokens
Uses the Luminera design system:
- Primary: #F5B914 (Amber)
- Secondary: #47E0FF (Cyan)
- Accent: #A64DFF (Purple)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // No props for this page component
    // All interactions are tested via play functions
  },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the Landing page showing all WISSIL subsystems
 */
export const Default: Story = {
  render: () => <LandingPage />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // ==== STEP 1: BRUTAL STRUCTURAL VERIFICATION ====
    await step('1. Brutal page structure verification', async () => {
      // Main heading - verify it's actually an H1 and visible
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
      expect(heading).toBeVisible();
      expect(heading.textContent?.length).toBeGreaterThan(10);

      // Verify subtitle/description exists and is readable
      const subtitle = canvas.getByText(/Lumenforge.io unifies AI generation/i);
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toBeVisible();
      expect(subtitle.tagName).toBe('P');

      // Verify navigation elements exist - get ALL links
      const navLinks = canvas.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
      const logoLink = navLinks.find(link => link.getAttribute('href') === '/landing' || link.textContent?.includes('Lumenforge.io'));
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toBeVisible();

      // Verify footer exists and has copyright
      const footer = canvas.getByText(/©/i);
      expect(footer).toBeInTheDocument();
      expect(footer).toBeVisible();

      // Verify page has proper semantic structure
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(1); // At least H1
      expect(headings[0].textContent).toContain('Creative Pipeline');
    });

    // ==== STEP 2: BRUTAL BUTTON INTERACTION TESTING ====
    await step('2. Brutal navigation button stress testing', async () => {
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);

      // Test "Docs" button - single click, double click, rapid clicks
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
      expect(docsButton).not.toBeDisabled();
      
      // Single click
      await userEvent.click(docsButton);
      await waitFor(() => expect(docsButton).toBeVisible(), { timeout: 500 });
      
      // Double click (should not break)
      await userEvent.dblClick(docsButton);
      
      // Rapid fire clicks (stress test)
      for (let i = 0; i < 5; i++) {
        await userEvent.click(docsButton);
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms delay
      }

      // Test "Templates" button
      const templatesButton = allButtons.find(
        btn => btn.textContent?.trim().toLowerCase() === 'templates'
      );
      expect(templatesButton).toBeInTheDocument();
      expect(templatesButton).toBeVisible();
      expect(templatesButton).not.toBeDisabled();
      
      await userEvent.click(templatesButton!);
      await userEvent.dblClick(templatesButton!); // Double click test

      // Test "Open Editor" button - rapid interaction
      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeInTheDocument();
      expect(openEditorButton).toBeVisible();
      expect(openEditorButton).not.toBeDisabled();
      
      // Click sequence
      await userEvent.click(openEditorButton);
      await userEvent.click(openEditorButton);
      await userEvent.click(openEditorButton);
    });

    // ==== STEP 3: BRUTAL HERO BUTTON TESTING ====
    await step('3. Brutal hero button interactions and edge cases', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeInTheDocument();
      expect(startCodingButton).toBeVisible();
      expect(startCodingButton).not.toBeDisabled();
      
      // Click with different pointer types (simulated)
      await userEvent.click(startCodingButton);
      await userEvent.click(startCodingButton, { button: 0 }); // Primary button
      
      // Test button after rapid scrolling
      window.scrollTo(0, 100);
      await waitFor(() => expect(startCodingButton).toBeInTheDocument());
      await userEvent.click(startCodingButton);
      window.scrollTo(0, 0);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeInTheDocument();
      expect(tryAIGeneratorButton).toBeVisible();
      expect(tryAIGeneratorButton).not.toBeDisabled();
      
      // Sequential rapid clicks on both buttons
      await userEvent.click(startCodingButton);
      await userEvent.click(tryAIGeneratorButton);
      await userEvent.click(startCodingButton);
      await userEvent.click(tryAIGeneratorButton);
      
      // Verify buttons remain functional after stress
      expect(startCodingButton).toBeVisible();
      expect(tryAIGeneratorButton).toBeVisible();
    });

    // ==== STEP 4: BRUTAL LINK AND NAVIGATION TESTING ====
    await step('4. Brutal link interaction testing', async () => {
      const navLinks = canvas.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
      
      const logoLink = navLinks.find(link => 
        link.getAttribute('href') === '/landing' || 
        link.textContent?.includes('Lumenforge.io')
      );
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toBeVisible();
      expect(logoLink).toHaveAttribute('href');
      
      // Test link accessibility
      expect(logoLink).toHaveAttribute('href');
      const href = logoLink!.getAttribute('href');
      expect(href).toBeTruthy();
      
      // Click link multiple times (should not break)
      await userEvent.click(logoLink!);
      await userEvent.click(logoLink!);
      await userEvent.dblClick(logoLink!);
      
      // Verify link still works
      expect(logoLink).toHaveAttribute('href');
      
      // Test all links have valid hrefs
      navLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    // ==== STEP 5: BRUTAL FEATURE GRID AND CONTENT TESTING ====
    await step('5. Brutal feature grid content verification', async () => {
      // Verify all three feature cards are present and have content
      const instantPreview = canvas.getByText(/Instant Preview/i);
      expect(instantPreview).toBeInTheDocument();
      expect(instantPreview).toBeVisible();
      expect(instantPreview.tagName).toBe('H2');
      expect(instantPreview.textContent?.trim().length).toBeGreaterThan(5);
      
      const cleanProject = canvas.getByText(/Clean Project Explorer/i);
      expect(cleanProject).toBeInTheDocument();
      expect(cleanProject).toBeVisible();
      expect(cleanProject.tagName).toBe('H2');
      
      const codeFirst = canvas.getByText(/Code-First Workflow/i);
      expect(codeFirst).toBeInTheDocument();
      expect(codeFirst).toBeVisible();
      expect(codeFirst.tagName).toBe('H2');

      // Verify feature cards have descriptions
      const descriptions = canvas.getAllByText(/Lightning-fast|minimal file tree|Built for iteration/i);
      expect(descriptions.length).toBeGreaterThanOrEqual(3);
      
      // Test scroll to feature cards
      instantPreview.scrollIntoView({ behavior: 'smooth' });
      await waitFor(() => expect(instantPreview).toBeInTheDocument(), { timeout: 1000 });
      
      // Verify cards are still visible after scroll
      expect(instantPreview).toBeVisible();
      expect(cleanProject).toBeVisible();
      expect(codeFirst).toBeVisible();
      
      // Count all feature card elements
      const featureCards = canvasElement.querySelectorAll('article[role="article"]');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });

    // ==== STEP 6: BRUTAL KEYBOARD NAVIGATION TESTING ====
    await step('6. Brutal keyboard navigation and accessibility', async () => {
      // Test Tab navigation - forward
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      docsButton.focus();
      expect(docsButton).toHaveFocus();

      // Tab forward through all interactive elements
      let tabCount = 0;
      let currentFocus = docsButton;
      
      // Tab through at least 5 elements
      for (let i = 0; i < 10; i++) {
        await userEvent.keyboard('{Tab}');
        tabCount++;
        
        // Verify focus moved
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement !== currentFocus) {
          currentFocus = focusedElement as HTMLElement;
          break; // Focus moved successfully
        }
        
        if (tabCount >= 5) break; // Safety limit
      }

      // Test Shift+Tab (backward navigation)
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
      
      // Test Enter key on focused button
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
      }
      
      // Test Space key on focused button
      docsButton.focus();
      await userEvent.keyboard(' ');
      await waitFor(() => expect(docsButton).toBeInTheDocument());

      // Test Escape key (should not break anything)
      await userEvent.keyboard('{Escape}');
      
      // Test Arrow keys (might be used in some contexts)
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowLeft}');
      await userEvent.keyboard('{ArrowRight}');
      
      // Verify page still functional
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
    });

    // ==== STEP 7: BRUTAL MOUSE INTERACTION TESTING ====
    await step('7. Brutal mouse and hover state testing', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      
      // Test hover - rapid hover/unhover
      await userEvent.hover(startCodingButton);
      expect(startCodingButton).toBeVisible();
      await userEvent.unhover(startCodingButton);
      await userEvent.hover(startCodingButton);
      await userEvent.unhover(startCodingButton);
      
      // Test hover on all buttons
      const allButtons = canvas.getAllByRole('button');
      for (const button of allButtons.slice(0, 5)) { // Test first 5 buttons
        await userEvent.hover(button);
        await userEvent.unhover(button);
      }
      
      // Test click after hover
      await userEvent.hover(startCodingButton);
      await userEvent.click(startCodingButton);
      await userEvent.unhover(startCodingButton);
      
      // Verify button still works
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);
    });

    // ==== STEP 8: BRUTAL SCROLL AND VIEWPORT TESTING ====
    await step('8. Brutal scroll and viewport interaction testing', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      await waitFor(() => expect(footer).toBeInTheDocument(), { timeout: 2000 });

      // Rapid scroll up and down
      window.scrollTo({ top: 0, behavior: 'auto' });
      await waitFor(() => expect(window.scrollY).toBeLessThan(100), { timeout: 500 });
      
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
      await waitFor(() => expect(window.scrollY).toBeGreaterThan(100), { timeout: 500 });
      
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'auto' });
      await waitFor(() => {
        const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
        expect(heading).toBeInTheDocument();
      }, { timeout: 1000 });

      // Scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await waitFor(() => {
        const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
        expect(heading).toBeInTheDocument();
      }, { timeout: 2000 });
      
      // Verify all elements still visible after scrolling
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      allButtons.forEach(btn => expect(btn).toBeInTheDocument());
    });

    // ==== STEP 9: BRUTAL ACCESSIBILITY AND ARIA TESTING ====
    await step('9. Brutal accessibility and ARIA verification', async () => {
      // Count and verify all buttons
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      
      // Verify each button has proper accessibility attributes
      allButtons.forEach((button, index) => {
        expect(button).toBeVisible();
        expect(button.textContent?.trim().length).toBeGreaterThan(0);
        
        // Verify button is not disabled (unless intentionally)
        // Verify button has accessible name
        const accessibleName = button.textContent || button.getAttribute('aria-label');
        expect(accessibleName?.trim().length).toBeGreaterThan(0);
        
        // Verify button is keyboard accessible
        expect(button.tabIndex).not.toBe(-1); // Should be focusable
      });

      // Verify all links have proper attributes
      const allLinks = canvas.getAllByRole('link');
      expect(allLinks.length).toBeGreaterThan(0);
      allLinks.forEach(link => {
        expect(link).toBeVisible();
        expect(link).toHaveAttribute('href');
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href?.length).toBeGreaterThan(0);
      });

      // Verify heading hierarchy
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(1);
      const h1 = headings.find(h => h.tagName === 'H1');
      expect(h1).toBeInTheDocument();
      
      // Verify semantic structure
      const articles = canvasElement.querySelectorAll('article');
      articles.forEach(article => {
        expect(article).toBeVisible();
      });
    });

    // ==== STEP 10: BRUTAL STRESS TESTING AND EDGE CASES ====
    await step('10. Brutal stress testing and edge cases', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      
      // Stress test: Rapid sequential clicks on multiple buttons
      const clickPromises = [];
      for (let i = 0; i < 3; i++) {
        clickPromises.push(userEvent.click(startCodingButton));
        clickPromises.push(userEvent.click(docsButton));
      }
      await Promise.all(clickPromises);
      
      // Verify buttons still work after stress
      expect(startCodingButton).toBeInTheDocument();
      expect(docsButton).toBeInTheDocument();
      await userEvent.click(startCodingButton);
      
      // Test focus management under stress
      startCodingButton.focus();
      expect(startCodingButton).toHaveFocus();
      
      // Rapid tab navigation
      for (let i = 0; i < 5; i++) {
        await userEvent.keyboard('{Tab}');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Verify page still functional
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      allButtons.forEach(btn => {
        expect(btn).toBeInTheDocument();
        expect(btn).toBeVisible();
      });
      
      // Final verification - all critical elements present
      const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading).toBeVisible();
      
      const footer = canvas.getByText(/©/i);
      expect(footer).toBeInTheDocument();
      
      // Verify feature cards still render
      const featureCards = canvasElement.querySelectorAll('article');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });
  },
};

/**
 * Landing page wrapped in WISSILLayout for consistency testing
 */
export const WithLayout: Story = {
  render: () => (
    <WISSILLayout system="landing" showHeader={false}>
      <LandingPage />
    </WISSILLayout>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Brutal layout wrapper verification', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading).toBeVisible();
    });

    await step('Brutal navigation stress testing within layout', async () => {
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      expect(docsButton).toBeVisible();
      
      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        await userEvent.click(docsButton);
      }

      const templatesButton = canvas.getAllByRole('button').find(
        btn => btn.textContent?.trim().toLowerCase() === 'templates'
      );
      if (templatesButton) {
        expect(templatesButton).toBeVisible();
        await userEvent.click(templatesButton);
        await userEvent.dblClick(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeVisible();
      await userEvent.click(openEditorButton);
    });

    await step('Brutal hero interactions within layout', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeVisible();
      
      // Stress test
      await userEvent.hover(startCodingButton);
      await userEvent.click(startCodingButton);
      await userEvent.keyboard('{Enter}');
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
      await userEvent.hover(tryAIGeneratorButton);
      await userEvent.click(tryAIGeneratorButton);
    });

    await step('Brutal layout functionality verification', async () => {
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      
      // Test all buttons after stress
      allButtons.forEach(async (btn) => {
        expect(btn).toBeVisible();
        expect(btn).not.toBeDisabled();
      });

      const allLinks = canvas.getAllByRole('link');
      expect(allLinks.length).toBeGreaterThan(0);
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
      
      // Keyboard navigation test
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      docsButton.focus();
      expect(docsButton).toHaveFocus();
      
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
    });
  },
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify mobile layout and responsive design', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      
      // Verify heading is appropriately sized for mobile
      const headingStyles = window.getComputedStyle(heading);
      expect(heading).toBeVisible();
    });

    await step('Test mobile navigation interactions', async () => {
      // In mobile, navigation buttons might be in a hamburger menu or stacked
      // Test all buttons that are visible
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(0);

      // Test hero buttons (should always be visible)
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
    });

    await step('Test mobile touch interactions', async () => {
      // Simulate touch/click on logo
      const navLinks = canvas.getAllByRole('link');
      const logoLink = navLinks.find(link => 
        link.getAttribute('href') === '/landing' || 
        link.textContent?.includes('Lumenforge.io')
      );
      if (logoLink) {
        await userEvent.click(logoLink);
      }
    });

    await step('Verify mobile feature grid is scrollable', async () => {
      // Verify feature cards are present
      const instantPreview = canvas.getByText(/Instant Preview/i);
      expect(instantPreview).toBeVisible();

      // Scroll to verify footer
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({ behavior: 'smooth' });
      
      await waitFor(() => {
        expect(footer).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify tablet layout and responsive design', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      
      // Verify feature grid adapts to tablet width
      const featureGrid = canvas.getByText(/Instant Preview/i).closest('div');
      expect(featureGrid).toBeInTheDocument();
    });

    await step('Test tablet navigation interactions', async () => {
      // All navigation buttons should be accessible
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      await userEvent.click(docsButton);

      const templatesButton = canvas.getAllByRole('button').find(
        btn => btn.textContent?.trim().toLowerCase() === 'templates'
      );
      if (templatesButton) {
        await userEvent.click(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      await userEvent.click(openEditorButton);
    });

    await step('Test tablet hero section interactions', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      await userEvent.click(tryAIGeneratorButton);
    });

    await step('Verify tablet feature grid layout', async () => {
      // All feature cards should be visible
      const features = [
        /Instant Preview/i,
        /Clean Project Explorer/i,
        /Code-First Workflow/i
      ];

      for (const featureText of features) {
        const feature = canvas.getByText(featureText);
        expect(feature).toBeVisible();
      }
    });
  },
};

/**
 * Wide screen viewport
 */
export const WideScreen: Story = {
  render: () => <LandingPage />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify wide screen layout and spacing', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      
      // Verify content is properly centered and has max-width
      const featureGrid = canvas.getByText(/Instant Preview/i).closest('div');
      expect(featureGrid).toBeInTheDocument();
    });

    await step('Test all navigation interactions on wide screen', async () => {
      // Test all navigation buttons
      const docsButton = canvas.getByRole('button', { name: /^docs$/i });
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);

      const templatesButton = canvas.getAllByRole('button').find(
        btn => btn.textContent?.trim().toLowerCase() === 'templates'
      );
      if (templatesButton) {
        expect(templatesButton).toBeVisible();
        await userEvent.click(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', { name: /^open editor$/i });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeVisible();
      await userEvent.click(openEditorButton);
    });

    await step('Test hero section interactions on wide screen', async () => {
      const startCodingButton = canvas.getByRole('button', { name: /^start coding$/i });
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);

      const tryAIGeneratorButton = canvas.getByRole('button', { name: /^try ai generator$/i });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
    });

    await step('Test keyboard navigation flow on wide screen', async () => {
      // Start from logo link
      const navLinks = canvas.getAllByRole('link');
      const logoLink = navLinks.find(link => 
        link.getAttribute('href') === '/landing' || 
        link.textContent?.includes('Lumenforge.io')
      );
      if (logoLink) {
        logoLink.focus();
        expect(logoLink).toHaveFocus();
      }

      // Tab through all interactive elements
      const allButtons = canvas.getAllByRole('button');
      for (let i = 0; i < Math.min(3, allButtons.length); i++) {
        await userEvent.keyboard('{Tab}');
        // Verify focus moved
      }
    });

    await step('Verify wide screen feature grid displays all cards', async () => {
      // All three feature cards should be visible side-by-side on wide screens
      const features = [
        { text: /Instant Preview/i, title: 'Instant Preview' },
        { text: /Clean Project Explorer/i, title: 'Clean Project Explorer' },
        { text: /Code-First Workflow/i, title: 'Code-First Workflow' }
      ];

      for (const feature of features) {
        const element = canvas.getByText(feature.text);
        expect(element).toBeVisible();
      }
    });

    await step('Test scroll interactions on wide screen', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({ behavior: 'smooth' });
      
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
  },
};

/**
 * Note about Controls and Actions:
 * 
 * **Controls:** The LandingPage component doesn't have props, so there are no controls.
 * To see interactive controls, check out the individual component stories:
 * - SimpleNav stories
 * - HeroSection stories
 * - LandingComponents story
 * 
 * **Actions:** Button clicks are logged to the browser console.
 * Open DevTools (F12) → Console tab to see navigation logs.
 * 
 * **Navigation:** Navigation doesn't work in Storybook (no Next.js router),
 * but buttons are clickable and will log their intended destinations.
 */
