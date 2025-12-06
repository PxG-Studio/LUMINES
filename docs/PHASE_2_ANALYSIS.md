# Phase 2: Enhanced Filesystem Components Analysis

## Current State

### FileTabs.tsx
- **Lines:** 7 (just a re-export)
- **Content:** Re-exports `Tabs` from `shell/Tabs` with filesystem naming
- **Usage:** Only in stories (`src/stories/Filesystem/FileTabs/FileTabs.stories.tsx`)
- **Features:** None (just an alias)

### FileTabsEnhanced.tsx
- **Lines:** 467
- **Content:** Full-featured tab component
- **Usage:** NOT USED ANYWHERE (dead code)
- **Features:**
  - Drag & drop reordering
  - Context menu (right-click)
  - Overflow handling with scroll arrows
  - Keyboard shortcuts
  - Dirty indicator
  - Icon support

### FileTree.tsx
- **Lines:** 130
- **Content:** Basic file tree
- **Usage:** Only in stories
- **Features:**
  - Basic expand/collapse
  - File/folder rendering
  - Selection

### FileTreeEnhanced.tsx
- **Lines:** 497
- **Content:** Advanced file tree
- **Usage:** 
  - `src/editor/performance/VirtualizedFileTree.tsx`
  - `src/editor/monaco/EditorContainer.tsx`
- **Features:**
  - Context menu (right-click)
  - Drag & drop
  - Keyboard navigation
  - File icons based on extension
  - WISSIL-FS integration
  - File create/delete/rename
  - Expanded state management

## Decision

**FileTabs:**
- `FileTabs.tsx` is just an alias - replace with `FileTabsEnhanced.tsx` functionality
- Rename `FileTabsEnhanced.tsx` → `FileTabs.tsx`
- Archive old `FileTabs.tsx`

**FileTree:**
- `FileTreeEnhanced.tsx` is actually being used in production code
- Replace `FileTree.tsx` with `FileTreeEnhanced.tsx` content
- Keep the `FileTree` name (more intuitive)
- Archive old `FileTree.tsx`

## Action Plan

1. Replace `FileTabs.tsx` with `FileTabsEnhanced.tsx` content
2. Update `FileTabsEnhanced` component name → `FileTabs`
3. Replace `FileTree.tsx` with `FileTreeEnhanced.tsx` content
4. Update `FileTreeEnhanced` component name → `FileTree`
5. Archive enhanced versions to `archive/filesystem-enhanced/`
6. Update all imports:
   - `FileTabsEnhanced` → `FileTabs`
   - `FileTreeEnhanced` → `FileTree`
7. Verify all imports work

