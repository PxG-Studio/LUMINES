# 📚 WISSIL Storybook Expansion Plan — Phase 1–3

**Goal: Transform Storybook from 90% → 100% IDE-Level Completeness**

*Target: Bolt.new / StackBlitz / VSCode Web-level quality*

---

## 📊 Current Status

### ✅ **What You Have (90%)**
- WISSIL Design System structure
- Slate primitives
- Ignis Blueprint Editor
- Ignition runtime
- Spark templates
- Basic IDE simulation

### ❌ **What's Missing (10%)**
1. WISSIL Editor Shell (layout composition)
2. WISSIL Filesystem (WissilFS) stories
3. Ignition Runtime Events Mock
4. LUNA / Waypoint AI Panels
5. Spark Template Preview (full graph view)
6. Unity Bridge Testing (Mock)
7. Global Theming / Modes
8. Error States & Recovery
9. Editor → Runtime Synchronization
10. WISSIL Simulation Mode Scenarios

---

## 📁 Complete Storybook Folder Structure

```
src/stories/
├── wissil/
│   ├── Landing.stories.tsx
│   ├── Slate/
│   ├── Ignition/
│   ├── Spark/
│   ├── Ignis/
│   └── Waypoint/
│
├── editor/
│   ├── EditorShell.stories.tsx          ← NEW
│   ├── Sidebar.stories.tsx               ← NEW
│   ├── TopBar.stories.tsx                ← NEW
│   ├── SplitPane.stories.tsx             ← NEW
│   ├── FileExplorer.stories.tsx          ← NEW
│   ├── Console.stories.tsx               ← NEW
│   ├── CommandPalette.stories.tsx        ← NEW
│   └── TabBar.stories.tsx                ← NEW
│
├── filesystem/                           ← NEW
│   ├── FileTree.stories.tsx
│   ├── FileTabs.stories.tsx
│   ├── EditorPane.stories.tsx
│   ├── FileOperations.stories.tsx
│   └── DirtyState.stories.tsx
│
├── ignition/
│   └── RuntimeEvents.stories.tsx         ← NEW
│       • Event: OnStart
│       • Event: OnUpdate
│       • Event: OnCardPlayed
│       • Event: OnCapture
│       • Event: OnScoreChange
│
├── waypoint/                             ← EXPAND
│   ├── AISuggestions.stories.tsx         ← NEW
│   ├── AIExplainer.stories.tsx           ← NEW
│   ├── AIFixPanel.stories.tsx            ← NEW
│   └── AIGraphGenerator.stories.tsx      ← NEW
│
├── spark/                                ← EXPAND
│   ├── TemplatePreview.stories.tsx       ← NEW
│   ├── TemplateMetadata.stories.tsx      ← NEW
│   └── TemplateGraphView.stories.tsx     ← NEW
│
├── unity-bridge/                         ← NEW
│   ├── SendEvent.stories.tsx
│   ├── ReceiveEvent.stories.tsx
│   ├── HotReload.stories.tsx
│   ├── ConsoleOutput.stories.tsx
│   └── RuntimeLogs.stories.tsx
│
├── theming/                              ← NEW
│   ├── DarkMode.stories.tsx
│   ├── LightMode.stories.tsx
│   ├── HighContrast.stories.tsx
│   └── SystemMode.stories.tsx
│
├── error-states/                         ← NEW
│   ├── BrokenNode.stories.tsx
│   ├── MissingProp.stories.tsx
│   ├── MissingSocket.stories.tsx
│   ├── InvalidWire.stories.tsx
│   ├── RuntimeException.stories.tsx
│   └── AIError.stories.tsx
│
├── sync-states/                          ← NEW
│   ├── RuntimeHighlightNode.stories.tsx
│   ├── RuntimeValueWatch.stories.tsx
│   └── DebuggerStepThrough.stories.tsx
│
└── simulation/                           ← EXPAND
    ├── CardFrontGameLoop.stories.tsx     ← NEW
    ├── TurnBasedSimulation.stories.tsx   ← NEW
    ├── AISimulation.stories.tsx          ← NEW
    └── AutoPlaytest.stories.tsx          ← NEW
```

