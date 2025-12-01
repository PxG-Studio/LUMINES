/**
 * Filesystem Helpers
 * 
 * Utilities for interacting with WissilFS
 */

import type { Page } from '@playwright/test';

export async function openFile(page: Page, filePath: string) {
  // Navigate file tree
  const parts = filePath.split('/').filter(Boolean);
  
  for (const part of parts.slice(0, -1)) {
    const folder = page.locator(`[data-file-tree-item="${part}"]`);
    await folder.click();
    await page.waitForTimeout(100);
  }
  
  // Click on file
  const fileName = parts[parts.length - 1];
  const file = page.locator(`[data-file-tree-item="${fileName}"]`);
  await file.click();
  
  // Wait for file to open in preview
  await page.waitForSelector('[data-testid="file-preview"]', { state: 'visible' });
}

export async function closeFileTab(page: Page, fileName: string) {
  const tab = page.locator(`[data-tab="${fileName}"]`);
  const closeButton = tab.locator('button[aria-label*="close"]');
  await closeButton.click();
  
  // Wait for tab to disappear
  await page.waitForSelector(`[data-tab="${fileName}"]`, { state: 'hidden' });
}

export async function switchFileTab(page: Page, fileName: string) {
  const tab = page.locator(`[data-tab="${fileName}"]`);
  await tab.click();
  
  // Wait for file content to load
  await page.waitForTimeout(200);
}

export async function expandFolder(page: Page, folderName: string) {
  const folder = page.locator(`[data-file-tree-item="${folderName}"]`);
  await folder.click();
  await page.waitForTimeout(200);
}

export async function createNewFile(page: Page, fileName: string, folderPath?: string) {
  // Right-click on folder or root
  const target = folderPath
    ? page.locator(`[data-file-tree-item="${folderPath}"]`)
    : page.locator('[data-testid="file-tree"]');
  
  await target.click({ button: 'right' });
  
  // Click "New File" in context menu
  await page.getByText('New File').click();
  
  // Enter file name
  await page.keyboard.type(fileName);
  await page.keyboard.press('Enter');
  
  await page.waitForTimeout(200);
}

export async function renameFile(page: Page, oldName: string, newName: string) {
  const file = page.locator(`[data-file-tree-item="${oldName}"]`);
  
  // Right-click and select rename
  await file.click({ button: 'right' });
  await page.getByText('Rename').click();
  
  // Edit name
  await page.keyboard.selectAll();
  await page.keyboard.type(newName);
  await page.keyboard.press('Enter');
  
  await page.waitForTimeout(200);
}

export async function deleteFile(page: Page, fileName: string) {
  const file = page.locator(`[data-file-tree-item="${fileName}"]`);
  
  await file.click({ button: 'right' });
  await page.getByText('Delete').click();
  
  // Confirm deletion
  await page.getByRole('button', { name: /confirm|delete/i }).click();
  
  await page.waitForTimeout(200);
}

