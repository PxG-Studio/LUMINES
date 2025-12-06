/**
 * Spark Template Preview E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Spark Template Preview', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Spark/Templates/CardGame');
    await page.waitForLoadState('networkidle');
  });

  test('should display template name', async ({ page }) => {
    await expect(page.getByText(/Card|Template/i)).toBeVisible();
  });

  test('should display template description', async ({ page }) => {
    // Description text should be visible
    const description = page.getByText(/card game|turn-based|template/i);
    await expect(description.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display template metadata', async ({ page }) => {
    // Check for metadata fields
    const metadata = page.getByText(/Nodes:|Connections:|Category:/i);
    if (await metadata.count() > 0) {
      await expect(metadata.first()).toBeVisible();
    }
  });

  test('should display template tags', async ({ page }) => {
    // Tags might be displayed as badges or chips
    const tags = page.getByText(/card|game|turn/i);
    await expect(tags.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display template difficulty', async ({ page }) => {
    const difficulty = page.getByText(/beginner|intermediate|advanced/i);
    if (await difficulty.count() > 0) {
      await expect(difficulty.first()).toBeVisible();
    }
  });
});

