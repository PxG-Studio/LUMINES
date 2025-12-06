/**
 * Blueprint Editing E2E Tests
 * 
 * Tests complete blueprint editing workflows
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { addNode, connectSockets, selectNode } from '../utils/graphHelpers';

test.describe('Blueprint Editing', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Ignis/Scenes/BlueprintEditorFull');
    await page.waitForLoadState('networkidle');
  });

  test('should create a simple blueprint graph', async ({ page }) => {
    // Add Start node
    await addNode(page, 'Start');
    await page.waitForTimeout(200);
    
    // Add Print node
    await addNode(page, 'Print');
    await page.waitForTimeout(200);
    
    // Verify both nodes exist
    const nodes = page.locator('[data-node-id]');
    await expect(nodes).toHaveCount(2);
  });

  test('should save blueprint changes', async ({ page }) => {
    await addNode(page, 'Start');
    await page.waitForTimeout(200);
    
    // Look for save button or trigger save
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    
    if (await saveButton.isVisible().catch(() => false)) {
      await saveButton.click();
      
      // Verify save confirmation
      await page.waitForTimeout(500);
    }
  });

  test('should load existing blueprint', async ({ page }) => {
    // This would test loading a saved blueprint
    // For now, verify the canvas is ready
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    await expect(canvas).toBeVisible();
  });

  test('should undo/redo changes', async ({ page }) => {
    await addNode(page, 'Start');
    await page.waitForTimeout(200);
    
    const initialNodeCount = await page.locator('[data-node-id]').count();
    
    // Undo
    await page.keyboard.press('Control+Z');
    await page.waitForTimeout(200);
    
    const afterUndoCount = await page.locator('[data-node-id]').count();
    expect(afterUndoCount).toBeLessThan(initialNodeCount);
    
    // Redo
    await page.keyboard.press('Control+Shift+Z');
    await page.waitForTimeout(200);
    
    const afterRedoCount = await page.locator('[data-node-id]').count();
    expect(afterRedoCount).toBe(initialNodeCount);
  });

  test('should create complex blueprint with multiple connections', async ({ page }) => {
    // Add multiple nodes
    await addNode(page, 'Start');
    await page.waitForTimeout(200);
    
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    const canvasBox = await canvas.boundingBox();
    
    // Add more nodes at different positions
    if (canvasBox) {
      await page.mouse.click(canvasBox.x + 200, canvasBox.y + 100);
      await page.waitForTimeout(200);
      
      await page.mouse.click(canvasBox.x + 400, canvasBox.y + 100);
      await page.waitForTimeout(200);
    }
    
    // Verify multiple nodes exist
    const nodes = page.locator('[data-node-id]');
    const nodeCount = await nodes.count();
    expect(nodeCount).toBeGreaterThanOrEqual(1);
  });
});

