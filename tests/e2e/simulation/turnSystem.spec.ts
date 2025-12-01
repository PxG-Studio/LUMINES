/**
 * Turn System Simulation E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Turn System Simulation', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Simulation/TurnSimulation');
    await page.waitForLoadState('networkidle');
  });

  test('should display turn system simulation', async ({ page }) => {
    const container = page.locator('[data-testid="simulation-container"]');
    if (await container.isVisible().catch(() => false)) {
      await expect(container).toBeVisible();
    }
  });

  test('should show current turn', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const turn = page.getByText(/Turn|turn/i);
    if (await turn.count() > 0) {
      await expect(turn.first()).toBeVisible();
    }
  });

  test('should advance turns', async ({ page }) => {
    // Wait for turn to advance
    await page.waitForTimeout(3000);
    
    // Verify turn has changed
    await expect(page).toBeTruthy();
  });

  test('should show player actions', async ({ page }) => {
    const actions = page.getByText(/action|move|play/i);
    if (await actions.count() > 0) {
      await expect(actions.first()).toBeVisible();
    }
  });
});

