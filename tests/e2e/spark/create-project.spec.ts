import { test, expect } from "@playwright/test";

test.describe("Spark Template Creation E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/spark");
  });

  test("create project from template", async ({ page }) => {
    // Navigate to new project page
    await page.goto("/spark/new");
    
    // Select template
    await page.click("text=Card Game – Turn-Based Core");
    
    // Fill project name
    await page.fill("[data-test='project-name']", "MyCardGame");
    
    // Click create
    await page.click("text=Create Project");
    
    // Wait for project creation
    await page.waitForURL(/\/spark\/project\/.*/, { timeout: 10000 });
    
    // Verify project structure
    await expect(page.locator("text=Blueprints")).toBeVisible();
    await expect(page.locator("text=MyCardGame")).toBeVisible();
  });

  test("template graph loads correctly", async ({ page }) => {
    await page.goto("/spark/new");
    await page.click("text=Platformer Starter");
    
    // Preview template
    await page.click("[data-test='preview-template']");
    
    // Template graph should be visible
    await expect(page.locator("[data-test='template-graph']")).toBeVisible();
    
    // Graph should have nodes
    const nodes = page.locator("[data-node-type]");
    await expect(nodes.first()).toBeVisible();
  });

  test("template applies to existing project", async ({ page }) => {
    // Navigate to existing project
    await page.goto("/spark/project/test-project");
    
    // Open template browser
    await page.click("[data-test='open-templates']");
    
    // Select template
    await page.click("text=Shooter Starter");
    
    // Apply template
    await page.click("[data-test='apply-template']");
    
    // Confirm dialog
    await page.click("text=Apply");
    
    // Verify template applied
    await expect(page.locator("[data-test='template-applied']")).toBeVisible();
  });
});

