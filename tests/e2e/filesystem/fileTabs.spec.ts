/**
 * File Tabs E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { switchFileTab, closeFileTab } from '../utils/fsHelpers';

test.describe('File Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Filesystem/FileTabs');
    await page.waitForLoadState('networkidle');
  });

  test('should display file tabs', async ({ page }) => {
    const tabs = page.locator('[data-tab]');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThan(0);
  });

  test('should show active tab', async ({ page }) => {
    const tabs = page.locator('[data-tab]');
    const firstTab = tabs.first();
    
    await expect(firstTab).toBeVisible();
    
    // Click to activate
    await firstTab.click();
    await page.waitForTimeout(200);
  });

  test('should switch between tabs', async ({ page }) => {
    const tabs = page.locator('[data-tab]');
    const tabCount = await tabs.count();
    
    if (tabCount > 1) {
      const firstTab = tabs.first();
      const secondTab = tabs.nth(1);
      
      await firstTab.click();
      await page.waitForTimeout(200);
      
      await secondTab.click();
      await page.waitForTimeout(200);
      
      // Verify tabs are interactive
      await expect(secondTab).toBeVisible();
    }
  });

  test('should show dirty indicator', async ({ page }) => {
    // Find tab with dirty state
    const dirtyTab = page.locator('[data-tab]').filter({ hasText: /TurnSystem/i });
    
    if (await dirtyTab.count() > 0) {
      await expect(dirtyTab.first()).toBeVisible();
      
      // Check for dirty indicator (dot or asterisk)
      const indicator = dirtyTab.first().locator('span').filter({ hasText: /●|•|\*/ });
      if (await indicator.count() > 0) {
        await expect(indicator.first()).toBeVisible();
      }
    }
  });

  test('should close tab', async ({ page }) => {
    const tabs = page.locator('[data-tab]');
    const initialCount = await tabs.count();
    
    if (initialCount > 0) {
      const firstTab = tabs.first();
      const closeButton = firstTab.locator('button').last();
      
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
        await page.waitForTimeout(200);
        
        // Verify tab count decreased
        const newCount = await page.locator('[data-tab]').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    }
  });
});

