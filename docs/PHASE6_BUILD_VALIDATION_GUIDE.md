# PHASE 6: VALIDATE STORYBOOK BUILD - VALIDATION GUIDE

**Date:** Created  
**Status:** 📋 **READY FOR EXECUTION**

---

## Build Validation Checklist

### Pre-Build Checks

- [ ] All story titles use canonical format: `Lumenforge.io Design System/WIS2L Framework/...`
- [ ] All MDX Meta titles match story titles
- [ ] No duplicate story IDs
- [ ] All imports resolve correctly

### Build Command

```bash
# Development build (faster, with HMR)
npm run storybook

# Production build (validates everything)
npm run build-storybook
```

### Validation Steps

1. **Start Storybook Development Server**
   ```bash
   npm run storybook
   ```
   - ✅ Should start without errors
   - ✅ Should display all stories in sidebar
   - ✅ Should show correct hierarchy

2. **Verify Storybook Hierarchy**
   - ✅ Check sidebar shows: `Lumenforge.io Design System` as root
   - ✅ Check `WIS2L Framework` appears correctly
   - ✅ Check all subsystems are visible (Landing, Slate, Ignition, Spark, Ignis, Waypoint)
   - ✅ Check all stories load without errors

3. **Test Story Navigation**
   - ✅ Click through stories in each subsystem
   - ✅ Verify all stories render correctly
   - ✅ Check Canvas view works
   - ✅ Check Docs view works

4. **Verify Landing Page Stories**
   - ✅ `Main Gateway` story loads
   - ✅ `Interactive Landing` story loads
   - ✅ `LandingComponents` story loads
   - ✅ All interaction tests pass
   - ✅ All play functions execute

5. **Check for Errors**
   - ✅ No console errors
   - ✅ No build warnings about missing modules
   - ✅ No TypeScript errors
   - ✅ No import resolution errors

6. **Production Build Test**
   ```bash
   npm run build-storybook
   ```
   - ✅ Build completes successfully
   - ✅ No build errors
   - ✅ Static files generated correctly

---

## Expected Results

### ✅ Success Indicators

- Storybook starts without errors
- All stories visible in sidebar
- Correct hierarchy displayed
- All stories render correctly
- No console errors
- Build completes successfully

### ⚠️ Common Issues & Fixes

1. **Module Resolution Errors**
   - Check `.storybook/main.ts` webpack aliases
   - Verify all import paths use `@/` aliases

2. **Duplicate Story IDs**
   - Check for duplicate story files
   - Verify story titles are unique

3. **Missing Dependencies**
   - Run `npm install`
   - Check `package.json` for required packages

4. **TypeScript Errors**
   - Run `npm run typecheck`
   - Fix any type errors

---

## Automated Validation Script

```bash
#!/bin/bash
# validate-storybook.sh

echo "🔍 Validating Storybook build..."

# Check if Storybook config exists
if [ ! -f ".storybook/main.ts" ]; then
    echo "❌ Storybook config not found"
    exit 1
fi

# Check if required dependencies are installed
if [ ! -d "node_modules/@storybook" ]; then
    echo "⚠️  Storybook dependencies not found. Running npm install..."
    npm install
fi

# Check for duplicate story IDs
echo "🔍 Checking for duplicate story titles..."
grep -r "title:" src/stories --include="*.stories.tsx" --include="*.stories.ts" | \
    sort | uniq -d && echo "⚠️  Duplicate titles found" || echo "✅ No duplicate titles"

# Check MDX alignment
echo "🔍 Verifying MDX Meta titles..."
grep -r "Meta title" src/stories src/app --include="*.mdx" | \
    grep -v "WIS2L Framework" && echo "⚠️  Some MDX files missing WIS2L Framework" || \
    echo "✅ All MDX files use WIS2L Framework"

# Attempt build
echo "🔍 Building Storybook..."
npm run build-storybook

if [ $? -eq 0 ]; then
    echo "✅ Storybook build successful!"
else
    echo "❌ Storybook build failed"
    exit 1
fi
```

---

## Status

📋 **READY FOR MANUAL VALIDATION**

**Next:** Run validation steps above, then proceed to Phase 7 - Final Output

