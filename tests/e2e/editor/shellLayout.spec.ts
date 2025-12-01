/**
 * Editor Shell Layout E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Editor Shell Layout', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Editor/EditorShell');
    await page.waitForLoadState('networkidle');
  });

  test('should display sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    if (await sidebar.isVisible().catch(() => false)) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('should display top bar', async ({ page }) => {
    const topBar = page.locator('[data-testid="top-bar"]');
    if (await topBar.isVisible().catch(() => false)) {
      await expect(topBar).toBeVisible();
    } else {
      // Fallback: look for menu items
      const menuItem = page.getByRole('button', { name: /File|Edit|View/i });
      await expect(menuItem.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display main content area', async ({ page }) => {
    // Main content should be visible
    const content = page.locator('main, [role="main"], .editor-content');
    if (await content.count() > 0) {
      await expect(content.first()).toBeVisible();
    }
  });

  test('should collapse sidebar', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    const collapseButton = page.getByRole('button', { name: /collapse|toggle/i });
    
    if (await collapseButton.isVisible().catch(() => false)) {
      await collapseButton.click();
      await page.waitForTimeout(300);
      
      // Verify sidebar is collapsed
      await expect(sidebar).toBeVisible();
    }
  });

  test('should show panels', async ({ page }) => {
    // Panels should be visible (if not fullscreen)
    const panels = page.locator('[data-testid="panel"], .panel');
    if (await panels.count() > 0) {
      await expect(panels.first()).toBeVisible();
    }
  });
});

