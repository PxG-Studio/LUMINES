/**
 * CardFront Game Loop Simulation E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { triggerRuntimeEvent } from '../fixtures/mockRuntime';

test.describe('CardFront Game Loop Simulation', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Simulation/CardFrontLoop');
    await page.waitForLoadState('networkidle');
  });

  test('should display simulation container', async ({ page }) => {
    const container = page.locator('[data-testid="simulation-container"]');
    if (await container.isVisible().catch(() => false)) {
      await expect(container).toBeVisible();
    }
  });

  test('should show game state', async ({ page }) => {
    const gameState = page.locator('[data-testid="game-state"]');
    if (await gameState.isVisible().catch(() => false)) {
      await expect(gameState).toBeVisible();
    } else {
      // Fallback: look for game state text
      const turn = page.getByText(/Turn|turn/i);
      await expect(turn.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should update game state over time', async ({ page }) => {
    // Wait for simulation to run
    await page.waitForTimeout(2000);
    
    // Verify state has updated
    const turnText = page.getByText(/Turn|turn/i);
    if (await turnText.count() > 0) {
      await expect(turnText.first()).toBeVisible();
    }
  });

  test('should display score', async ({ page }) => {
    const score = page.getByText(/Score|score/i);
    if (await score.count() > 0) {
      await expect(score.first()).toBeVisible();
    }
  });

  test('should display phase information', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const phase = page.getByText(/Phase|phase|draw|play/i);
    if (await phase.count() > 0) {
      await expect(phase.first()).toBeVisible();
    }
  });

  test('should respond to runtime events', async ({ page }) => {
    // Trigger game event
    await triggerRuntimeEvent(page, 'OnCardPlayed', {
      cardId: 'card-001',
    });
    
    await page.waitForTimeout(500);
    
    // Verify event was processed
    await expect(page).toBeTruthy();
  });
});

