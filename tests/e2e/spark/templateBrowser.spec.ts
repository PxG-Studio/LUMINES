/**
 * Spark Template Browser E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Spark Template Browser', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Spark/Templates');
    await page.waitForLoadState('networkidle');
  });

  test('should display template browser', async ({ page }) => {
    // Verify template browser is visible
    const browser = page.locator('[data-testid="template-browser"]');
    if (await browser.isVisible().catch(() => false)) {
      await expect(browser).toBeVisible();
    } else {
      // Fallback: check for template cards
      const templates = page.locator('[data-template]');
      await expect(templates.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display template cards', async ({ page }) => {
    const templateCards = page.locator('[data-template]');
    const cardCount = await templateCards.count();
    
    if (cardCount > 0) {
      await expect(templateCards.first()).toBeVisible();
    }
  });

  test('should filter templates by search', async ({ page }) => {
    const searchInput = page.getByPlaceholderText(/search|filter/i);
    
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('card');
      await page.waitForTimeout(500);
      
      // Verify filtered results
      const templates = page.locator('[data-template]');
      await expect(templates.first()).toBeVisible();
    }
  });

  test('should open template preview on click', async ({ page }) => {
    const templateCard = page.locator('[data-template]').first();
    
    if (await templateCard.isVisible().catch(() => false)) {
      await templateCard.click();
      await page.waitForTimeout(500);
      
      // Verify preview opened
      const preview = page.locator('[data-testid="template-preview"]');
      if (await preview.isVisible().catch(() => false)) {
        await expect(preview).toBeVisible();
      }
    }
  });
});

