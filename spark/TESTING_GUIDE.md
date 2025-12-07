# SPARK Testing Guide

This document explains how to test the SPARK application.

## Test Setup

SPARK uses Vitest as its testing framework. Tests are located in the `__tests__` directory.

### Running Tests

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Test Categories

### 1. Claude API Integration Tests

Located in `__tests__/claude-integration.test.ts`

These tests verify:
- Claude API connectivity
- Script generation functionality
- Error handling
- Script name extraction

**Note:** These tests require a valid `ANTHROPIC_API_KEY` in `.env.local`

### 2. Export System Tests

Located in `__tests__/export-system.test.ts`

Tests for:
- README generation
- Assembly definition creation
- Package manifest generation
- Export template configurations

### 3. Unity C# Validator Tests

Located in `__tests__/unity-validator.test.ts`

Validates:
- Unity script structure
- Required using statements
- Class declarations
- Brace matching
- Namespace support

## Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Testing Server Actions

```typescript
import { generateUnityScript } from '../app/spark/actions/generate';

it('should generate Unity script', async () => {
  const result = await generateUnityScript('Create a player controller');

  expect(result.success).toBe(true);
  expect(result.code).toBeDefined();
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import Component from '../app/spark/components/Component';

it('should render component', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Test Coverage Goals

- Unit Tests: 80%+ coverage
- Integration Tests: Key user flows
- API Tests: All endpoints

## Continuous Integration

Tests should run on:
- Pre-commit (via git hooks)
- Pull requests
- Before deployment

## Common Issues

### API Key Not Configured

If you see warnings about missing API keys, add them to `.env.local`:

```env
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Import Path Errors

Ensure the `@/` alias is configured in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './'),
  },
}
```

## Performance Testing

For performance-critical operations:

```typescript
it('should complete within time limit', async () => {
  const start = Date.now();
  await someOperation();
  const duration = Date.now() - start;

  expect(duration).toBeLessThan(1000);
});
```

## Mocking

### Mocking API Calls

```typescript
import { vi } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn(() => ({
    messages: {
      create: vi.fn(() => Promise.resolve({
        content: [{ type: 'text', text: 'mock code' }]
      }))
    }
  }))
}));
```

## Best Practices

1. Keep tests focused and isolated
2. Use descriptive test names
3. Test edge cases and error conditions
4. Avoid testing implementation details
5. Use fixtures for complex test data
6. Clean up after tests (especially when using localStorage)

## Debugging Tests

Run tests in watch mode:
```bash
npm test -- --watch
```

Run a specific test file:
```bash
npm test -- claude-integration
```

Run tests with UI:
```bash
npm run test:ui
```
