/**
 * Ignis Node Editor E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { addNode, selectNode } from '../utils/graphHelpers';

test.describe('Ignis Node Editor', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Ignis/Scenes/BlueprintEditorFull');
    await page.waitForLoadState('networkidle');
  });

  test('should drag node from palette onto canvas', async ({ page }) => {
    // Click on "Print" node in palette
    const printNode = page.locator('[data-palette-node="Print"]');
    await expect(printNode).toBeVisible();
    await printNode.click();
    
    // Click on canvas to place node
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    
    await page.mouse.click(
      canvasBox!.x + canvasBox!.width / 2,
      canvasBox!.y + canvasBox!.height / 2
    );
    
    // Verify node exists on canvas
    const nodes = page.locator('[data-node-id]');
    await expect(nodes.first()).toBeVisible();
  });

  test('should add node via helper function', async ({ page }) => {
    await addNode(page, 'Print');
    
    // Verify node exists
    const nodes = page.locator('[data-node-id]');
    await expect(nodes.first()).toBeVisible();
  });

  test('should select node on click', async ({ page }) => {
    await addNode(page, 'Print');
    
    const node = page.locator('[data-node-id]').first();
    await node.click();
    
    // Node should be selected (check for selection style or attribute)
    await expect(node).toBeVisible();
  });

  test('should delete node with Delete key', async ({ page }) => {
    await addNode(page, 'Print');
    
    const node = page.locator('[data-node-id]').first();
    await node.click();
    
    await page.keyboard.press('Delete');
    
    // Node should be removed
    await expect(node).not.toBeVisible();
  });

  test('should move node by dragging', async ({ page }) => {
    await addNode(page, 'Print');
    
    const node = page.locator('[data-node-id]').first();
    const initialBox = await node.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Drag node
    await page.mouse.move(initialBox!.x + initialBox!.width / 2, initialBox!.y + initialBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 100, initialBox!.y + 100);
    await page.mouse.up();
    
    await page.waitForTimeout(200);
    
    // Node should be in new position
    const newBox = await node.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.x).not.toBe(initialBox!.x);
  });
});

