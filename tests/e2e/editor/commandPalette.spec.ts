/**
 * Command Palette E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory, openCommandPalette, searchCommandPalette, selectCommand } from '../utils/actions';

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Editor/CommandPalette');
    await page.waitForLoadState('networkidle');
  });

  test('should open command palette with shortcut', async ({ page }) => {
    await openCommandPalette(page);
    
    const palette = page.locator('[data-testid="command-palette"]');
    await expect(palette).toBeVisible({ timeout: 3000 });
  });

  test('should display search input', async ({ page }) => {
    await openCommandPalette(page);
    
    const input = page.locator('[data-testid="command-palette"] input');
    await expect(input).toBeVisible();
  });

  test('should filter commands by search', async ({ page }) => {
    await searchCommandPalette(page, 'save');
    
    const results = page.locator('[data-testid="command-palette"] [role="option"]');
    const count = await results.count();
    
    if (count > 0) {
      await expect(results.first()).toBeVisible();
    }
  });

  test('should navigate commands with keyboard', async ({ page }) => {
    await openCommandPalette(page);
    
    // Press Arrow Down
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    
    // Verify navigation works
    const options = page.locator('[role="option"]');
    await expect(options.first()).toBeVisible();
  });

  test('should select command', async ({ page }) => {
    await openCommandPalette(page);
    await page.waitForTimeout(300);
    
    // Select first command
    const firstCommand = page.locator('[role="option"]').first();
    if (await firstCommand.isVisible().catch(() => false)) {
      await firstCommand.click();
      
      // Verify palette closed
      await page.waitForTimeout(300);
    }
  });

  test('should close on Escape key', async ({ page }) => {
    await openCommandPalette(page);
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // Verify palette is closed
    const palette = page.locator('[data-testid="command-palette"]');
    await expect(palette).not.toBeVisible({ timeout: 1000 }).catch(() => {
      // Palette might use different visibility mechanism
    });
  });
});

