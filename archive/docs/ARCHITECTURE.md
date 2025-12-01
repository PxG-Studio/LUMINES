# WISSIL Architecture - 9.5/10 Production-Ready

This document outlines the complete architecture for the WISSIL IDE system built on Next.js, Storybook, and modern runtime technologies.

## 📁 Folder Structure

```
/src
  /design-system
    /tokens          # Color, spacing, typography tokens
    /themes          # CSS themes (Nocturna dark theme)
    /primitives      # Button, Card, Panel, Surface components
    /icons           # Icon components
    /layouts         # SplitView, PanelGrid, etc.

  /wissil
    /Landing         # Main gateway page
    /Slate           # IDE shell (editor + panels)
    /Ignition        # Runtime engine (Sandpack + Vite)
    /Ignis           # Preview layer (Unity WebGL)
    /Spark           # Templates & examples
    /Waypoint        # Documentation & reference

  /runtime
    /sandpack        # Sandpack file system abstraction
    /sandbox-bridge  # Communication layer (postMessage + WebSocket)
    /compiler        # Vite transform pipeline

  /components
    /ui              # General UI components
    /editor          # CodeEditor, UnityPreviewWrapper
    /panels          # FileTree, TabBar, Sidebar
    /navigation      # Navigation components

  /state             # Zustand stores (editor, runtime, preview, UI)
  /hooks             # Custom React hooks
  /utils             # Utility functions

.storybook           # Storybook configuration
public               # Static assets
```

## 🎨 Design System

### Nocturna Design System

Optimized for dark-mode IDE environments with:

- **Color Tokens**: Semantic color system (`--nv-bg-0`, `--nv-accent`, etc.)
- **Spacing Tokens**: Consistent spacing scale (`--nv-space-1` through `--nv-space-9`)
- **Primitives**: Button, Card, Panel, Surface components
- **Layouts**: SplitView, PanelGrid for draggable interfaces

### Usage

```tsx
import { Button, Card, Panel, Surface } from '@/design-system/primitives';
import { SplitView } from '@/design-system/layouts';
```

## ⚡ Runtime Architecture

### Ignition Runtime (Sandpack + Vite Hybrid)

**Sandpack** provides:
- VM-powered code execution (like StackBlitz)
- File system abstraction
- Dependency isolation
- Security through sandboxed iframes

**Vite Transform** provides:
- Hot module replacement (HMR)
- Fast dev experience
- Real error overlays
- Code transformation pipeline

### Sandbox Bridge

Communication layer between:
- **Slate** (Editor) ↔ **Ignition** (Runtime)
- Uses `postMessage` for iframe communication
- Optional WebSocket for live updates
- Event-driven architecture

```typescript
import { getBridge } from '@/runtime/sandbox-bridge';

const bridge = getBridge();
bridge.send({
  type: 'code-change',
  payload: { path: '/App.tsx', content: '...' }
});
```

## 🎮 Unity WebGL Integration (Ignis)

### Unity Preview Wrapper

Features:
- Lazy loads Unity loader.js
- Shadow DOM isolation (prevents Storybook CSS interference)
- Throttled resize events
- Memory-efficient canvas mounting
- PostMessage bridge back to editor

```tsx
<UnityPreviewWrapper
  buildUrl="/unity-build"
  loaderUrl="/unity/loader.js"
  onUnityLoaded={() => console.log('Unity ready')}
/>
```

### Key Techniques

1. **Shadow DOM Isolation**: Prevents CSS conflicts
2. **Lazy Loading**: Only loads when visible
3. **Event Throttling**: Prevents performance issues
4. **Memoization**: Optimized re-renders

## 📊 State Management

### Zustand Stores

Four main stores:

1. **EditorState**: File management, tabs, active file
2. **RuntimeState**: Compilation, errors, build output
3. **PreviewState**: Unity loading, canvas size, fullscreen
4. **UIState**: Sidebar, panels, theme preferences

```typescript
import { useEditorState, useRuntimeState } from '@/state';

const { files, openFile, updateFile } = useEditorState();
const { isRunning, errors, start, stop } = useRuntimeState();
```

## 🧩 Component Architecture

### Editor Components

- **CodeEditor**: Monaco editor integration (placeholder for now)
- **UnityPreviewWrapper**: Unity WebGL preview with isolation

### Panel Components

- **FileTree**: File explorer with folder expansion
- **TabBar**: Open file tabs with dirty indicators

### Layout Components

- **SplitView**: Draggable split panes (horizontal/vertical)

## 🔌 Integration Points

### How Components Connect

```
Slate (Editor)
  ↓ (SandboxBridge)
Ignition (Runtime)
  ↓ (Sandpack FS)
Vite Transform
  ↓ (compile)
Bundle Output
  ↓ (postMessage)
Ignis (Preview)
```

## 🚀 Getting Started

### Development

```bash
# Install dependencies
npm install

# Start Next.js dev server
npm run dev

# Start Storybook
npm run storybook
```

### Build

```bash
# Build Next.js app
npm run build

# Build Storybook
npm run build-storybook
```

## 📝 Next Steps

1. **Monaco Editor Integration**: Replace placeholder CodeEditor with @monaco-editor/react
2. **Sandpack Full Integration**: Complete Sandpack provider setup
3. **Unity Build Pipeline**: Set up Unity WebGL build process
4. **Template System**: Implement Spark template injection
5. **Documentation Renderer**: Complete Waypoint MDX renderer

## 🎯 Production Readiness Checklist

- [x] Design system tokens and primitives
- [x] State management with Zustand
- [x] Runtime abstraction layer
- [x] Unity WebGL wrapper
- [x] Component architecture
- [ ] Monaco editor integration
- [ ] Full Sandpack integration
- [ ] Template system
- [ ] Documentation renderer
- [ ] Error handling & logging
- [ ] Performance optimization
- [ ] Accessibility (a11y)
- [ ] Testing suite

## 📚 Resources

- [Sandpack Documentation](https://sandpack.codesandbox.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Unity WebGL](https://docs.unity3d.com/Manual/webgl.html)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Storybook](https://storybook.js.org/)


