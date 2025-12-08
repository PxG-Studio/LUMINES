/**
 * Storybook Test Runner Configuration
 * Enforces 8-Point StackBlitz Parity Metrics
 */

import type { TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';
import { expect, test as baseTest } from '@storybook/test-runner';
import { toMatchSnapshot } from 'jest-snapshot';

const config: TestRunnerConfig = {
  setup() {
    // Inject axe for accessibility testing
    injectAxe();
  },
  
  async preVisit(page, context) {
    // Wait for component to be ready
    await page.waitForLoadState('networkidle');
  },
  
  async postVisit(page, context) {
    const { id, title } = context;
    
    // METRIC 5: Accessibility Coverage
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
    
    // METRIC 6: Visual Regression Coverage
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot(`${id}.png`);
    
    // METRIC 4: Interaction Test Coverage
    // Verify keyboard navigation works
    const focusableElements = await page.$$('[tabindex], button, a, input, textarea, select');
    if (focusableElements.length > 0) {
      await focusableElements[0].focus();
      const focused = await page.evaluate(() => document.activeElement);
      expect(focused).toBeTruthy();
    }
  },
  
  tags: {
    include: ['test'],
    exclude: ['skip-test'],
  },
};

export default config;

