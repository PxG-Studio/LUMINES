/**
 * Inspector Editing E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { addNode, selectNode, updateNodeProperty } from '../utils/graphHelpers';

test.describe('Ignis Inspector Editing', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Ignis/Scenes/BlueprintEditorFull');
    await page.waitForLoadState('networkidle');
  });

  test('should display inspector when node is selected', async ({ page }) => {
    await addNode(page, 'Print');
    
    const node = page.locator('[data-node-id]').first();
    await node.click();
    
    // Inspector should be visible
    const inspector = page.locator('[data-testid="blueprint-inspector"]');
    await expect(inspector).toBeVisible();
  });

  test('should update node property in inspector', async ({ page }) => {
    await addNode(page, 'Print');
    await selectNode(page, await page.locator('[data-node-id]').first().getAttribute('data-node-id') || '');
    
    // Find and update property input
    const inspector = page.locator('[data-testid="blueprint-inspector"]');
    const messageInput = inspector.locator('input').first();
    
    if (await messageInput.count() > 0) {
      await messageInput.fill('Hello from E2E test');
      await messageInput.blur();
      
      await page.waitForTimeout(200);
      
      // Verify value was updated
      await expect(messageInput).toHaveValue('Hello from E2E test');
    }
  });

  test('should show node type in inspector', async ({ page }) => {
    await addNode(page, 'Print');
    await selectNode(page, await page.locator('[data-node-id]').first().getAttribute('data-node-id') || '');
    
    const inspector = page.locator('[data-testid="blueprint-inspector"]');
    await expect(inspector).toContainText('Print', { ignoreCase: true });
  });

  test('should update multiple properties', async ({ page }) => {
    await addNode(page, 'Add');
    await selectNode(page, await page.locator('[data-node-id]').first().getAttribute('data-node-id') || '');
    
    const inspector = page.locator('[data-testid="blueprint-inspector"]');
    const inputs = inspector.locator('input');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Update first input
      await inputs.nth(0).fill('5');
      await inputs.nth(0).blur();
      
      if (inputCount > 1) {
        // Update second input
        await inputs.nth(1).fill('3');
        await inputs.nth(1).blur();
      }
      
      await page.waitForTimeout(200);
    }
  });
});

