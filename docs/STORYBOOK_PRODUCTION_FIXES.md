# Storybook Production Readiness - Fixes Plan

## Quick Wins to Reach ~90% Production Ready

### Phase 1: Story Consolidation ✅
1. Move all stories from `src/wissil/**/*.stories.tsx` → `src/stories/WISSIL/`
2. Move all stories from `src/app/**/*.stories.tsx` → `src/stories/WISSIL/`
3. Move design-system stories → `src/stories/DesignSystem/`
4. Merge EditorShell → Editor/Shell/

### Phase 2: Hierarchy Standardization ✅
1. Update all story titles to use consistent naming
2. Update `.storybook/preview.ts` storySort order
3. Ensure all categories use PascalCase

### Phase 3: Story Quality Improvements ✅
1. Add error states to critical components
2. Add loading states
3. Add empty states

### Phase 4: Documentation ✅
1. Create MDX docs for top 10 components
2. Add usage examples

## Target Structure

```
src/stories/
├── WISSIL/
│   ├── Landing/
│   ├── Slate/
│   ├── Ignition/
│   ├── Spark/
│   ├── Ignis/
│   └── Waypoint/
├── Editor/
│   ├── Shell/        (merged from EditorShell)
│   ├── Complete/
│   ├── GameDev/
│   └── ...
├── DesignSystem/
│   └── Primitives/
└── [other categories...]
```

