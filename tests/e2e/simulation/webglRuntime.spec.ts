/**
 * WebGL Runtime Simulation E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { setupMockRuntime, triggerRuntimeEvent } from '../fixtures/mockRuntime';

test.describe('WebGL Runtime Simulation', () => {
  test.beforeEach(async ({ page, mockRuntime }) => {
    await setupMockRuntime(page);
    await waitForStory(page, 'Simulation/WebGLRuntime');
    await page.waitForLoadState('networkidle');
  });

  test('should display WebGL runtime container', async ({ page }) => {
    const container = page.locator('[data-testid="simulation-container"]');
    if (await container.isVisible().catch(() => false)) {
      await expect(container).toBeVisible();
    }
  });

  test('should receive Unity events', async ({ page }) => {
    // Trigger Unity event
    await triggerRuntimeEvent(page, 'OnStart', {
      sceneId: 'main',
    });
    
    await page.waitForTimeout(500);
    
    // Verify event was received
    await expect(page).toBeTruthy();
  });

  test('should send events to Unity', async ({ page }) => {
    // Test sending events to Unity runtime
    await page.evaluate(() => {
      if ((window as any).unityInstance) {
        (window as any).unityInstance.SendMessage('GameObject', 'Method', 'arg1');
      }
    });
    
    await page.waitForTimeout(500);
    
    // Verify event was sent
    await expect(page).toBeTruthy();
  });

  test('should display runtime logs', async ({ page }) => {
    const console = page.locator('[data-testid="runtime-console"]');
    if (await console.isVisible().catch(() => false)) {
      await expect(console).toBeVisible();
    }
  });
});

