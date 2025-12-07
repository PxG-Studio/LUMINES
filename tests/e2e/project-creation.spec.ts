/**
 * E2E Tests: Project Creation Flow
 * Critical path: Create project, add components, deploy
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

test.describe('Project Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpassword';

    await page.goto(BASE_URL);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should create a new project', async ({ page }) => {
    // Navigate to projects page
    await page.click('text=Projects, [href*="projects"]');
    await expect(page).toHaveURL(/.*projects/);

    // Click create project button
    await page.click('button:has-text("New Project"), [data-testid="create-project-button"]');

    // Fill project form
    const projectName = `Test Project ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name"]', projectName);
    await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'Test project description');

    // Submit form
    await page.click('button[type="submit"], button:has-text("Create")');

    // Should see project in list
    await expect(page.locator(`text=${projectName}`)).toBeVisible({ timeout: 10000 });
  });

  test('should add component to project', async ({ page }) => {
    // Navigate to existing project or create one
    await page.click('text=Projects, [href*="projects"]');
    await expect(page).toHaveURL(/.*projects/);

    // Click on first project or create new one
    const projectLink = page.locator('[data-testid="project-item"], .project-item').first();
    if (await projectLink.count() > 0) {
      await projectLink.click();
    } else {
      // Create new project first
      await page.click('button:has-text("New Project")');
      await page.fill('input[name="name"]', `Test Project ${Date.now()}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }

    // Add component
    await page.click('button:has-text("Add Component"), [data-testid="add-component-button"]');
    await page.fill('input[name="componentName"]', 'TestComponent');
    await page.selectOption('select[name="type"]', 'react'); // or appropriate type
    await page.click('button[type="submit"], button:has-text("Add")');

    // Should see component in list
    await expect(page.locator('text=TestComponent')).toBeVisible({ timeout: 5000 });
  });

  test('should deploy project', async ({ page }) => {
    // Navigate to project
    await page.click('text=Projects, [href*="projects"]');
    await expect(page).toHaveURL(/.*projects/);

    const projectLink = page.locator('[data-testid="project-item"], .project-item').first();
    if (await projectLink.count() > 0) {
      await projectLink.click();
    } else {
      // Create new project first
      await page.click('button:has-text("New Project")');
      await page.fill('input[name="name"]', `Test Project ${Date.now()}`);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }

    // Click deploy button
    await page.click('button:has-text("Deploy"), [data-testid="deploy-button"]');

    // Should see deployment status
    await expect(page.locator('text=Deploying, text=Deployed, [data-testid="deployment-status"]')).toBeVisible({ timeout: 30000 });
  });

  test('should validate project form', async ({ page }) => {
    await page.click('text=Projects, [href*="projects"]');
    await page.click('button:has-text("New Project")');

    // Try to submit without required fields
    await page.click('button[type="submit"], button:has-text("Create")');

    // Should show validation errors
    await expect(page.locator('.error, [role="alert"], text=/required/i')).toBeVisible();
  });
});


