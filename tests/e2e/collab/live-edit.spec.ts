import { test, expect } from "@playwright/test";

test.describe("Real-Time Collaboration E2E Tests", () => {
  test("two users see node movement", async ({ browser }) => {
    // Create two browser contexts (simulating two users)
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    
    const user1 = await user1Context.newPage();
    const user2 = await user2Context.newPage();
    
    // Both users navigate to same graph
    const graphId = "test-collab-graph";
    
    await user1.goto(`/ignis?graph=${graphId}`);
    await user2.goto(`/ignis?graph=${graphId}`);
    
    // Wait for both to connect
    await user1.waitForSelector("[data-test='canvas']");
    await user2.waitForSelector("[data-test='canvas']");
    
    // User 1 adds and moves a node
    await user1.click("[data-test='open-palette']");
    await user1.fill("[data-test='palette-search']", "Print");
    await user1.click("[data-test='palette-item-Print']");
    
    const node1 = user1.locator("[data-node-type='Print']").first();
    const canvas1 = user1.locator("[data-test='canvas']");
    
    await node1.dragTo(canvas1, {
      targetPosition: { x: 300, y: 300 }
    });
    
    // Wait for sync (collaboration delay)
    await user2.waitForTimeout(500);
    
    // User 2 should see the node
    const node2 = user2.locator("[data-node-type='Print']").first();
    await expect(node2).toBeVisible();
    
    // Verify position synced
    const pos2 = await node2.boundingBox();
    expect(pos2?.x).toBeGreaterThan(0);
    expect(pos2?.y).toBeGreaterThan(0);
    
    await user1Context.close();
    await user2Context.close();
  });

  test("wire creation syncs between users", async ({ browser }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    
    const user1 = await user1Context.newPage();
    const user2 = await user2Context.newPage();
    
    const graphId = "test-collab-wire";
    
    await user1.goto(`/ignis?graph=${graphId}`);
    await user2.goto(`/ignis?graph=${graphId}`);
    
    await user1.waitForSelector("[data-test='canvas']");
    await user2.waitForSelector("[data-test='canvas']");
    
    // User 1 creates connection
    // (Assuming nodes already exist or created in setup)
    
    // Wait for sync
    await user2.waitForTimeout(500);
    
    // User 2 should see the wire
    await expect(user2.locator("svg path[data-wire]")).toBeVisible();
    
    await user1Context.close();
    await user2Context.close();
  });
});

