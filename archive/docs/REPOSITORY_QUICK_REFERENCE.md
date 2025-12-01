# ⚡ LUMINES/WISSIL Quick Reference Guide

## 📖 Documentation Index

| Document | Purpose | Status |
|----------|---------|--------|
| **[REPOSITORY_ARCHITECTURE.md](./REPOSITORY_ARCHITECTURE.md)** | Complete system architecture with detailed breakdowns | ✅ |
| **[REPOSITORY_MINDMAP.md](./REPOSITORY_MINDMAP.md)** | Visual mindmaps of all systems | ✅ |
| **[REPOSITORY_DIAGRAMS.md](./REPOSITORY_DIAGRAMS.md)** | System flow and interaction diagrams | ✅ |
| **[REPOSITORY_COMPLETE_OVERVIEW.md](./REPOSITORY_COMPLETE_OVERVIEW.md)** | Master overview document | ✅ |
| **[README.md](./README.md)** | Project overview and quick start | ✅ |

---

## 🗂️ Key Directories

```
src/
├── app/              → Next.js pages (6 subsystems)
├── wissil/           → Core IDE modules (250+ files)
├── ignis/            → Visual scripting (Blueprint Editor)
├── design-system/    → Slate design tokens & components
├── runtime/          → Unity bridge & hot reload
├── components/       → Shared React components
├── state/            → Zustand stores
└── stories/          → Storybook documentation
```

---

## 🎯 Core Modules Quick Reference

### Runtime & Bridge
- `src/wissil/runtime/unityBridge/` - Unity ↔ JS messaging
- `src/wissil/runtime/fs/` - File system abstraction
- `src/wissil/runtime/hotreload/` - Hot reload engine

### Editor Tools
- `src/wissil/scenegraph/` - Scene Graph Editor
- `src/wissil/prefabs/` - Prefab System
- `src/wissil/prefabs/variants/` - Prefab Variants
- `src/wissil/audio/` - Audio Mixer
- `src/wissil/ui/` - UI Canvas Editor
- `src/wissil/animation/` - Animation Timeline

### Visual Scripting
- `src/ignis/blueprint/` - Blueprint Editor
- `src/ignis/blueprint/library/` - 34+ nodes

### Build & Deploy
- `src/wissil/build/` - Build orchestration
- `src/wissil/build/deploy/` - Deployment providers

### AI System
- `src/wissil/luna/` - LUNA AI (25+ assistants)

---

## 📊 Phase Quick Reference

| Phase | System | Files |
|-------|--------|-------|
| E, F, G | Runtime Bridge + Hot Reload | 15 |
| K | Scene Graph | 11 |
| U, Y | Prefabs + Variants | 28 |
| W | Audio Mixer | 13 |
| X | UI Canvas | 13 |
| Z | Build & Deploy | 23 |
| AE | Ignis Blueprint | 16 |

---

## 🔑 Key Zustand Stores

```typescript
// Core Stores
useEditorState()      // Editor state
useRuntimeState()     // Runtime state
usePreviewState()     // Preview state
useUIState()          // UI state

// Module Stores
useSceneGraphStore()  // Scene hierarchy
usePrefabStore()      // Prefab data
useAudioMixerStore()  // Audio mixer
useCanvasStore()      // UI canvas
useBPGraphStore()     // Blueprint graphs
useBuildStore()       // Build state
```

---

## 🚀 Quick Commands

```bash
# Development
npm run dev          # Start Next.js (localhost:3000)
npm run storybook    # Start Storybook (localhost:6006)

# Build
npm run build        # Production build
npm run build-storybook  # Storybook build

# Git
git checkout develop # Switch to develop branch
```

---

## 📚 See Also

- **Complete Architecture:** [REPOSITORY_ARCHITECTURE.md](./REPOSITORY_ARCHITECTURE.md)
- **Visual Mindmaps:** [REPOSITORY_MINDMAP.md](./REPOSITORY_MINDMAP.md)
- **System Diagrams:** [REPOSITORY_DIAGRAMS.md](./REPOSITORY_DIAGRAMS.md)
- **Overview:** [REPOSITORY_COMPLETE_OVERVIEW.md](./REPOSITORY_COMPLETE_OVERVIEW.md)

---

*Quick reference for developers working on LUMINES/WISSIL*

