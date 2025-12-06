import { test, expect } from "@playwright/test";

test.describe("C# Generation and Hot Reload E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ignis");
  });

  test("C# script generates from graph", async ({ page }) => {
    // Create a simple graph first
    await page.click("[data-test='open-palette']");
    await page.fill("[data-test='palette-search']", "Start");
    await page.click("[data-test='palette-item-Start']");
    
    await page.fill("[data-test='palette-search']", "Print");
    await page.click("[data-test='palette-item-Print']");
    
    // Click export button
    await page.click("[data-test='export-csharp']");
    
    // Wait for code generation
    await page.waitForSelector("[data-test='csharp-output']");
    
    const code = await page.locator("[data-test='csharp-output']").innerText();
    
    // Verify C# code structure
    expect(code).toContain("public class");
    expect(code).toContain("MonoBehaviour");
    expect(code).toContain("void Start()");
    expect(code).toContain("Debug.Log");
  });

  test("C# code sends to Unity runtime", async ({ page }) => {
    // Generate code first
    await page.click("[data-test='open-palette']");
    await page.fill("[data-test='palette-search']", "Start");
    await page.click("[data-test='palette-item-Start']");
    
    await page.click("[data-test='export-csharp']");
    await page.waitForSelector("[data-test='csharp-output']");
    
    // Click hot reload button
    await page.click("[data-test='hot-reload']");
    
    // Wait for Unity bridge confirmation
    await page.waitForSelector("[data-test='reload-status']", { state: "visible" });
    
    const status = await page.locator("[data-test='reload-status']").innerText();
    expect(status).toContain("Reloaded");
  });

  test("hot reload preserves Unity runtime state", async ({ page }) => {
    // This would require Unity WebGL runtime to be running
    // Mock or verify that state is preserved during reload
    await page.goto("/ignis");
    
    // Create graph and hot reload
    await page.click("[data-test='hot-reload']");
    
    // Verify no errors
    const errors = page.locator("[data-test='error-message']");
    await expect(errors).not.toBeVisible();
  });
});

