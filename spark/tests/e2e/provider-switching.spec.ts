import { test, expect } from '@playwright/test';

/**
 * E2E Test: Provider switching (Claude ↔ OpenAI)
 * 
 * Tests switching between AI providers and model selection
 */
test.describe('Provider Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spark');
  });

  test('switches from Claude to OpenAI', async ({ page }) => {
    // Find provider selector
    const providerSelector = page.locator('select[name="provider"], [data-testid="provider-select"]').first();
    
    if (await providerSelector.isVisible()) {
      // Select OpenAI
      await providerSelector.selectOption('openai');
      
      // Verify selection
      const selectedValue = await providerSelector.inputValue();
      expect(selectedValue).toBe('openai');
    } else {
      // Provider selector may not be visible in MVP
      // This test may need to be updated based on actual UI
      test.skip();
    }
  });

  test('switches from OpenAI to Claude', async ({ page }) => {
    const providerSelector = page.locator('select[name="provider"], [data-testid="provider-select"]').first();
    
    if (await providerSelector.isVisible()) {
      // Select Claude
      await providerSelector.selectOption('claude');
      
      // Verify selection
      const selectedValue = await providerSelector.inputValue();
      expect(selectedValue).toBe('claude');
    } else {
      test.skip();
    }
  });

  test('selects different models', async ({ page }) => {
    // Find model selector
    const modelSelector = page.locator('select[name="model"], [data-testid="model-select"]').first();
    
    if (await modelSelector.isVisible()) {
      // Get available models
      const options = await modelSelector.locator('option').allTextContents();
      expect(options.length).toBeGreaterThan(0);
      
      // Select a model
      await modelSelector.selectOption({ index: 1 });
      
      // Verify selection persisted
      const selectedValue = await modelSelector.inputValue();
      expect(selectedValue).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('generates code with selected provider', async ({ page }) => {
    // Select provider if selector exists
    const providerSelector = page.locator('select[name="provider"], [data-testid="provider-select"]').first();
    if (await providerSelector.isVisible()) {
      await providerSelector.selectOption('claude');
    }

    // Generate code
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for generation
    await page.waitForTimeout(5000);

    // Verify code was generated (regardless of provider)
    const previewContent = page.locator('[data-testid="preview-panel"], .monaco-editor').first();
    await expect(previewContent).toBeVisible({ timeout: 30000 });
  });

  test('handles provider-specific errors', async ({ page }) => {
    // Select a provider
    const providerSelector = page.locator('select[name="provider"], [data-testid="provider-select"]').first();
    if (await providerSelector.isVisible()) {
      await providerSelector.selectOption('openai');
    }

    // Intercept API calls for selected provider
    await page.route('**/api/**', route => {
      if (route.request().url().includes('openai')) {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Invalid API key' }),
        });
      } else {
        route.continue();
      }
    });

    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Should show provider-specific error
    await expect(
      page.locator('text=/api key|authentication|invalid/i').first()
    ).toBeVisible({ timeout: 10000 });
  });
});

