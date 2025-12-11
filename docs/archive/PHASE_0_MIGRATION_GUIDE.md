# Phase 0 - Turborepo Structure Migration Guide

**Status:** ✅ Complete - Structural setup only  
**Date:** December 2024  
**Branch:** prototype-1

---

## What Was Created

### New Turborepo Structure

```
LUMINES/
├── apps/
│   ├── web/              ✅ NEW - LumenForge.io MVP site
│   └── storybook/        ✅ NEW - Unified design system hub
│
├── packages/
│   ├── ui/               ✅ NEW - Shared UI components (stub)
│   ├── tokens/           ✅ NEW - Design tokens (stub)
│   ├── spark/            ⚠️ PLACEHOLDER - Do not use yet
│   └── slate/            ⚠️ PLACEHOLDER - Do not use yet
│
└── [Existing code unchanged]
    ├── src/app/spark/    ✅ UNTOUCHED - Production ready
    ├── src/app/slate/    ✅ UNTOUCHED - Production ready
    ├── .storybook/       ✅ UNTOUCHED - Existing Storybook
    └── All other files   ✅ UNTOUCHED
```

---

## What Remains Untouched

### ✅ Production-Ready Systems (DO NOT MODIFY)

1. **SPARK** (`src/app/spark/`)
   - Complete Storybook integration
   - Chromatic visual regression
   - Percy pixel regression
   - Full Playwright test suite
   - CI/CD pipeline (`.github/workflows/ci-spark.yml`)

2. **SLATE** (`src/app/slate/`)
   - Complete Storybook integration
   - Chromatic visual regression
   - Percy pixel regression
   - Full Playwright test suite
   - CI/CD pipeline (`.github/workflows/ci-slate.yml`)

3. **Existing Storybook** (`.storybook/`)
   - Current configuration
   - Existing stories
   - All pipelines functional

4. **All other code**
   - No files moved
   - No imports broken
   - All functionality preserved

---

## Configuration Updates

### ✅ Updated Files

1. **Root `package.json`**
   - Added `workspaces` configuration
   - Added Turborepo scripts (`dev:web`, `dev:storybook`, `build:all`, `test:all`)

2. **`turbo.json`**
   - Added `dev` task with persistent flag
   - Added migration TODO comment

3. **New GitHub Actions**
   - `.github/workflows/lumines-base.yml` - Reusable base workflow
   - `.github/workflows/build-and-deploy.yml` - Turborepo build pipeline

---

## Future Migration Path (Optional)

### Phase 1: Design Tokens Migration
- [ ] Migrate `src/tokens/` → `packages/tokens/`
- [ ] Update imports in `apps/web` and `apps/storybook`
- [ ] Update Tailwind configs
- [ ] Test and validate

### Phase 2: UI Components Migration
- [ ] Migrate shared components from `src/components/` → `packages/ui/`
- [ ] Migrate design system components → `packages/ui/`
- [ ] Create component stories in `packages/ui/`
- [ ] Update imports
- [ ] Test and validate

### Phase 3: SPARK Migration (Optional)
- [ ] Evaluate if migration needed
- [ ] Create migration plan
- [ ] Test in staging
- [ ] Migrate code → `packages/spark/`
- [ ] Update CI/CD workflows
- [ ] Update imports

### Phase 4: SLATE Migration (Optional)
- [ ] Evaluate if migration needed
- [ ] Create migration plan
- [ ] Test in staging
- [ ] Migrate code → `packages/slate/`
- [ ] Update CI/CD workflows
- [ ] Update imports

---

## Current Status

### ✅ Working Now

- Turborepo structure exists
- `apps/web` is ready for LumenForge.io MVP
- `apps/storybook` is ready for unified design system
- All existing code untouched and functional
- CI/CD workflows ready (but won't break existing)

### ⚠️ Not Yet Active

- Packages are stubs (no actual code migrated)
- New apps need dependencies installed (`npm install` in workspace)
- Migration TODOs mark future work

---

## Next Steps

### Immediate (Can Do Now)

1. **Install dependencies in new workspaces:**
   ```bash
   cd apps/web && npm install
   cd ../storybook && npm install
   ```

2. **Test new web app:**
   ```bash
   npm run dev:web
   # or
   cd apps/web && npm run dev
   ```

3. **Test new Storybook:**
   ```bash
   npm run dev:storybook
   # or
   cd apps/storybook && npm run storybook
   ```

### Future (When Ready)

- Follow migration phases above
- Gradually move code into packages
- Integrate with existing SPARK/SLATE
- Unify Storybook instances

---

## Important Notes

### ⚠️ DO NOT:
- Migrate SPARK or SLATE yet (they work perfectly where they are)
- Break existing imports
- Modify existing Storybook config
- Change existing CI/CD pipelines

### ✅ DO:
- Build LumenForge.io MVP in `apps/web`
- Create design system in `apps/storybook`
- Use packages for new shared code
- Follow migration guide when ready

---

## Questions?

- SPARK/SLATE stay in `src/app/` for now
- New work goes in `apps/` and `packages/`
- Migration is optional, not required
- All existing functionality preserved

