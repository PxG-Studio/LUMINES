/**
 * Common Actions
 * 
 * Reusable action helpers for E2E tests
 */

import { Page, Locator } from '@playwright/test';
import type { Page as PageType } from '@playwright/test';

export async function drag(
  page: Page,
  from: Locator | string,
  to: Locator | string,
  options?: { delay?: number }
) {
  const fromLocator = typeof from === 'string' ? page.locator(from) : from;
  const toLocator = typeof to === 'string' ? page.locator(to) : to;
  
  const fromBox = await fromLocator.boundingBox();
  const toBox = await toLocator.boundingBox();
  
  if (!fromBox || !toBox) {
    throw new Error('Cannot drag: element not found or not visible');
  }
  
  await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2);
  await page.mouse.down();
  
  if (options?.delay) {
    await page.waitForTimeout(options.delay);
  }
  
  await page.mouse.move(toBox.x + toBox.width / 2, toBox.y + toBox.height / 2);
  await page.mouse.up();
}

export async function clickMenu(page: Page, label: string) {
  const menuItem = page.getByRole('button', { name: label });
  await menuItem.click();
}

export async function waitForStory(page: Page, storyTitle: string) {
  // Navigate to Storybook story
  const storyPath = storyTitle.split('/').join('-').toLowerCase().replace(/\s+/g, '-');
  await page.goto(`http://localhost:6006/?path=/story/${storyPath}`);
  await page.waitForLoadState('networkidle');
}

export async function openCommandPalette(page: Page) {
  // Press Ctrl+K (or Cmd+K on Mac)
  await page.keyboard.press('Control+K');
  await page.waitForSelector('[data-testid="command-palette"]', { state: 'visible' });
}

export async function searchCommandPalette(page: Page, query: string) {
  await openCommandPalette(page);
  await page.fill('[data-testid="command-palette"] input', query);
  await page.waitForTimeout(300); // Wait for search results
}

export async function selectCommand(page: Page, commandLabel: string) {
  const command = page.getByRole('option', { name: commandLabel });
  await command.click();
}

export async function waitForAnimation(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.waitForTimeout(100); // Wait for animations to complete
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `tests/e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