---

## 🎯 Phase 1: Core Infrastructure (Week 1)

### 1.1 Editor Shell

**File:** `src/stories/editor/EditorShell.stories.tsx`

**Purpose:** Test complete IDE layout composition

**Stories:**
- Default layout
- With sidebar collapsed
- With panels hidden
- Split view modes
- Fullscreen mode
- Custom panel arrangement

### 1.2 Filesystem

**File:** `src/stories/filesystem/FileTree.stories.tsx`

**Purpose:** Test file tree, tabs, dirty states

**Stories:**
- File tree navigation
- File open/close
- File rename
- Dirty state indicators
- Multiple tabs
- Tab switching

### 1.3 Theming

**File:** `src/stories/theming/DarkMode.stories.tsx`

**Purpose:** Test all components in different themes

**Stories:**
- Dark mode (all components)
- Light mode (all components)
- High contrast (all components)
- System mode toggle

---

## 🎯 Phase 2: Runtime & Integration (Week 2)

### 2.1 Ignition Runtime Events

**File:** `src/stories/ignition/RuntimeEvents.stories.tsx`

**Purpose:** Mock Unity runtime events for testing

**Stories:**
- OnStart event
- OnUpdate event
- Custom game events
- Event propagation
- Event debugging

### 2.2 Unity Bridge

**File:** `src/stories/unity-bridge/SendEvent.stories.tsx`

**Purpose:** Test bidirectional communication

**Stories:**
- Send event to Unity
- Receive event from Unity
- Hot reload simulation
- Console output streaming
- Runtime logs

### 2.3 Editor → Runtime Sync

**File:** `src/stories/sync-states/RuntimeHighlightNode.stories.tsx`

**Purpose:** Test blueprint-to-runtime synchronization

**Stories:**
- Runtime node highlighting
- Runtime value watching
- Debugger step-through
- Breakpoints
- Variable inspection

---

## 🎯 Phase 3: Advanced Features (Week 3)

### 3.1 Waypoint AI Panels

**File:** `src/stories/waypoint/AISuggestions.stories.tsx`

**Purpose:** Test AI assistant features

**Stories:**
- AI suggestions panel
- AI explainer
- AI fix panel
- Graph generation
- Code explanations

### 3.2 Spark Template Previews

**File:** `src/stories/spark/TemplatePreview.stories.tsx`

**Purpose:** Full template visualization

**Stories:**
- Template graph view
- Template metadata
- Template assets
- Onboarding steps
- Template customization

### 3.3 Error States

**File:** `src/stories/error-states/BrokenNode.stories.tsx`

**Purpose:** Test error handling and recovery

**Stories:**
- Broken node visualization
- Missing prop errors
- Invalid wire errors
- Runtime exceptions
- AI error handling
- Recovery suggestions

### 3.4 Simulation Scenarios

**File:** `src/stories/simulation/CardFrontGameLoop.stories.tsx`

**Purpose:** End-to-end gameplay simulation

**Stories:**
- CardFront game loop
- Turn-based simulation
- AI simulation
- Auto-playtest
- Performance profiling

---

## 📝 Story Template Library

### Template 1: Editor Component Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { EditorShell } from '@/editor/EditorShell';

const meta = {
  title: 'Editor/Editor Shell',
  component: EditorShell,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.2,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditorShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: true,
  },
};

export const SidebarCollapsed: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: true,
  },
};

