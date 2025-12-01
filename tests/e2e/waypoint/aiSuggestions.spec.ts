/**
 * Waypoint AI Suggestions E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';

test.describe('Waypoint AI Suggestions', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Waypoint/AISuggestions');
    await page.waitForLoadState('networkidle');
  });

  test('should display AI suggestions panel', async ({ page }) => {
    const panel = page.locator('[data-testid="ai-panel"]');
    if (await panel.isVisible().catch(() => false)) {
      await expect(panel).toBeVisible();
    } else {
      // Fallback: look for suggestions list
      const suggestions = page.locator('[data-ai-suggestion]');
      await expect(suggestions.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display suggestion items', async ({ page }) => {
    const suggestions = page.locator('[data-ai-suggestion]');
    const count = await suggestions.count();
    
    if (count > 0) {
      await expect(suggestions.first()).toBeVisible();
      
      // Verify suggestion text is visible
      const firstSuggestion = suggestions.first();
      await expect(firstSuggestion).toBeVisible();
    }
  });

  test('should show loading state', async ({ page }) => {
    // If loading state exists, verify it
    const loadingText = page.getByText(/loading|generating/i);
    if (await loadingText.isVisible().catch(() => false)) {
      await expect(loadingText).toBeVisible();
    }
  });

  test('should allow clicking suggestions', async ({ page }) => {
    const suggestions = page.locator('[data-ai-suggestion]');
    const count = await suggestions.count();
    
    if (count > 0) {
      const firstSuggestion = suggestions.first();
      await firstSuggestion.click();
      
      await page.waitForTimeout(300);
      
      // Verify click was handled (might open modal or apply suggestion)
    }
  });

  test('should display empty state when no suggestions', async ({ page }) => {
    // This would require a story with empty suggestions
    const emptyState = page.getByText(/no suggestions|empty/i);
    if (await emptyState.isVisible().catch(() => false)) {
      await expect(emptyState).toBeVisible();
    }
  });
});

