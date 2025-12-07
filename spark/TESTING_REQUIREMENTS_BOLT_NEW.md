# SPARK Unit Testing Requirements: Matching bolt.new Quality

**Date:** December 7, 2024  
**Target:** Production-grade AI code generator quality (bolt.new level)

---

## 📊 Current State Analysis

### SPARK Test Coverage (Current)

**Test Files:** 11
- `claude-integration.test.ts`
- `export-system.test.ts`
- `unity-validator.test.ts`
- `unity-bridge.test.ts` (integration)
- `unity-schemas.test.ts`
- Plus 6 E2E/integration tests

**Code Files:** 96 TypeScript/TSX files
- Components: 18 files
- Library functions: 78 files

**Current Ratio:** **11.5%** (11 tests / 96 files)

---

## 🎯 bolt.new Quality Standards (Estimated)

Based on industry standards for production AI code generators:

### Coverage Targets:
- **Unit Test Coverage:** 85-90%
- **Integration Test Coverage:** 70-80%
- **E2E Test Coverage:** Critical paths 100%

### Test-to-Code Ratio:
- **Minimum:** 1:1 (1 test per file/function)
- **Recommended:** 2:1 (2 tests per file/function)
- **Critical Functions:** 3-5 tests per function

---

## 📈 SPARK Testing Gap Analysis

### What Needs Testing

#### 1. Core AI Generation (Critical) - **HIGH PRIORITY**

**Files to Test:**
- `src/lib/spark/ai/claude-client.ts` - ✅ Has test
- `src/lib/spark/ai/openai-client.ts` - ❌ **MISSING**
- `src/lib/spark/ai/prompts.ts` - ❌ **MISSING**
- `src/lib/spark/ai/error-handler.ts` - ❌ **MISSING**
- `src/lib/spark/ai/queue.ts` - ❌ **MISSING**
- `src/lib/spark/ai/cache.ts` - ❌ **MISSING**
- `src/lib/spark/ai/connection-pool.ts` - ❌ **MISSING**

**Required Tests:** **~35-50 unit tests**
- API call success/failure
- Rate limiting
- Retry logic
- Error handling
- Token counting
- Response parsing
- Prompt generation
- Cache hit/miss
- Connection pooling

---

#### 2. Code Validation (Critical) - **HIGH PRIORITY**

**Files to Test:**
- `src/lib/spark/unity/validator.ts` - ✅ Has test
- `src/lib/spark/engines/unityAdapter.ts` - ❌ **MISSING**
- `src/lib/spark/engines/base.ts` - ❌ **MISSING**
- `src/lib/spark/engines/registry.ts` - ❌ **MISSING**

**Required Tests:** **~20-30 unit tests**
- C# syntax validation
- Script name extraction
- Class structure validation
- Namespace handling
- Using statements
- Brace matching
- Engine adapter registration
- Multi-engine support

---

#### 3. Export System (High Priority)

**Files to Test:**
- `src/lib/spark/export/zip-generator.ts` - ❌ **MISSING**
- `src/lib/spark/export/templates.ts` - ✅ Has test

**Required Tests:** **~15-20 unit tests**
- ZIP file generation
- Meta file creation
- Template application
- File structure validation
- GUID generation
- Assembly definition
- Package manifest

---

#### 4. Components (High Priority)

**Files to Test:**
- `src/app/spark/components/MCPChat.tsx` - ❌ **MISSING**
- `src/app/spark/components/PreviewPanel.tsx` - ❌ **MISSING**
- `src/app/spark/components/ExportButton.tsx` - ❌ **MISSING**
- `src/app/spark/components/ErrorBoundary.tsx` - ❌ **MISSING**
- `src/app/spark/components/EngineSelector.tsx` - ❌ **MISSING**
- `src/app/spark/components/PresetSelector.tsx` - ❌ **MISSING**
- `src/app/spark/components/GenerationHistory.tsx` - ❌ **MISSING**
- `src/app/spark/components/UserPreferences.tsx` - ❌ **MISSING**
- `src/app/spark/components/UsageStats.tsx` - ❌ **MISSING**
- `src/app/spark/components/ProgressPanel.tsx` - ❌ **MISSING**
- `src/app/spark/components/UndoRollbackPanel.tsx` - ❌ **MISSING**

**Required Tests:** **~60-80 unit tests**
- Component rendering
- User interactions
- State management
- Error states
- Loading states
- Props validation
- Event handling

---

#### 5. Server Actions (Critical)

**Files to Test:**
- `src/app/spark/actions/generate.ts` - ❌ **MISSING**

**Required Tests:** **~15-20 unit tests**
- Code generation flow
- Error handling
- Validation
- Response formatting

---

#### 6. API Routes (High Priority)

**Files to Test:**
- `src/app/api/export/route.ts` - ❌ **MISSING**
- `src/app/api/spark/health/route.ts` - ❌ **MISSING**
- `src/app/api/v1/generate/route.ts` - ❌ **MISSING**

**Required Tests:** **~20-30 unit tests**
- Request validation
- Response formatting
- Error handling
- Rate limiting
- Authentication

---

#### 7. Library Functions (Medium Priority)

