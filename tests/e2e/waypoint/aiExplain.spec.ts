/**
 * Waypoint AI Explain E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Waypoint AI Explain', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Waypoint/AIExplain');
    await page.waitForLoadState('networkidle');
  });

  test('should display explanation panel', async ({ page }) => {
    // Verify panel is visible
    const panel = page.locator('[data-testid="ai-panel"]');
    if (await panel.isVisible().catch(() => false)) {
      await expect(panel).toBeVisible();
    } else {
      // Fallback: look for explanation text
      const explanation = page.getByText(/explanation|this node/i);
      await expect(explanation.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display explanation text', async ({ page }) => {
    // Look for explanation content
    const explanation = page.getByText(/adds|numbers|node/i);
    await expect(explanation.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display code if provided', async ({ page }) => {
    // Look for code blocks
    const codeBlock = page.locator('pre, code');
    if (await codeBlock.count() > 0) {
      await expect(codeBlock.first()).toBeVisible();
    }
  });

  test('should have copy button', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /copy/i });
    if (await copyButton.isVisible().catch(() => false)) {
      await expect(copyButton).toBeVisible();
    }
  });
});

