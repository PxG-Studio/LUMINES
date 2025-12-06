## SLATE – Full IDE Architecture & Checklist

This document captures the **major components**, data flows, and **production‑readiness checks** for the `Slate / Pages / Full IDE` Storybook entry.

It is intended as a living reference while iterating on SLATE.

---

## 1. High‑Level Layout

- **Page entry**
  - **Story**: `Slate / Pages / Full IDE`
  - **Component**: `SlateLayout`
  - **Stories**: `Default`, `WithInteractions`, `KeyboardNavigation`, `BottomPanelKeyboard`, `Mobile`, `Tablet`, `WideScreen`

- **Shell**
  - `SlateLayout` is the **top‑level IDE shell**.
  - Wrapped in `IgnitionProvider` (runtime & messaging).
  - Uses `SplitView` primitives for all resizable panes:
    - Left vs Right columns
    - Inspector vs FileTree
    - Editor vs (Preview + BottomPanel)
    - Preview vs BottomPanel

---

## 2. Major Components (by Area)

### 2.1 Navigation & Chrome

- **`SlateLayout`**
  - Props:
    - `onFileSelect(path)`, `onTabSelect(tab)`, `onTabClose(tab)`
    - `onRun()`, `onRestart()`, `onStop()`
  - Children:
    - `Sidebar`
    - `EditorToolbar` / runtime bar
    - `TabBar`
    - `SplitView` (Inspector + FileTree)
    - `SplitView` (MonacoEditor + StatusBar + Preview + BottomPanel)

- **`Sidebar`**
  - Semantic `<nav aria-label="Primary navigation">`.
  - Buttons: `Explorer`, `Files` (and future entries), each:
    - `aria-label`
    - `aria-pressed`
    - Tooltip / title

- **`EditorToolbar` / `IgnitionRuntimeBar`**
  - Shows runtime state and **Run / Restart / Stop** buttons.
  - Forwards callbacks to `SlateLayout` props.

- **`StatusBar`**
  - Renders at bottom of editor column.
  - Sources data from `useEditorState` (cursor, file path, runtime state).

### 2.2 Left Column – Explorer & Inspector

- **`InspectorPanel`**
  - Reads `selectedFile` from `useEditorState`.
  - States:
    - No file → “No file selected” + guidance.
    - File selected → path / type / extension + placeholder metadata card.
  - Accessibility:
    - `role="region" aria-label="Inspector panel" tabIndex={0}`
    - Inner `role="status" aria-live="polite"` for empty state text.

- **`FileTree`**
  - Builds nested FS object from `useWissilFS().getSnapshot()`.
  - Uses `FileTreeNode` recursively.
  - Recomputes on FS changes via `regenerateTree()`.
  - Announces file changes via `#sr-announcements` `role="status"`.
  - Empty state: “No files yet” with icon + message.

- **`FileTreeNode`**
  - Determines folder vs file by `typeof value`.
  - For folders:
    - Expand / collapse.
    - Chevron icon rotated based on `open` state.
  - For files:
    - Calls `openFile(fullPath)` + `onFileClick(fullPath)`.
  - Accessibility:
    - `role="treeitem"`, `aria-expanded` for folders.
    - `aria-selected` based on `useEditorState().selectedFile`.
    - `aria-label` distinguishes "Folder {name}" vs "File {name}".
    - Keyboard: Enter/Space, ArrowLeft/Right, ArrowUp/Down for traversal.

### 2.3 Center – Editor Stack

- **`MonacoEditor`**
  - Active file from `useEditorTabs((s) => s.activeFile)`.
  - Loads / saves content via `useWissilFS.getState().readFile/writeFile`.
  - Configures Monaco:
    - Custom `nocturna-dark` theme.
    - TS/JS compiler options (ES2020, JSX React, `allowJs`, etc.).
    - Diagnostics enabled.
  - On change:
    - Writes to FS.
    - Updates local `value`.
    - Triggers `triggerHMR()` (debounced).
  - Tracks cursor via `setCursorPosition` in `useEditorState`.
  - Empty state when `!activeFile`: friendly, centered illustration + text.

- **`TabBar`**
  - Uses `useEditorTabs`:
    - `openFiles`, `activeFile`, `setActive`, `close`.
  - When no files:
    - Renders a `role="tablist"` with a disabled tab “No files open”.
  - When files present:
    - `role="tablist" aria-label="Open files"`.
    - Each file:
      - `role="tab"`, `aria-selected`, `aria-controls="editor-panel"`.
      - Close button:
        - `aria-label="Close {fileName}"`
        - Icon `✕` wrapped in `aria-hidden="true"`.
  - Keyboard:
    - ArrowLeft/Right, Home/End, `Ctrl+W` (close).

### 2.4 Right‑Bottom – Preview & Output

- **`PreviewPanel`**
  - Thin wrapper around `IgnisContainer`.
  - Intended for Unity / Ignis runtime view.

