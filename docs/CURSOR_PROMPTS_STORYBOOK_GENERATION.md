# 🤖 Cursor AI Prompts for Storybook Generation

**Copy-paste these prompts into Cursor to auto-generate all missing Storybook stories.**

---

## 📋 Prompt 1: Generate Editor Shell Stories

```
Generate complete Storybook stories for WISSIL Editor Shell component based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. EditorShell.stories.tsx with:
   - Default layout (sidebar + panels visible)
   - Sidebar collapsed
   - Panels hidden
   - Split view modes (horizontal, vertical, quad)
   - Fullscreen mode
   - Custom panel arrangement

2. Sidebar.stories.tsx with:
   - Expanded state
   - Collapsed state
   - With menu items
   - With icons

3. TopBar.stories.tsx with:
   - Default menu bar
   - With file menu
   - With edit menu
   - With view menu
   - With settings

4. SplitPane.stories.tsx with:
   - Horizontal split (50/50)
   - Vertical split (50/50)
   - Quad split
   - Resizable splits
   - Custom split ratios

5. FileExplorer.stories.tsx with:
   - File tree navigation
   - Folder expansion/collapse
   - File selection
   - Context menu

6. Console.stories.tsx with:
   - Log output
   - Error output
   - Warning output
   - Info output
   - Clear console

7. CommandPalette.stories.tsx with:
   - Command search
   - Filtered results
   - Keyboard navigation
   - Command execution

8. TabBar.stories.tsx with:
   - Multiple open tabs
   - Active tab
   - Tab close button
   - Tab switching
   - Dirty state indicators

Use:
- TypeScript + React
- Storybook 7 format
- @storybook/react-vite
- Chromatic configuration (diffThreshold: 0.01)
- @storybook/addon-interactions for interactions
- Proper TypeScript types
- Mock data for file system

Location: src/stories/editor/
```

---

## 📋 Prompt 2: Generate Filesystem Stories

```
Generate complete Storybook stories for WISSIL Filesystem (WissilFS) components based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. FileTree.stories.tsx with:
   - Nested folder structure
   - File/folder icons
   - Expand/collapse
   - File selection
   - Context menu (rename, delete, new file)
   - Drag and drop

2. FileTabs.stories.tsx with:
   - Multiple open files
   - Active tab indicator
   - Tab close button
   - Tab switching
   - Dirty state (unsaved indicator)
   - Tab overflow (scrollable)

3. EditorPane.stories.tsx with:
   - File content display
   - Syntax highlighting
   - Line numbers
   - Code folding
   - Find/replace
   - Multiple panes

4. FileOperations.stories.tsx with:
   - Create new file
   - Create new folder
   - Rename file/folder
   - Delete file/folder
   - Move file/folder
   - Copy file/folder

5. DirtyState.stories.tsx with:
   - Unsaved changes indicator
   - Save prompt dialog
   - Discard changes
   - Save all
   - Auto-save indicator

Use mock file system data:
- Folders: Blueprints/, Assets/, Scripts/, Templates/
- Files: .blueprint, .cs, .json, .md
- Include realistic file sizes and timestamps

Location: src/stories/filesystem/
```

---

## 📋 Prompt 3: Generate Runtime Events Stories

```
Generate Storybook stories for Ignition Runtime Events (mocked Unity events) based on STORYBOOK_EXPANSION_PLAN.md.

Create RuntimeEventMock component and stories:

1. OnStart.stories.tsx:
   - Scene initialization event
   - GameObject spawn
   - Component initialization
   - Event payload visualization

2. OnUpdate.stories.tsx:
   - Frame update event (animated, 60fps simulation)
   - DeltaTime display
   - Update counter
   - Performance metrics

3. OnCardPlayed.stories.tsx:
   - Card game event
   - Card data in payload
   - Game state update
   - Event chain visualization

4. OnCapture.stories.tsx:
   - Card capture event
   - Capture logic display
   - Score update
   - Animation preview

5. OnScoreChange.stories.tsx:
   - Score change event
   - Score display update
   - Score history
   - Victory/defeat states

Requirements:
- Use React hooks for event simulation
- Mock Unity runtime bridge
- Include event payload inspector
- Show event propagation
- Disable Chromatic snapshots for animated stories (chromatic: { disable: true })
- Include play/pause controls
- Show event timeline

Location: src/stories/ignition/RuntimeEvents/
```

---

## 📋 Prompt 4: Generate Unity Bridge Stories

