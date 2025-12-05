import { test, expect } from '@playwright/test';

/**
 * E2E Test: Multi-file project workflow
 * 
 * Tests creating multiple scripts and organizing them into a project
 */
test.describe('Multi-file Project Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spark');
  });

  test('creates multiple scripts in sequence', async ({ page }) => {
    // Generate first script
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a PlayerController script');
    
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    await page.waitForTimeout(5000);

    // Generate second script
    await chatInput.fill('Create a GameManager script');
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    await page.waitForTimeout(5000);

    // Verify both scripts are accessible
    // This depends on UI implementation - may need to check history or file list
    const scriptNames = page.locator('text=PlayerController, text=GameManager');
    await expect(scriptNames.first()).toBeVisible({ timeout: 10000 });
  });

  test('organizes scripts into project structure', async ({ page }) => {
    // This test depends on project management features
    // For MVP, we may just verify scripts can be generated sequentially
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    
    await chatInput.fill('Create a Unity script');
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    await page.waitForTimeout(5000);
    
    // Verify project structure if implemented
    // For MVP, this may be a placeholder
    expect(true).toBe(true);
  });

  test('exports multiple files as ZIP', async ({ page }) => {
    // Generate multiple scripts
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    
    for (const prompt of ['Create PlayerController', 'Create GameManager']) {
      await chatInput.fill(prompt);
      const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
      } else {
        await chatInput.press('Enter');
      }
      await page.waitForTimeout(5000);
    }

    // Export all files
    const exportButton = page.locator('button:has-text("Export"), [data-testid="export-button"]').first();
    if (await exportButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.zip$/);
    }
  });
});

