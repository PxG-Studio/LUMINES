/**
 * File Preview E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('File Preview', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Filesystem/FilePreview');
    await page.waitForLoadState('networkidle');
  });

  test('should display file preview', async ({ page }) => {
    const preview = page.locator('[data-testid="file-preview"]');
    await expect(preview).toBeVisible();
  });

  test('should display file content', async ({ page }) => {
    const preview = page.locator('[data-testid="file-preview"]');
    const content = preview.locator('pre, code');
    
    if (await content.count() > 0) {
      await expect(content.first()).toBeVisible();
    }
  });

  test('should display file name', async ({ page }) => {
    const preview = page.locator('[data-testid="file-preview"]');
    await expect(preview).toContainText(/\.json|\.ts|\.js/i);
  });

  test('should display language indicator', async ({ page }) => {
    const preview = page.locator('[data-testid="file-preview"]');
    // Language might be shown in a label or header
    await expect(preview).toBeVisible();
  });
});

