import { test, expect } from '@playwright/test';

/**
 * E2E Test: Error handling and recovery
 * 
 * Tests various error scenarios and recovery mechanisms
 */
test.describe('Error Handling and Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spark');
  });

  test('handles API failures gracefully', async ({ page }) => {
    // Intercept and fail API requests
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Wait for error message
    await expect(
      page.locator('text=/error|failed|try again/i').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('handles invalid inputs', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    
    // Try empty input
    await chatInput.fill('');
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    // Button should be disabled or show validation error
    if (await sendButton.isVisible()) {
      const isDisabled = await sendButton.isDisabled();
      expect(isDisabled).toBe(true);
    }
  });

  test('handles network errors', async ({ page }) => {
    // Simulate network offline
    await page.context().setOffline(true);

    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Should show network error
    await expect(
      page.locator('text=/network|offline|connection/i').first()
    ).toBeVisible({ timeout: 10000 });

    // Restore network
    await page.context().setOffline(false);
  });

  test('recovers from timeout errors', async ({ page }) => {
    // Intercept and delay API requests to simulate timeout
    await page.route('**/api/**', route => {
      setTimeout(() => {
        route.fulfill({
          status: 504,
          body: JSON.stringify({ error: 'Gateway timeout' }),
        });
      }, 100);
    });

    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Should show timeout error or retry option
    await expect(
      page.locator('text=/timeout|retry|try again/i').first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('handles rate limiting', async ({ page }) => {
    // Intercept and return rate limit error
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 429,
        headers: {
          'Retry-After': '60',
        },
        body: JSON.stringify({ error: 'Rate limit exceeded' }),
      });
    });

    const chatInput = page.locator('textarea[placeholder*="prompt"], input[placeholder*="prompt"]').first();
    await chatInput.fill('Create a Unity script');

    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();
    } else {
      await chatInput.press('Enter');
    }

    // Should show rate limit message
    await expect(
      page.locator('text=/rate limit|too many|retry after/i').first()
    ).toBeVisible({ timeout: 10000 });
  });
});