```
Generate Storybook stories for Unity Bridge (bidirectional communication mock) based on STORYBOOK_EXPANSION_PLAN.md.

Create UnityBridgeMock component and stories:

1. SendEvent.stories.tsx:
   - Send event to Unity
   - Event type selector
   - Payload editor (JSON)
   - Send button
   - Response status

2. ReceiveEvent.stories.tsx:
   - Receive event from Unity
   - Event queue display
   - Event payload viewer
   - Auto-scroll to latest
   - Filter by event type

3. HotReload.stories.tsx:
   - Hot reload simulation
   - Code change detection
   - Reload trigger
   - Reload progress
   - Reload success/error

4. ConsoleOutput.stories.tsx:
   - Unity console logs
   - Log levels (info, warning, error)
   - Log filtering
   - Clear console
   - Export logs

5. RuntimeLogs.stories.tsx:
   - Runtime log stream
   - Real-time updates
   - Log search
   - Log levels filter
   - Timestamp display

Requirements:
- Mock Unity WebGL runtime
- Use WebSocket simulation (setInterval)
- Include event history
- Show bidirectional communication flow
- Disable Chromatic for real-time stories
- Include pause/resume controls

Location: src/stories/unity-bridge/
```

---

## 📋 Prompt 5: Generate Waypoint AI Stories

```
Generate complete Storybook stories for Waypoint AI Panels based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. AISuggestions.stories.tsx:
   - AI suggestion list
   - Suggestion cards
   - Apply suggestion button
   - Dismiss suggestion
   - Loading state
   - Empty state

2. AIExplainer.stories.tsx:
   - Code explanation panel
   - Explanation text
   - Highlighted code sections
   - Next/previous navigation
   - Copy explanation
   - Feedback buttons

3. AIFixPanel.stories.tsx:
   - Auto-fix suggestions
   - Fix preview (before/after)
   - Apply fix button
   - Fix details expand
   - Multiple fixes
   - Fix confidence score

4. AIGraphGenerator.stories.tsx:
   - Graph generation prompt input
   - Generated graph preview
   - Graph customization options
   - Regenerate button
   - Export graph
   - Save to library

Requirements:
- Use mock AI responses (simulate API delay)
- Include loading skeletons
- Show error states
- Include retry mechanisms
- Use WISSIL design tokens
- Include Chromatic snapshots (except loading states)

Location: src/stories/waypoint/
```

---

## 📋 Prompt 6: Generate Spark Template Preview Stories

```
Generate Storybook stories for Spark Template Preview (full graph view) based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. TemplatePreview.stories.tsx:
   - Full template graph visualization
   - Zoom/pan controls
   - Node details on hover
   - Connection highlighting
   - Fullscreen mode

2. TemplateMetadata.stories.tsx:
   - Template name and description
   - Author information
   - Version and changelog
   - Tags and categories
   - Difficulty rating
   - Usage statistics

3. TemplateGraphView.stories.tsx:
   - Interactive graph canvas
   - Node library sidebar
   - Search nodes
   - Filter by category
   - Add node to template
   - Export template

Requirements:
- Use Ignis Blueprint Editor components
- Include template graph data
- Mock template assets
- Show onboarding steps
- Include customization options
- Use Chromatic for static previews

Location: src/stories/spark/
```

---

## 📋 Prompt 7: Generate Theming Stories

```
Generate Storybook stories for Global Theming / Modes based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. DarkMode.stories.tsx:
   - All components in dark mode
   - Dark mode color palette
   - Contrast verification
   - Shadow styling

2. LightMode.stories.tsx:
   - All components in light mode
   - Light mode color palette
   - Border styling
   - Background colors

3. HighContrast.stories.tsx:
   - High contrast theme
   - Accessibility compliance
   - Color contrast ratios
   - Border emphasis

4. SystemMode.stories.tsx:
   - System theme detection
   - Auto-switch on system change
   - Theme persistence
   - Theme toggle button

Requirements:
- Use CSS custom properties for theming
- Include all Slate design tokens
- Test with Ignis Blueprint Editor
- Test with all UI components
- Verify contrast ratios (WCAG AA)
- Include theme switcher component

Location: src/stories/theming/
```

---

## 📋 Prompt 8: Generate Error States Stories

