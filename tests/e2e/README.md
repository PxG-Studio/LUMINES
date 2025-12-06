# E2E Test Suite
## End-to-End Testing for LUMINES/WIS2L

**Version:** 1.0.0  
**Last Updated:** December 6, 2025

---

## Overview

This directory contains end-to-end (E2E) tests for the LUMINES/WIS2L application using Playwright.

### Test Coverage

- **Authentication Flow** (`auth-flow.spec.ts`)
  - Login/logout
  - Session management
  - Token refresh
  - Protected routes

- **Project Creation** (`project-creation.spec.ts`)
  - Create project
  - Add components
  - Deploy project
  - Form validation

- **API Integration** (`api-integration.spec.ts`)
  - Health endpoints
  - Authentication
  - Error handling
  - Rate limiting

- **Deployment Flow** (`deployment-flow.spec.ts`)
  - Create deployment
  - Monitor status
  - Rollback
  - Error handling

- **Critical Flows** (`critical-flows.spec.ts`)
  - End-to-end user journeys
  - Integration scenarios

- **API Endpoints** (`api-endpoints.spec.ts`)
  - All API endpoints
  - Request/response validation

---

## Prerequisites

- Node.js 18+
- npm 9+
- Playwright browsers installed

---

## Setup

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### Environment Variables

Create `.env.test` file:

```env
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword
DATABASE_URL=postgresql://user:password@localhost:5432/lumines_test
```

---

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/auth-flow.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

---

## Test Structure

```
tests/e2e/
├── auth-flow.spec.ts          # Authentication tests
├── project-creation.spec.ts   # Project creation tests
├── api-integration.spec.ts    # API integration tests
├── deployment-flow.spec.ts    # Deployment tests
├── critical-flows.spec.ts     # Critical path tests
├── api-endpoints.spec.ts      # API endpoint tests
├── playwright.config.ts       # Playwright configuration
└── README.md                  # This file
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Welcome');
  });
});
```

### Best Practices

1. **Use descriptive test names**
   ```typescript
   test('should login successfully with valid credentials', async ({ page }) => {
     // ...
   });
   ```

2. **Use data-testid attributes**
   ```typescript
   await page.click('[data-testid="login-button"]');
   ```

3. **Wait for elements**
   ```typescript
   await expect(page.locator('.loading')).toBeHidden();
   ```

4. **Use fixtures for common setup**
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/login');
   });
   ```

5. **Clean up after tests**
   ```typescript
   test.afterEach(async ({ page }) => {
     // Cleanup code
   });
   ```

---

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop
- Pull requests
- Manual workflow dispatch

### Test Reports

Test reports are generated in:
- `playwright-report/` - HTML report
- `test-results/` - Screenshots and videos

---

## Troubleshooting

### Tests Failing Locally

1. **Check if server is running:**
   ```bash
   npm run dev
   ```

2. **Check environment variables:**
   ```bash
   cat .env.test
   ```

3. **Check browser installation:**
   ```bash
   npx playwright install --with-deps
   ```

### Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify server is responding

### Flaky Tests

- Add explicit waits
- Use `waitForSelector` instead of `waitForTimeout`
- Check for race conditions

---

## Maintenance

### Regular Tasks

- **Weekly:** Review test results, fix flaky tests
- **Monthly:** Update test coverage, add new scenarios
- **Quarterly:** Review and optimize test suite

### Adding New Tests

1. Create new test file in `tests/e2e/`
2. Follow naming convention: `*.spec.ts`
3. Add to appropriate test suite
4. Update this README

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025

