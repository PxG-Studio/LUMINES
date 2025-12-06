# Mirror Components Integration Guide

**WISSIL / LUMINES — Comprehensive Integration of 33 Components**

**Date:** December 2024  
**Status:** 🔄 In Progress

---

## 📋 Component Inventory (33 Components)

### Editor Components (Expected: ~15)

#### File Management
1. **FileExplorer.tsx** - Enhanced file explorer
2. **FileTabs.tsx** - Advanced tab management
3. **FileTree.tsx** - File tree component (if different from ours)

#### Monaco Integration
4. **MonacoEditor.tsx** - Monaco wrapper (if different from ours)
5. **MonacoTheme.tsx** - Theme configuration
6. **MonacoLanguage.tsx** - Language support
7. **MonacoIntelliSense.tsx** - Autocomplete setup

#### Core Editor
8. **EditorCore.tsx** - Core editor logic
9. **EditorCommands.tsx** - Command handling
10. **EditorKeybindings.tsx** - Keyboard shortcuts

#### Git Integration
11. **GitPanel.tsx** - Git status panel
12. **GitDiff.tsx** - Diff viewer
13. **GitCommit.tsx** - Commit interface

### Landing Components (Expected: 7+)

14. **AnimatedCounter.tsx** - Animated number counter
15. **FloatingOrbs.tsx** - Floating background orbs
16. **GlassCard.tsx** - Glassmorphism card
17. **GradientButton.tsx** - Gradient button
18. **HeroPromptInput.tsx** - Hero section input
19. **RotatingWord.tsx** - Rotating text animation
20. **StreamingText.tsx** - Streaming text effect

### StackBlitz/Runtime Components (Expected: 5+)

21. **StackBlitzRuntime.tsx** - Main runtime component
22. **WebContainer.tsx** - WebContainer integration
23. **PreviewFrame.tsx** - Preview iframe
24. **ConsoleOutput.tsx** - Console display
25. **BuildStatus.tsx** - Build status indicator

### Additional Components (Expected: 6+)

26-33. **Additional utility components** (TBD)

---

## 🏗️ Integration Structure

### Target Directory Structure

```
src/
├── editor/
│   ├── filesystem/
│   │   ├── FileTree.tsx              (existing - basic)
│   │   ├── FileTreeEnhanced.tsx      (our new version)
│   │   ├── FileExplorer.tsx          (from mirror - to integrate)
│   │   ├── FileTabs.tsx              (existing - basic)
│   │   └── FileTabsEnhanced.tsx      (our new version)
│   ├── monaco/
│   │   ├── MonacoEditor.tsx          (our new version)
│   │   ├── MonacoTheme.tsx          (from mirror - to integrate)
│   │   ├── MonacoLanguage.tsx        (from mirror - to integrate)
│   │   └── MonacoIntelliSense.tsx    (from mirror - to integrate)
│   ├── git/
│   │   ├── GitPanel.tsx              (from mirror - to integrate)
│   │   ├── GitDiff.tsx               (from mirror - to integrate)
│   │   └── GitCommit.tsx             (from mirror - to integrate)
│   └── runtime/
│       ├── StackBlitzRuntime.tsx     (from mirror - to integrate)
│       ├── WebContainer.tsx          (from mirror - to integrate)
│       ├── PreviewFrame.tsx          (from mirror - to integrate)
│       └── ConsoleOutput.tsx        (from mirror - to integrate)
├── components/
│   └── landing/
│       ├── AnimatedCounter.tsx       (from mirror - to integrate)
│       ├── FloatingOrbs.tsx          (from mirror - to integrate)
│       ├── GlassCard.tsx             (from mirror - to integrate)
│       ├── GradientButton.tsx        (from mirror - to integrate)
│       ├── HeroPromptInput.tsx       (from mirror - to integrate)
│       ├── RotatingWord.tsx          (from mirror - to integrate)
│       └── StreamingText.tsx         (from mirror - to integrate)
```

---

## 🔄 Integration Process

### Phase 1: Component Analysis & Comparison

#### Step 1.1: FileExplorer vs FileTreeEnhanced
- [ ] Read FileExplorer.tsx from mirror
- [ ] Compare features with FileTreeEnhanced.tsx
- [ ] Identify unique features in each
- [ ] Create merge plan
- [ ] Merge into single enhanced component

#### Step 1.2: FileTabs Comparison
- [ ] Read FileTabs.tsx from mirror
- [ ] Compare with FileTabsEnhanced.tsx
- [ ] Identify unique features
- [ ] Merge best features

#### Step 1.3: Monaco Components
- [ ] Read Monaco components from mirror
- [ ] Compare with our MonacoEditor.tsx
- [ ] Integrate MonacoTheme, MonacoLanguage, MonacoIntelliSense
- [ ] Enhance our MonacoEditor with mirror features

### Phase 2: Component Adaptation

#### Step 2.1: WISSIL-FS Integration
For each component:
- [ ] Replace file system calls with `useWissilFS()`
- [ ] Update file paths to use WISSIL-FS format
- [ ] Test file operations

#### Step 2.2: SLATE Design Tokens
For each component:
- [ ] Replace hardcoded colors with SLATE tokens
- [ ] Update spacing to use SLATE spacing scale
- [ ] Update typography to use SLATE typography
- [ ] Ensure dark theme compatibility

#### Step 2.3: TypeScript & Type Safety
- [ ] Add proper TypeScript types
- [ ] Fix any type errors
- [ ] Add JSDoc comments
- [ ] Ensure strict mode compatibility

### Phase 3: Integration & Testing