- **`BottomPanel`**
  - Tabs: `"console" | "logs" | "errors"`.
  - Tab bar:
    - `role="tablist" aria-label="Output panel tabs"`.
    - Each tab:
      - `role="tab"`, `aria-selected`, `aria-controls="{id}-panel"`, `tabIndex`.
      - ArrowLeft/Right moves between tabs.
  - Content:
    - Console: `ConsolePanel` inside `role="tabpanel" id="console-panel"`.
    - Logs + Errors:
      - `role="tabpanel"` with empty‑state illustrations and copy.

---

## 3. Shared Primitives & State

- **`SplitView`**
  - Props: `direction`, `initial`, `min`, `max`.
  - Renders:
    - Children wrapped with draggable divider.
    - Divider as `role="separator"` with:
      - `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
      - `aria-orientation`, `tabIndex=0`.
    - Keyboard: Arrow keys + Home/End to resize.

- **Global stores**
  - `useWissilFS` – virtual FS tree and read/write API.
  - `useEditorState` – selection, cursor position, runtime messages.
  - `useEditorTabs` – open tabs model and actions.

---

## 4. Storybook: Interaction & A11y Coverage

**File**: `src/wissil/Slate/FullSlate.stories.tsx`

- **Helpers**
  - `runBasicAssertions(playContext)`
    - Verifies:
      - Primary navigation exists.
      - Inspector + "No file open" editor state.
      - Run/Restart/Stop buttons enabled.
      - Console/Logs/Errors tabs present.
  - `exerciseRunAndPanels(playContext)`
    - Runs `runBasicAssertions`.
    - Clicks Run.
    - Switches Console → Logs → Errors → Console.

- **Stories**
  - `Default`
    - Desktop, idle status.
    - `play: runBasicAssertions`.
  - `WithInteractions`
    - Desktop, `status: "Ignition: ready"`.
    - Args wired with `fn()` spies:
      - `onFileSelect`, `onTabSelect`, `onTabClose`, `onRun`, `onRestart`, `onStop`.
    - A11y: disables only `color-contrast` rule due to Storybook chrome noise.
    - `play: exerciseRunAndPanels`.
  - `KeyboardNavigation`
    - Desktop.
    - A11y: `color-contrast` disabled (Storybook chrome).
    - `play`:
      - Runs `runBasicAssertions`.
      - Focuses File Explorer region.
      - If a tree exists:
        - Sends `{ArrowDown}`, `{ArrowUp}`.
      - If tabs exist:
        - Focuses first and sends `{ArrowRight}`, `{ArrowLeft}`.
  - `BottomPanelKeyboard`
    - Desktop.
    - A11y: `color-contrast` disabled.
    - `play`:
      - Runs `runBasicAssertions`.
      - Focuses bottom `tablist`.
      - Sends `{ArrowRight}`, `{ArrowRight}`, `{ArrowLeft}`.
  - `Mobile`
    - Viewport: `mobile1`.
    - Args: `status: "Ignition: idle"`, explicit `onRun/onRestart/onStop` spies.
    - A11y: `color-contrast` rule disabled.
    - `play: exerciseRunAndPanels`.
  - `Tablet`
    - Viewport: `tablet`.
    - Same pattern as `Mobile` (spies + `exerciseRunAndPanels` + a11y override).
  - `WideScreen`
    - Viewport: `wideScreen`.
    - Same pattern as `Mobile`/`Tablet`.

---

## 5. Production‑Readiness Checklist

Use this to track progress when hardening the Full IDE.

- **Shell & Layout**
  - [ ] `SlateLayout` renders correctly at desktop, tablet, mobile, widescreen.
  - [ ] All `SplitView` dividers are keyboard‑focusable and resize correctly.
  - [ ] Status bar always visible and not obscured at small heights.

- **File System**
  - [ ] `FileTree` updates when FS changes (add, remove, rename).
  - [ ] Selection stays in sync across tree, tabs, editor, and inspector.
  - [ ] No crashes when FS is empty.

- **Tabs & Editor**
  - [ ] Opening a file always opens/activates a tab and loads content in Monaco.
  - [ ] Closing the active tab re‑selects a sensible neighbor (or shows empty editor).
  - [ ] Unsaved changes are visibly indicated (tab + status bar).
  - [ ] Large files (2k+ lines) remain responsive.

- **Runtime & Output**
  - [ ] Run/Restart/Stop wired to Ignition runtime and update status bar.
  - [ ] Console/Logs/Errors show appropriate output and clear when re‑running.
  - [ ] Error states (build/runtime failure) are clearly surfaced and recoverable.

- **Accessibility**
  - [ ] All landmarks: primary navigation, main, inspector region, file explorer region.
  - [ ] `FileTree` and `TabBar` fully operable via keyboard.
  - [ ] Bottom panel tabs operable via keyboard.
  - [ ] Screen readers announce key changes (opened file, errors, runs).
  - [ ] No WCAG contrast failures inside SLATE components (Storybook chrome excluded).

- **Storybook Quality Gates**
  - [ ] All `FullSlate` stories pass their `play` functions without unhandled errors.
  - [ ] `Default` and `WithInteractions` a11y reports are clean (excluding known Storybook issues).
  - [ ] Mobile/Tablet/WideScreen stories validate behavior at each breakpoint.

Keep this document up to date as you add features (e.g., context menus, more runtime controls, multi‑project support) so the Full IDE remains understandable and testable as it grows.


