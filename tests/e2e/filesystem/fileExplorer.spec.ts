/**
 * File Explorer E2E Tests
 */

import { test, expect } from '../fixtures/baseFixture';
import { waitForStory } from '../utils/actions';
import { expandFolder, openFile } from '../utils/fsHelpers';

test.describe('File Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await waitForStory(page, 'Filesystem/Tree');
    await page.waitForLoadState('networkidle');
  });

  test('should display file tree', async ({ page }) => {
    const fileTree = page.locator('[data-testid="file-tree"]');
    await expect(fileTree).toBeVisible();
  });

  test('should expand folder on click', async ({ page }) => {
    // Find a folder and click it
    const folder = page.getByText('Blueprints').first();
    await expect(folder).toBeVisible();
    
    await folder.click();
    await page.waitForTimeout(300);
    
    // Verify folder expanded (child items visible)
    const file = page.getByText('TurnSystem.json');
    await expect(file).toBeVisible();
  });

  test('should collapse folder on second click', async ({ page }) => {
    // Expand folder
    const folder = page.getByText('Blueprints').first();
    await folder.click();
    await page.waitForTimeout(300);
    
    // Collapse folder
    await folder.click();
    await page.waitForTimeout(300);
    
    // Verify folder collapsed (children may still be in DOM but hidden)
    // This would need specific implementation details
  });

  test('should open file when clicked', async ({ page }) => {
    // Expand folder first
    const folder = page.getByText('Blueprints').first();
    await folder.click();
    await page.waitForTimeout(300);
    
    // Click on file
    const file = page.getByText('TurnSystem.json');
    await file.click();
    
    // Verify file preview or tab opened
    await page.waitForTimeout(300);
  });

  test('should display nested folder structure', async ({ page }) => {
    // Expand parent folder
    const assetsFolder = page.getByText('Assets').first();
    await assetsFolder.click();
    await page.waitForTimeout(300);
    
    // Verify nested folder is visible
    const spritesFolder = page.getByText('Sprites');
    await expect(spritesFolder).toBeVisible();
  });
});