#### Step 3.1: Update EditorContainer
- [ ] Integrate FileExplorer (merged version)
- [ ] Integrate FileTabs (merged version)
- [ ] Integrate Monaco enhancements
- [ ] Add Git panel (if applicable)
- [ ] Add StackBlitz runtime

#### Step 3.2: Storybook Stories
- [ ] Create stories for all integrated components
- [ ] Add interaction tests
- [ ] Add accessibility tests
- [ ] Add visual regression tests

#### Step 3.3: Unit Tests
- [ ] Write tests for FileExplorer
- [ ] Write tests for FileTabs
- [ ] Write tests for Monaco components
- [ ] Write tests for Landing components
- [ ] Write tests for Runtime components

---

## 📝 Component-by-Component Integration Plan

### 1. FileExplorer.tsx

**Source:** `E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\components\editor\FileManagement\FileExplorer.tsx`

**Integration Steps:**
1. Copy to `src/editor/filesystem/FileExplorer.tsx`
2. Replace file system calls with `useWissilFS()`
3. Update styling to use SLATE tokens
4. Compare with FileTreeEnhanced.tsx
5. Merge unique features
6. Create unified FileExplorer component

**Key Features to Check:**
- Search/filter functionality
- File icons
- Context menu
- Drag & drop
- Keyboard navigation

### 2. FileTabs.tsx

**Source:** `E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\components\editor\FileManagement\FileTabs.tsx`

**Integration Steps:**
1. Copy to `src/editor/filesystem/FileTabs.tsx` (as FileTabsMirror.tsx)
2. Compare with FileTabsEnhanced.tsx
3. Merge best features
4. Adapt to WISSIL-FS
5. Update to use SLATE tokens

**Key Features to Check:**
- Tab reordering
- Context menu
- Overflow handling
- Keyboard shortcuts
- Middle-click close

### 3. StackBlitzRuntime.tsx

**Source:** `E:\Projects\LUMENFORGE\DO_NOT_MOVE_DO_NOT_DELETE_MIRROR_COMPONENTS\components\stackblitz\StackBlitzRuntime.tsx`

**Integration Steps:**
1. Copy to `src/editor/runtime/StackBlitzRuntime.tsx`
2. Install required dependencies (@stackblitz/webcontainer)
3. Integrate with WISSIL-FS
4. Add to EditorContainer
5. Create Storybook stories

**Priority:** HIGH (Critical for Phase 3)

### 4. Landing Components (7+)

**Integration Steps:**
1. Copy all landing components to `src/components/landing/`
2. Adapt to use SLATE tokens
3. Ensure Next.js compatibility
4. Create Storybook stories
5. Integrate into landing page

**Components:**
- AnimatedCounter.tsx
- FloatingOrbs.tsx
- GlassCard.tsx
- GradientButton.tsx
- HeroPromptInput.tsx
- RotatingWord.tsx
- StreamingText.tsx

---

## 🔧 Adaptation Template

### Template for Adapting Components

```typescript
/**
 * [Component Name]
 * 
 * Adapted from mirror components for WISSIL
 * - Integrated with WISSIL-FS
 * - Uses SLATE design tokens
 * - TypeScript strict mode
 */

'use client';

import React from 'react';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';
// Import SLATE tokens
import { slateTokens } from '@/tokens/slate.tokens';

export interface [Component]Props {
  // Props interface
}

export const [Component]: React.FC<[Component]Props> = (props) => {
  const fs = useWissilFS();
  
  // Component implementation
  // - Use fs.readFile(), fs.writeFile(), etc.
  // - Use slateTokens.colors, slateTokens.spacing, etc.
  
  return (
    <div style={{
      // Use SLATE tokens
      background: slateTokens.colors.background.primary,
      color: slateTokens.colors.text.primary,
      padding: slateTokens.spacing.md,
    }}>
      {/* Component content */}
    </div>
  );
};

export default [Component];
```

---

## ✅ Integration Checklist

### Editor Components
- [ ] FileExplorer.tsx - Compare & merge
- [ ] FileTabs.tsx - Compare & merge
- [ ] MonacoTheme.tsx - Integrate
- [ ] MonacoLanguage.tsx - Integrate
- [ ] MonacoIntelliSense.tsx - Integrate
- [ ] EditorCore.tsx - Review & integrate
- [ ] EditorCommands.tsx - Review & integrate
- [ ] EditorKeybindings.tsx - Review & integrate
- [ ] GitPanel.tsx - Integrate
- [ ] GitDiff.tsx - Integrate
- [ ] GitCommit.tsx - Integrate

### Landing Components
- [ ] AnimatedCounter.tsx - Integrate
- [ ] FloatingOrbs.tsx - Integrate
- [ ] GlassCard.tsx - Integrate
- [ ] GradientButton.tsx - Integrate
- [ ] HeroPromptInput.tsx - Integrate
- [ ] RotatingWord.tsx - Integrate
- [ ] StreamingText.tsx - Integrate

### Runtime Components
- [ ] StackBlitzRuntime.tsx - Integrate (HIGH PRIORITY)
- [ ] WebContainer.tsx - Integrate
- [ ] PreviewFrame.tsx - Integrate
- [ ] ConsoleOutput.tsx - Integrate
- [ ] BuildStatus.tsx - Integrate

### Testing & Documentation
- [ ] Create Storybook stories for all components
- [ ] Write unit tests
- [ ] Update documentation
- [ ] Create integration examples

---

## 🚀 Next Steps

1. **Access Components** - Use alternative method to read files
2. **Create Comparison Tool** - Automated comparison script
3. **Start Integration** - Begin with high-priority components
4. **Test Thoroughly** - Ensure all components work together

---

**Status:** Ready for component access and integration  
**Priority:** HIGH - StackBlitzRuntime and Landing components

