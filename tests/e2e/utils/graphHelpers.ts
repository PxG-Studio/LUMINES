/**
 * Graph Helpers
 * 
 * Utilities for interacting with Ignis Blueprint Editor
 */

import type { Page } from '@playwright/test';
import { drag } from './actions';

export async function addNode(page: Page, nodeType: string) {
  // Click on node in palette
  const paletteItem = page.locator(`[data-palette-node="${nodeType}"]`);
  await paletteItem.click();
  
  // Get canvas center
  const canvas = page.locator('[data-testid="blueprint-canvas"]');
  const canvasBox = await canvas.boundingBox();
  
  if (!canvasBox) {
    throw new Error('Canvas not found');
  }
  
  // Click at canvas center to place node
  await page.mouse.click(
    canvasBox.x + canvasBox.width / 2,
    canvasBox.y + canvasBox.height / 2
  );
  
  // Wait for node to appear
  await page.waitForSelector(`[data-node-id]`, { state: 'visible' });
}

export async function connectSockets(
  page: Page,
  fromNodeId: string,
  fromSocketId: string,
  toNodeId: string,
  toSocketId: string
) {
  const fromSocket = page.locator(
    `[data-node-id="${fromNodeId}"] [data-socket-id="${fromSocketId}"][data-socket-direction="output"]`
  );
  const toSocket = page.locator(
    `[data-node-id="${toNodeId}"] [data-socket-id="${toSocketId}"][data-socket-direction="input"]`
  );
  
  await drag(page, fromSocket, toSocket);
  
  // Wait for wire to appear
  await page.waitForTimeout(200);
}

export async function selectNode(page: Page, nodeId: string) {
  const node = page.locator(`[data-node-id="${nodeId}"]`);
  await node.click();
  
  // Wait for selection highlight
  await page.waitForSelector(`[data-node-id="${nodeId}"][data-selected="true"]`, {
    state: 'visible',
    timeout: 1000,
  }).catch(() => {
    // Selection might not use data attribute, continue anyway
  });
}

export async function deleteNode(page: Page, nodeId: string) {
  await selectNode(page, nodeId);
  await page.keyboard.press('Delete');
  
  // Wait for node to disappear
  await page.waitForSelector(`[data-node-id="${nodeId}"]`, { state: 'hidden' });
}

export async function updateNodeProperty(
  page: Page,
  nodeId: string,
  propertyName: string,
  value: string
) {
  await selectNode(page, nodeId);
  
  const input = page.locator(`[data-inspector-prop="${propertyName}"]`);
  await input.fill(value);
  await input.blur();
  
  // Wait for update to propagate
  await page.waitForTimeout(200);
}

export async function getNodePosition(page: Page, nodeId: string) {
  const node = page.locator(`[data-node-id="${nodeId}"]`);
  const box = await node.boundingBox();
  return box ? { x: box.x, y: box.y } : null;
}

export async function moveNode(page: Page, nodeId: string, position: { x: number; y: number }) {
  const node = page.locator(`[data-node-id="${nodeId}"]`);
  const box = await node.boundingBox();
  
  if (!box) {
    throw new Error(`Node ${nodeId} not found`);
  }
  
  // Drag from node center to new position
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(position.x, position.y);
  await page.mouse.up();
  
  await page.waitForTimeout(200);
}

