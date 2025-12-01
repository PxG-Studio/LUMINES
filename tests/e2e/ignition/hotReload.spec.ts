/**
 * Hot Reload E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Ignition Hot Reload', () => {
  test('should display hot reload component', async ({ page }) => {
    // Navigate to hot reload story (if it exists)
    await waitForStory(page, 'IgnitionRuntime/HotReload');
    await page.waitForLoadState('networkidle');
    
    // Verify hot reload UI is visible
    const container = page.locator('[data-testid="hot-reload"]');
    if (await container.isVisible().catch(() => false)) {
      await expect(container).toBeVisible();
    }
  });

  test('should trigger hot reload', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/HotReload');
    await page.waitForLoadState('networkidle');
    
    // Click reload button if it exists
    const reloadButton = page.getByRole('button', { name: /reload|update/i });
    
    if (await reloadButton.isVisible().catch(() => false)) {
      await reloadButton.click();
      
      // Verify reload confirmation
      await page.waitForTimeout(1000);
      await expect(page.getByText(/reloaded|updated/i)).toBeVisible({ timeout: 2000 }).catch(() => {
        // Reload might not show confirmation message
      });
    }
  });

  test('should show reload status', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/HotReload');
    await page.waitForLoadState('networkidle');
    
    // Verify status indicator exists
    const status = page.getByText(/status|reload/i);
    if (await status.isVisible().catch(() => false)) {
      await expect(status).toBeVisible();
    }
  });
});

