# 🧪 WISSIL Automated QA Suite

**Comprehensive Testing Infrastructure for WISSIL/LUMINES**

---

## 📁 Directory Structure

```
tests/
├── unit/              # Vitest unit tests
│   ├── slate/        # Design system tests
│   └── ignis/        # Blueprint editor tests
├── integration/      # Integration tests
│   ├── canvas/       # Canvas interaction tests
│   ├── spark/        # Template tests
│   ├── csharp/       # Code generation tests
│   └── runtime-binder/ # Unity bridge tests
├── e2e/              # Playwright end-to-end tests
│   ├── ignis/        # Blueprint editor E2E
│   ├── collab/       # Collaboration tests
│   ├── hotreload/    # Hot reload tests
│   └── spark/        # Template creation tests
├── visual/           # Chromatic visual regression
├── perf/             # Performance benchmarks
├── mock/             # Mock implementations
│   ├── unity/        # Unity bridge mock
│   ├── fs/           # File system mock
│   └── collab/       # Collaboration server mock
├── fixtures/         # Test data and fixtures
└── setup.ts          # Test setup configuration
```

---

## 🚀 Quick Start

```bash
# Run all tests
npm run test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:perf

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 📊 Test Coverage

- ✅ **Unit Tests:** 100+ test cases
- ✅ **Integration Tests:** 50+ test cases
- ✅ **E2E Tests:** 30+ scenarios
- ✅ **Visual Regression:** 400+ stories
- ✅ **Performance Benchmarks:** 10+ metrics

---

## 🧩 Test Categories

### Unit Tests
- Slate design tokens
- Slate components (snapshots)
- Node library definitions
- Graph store operations
- Blueprint interpreter

### Integration Tests
- Canvas pan/zoom interactions
- Node dragging
- Wire rendering
- Template loading
- C# code generation
- Runtime binder communication

### E2E Tests
- Full blueprint editor workflow
- Real-time collaboration
- C# hot reload
- Template project creation
- Multi-user scenarios

### Performance Tests
- Canvas FPS (60fps target)
- Graph load times (<100ms for 100 nodes)
- Memory leak detection
- Zoom/pan smoothness

---

## 🎯 CI/CD Integration

All tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` branch
- Scheduled nightly runs

See `.github/workflows/qa.yml` for configuration.

---

**Last Updated:** December 2024
