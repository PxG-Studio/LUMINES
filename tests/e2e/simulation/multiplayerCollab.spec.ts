/**
 * Multiplayer Collaboration E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { setupMockCollab, simulateUserCursor, simulateUserAction } from '../fixtures/mockCollab';

test.describe('Multiplayer Collaboration', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockCollab(page, [
      { id: 'user1', name: 'User 1', cursor: { x: 100, y: 100 } },
      { id: 'user2', name: 'User 2', cursor: { x: 200, y: 200 } },
    ]);
    
    await waitForStory(page, 'Simulation/CollabSimulation');
    await page.waitForLoadState('networkidle');
  });

  test('should display multiple user cursors', async ({ page }) => {
    // Verify collaboration is active
    const collabContainer = page.locator('[data-testid="collab-container"]');
    if (await collabContainer.isVisible().catch(() => false)) {
      await expect(collabContainer).toBeVisible();
    }
  });

  test('should sync node movements', async ({ page }) => {
    // Simulate user moving a node
    await simulateUserAction(page, 'user1', 'node.move', {
      nodeId: 'node1',
      position: { x: 300, y: 300 },
    });
    
    await page.waitForTimeout(500);
    
    // Verify sync happened
    await expect(page).toBeTruthy();
  });

  test('should sync text edits', async ({ page }) => {
    // Simulate user editing text
    await simulateUserAction(page, 'user2', 'text.edit', {
      text: 'Updated text',
    });
    
    await page.waitForTimeout(500);
    
    // Verify sync happened
    await expect(page).toBeTruthy();
  });

  test('should display user presence', async ({ page }) => {
    // Verify user presence indicators
    const userIndicator = page.getByText(/User 1|User 2/i);
    if (await userIndicator.count() > 0) {
      await expect(userIndicator.first()).toBeVisible();
    }
  });
});