export const Fullscreen: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: false,
  },
};
```

### Template 2: Runtime Event Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { RuntimeEventMock } from '@/ignition/RuntimeEventMock';

const meta = {
  title: 'Ignition/Runtime Events',
  component: RuntimeEventMock,
  parameters: {
    layout: 'padded',
    chromatic: { disable: true }, // Disable for dynamic events
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RuntimeEventMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnStart: Story = {
  args: {
    eventType: 'OnStart',
    payload: { sceneId: 'main' },
  },
};

export const OnUpdate: Story = {
  args: {
    eventType: 'OnUpdate',
    payload: { deltaTime: 0.016 },
    repeat: true,
    interval: 16,
  },
};
```

### Template 3: Error State Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from '@/error-states/ErrorBoundary';

const meta = {
  title: 'Error States/Broken Node',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
    chromatic: { diffThreshold: 0.1 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MissingSocket: Story = {
  args: {
    error: {
      type: 'missing-socket',
      nodeId: 'node-123',
      socketId: 'output-0',
      message: 'Required output socket not found',
    },
  },
};

export const InvalidWire: Story = {
  args: {
    error: {
      type: 'invalid-wire',
      connectionId: 'conn-456',
      message: 'Cannot connect float to exec socket',
    },
  },
};
```

---

## 🚀 Implementation Guide

### Step 1: Create Folder Structure

```bash
mkdir -p src/stories/{editor,filesystem,unity-bridge,theming,error-states,sync-states,simulation}
```

### Step 2: Generate Stories (Use Cursor AI)

**Prompt for Cursor:**
```
Generate Storybook stories for WISSIL Editor Shell component:
- Default layout with sidebar and panels
- Sidebar collapsed state
- Panels hidden state
- Split view modes (horizontal, vertical, quad)
- Fullscreen mode
- Custom panel arrangement

Use the story template format from STORYBOOK_EXPANSION_PLAN.md.
Include Chromatic configuration for visual regression testing.
```

### Step 3: Register in Storybook

Stories are auto-discovered if you follow the naming convention:
- `*.stories.tsx` or `*.stories.ts`
- Located in `src/stories/` or `stories/`

### Step 4: Test with Chromatic

```bash
npm run chromatic
```

---

## 📋 Checklist

### Phase 1: Core Infrastructure
- [ ] Editor Shell stories
- [ ] Sidebar stories
- [ ] TopBar stories
- [ ] SplitPane stories
- [ ] File Explorer stories
- [ ] Console stories
- [ ] Command Palette stories
- [ ] File Tree stories
- [ ] File Tabs stories
- [ ] Editor Pane stories
- [ ] Dark Mode stories
- [ ] Light Mode stories
- [ ] High Contrast stories

### Phase 2: Runtime & Integration
- [ ] Runtime Events (OnStart, OnUpdate, etc.)
- [ ] Unity Bridge (Send/Receive events)
- [ ] Hot Reload simulation
- [ ] Console Output stories
- [ ] Runtime Logs stories
- [ ] Runtime Highlight Node
- [ ] Runtime Value Watch
- [ ] Debugger Step Through

### Phase 3: Advanced Features
- [ ] AI Suggestions panel
- [ ] AI Explainer
- [ ] AI Fix Panel
- [ ] AI Graph Generator
- [ ] Template Preview (full graph)
- [ ] Template Metadata
- [ ] Broken Node errors
- [ ] Missing Prop errors
- [ ] Invalid Wire errors
- [ ] RuntimeException stories
- [ ] CardFront Game Loop
- [ ] Turn-based Simulation
- [ ] AI Simulation
- [ ] Auto Playtest

---

## 🎨 Chromatic Configuration

**File:** `.storybook/main.ts`

```typescript
export default {
  parameters: {
    chromatic: {
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true,
      viewports: [1280, 768, 375],
      // Disable for dynamic/interactive stories
      disableSnapshot: false,
    },
  },
};
```

---

## 🔄 Auto-Generation Prompts

### For Cursor AI

**Prompt 1: Generate All Editor Stories**
```
Generate all WISSIL Editor Shell Storybook stories based on STORYBOOK_EXPANSION_PLAN.md:
- EditorShell with all layout variants
- Sidebar with collapsed/expanded states
- TopBar with menu items
- SplitPane with different split configurations
- FileExplorer with file tree navigation
- Console with log output
- CommandPalette with command search
- TabBar with multiple tabs and close buttons

Use TypeScript, React, and Storybook 7 format.
Include Chromatic configuration.
```

**Prompt 2: Generate Filesystem Stories**
```
Generate WISSIL Filesystem Storybook stories:
- FileTree with nested folders and files
- FileTabs with open/close/switch functionality
- EditorPane with file content
- FileOperations (create, rename, delete)
- DirtyState indicators and unsaved changes warnings

Use mock file system data.
Include interaction testing with @storybook/addon-interactions.
```

**Prompt 3: Generate Runtime Event Stories**
```
Generate Ignition Runtime Events mock stories:
- OnStart event with scene initialization
- OnUpdate event with frame updates (animated)
- OnCardPlayed event with game state updates
- OnCapture event with card capture logic
- OnScoreChange event with score updates

Use mock Unity runtime events.
Include event propagation visualization.
Disable Chromatic snapshots for animated stories.
```

**Prompt 4: Generate Error State Stories**
```
Generate Error States Storybook stories:
- BrokenNode with error messages and recovery
- MissingProp with prop validation errors
- MissingSocket with socket connection errors
- InvalidWire with type mismatch errors
- RuntimeException with stack traces
- AIError with AI suggestion failures

Use ErrorBoundary components.
Include error recovery UI.
Test error state styling and contrast.
```

**Prompt 5: Generate Waypoint AI Stories**
```
Generate Waypoint AI Panel Storybook stories:
- AISuggestions with suggestion list and selection
- AIExplainer with code explanation display
- AIFixPanel with auto-fix suggestions and preview
- AIGraphGenerator with generated blueprint preview

Use mock AI responses.
Include loading states.
Test AI response formatting.
```

---

## 📊 Story Coverage Matrix

| Component | Stories | Chromatic | Interactions | Status |
|-----------|---------|-----------|--------------|--------|
| Editor Shell | 6 | ✅ | ✅ | ⏳ Pending |
| Sidebar | 4 | ✅ | ✅ | ⏳ Pending |
| Filesystem | 8 | ✅ | ✅ | ⏳ Pending |
| Runtime Events | 5 | ❌ | ✅ | ⏳ Pending |
| Unity Bridge | 5 | ❌ | ✅ | ⏳ Pending |
| Waypoint AI | 4 | ✅ | ✅ | ⏳ Pending |
| Spark Templates | 3 | ✅ | ✅ | ⏳ Pending |
| Theming | 4 | ✅ | ❌ | ⏳ Pending |
| Error States | 6 | ✅ | ✅ | ⏳ Pending |
| Sync States | 3 | ❌ | ✅ | ⏳ Pending |
| Simulation | 4 | ❌ | ✅ | ⏳ Pending |

---

## ✅ Success Criteria

**Phase 1 Complete When:**
- ✅ All editor shell components have stories
- ✅ Filesystem components have full coverage
- ✅ Theming works across all components
- ✅ Chromatic passes for all Phase 1 stories

**Phase 2 Complete When:**
- ✅ Runtime events can be simulated
- ✅ Unity bridge communication is testable
- ✅ Editor-runtime sync is validated
- ✅ All integration stories work

**Phase 3 Complete When:**
- ✅ AI panels are fully functional
- ✅ Template previews show complete graphs
- ✅ Error states are handled gracefully
- ✅ Simulation scenarios run end-to-end

---

## 🎯 Final Target

**Once complete, your Storybook will be:**

✅ **Bolt.new-level reliability**  
✅ **VSCode Web-level visualization**  
✅ **Figma-level consistency**  
✅ **Unity Editor-level modularity**  
✅ **StackBlitz-level completeness**

**Production-ready. Enterprise-grade. IDE-level.**

---

**Status: Ready for Implementation** 🚀

*Last Updated: December 2024*

