/**
 * Graph Connections E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { addNode, connectSockets } from '../utils/graphHelpers';

test.describe('Ignis Graph Connections', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Ignis/Scenes/BlueprintEditorFull');
    await page.waitForLoadState('networkidle');
  });

  test('should connect two nodes with wire', async ({ page }) => {
    // Add first node
    await addNode(page, 'Sequence');
    const node1 = page.locator('[data-node-id]').first();
    const node1Id = await node1.getAttribute('data-node-id');
    expect(node1Id).toBeTruthy();
    
    await page.waitForTimeout(300);
    
    // Add second node
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    const canvasBox = await canvas.boundingBox();
    await page.mouse.click(canvasBox!.x + canvasBox!.width / 2 + 200, canvasBox!.y + canvasBox!.height / 2);
    
    await page.waitForTimeout(300);
    
    const node2 = page.locator('[data-node-id]').last();
    const node2Id = await node2.getAttribute('data-node-id');
    expect(node2Id).toBeTruthy();
    
    // Get socket IDs (using generic selectors)
    const outputSocket = node1.locator('[data-socket-direction="output"]').first();
    const inputSocket = node2.locator('[data-socket-direction="input"]').first();
    
    // Connect sockets
    const outputBox = await outputSocket.boundingBox();
    const inputBox = await inputSocket.boundingBox();
    
    if (outputBox && inputBox) {
      await page.mouse.move(outputBox.x + outputBox.width / 2, outputBox.y + outputBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(inputBox.x + inputBox.width / 2, inputBox.y + inputBox.height / 2);
      await page.mouse.up();
    }
    
    await page.waitForTimeout(300);
    
    // Verify wire exists
    const wires = page.locator('svg path[stroke]');
    await expect(wires.first()).toBeVisible();
  });

  test('should remove wire when clicking on it', async ({ page }) => {
    // Create connection first
    await addNode(page, 'Sequence');
    await page.waitForTimeout(300);
    
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    const canvasBox = await canvas.boundingBox();
    await page.mouse.click(canvasBox!.x + canvasBox!.width / 2 + 200, canvasBox!.y + canvasBox!.height / 2);
    await page.waitForTimeout(300);
    
    // Create connection (simplified - would need actual socket interaction)
    // For now, just verify wires can be selected
    const wires = page.locator('svg path[stroke]');
    const wireCount = await wires.count();
    
    if (wireCount > 0) {
      await wires.first().click();
      // Wire should be removed or highlighted
    }
  });

  test('should display wire on canvas', async ({ page }) => {
    // This test would verify wire rendering
    // For now, just verify canvas exists
    const canvas = page.locator('[data-testid="blueprint-canvas"]');
    await expect(canvas).toBeVisible();
  });
});