**Files to Test:**
- `src/lib/spark/analytics/tracker.ts` - ❌ **MISSING**
- `src/lib/spark/analytics/cost-tracker.ts` - ❌ **MISSING**
- `src/lib/spark/rate-limiting/limiter.ts` - ❌ **MISSING**
- `src/lib/spark/monitoring/error-logging.ts` - ❌ **MISSING**
- `src/lib/spark/monitoring/audit.ts` - ❌ **MISSING**
- `src/lib/spark/database/operations/spark.ts` - ❌ **MISSING**
- `src/lib/spark/auth/middleware.ts` - ❌ **MISSING**
- `src/lib/spark/auth/user-context.ts` - ❌ **MISSING**

**Required Tests:** **~40-60 unit tests**
- Analytics tracking
- Cost calculation
- Rate limiting logic
- Error aggregation
- Audit logging
- Database operations
- Authentication

---

## 🎯 Total Unit Test Requirements

### Minimum (bolt.new parity): **~200-300 unit tests**

**Breakdown:**
- Core AI Generation: 35-50 tests
- Code Validation: 20-30 tests
- Export System: 15-20 tests
- Components: 60-80 tests
- Server Actions: 15-20 tests
- API Routes: 20-30 tests
- Library Functions: 40-60 tests

**Total:** **205-290 unit tests**

---

### Recommended (Production-grade): **~350-450 unit tests**

**Additional Coverage:**
- Edge cases: +50-80 tests
- Error scenarios: +40-60 tests
- Integration points: +30-50 tests
- Performance: +20-30 tests

**Total:** **345-480 unit tests**

---

## 📊 Test Coverage Goals

### By Category:

| Category | Current | Target | Gap |
|----------|---------|--------|-----|
| AI Generation | 14% | 90% | -76% |
| Validation | 33% | 90% | -57% |
| Export | 20% | 85% | -65% |
| Components | 0% | 80% | -80% |
| API Routes | 0% | 85% | -85% |
| Library Functions | 0% | 75% | -75% |
| **Overall** | **11.5%** | **85%** | **-73.5%** |

---

## 🚀 Implementation Priority

### Phase 1: Critical Path (Week 1-2)
**Target:** 100-150 tests

1. ✅ AI Generation Core (35-50 tests)
   - Claude client
   - OpenAI client
   - Error handling
   - Retry logic

2. ✅ Code Validation (20-30 tests)
   - Unity validator
   - Engine adapters
   - Registry

3. ✅ Server Actions (15-20 tests)
   - Generate action
   - Error handling

4. ✅ Export System (15-20 tests)
   - ZIP generation
   - Templates

**Priority:** **CRITICAL** - Core functionality

---

### Phase 2: User-Facing (Week 3-4)
**Target:** 60-80 tests

1. ✅ Components (60-80 tests)
   - MCPChat
   - PreviewPanel
   - ExportButton
   - ErrorBoundary
   - Other components

**Priority:** **HIGH** - User experience

---

### Phase 3: Infrastructure (Week 5-6)
**Target:** 40-60 tests

1. ✅ API Routes (20-30 tests)
2. ✅ Library Functions (40-60 tests)

**Priority:** **MEDIUM** - Stability

---

## 📝 Test Quality Standards

### Each Test Should:
1. ✅ Test one behavior/outcome
2. ✅ Be independent (no test dependencies)
3. ✅ Be fast (<100ms per test)
4. ✅ Be deterministic (same input = same output)
5. ✅ Have clear naming (`should [expected behavior] when [condition]`)
6. ✅ Test both success and failure cases
7. ✅ Test edge cases and boundaries

### Test Structure:
```typescript
describe('Component/Function Name', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

---

## 🎯 Final Answer

### To Match bolt.new Quality:

**Minimum Required:** **200-300 unit tests**

**Recommended:** **350-450 unit tests**

**Current:** **11 tests**

**Gap:** **189-289 tests (minimum)** or **339-439 tests (recommended)**

---

## ✅ Action Plan

### Immediate (This Week):
1. Create test files for all missing core functions
2. Write tests for AI generation (35-50 tests)
3. Write tests for validation (20-30 tests)
4. Write tests for export (15-20 tests)

**Target:** +70-100 tests

### Short-term (Next 2 Weeks):
1. Component tests (60-80 tests)
2. Server action tests (15-20 tests)
3. API route tests (20-30 tests)

**Target:** +95-130 tests

### Medium-term (Next Month):
1. Library function tests (40-60 tests)
2. Edge case tests (50-80 tests)
3. Error scenario tests (40-60 tests)

**Target:** +130-200 tests

---

## 📊 Success Metrics

### Coverage Targets:
- **Unit Tests:** 85%+ coverage
- **Integration Tests:** 70%+ coverage
- **E2E Tests:** 100% critical paths

### Quality Metrics:
- **Test Execution Time:** <5 minutes for full suite
- **Test Reliability:** 99%+ pass rate
- **Test Maintenance:** <10% flaky tests

---

**Last Updated:** December 7, 2024  
**Current Status:** 11 tests / 200-300 required = **3.7-5.5% complete**

