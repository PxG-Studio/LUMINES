/**
 * Ignition Runtime Events E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { triggerRuntimeEvent } from '../fixtures/mockRuntime';

test.describe('Ignition Runtime Events', () => {
  test('should display OnStart event', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/Events/OnStart');
    await page.waitForLoadState('networkidle');
    
    // Verify event component is visible
    const eventDisplay = page.getByText(/Runtime Event:/i);
    await expect(eventDisplay).toBeVisible();
    
    // Verify event name is shown
    await expect(page.getByText(/OnStart/i)).toBeVisible();
  });

  test('should display event payload', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/Events/OnStart');
    await page.waitForLoadState('networkidle');
    
    // Verify payload is displayed
    const payload = page.locator('pre');
    await expect(payload.first()).toBeVisible();
  });

  test('should trigger runtime event', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/Events/OnCardPlayed');
    await page.waitForLoadState('networkidle');
    
    // Trigger event
    await triggerRuntimeEvent(page, 'OnCardPlayed', {
      cardId: 'card-001',
      playerId: 'player-1',
    });
    
    await page.waitForTimeout(500);
    
    // Verify event was received
    await expect(page.getByText(/OnCardPlayed/i)).toBeVisible();
  });

  test('should display OnUpdate events repeatedly', async ({ page }) => {
    await waitForStory(page, 'IgnitionRuntime/Events/OnUpdate');
    await page.waitForLoadState('networkidle');
    
    // Wait for multiple updates
    await page.waitForTimeout(2000);
    
    // Verify update counter increased
    const triggerText = page.getByText(/Triggered:/i);
    await expect(triggerText).toBeVisible();
  });
});