```
Generate Storybook stories for Error States & Recovery based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. BrokenNode.stories.tsx:
   - Node error visualization
   - Error message display
   - Error icon
   - Retry button
   - Remove node option

2. MissingProp.stories.tsx:
   - Missing prop warning
   - Prop name highlight
   - Suggested default value
   - Auto-fix suggestion
   - Ignore option

3. MissingSocket.stories.tsx:
   - Missing socket error
   - Socket location highlight
   - Connection suggestion
   - Create socket option
   - Remove connection option

4. InvalidWire.stories.tsx:
   - Type mismatch visualization
   - Source/target socket highlight
   - Type information display
   - Fix suggestion (type conversion)
   - Remove wire option

5. RuntimeException.stories.tsx:
   - Runtime error display
   - Stack trace
   - Error context
   - Restart runtime option
   - Report error option

6. AIError.stories.tsx:
   - AI error message
   - Error reason
   - Retry with LUNA
   - Fallback suggestion
   - Report to team

Requirements:
- Use ErrorBoundary components
- Include error recovery UI
- Show error state styling
- Test error contrast (readability)
- Include error actions
- Mock error scenarios

Location: src/stories/error-states/
```

---

## 📋 Prompt 9: Generate Sync States Stories

```
Generate Storybook stories for Editor → Runtime Synchronization based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. RuntimeHighlightNode.stories.tsx:
   - Node highlight on runtime execution
   - Execution flow visualization
   - Active node indicator
   - Execution timeline
   - Step forward/backward

2. RuntimeValueWatch.stories.tsx:
   - Variable value display
   - Real-time value updates
   - Value history
   - Watch/unwatch controls
   - Value type indicators

3. DebuggerStepThrough.stories.tsx:
   - Breakpoint visualization
   - Step over/into/out
   - Call stack display
   - Variable inspection
   - Resume execution
   - Pause execution

Requirements:
- Sync with Ignis Blueprint Editor
- Mock runtime execution
- Use animation for highlighting
- Include debug controls
- Show execution flow
- Disable Chromatic for animated states

Location: src/stories/sync-states/
```

---

## 📋 Prompt 10: Generate Simulation Scenarios Stories

```
Generate Storybook stories for WISSIL Simulation Mode Scenarios based on STORYBOOK_EXPANSION_PLAN.md.

Create:
1. CardFrontGameLoop.stories.tsx:
   - Complete game loop simulation
   - Turn-based flow
   - Card draw/discard
   - Capture logic
   - Score tracking
   - Victory/defeat states

2. TurnBasedSimulation.stories.tsx:
   - Turn sequence
   - Player actions
   - AI opponent moves
   - Turn timer
   - Skip turn option
   - Turn history

3. AISimulation.stories.tsx:
   - AI decision making
   - AI move prediction
   - AI difficulty levels
   - AI analysis display
   - AI move history

4. AutoPlaytest.stories.tsx:
   - Automated game simulation
   - Multiple game runs
   - Statistics collection
   - Performance metrics
   - Bug detection
   - Test results

Requirements:
- Use CardFront game logic
- Include game state management
- Show real-time simulation
- Include controls (play/pause/reset)
- Mock Unity runtime
- Include performance profiling
- Disable Chromatic for dynamic simulations

Location: src/stories/simulation/
```

---

## 🚀 Batch Generation Prompt

```
Generate ALL missing Storybook stories for WISSIL based on STORYBOOK_EXPANSION_PLAN.md.

Generate stories for:
1. Editor Shell (8 components)
2. Filesystem (5 components)
3. Runtime Events (5 events)
4. Unity Bridge (5 components)
5. Waypoint AI (4 panels)
6. Spark Templates (3 views)
7. Theming (4 modes)
8. Error States (6 errors)
9. Sync States (3 states)
10. Simulation (4 scenarios)

Follow these rules:
- Use TypeScript + React
- Storybook 7 format
- Include Chromatic config
- Use @storybook/addon-interactions
- Include proper TypeScript types
- Use WISSIL design tokens
- Include mock data
- Follow naming conventions from plan
- Location: src/stories/[category]/

Generate all files in one batch.
```

---

## ✅ Verification Checklist

After generation, verify:
- [ ] All stories compile without errors
- [ ] Chromatic configuration is correct
- [ ] Mock data is realistic
- [ ] TypeScript types are correct
- [ ] Stories follow naming conventions
- [ ] All interactions work
- [ ] Visual regression tests pass
- [ ] Documentation is auto-generated

---

**Ready to Generate** 🚀

*Copy these prompts into Cursor for instant story generation*

