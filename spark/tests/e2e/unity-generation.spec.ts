import { test, expect } from '@playwright/test';

/**
 * E2E Test: User generates Unity script (full flow)
 * 
 * Tests the complete workflow:
 * 1. User navigates to SPARK
 * 2. User enters a prompt
 * 3. Code is generated
 * 4. Code appears in preview
 * 5. User can export the code
 */
test.describe('Unity Script Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spark');
  });

  test('generates Unity script from prompt', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('text=SPARK')).toBeVisible();

    // Find the chat input
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await expect(chatInput).toBeVisible();

    // Enter a prompt
    await chatInput.fill('Create a Unity PlayerController script with WASD movement');

    // Submit the prompt (look for send button or Enter key)
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for generation to complete
    // Look for loading indicator to disappear and code to appear
    await page.waitForSelector('text=Generating', { state: 'hidden', timeout: 30000 }).catch(() => {});
    
    // Wait for code preview to appear
    await expect(
      page.locator('text=class PlayerController, text=MonoBehaviour, [data-testid="preview-panel"]').first()
    ).toBeVisible({ timeout: 30000 });

    // Verify code contains expected elements
    const previewContent = await page.locator('[data-testid="preview-panel"], .monaco-editor').first().textContent();
    expect(previewContent).toContain('class');
    expect(previewContent).toContain('MonoBehaviour');
  });

  test('displays script name in preview', async ({ page }) => {
    await page.goto('/spark');
    
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script called TestScript');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for script name to appear
    await expect(
      page.locator('text=TestScript, [data-testid="script-name"]').first()
    ).toBeVisible({ timeout: 30000 });
  });

  test('allows exporting generated code', async ({ page }) => {
    await page.goto('/spark');
    
    // Generate code first
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a simple Unity script');
    
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for code to be generated
    await page.waitForTimeout(5000);

    // Find and click export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), [data-testid="export-button"]').first();
    await expect(exportButton).toBeVisible({ timeout: 30000 });
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('validates generated code syntax', async ({ page }) => {
    await page.goto('/spark');
    
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity PlayerController');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for validation to complete
    await page.waitForTimeout(5000);

    // Check for validation indicators (no error messages)
    const errorMessages = page.locator('text=/error|invalid|syntax/i');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });
});

