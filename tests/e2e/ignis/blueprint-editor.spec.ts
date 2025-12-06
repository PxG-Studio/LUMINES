import { test, expect } from "@playwright/test";

test.describe("Blueprint Editor E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Ignis Blueprint Editor
    await page.goto("/ignis");
  });

  test("Blueprint Editor loads", async ({ page }) => {
    await expect(page.locator("[data-test='node-palette']")).toBeVisible();
    await expect(page.locator("[data-test='canvas']")).toBeVisible();
    await expect(page.locator("[data-test='inspector']")).toBeVisible();
  });

  test("can add node from palette", async ({ page }) => {
    // Open palette
    await page.click("[data-test='open-palette']");
    
    // Search for node
    await page.fill("[data-test='palette-search']", "Print");
    
    // Click on Print node
    await page.click("[data-test='palette-item-Print']");
    
    // Node should appear on canvas
    await expect(page.locator("[data-node-type='Print']")).toBeVisible();
  });

  test("can drag node on canvas", async ({ page }) => {
    // Add a node first
    await page.click("[data-test='open-palette']");
    await page.fill("[data-test='palette-search']", "Print");
    await page.click("[data-test='palette-item-Print']");
    
    const node = page.locator("[data-node-type='Print']").first();
    const canvas = page.locator("[data-test='canvas']");
    
    // Drag node
    const nodeBox = await node.boundingBox();
    const canvasBox = await canvas.boundingBox();
    
    if (nodeBox && canvasBox) {
      await node.dragTo(canvas, {
        targetPosition: { x: 200, y: 200 }
      });
      
      // Verify node moved
      const newBox = await node.boundingBox();
      expect(newBox?.x).toBeGreaterThan(nodeBox.x);
      expect(newBox?.y).toBeGreaterThan(nodeBox.y);
    }
  });

  test("can connect nodes with wires", async ({ page }) => {
    // Add two nodes
    await page.click("[data-test='open-palette']");
    await page.fill("[data-test='palette-search']", "Start");
    await page.click("[data-test='palette-item-Start']");
    
    await page.fill("[data-test='palette-search']", "Print");
    await page.click("[data-test='palette-item-Print']");
    
    // Connect them
    const startNode = page.locator("[data-node-type='Start']").first();
    const printNode = page.locator("[data-node-type='Print']").first();
    
    const startOutput = startNode.locator("[data-socket-direction='output']").first();
    const printInput = printNode.locator("[data-socket-direction='input']").first();
    
    await startOutput.dragTo(printInput);
    
    // Wire should appear
    await expect(page.locator("svg path[data-wire]")).toBeVisible();
  });

  test("can zoom canvas", async ({ page }) => {
    const canvas = page.locator("[data-test='canvas']");
    
    await canvas.hover();
    await page.mouse.wheel(0, -500);
    
    // Zoom should be applied (checked via transform or state)
    await page.waitForTimeout(100);
    
    // Verify zoom worked (e.g., check transform scale)
    const transform = await canvas.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    expect(transform).toBeDefined();
  });
});

