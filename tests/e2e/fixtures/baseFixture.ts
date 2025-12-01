/**
 * Base Playwright Fixture
 * 
 * Provides base setup for all E2E tests
 */

import { test as base } from '@playwright/test';
import path from 'path';

export const test = base.extend({
  // Custom page fixture with Storybook setup
  page: async ({ page, baseURL }, use) => {
    // Navigate to Storybook
    await page.goto('http://localhost:6006');
    
    // Set viewport to IDE size
    await page.setViewportSize({ width: 1600, height: 900 });
    
    // Mock localStorage
    await page.addInitScript(() => {
      // Mock WISSIL localStorage
      if (!window.localStorage.getItem('wissil-config')) {
        window.localStorage.setItem('wissil-config', JSON.stringify({
          theme: 'dark',
          sidebarVisible: true,
        }));
      }
    });
    
    // Mock file system
    await page.addInitScript(() => {
      (window as any).WISSIL = {
        fs: {
          readFile: async (path: string) => {
            return JSON.stringify({ content: 'mock file content' });
          },
          writeFile: async (path: string, content: string) => {
            return true;
          },
          readDirectory: async (path: string) => {
            return ['file1.json', 'file2.json'];
          },
        },
      };
    });
    
    await use(page);
  },
  
  // Mock runtime fixture
  mockRuntime: async ({ page }, use) => {
    await page.addInitScript(() => {
      (window as any).WISSIL = {
        ...(window as any).WISSIL,
        runtime: {
          sendEvent: (event: string, payload: any) => {
            console.log('[Mock Runtime]', event, payload);
          },
          onEvent: (callback: Function) => {
            // Mock event listener
          },
        },
      };
    });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';

