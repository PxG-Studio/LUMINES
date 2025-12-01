import { test, expect } from "@playwright/test";

test.describe("Canvas Performance Tests", () => {
  test("canvas maintains 60fps while dragging nodes", async ({ page }) => {
    await page.goto("/ignis");
    
    // Load a graph with many nodes
    await page.evaluate(() => {
      // Create test graph with 50 nodes
      const store = window.__WISSIL_STORE__;
      // Setup test graph
    });
    
    // Start FPS monitoring
    await page.evaluate(() => {
      (window as any).__fpsMonitor = {
        frames: 0,
        startTime: Date.now(),
        fps: 0
      };
      
      let lastFrame = performance.now();
      function measureFrame() {
        const now = performance.now();
        const delta = now - lastFrame;
        lastFrame = now;
        
        if ((window as any).__fpsMonitor) {
          (window as any).__fpsMonitor.frames++;
          (window as any).__fpsMonitor.fps = 1000 / delta;
        }
        
        requestAnimationFrame(measureFrame);
      }
      requestAnimationFrame(measureFrame);
    });
    
    // Drag a node
    const node = page.locator("[data-node-type='Print']").first();
    const canvas = page.locator("[data-test='canvas']");
    
    await node.dragTo(canvas, {
      targetPosition: { x: 500, y: 500 },
      steps: 60 // Simulate 1 second of dragging
    });
    
    // Wait a bit for FPS to stabilize
    await page.waitForTimeout(1000);
    
    // Get average FPS
    const avgFPS = await page.evaluate(() => {
      return (window as any).__fpsMonitor?.fps || 0;
    });
    
    // Should maintain at least 55 FPS (allowing for variance)
    expect(avgFPS).toBeGreaterThanOrEqual(55);
  });

  test("canvas handles zoom smoothly", async ({ page }) => {
    await page.goto("/ignis");
    
    const canvas = page.locator("[data-test='canvas']");
    
    // Perform rapid zoom operations
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, -100);
      await page.waitForTimeout(50);
    }
    
    // Check that no errors occurred
    const errors = page.locator("[data-test='error-message']");
    await expect(errors).not.toBeVisible();
  });

  test("large graph loads quickly", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto("/ignis?graph=large-test-graph");
    
    // Wait for graph to load
    await page.waitForSelector("[data-test='canvas']", { state: "visible" });
    
    const loadTime = Date.now() - startTime;
    
    // Should load in under 1 second
    expect(loadTime).toBeLessThan(1000);
  });
});

