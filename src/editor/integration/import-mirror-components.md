# Import Mirror Components - Step by Step Guide

**WISSIL / LUMINES — Systematic Component Integration**

---

## 📋 Process Overview

1. **Locate** component in mirror directory
2. **Read** component code
3. **Analyze** dependencies and features
4. **Adapt** to WISSIL (FS + SLATE)
5. **Integrate** into WISSIL structure
6. **Test** thoroughly

---

## 🔍 Component Locations

### Expected Locations

```
E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\
├── components/
│   ├── editor/
│   │   ├── FileManagement/
│   │   │   ├── FileExplorer.tsx
│   │   │   └── FileTabs.tsx
│   │   ├── Monaco/
│   │   ├── Git/
│   │   └── Core/
│   ├── landing/
│   │   ├── AnimatedCounter.tsx
│   │   ├── FloatingOrbs.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GradientButton.tsx
│   │   ├── HeroPromptInput.tsx
│   │   ├── RotatingWord.tsx
│   │   └── StreamingText.tsx
│   └── stackblitz/
│       └── StackBlitzRuntime.tsx
└── src/
    └── App.tsx
```

---

## 📝 Integration Template

For each component, follow this template:

### Step 1: Read Component

```bash
# Read the component file
Get-Content "E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\components\[path]\[Component].tsx"
```

### Step 2: Create Adapted Version

Create file: `src/editor/[category]/[Component].tsx`

```typescript
/**
 * [Component Name]
 * 
 * Adapted from mirror components for WISSIL
 * Source: E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\components\[path]
 * 
 * Changes:
 * - Integrated with WISSIL-FS
 * - Uses SLATE design tokens
 * - TypeScript strict mode
 * - Next.js App Router compatible
 */

'use client';

import React from 'react';
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';
import { slateTokens } from '@/tokens/slate.tokens';

// [Paste original component code here]
// Then adapt:
// 1. Replace file system calls with fs.readFile(), fs.writeFile(), etc.
// 2. Replace colors with slateTokens.colors.*
// 3. Replace spacing with slateTokens.spacing.*
// 4. Add proper TypeScript types
// 5. Ensure 'use client' directive for Next.js
```

### Step 3: Create Storybook Story

Create file: `src/stories/[Category]/[Component]/[Component].stories.tsx`

### Step 4: Write Tests

Create file: `tests/editor/[category]/[Component].test.tsx`

### Step 5: Integrate

Update `EditorContainer.tsx` or relevant parent component

---

## ✅ Component Integration Checklist

### Editor Components

- [ ] **FileExplorer.tsx**
  - [ ] Read from mirror
  - [ ] Compare with FileTreeEnhanced.tsx
  - [ ] Merge best features
  - [ ] Adapt to WISSIL-FS
  - [ ] Adapt to SLATE tokens
  - [ ] Create story
  - [ ] Write tests
  - [ ] Integrate

- [ ] **FileTabs.tsx**
  - [ ] Read from mirror
  - [ ] Compare with FileTabsEnhanced.tsx
  - [ ] Merge best features
  - [ ] Adapt to WISSIL-FS
  - [ ] Adapt to SLATE tokens
  - [ ] Create story
  - [ ] Write tests
  - [ ] Integrate

- [ ] **Monaco Components** (3-5 components)
  - [ ] MonacoTheme.tsx
  - [ ] MonacoLanguage.tsx
  - [ ] MonacoIntelliSense.tsx
  - [ ] Integrate with our MonacoEditor.tsx

- [ ] **Git Components** (3 components)
  - [ ] GitPanel.tsx
  - [ ] GitDiff.tsx
  - [ ] GitCommit.tsx

### Landing Components (7 components)

- [ ] AnimatedCounter.tsx
- [ ] FloatingOrbs.tsx
- [ ] GlassCard.tsx
- [ ] GradientButton.tsx
- [ ] HeroPromptInput.tsx
- [ ] RotatingWord.tsx
- [ ] StreamingText.tsx

### Runtime Components (5+ components)

- [ ] **StackBlitzRuntime.tsx** (HIGH PRIORITY)
- [ ] WebContainer.tsx
- [ ] PreviewFrame.tsx
- [ ] ConsoleOutput.tsx
- [ ] BuildStatus.tsx

---

## 🚀 Quick Start Integration

### For Each Component:

1. **Copy** component to appropriate `src/` location
2. **Add** `'use client'` directive
3. **Import** `useWissilFS` and `slateTokens`
4. **Replace** file operations with WISSIL-FS
5. **Replace** colors/spacing with SLATE tokens
6. **Fix** TypeScript errors
7. **Test** in Storybook
8. **Integrate** into parent component

---

**Status:** Ready for systematic integration  
**Next:** Begin with high-priority components (StackBlitzRuntime, FileExplorer, FileTabs)

