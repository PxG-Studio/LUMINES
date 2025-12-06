# 🔥 WISSIL QA TESTING PLAN (QC MASTER)

**WISSIL / LUMINES — Comprehensive Quality Assurance Testing Plan**

*Last updated: December 2024*

---

## 📘 Scope

All subsystems across Ignis, Ignition, Slate, Spark, Collab, and Waypoint.

This testing plan validates:
- ✅ Ignis (Node IDE)
- ✅ Ignition (Runtime + WebGL bridge)
- ✅ Slate (Design System)
- ✅ Spark (Templates)
- ✅ Waypoint (LUNA Assistance)
- ✅ Collab Layer (Figma-style Real-time Collaboration)
- ✅ Storybook + Chromatic Visual Regression

---

# ⭐ QC.1 — Foundational Testing (Slate Baseline)

These tests guarantee the design system is healthy.

**If Slate breaks, Ignis breaks.**

---

## ✔ QC.1.1 — Token Integrity

Validate every token:

- ✅ Colors
- ✅ Spacing
- ✅ Radii
- ✅ Fonts
- ✅ Shadows
- ✅ Wire colors
- ✅ Node background
- ✅ Canvas background

**Method:** Storybook + automated Chromatic visual snapshots.

**Expected Result:** All tokens render consistently across all subsystems.

---

## ✔ QC.1.2 — Component Visual Tests

Test all Slate components:

- ✅ Button
- ✅ Input
- ✅ Toggle
- ✅ Slider
- ✅ Panel
- ✅ Tabs
- ✅ Tree
- ✅ List
- ✅ Popover
- ✅ Tooltip
- ✅ Dialog

**Test Types:**

- ✅ Visual diff (Chromatic snapshots)
- ✅ Focus/keyboard navigation
- ✅ Resizing behavior
- ✅ Theme switching (dark/light)

**Expected Result:** All components pass visual regression tests and accessibility checks.

---

# ⭐ QC.2 — Ignis Editor Atomic Component Testing

Each node-editing component gets its own QA block.

---

## ✔ QC.2.1 — NodeRenderer

**Test:**

- ✅ Renders title correctly
- ✅ Renders sockets (input/output)
- ✅ Dynamic prop editors work
- ✅ Resizes correctly
- ✅ Drag handle works
- ✅ Node color tokens load correctly
- ✅ Node selection state visible
- ✅ Node hover state works

**Expected Result:** All node types render consistently with proper layout.

---

## ✔ QC.2.2 — WireRenderer

**Test:**

- ✅ Bézier curves draw correctly
- ✅ Type-colored wires (exec, float, string, bool, vector3)
- ✅ Wire hover state
- ✅ Wire selection state
- ✅ Wire endpoints stick to sockets
- ✅ No z-index clipping
- ✅ Wire paths don't overlap nodes
- ✅ Wire curves are smooth

**Expected Result:** All wire connections render accurately with proper visual feedback.

---

## ✔ QC.2.3 — NodePalette

**Test:**

- ✅ Search works (real-time filtering)
- ✅ Category filter works
- ✅ Adding node pushes correct operation
- ✅ Keyboard navigation (arrow keys, enter)
- ✅ Scroll behavior
- ✅ Category expansion/collapse
- ✅ Node descriptions display

**Expected Result:** Users can quickly find and add nodes to the canvas.

---

## ✔ QC.2.4 — Inspector Panel

**Test:**

- ✅ Displays node props correctly
- ✅ Updating prop updates node in real-time
- ✅ Validation (numeric, vector, bool, string)
- ✅ Live update re-renders
- ✅ Field types match socket types
- ✅ Default values display
- ✅ Required fields indicated

**Expected Result:** Property editing works seamlessly with visual feedback.

---

# ⭐ QC.3 — Ignis Canvas & Interaction Testing

---

## ✔ QC.3.1 — Canvas Movement

**Test:**

- ✅ Pan with mouse drag
- ✅ Pan with middle mouse button
- ✅ Pan with Shift+Left click
- ✅ Zoom with wheel
- ✅ Zoom origin preserved
- ✅ Reset zoom works (Ctrl+0)
- ✅ Zoom limits respected (min/max)
- ✅ Pan boundaries work

**Expected Result:** Canvas navigation feels smooth and intuitive.

---

## ✔ QC.3.2 — Node Interaction

**Test:**

- ✅ Drag node (single)
- ✅ Drag multiple nodes
- ✅ Snap to grid
- ✅ Multi-select node (Shift+Click, Ctrl+Click)
- ✅ Delete nodes (Delete key, Backspace)
- ✅ Duplicate nodes (Ctrl+D)
- ✅ Copy/paste nodes (Ctrl+C, Ctrl+V)
- ✅ Undo/Redo operations
- ✅ Node context menu

**Expected Result:** All node manipulation operations work reliably.

---

## ✔ QC.3.3 — Wire Interaction

**Test:**

- ✅ Drag from output socket to create wire
- ✅ Drag from input socket to create wire
- ✅ Invalid socket types blocked (type mismatch)
- ✅ Remove wire via click
- ✅ Remove wire via keyboard
- ✅ Auto-routing paths avoid nodes
- ✅ Wire snapping to sockets
- ✅ Multiple connections to same input (if allowed)

**Expected Result:** Wire creation and deletion work seamlessly.

---

## ✔ QC.3.4 — Error Cases

**Test:**

- ✅ Wire to missing node (error handling)
- ✅ Missing output socket (validation)
- ✅ Orphan node warnings
- ✅ Cycle detection (exec flow loops)
- ✅ Type mismatch warnings
- ✅ Required socket not connected warnings

**Expected Result:** Error states are clearly communicated to users.

---

# ⭐ QC.4 — BPGraph Model & State Testing

---

## ✔ QC.4.1 — Add Node Operation

**Test:**

Effect recorded in:

- ✅ GraphStore (Zustand state)
- ✅ CollabStore (multi-user sync)
- ✅ BlueprintAssetAPI (persistence)

**Expected Result:** Node addition updates all state layers correctly.

---

## ✔ QC.4.2 — Update Props

**Test:**

Verify:

- ✅ Deep property merge
- ✅ No mutations to other nodes
- ✅ Undo works (if implemented)
- ✅ Redo works (if implemented)
- ✅ State persistence

**Expected Result:** Property updates are atomic and reversible.

---

## ✔ QC.4.3 — Connection Graph Validity

**Test:**

Check:

- ✅ DAG integrity (for exec graph)
- ✅ No impossible loops in exec flow
- ✅ Type matching enforced
- ✅ Unique connection IDs
- ✅ No duplicate connections
- ✅ Socket direction validation

**Expected Result:** Graph structure remains valid at all times.

---

# ⭐ QC.5 — Interpreter Testing (BPInterpreter)

---

## ✔ QC.5.1 — Core Flow

**Test:**

- ✅ Single Sequence
- ✅ Sequence → Print
- ✅ Branch → True/False
- ✅ Delay node execution
- ✅ Event node triggers

**Expected Result:** Basic execution flow works correctly.

---

## ✔ QC.5.2 — Math Nodes

**Test:**

- ✅ Add (float, int)
- ✅ Subtract
- ✅ Multiply
- ✅ Divide (handle division by zero)
- ✅ Modulo
- ✅ Vector operations

**Expected Result:** All math operations compute correctly.

---

## ✔ QC.5.3 — Variable Nodes

**Test:**

- ✅ SetVar (create variable)
- ✅ GetVar (retrieve variable)
- ✅ Variable scoping (graph-level)
- ✅ Overwrites (update existing variable)
- ✅ Variable persistence across execution

**Expected Result:** Variable system works reliably.

---

## ✔ QC.5.4 — Unity API Mock

**Test:**

- ✅ GetPosition mock
- ✅ SetPosition mock
- ✅ PlaySound mock
- ✅ SpawnPrefab mock
- ✅ DestroyObject mock

**Expected Result:** Unity API calls are properly mocked for testing.

---

## ✔ QC.5.5 — Error Handling

**Test:**

- ✅ Missing input (default value fallback)
- ✅ Unsupported type (error message)
- ✅ Runtime loop detection
- ✅ Stack overflow prevention
- ✅ Null reference handling

**Expected Result:** Interpreter handles errors gracefully.

---

# ⭐ QC.6 — Collaboration Testing (Real-Time Multi-User)

---

## ✔ QC.6.1 — Basic Presence

**Test:**

- ✅ Cursor display (remote users)
- ✅ Color assignment (unique per user)
- ✅ Username display
- ✅ Cursor movement smooth
- ✅ Cursor disappears on disconnect

**Expected Result:** Users can see each other's presence clearly.

---

## ✔ QC.6.2 — Node Synced Movement

**Test:**

- ✅ Two clients moving nodes simultaneously
- ✅ Conflict resolution (last-write-wins or operational transform)
- ✅ No jitter or flicker
- ✅ Movement syncs within 100ms

**Expected Result:** Node movements sync reliably between clients.

---

## ✔ QC.6.3 — Wire Editing

**Test:**

- ✅ Client A adds wire
- ✅ Client B sees update immediately
- ✅ Client B deletes wire
- ✅ Client A sees change
- ✅ Concurrent wire creation handling

**Expected Result:** Wire operations sync correctly across clients.

---

## ✔ QC.6.4 — Collab Stress Test

**Simulate:**

- ✅ 20 clients connected simultaneously
- ✅ 100 operations/second total
- ✅ Latency spikes (100-500ms)
- ✅ Packet loss scenarios
- ✅ Reconnection handling

**Expected Result:** System remains stable under load.

---

## ✔ QC.6.5 — Offline Recovery

**Test:**

- ✅ Disconnect client
- ✅ Make changes while offline
- ✅ Reconnect
- ✅ Merge ops correctly (conflict resolution)
- ✅ No data loss

**Expected Result:** Offline changes are properly merged on reconnect.

---

# ⭐ QC.7 — Spark Template Testing

---

## ✔ QC.7.1 — Load Template Graphs

**Test:**

- ✅ Card game template
- ✅ Platformer template
- ✅ Shooter template
- ✅ VN (Visual Novel) template
- ✅ Puzzle template
- ✅ Top-down RPG template

**Expected Result:** All templates load correctly.

---

## ✔ QC.7.2 — Graph Validity

**Test:**

- ✅ Templates contain valid node IDs
- ✅ No missing sockets
- ✅ No missing connections
- ✅ No orphan nodes
- ✅ All exec flows connected
- ✅ All data types match

**Expected Result:** All templates are valid, executable graphs.

---

## ✔ QC.7.3 — Smoke Test

**Test:**

- ✅ Load template
- ✅ Spawn new graph from template
- ✅ Drag nodes
- ✅ Modify properties
- ✅ Add new nodes
- ✅ Save graph

**Expected Result:** Template-based workflows function correctly.

---

## ✔ QC.7.4 — Template Launcher

**Test:**

- ✅ Create project from template
- ✅ Apply template to existing project
- ✅ File system structure created correctly
- ✅ Assets copied to project
- ✅ Project initializes correctly

**Expected Result:** Template application creates valid project structure.

---

# ⭐ QC.8 — C# Generation & Unity Runtime Testing

---

## ✔ QC.8.1 — Graph → C#

**Test outputs:**

- ✅ Syntactically valid C# code
- ✅ Methods generated correctly
- ✅ Events mapped to Unity messages (Start, Update, etc.)
- ✅ Props mapped to fields
- ✅ Variable declarations correct
- ✅ Type conversions handled

**Expected Result:** Generated C# code compiles and runs in Unity.

---

## ✔ QC.8.2 — C# Hot Reload (Ignition)

**Test:**

- ✅ Regenerate script from graph
- ✅ Send to Unity WebGL runtime
- ✅ Runtime updates behavior without restart
- ✅ No freeze or crash
- ✅ Safe for repeated reloads
- ✅ State preserved during reload

**Expected Result:** Hot reload works seamlessly in Unity WebGL.

---

## ✔ QC.8.3 — UnityBinder Tests

**Test:**

- ✅ Events forwarded from Unity to JS
- ✅ JS executes graph on event
- ✅ Graph returns values to Unity
- ✅ Bidirectional communication stable
- ✅ Error handling in bridge

**Expected Result:** Unity ↔ JavaScript communication is reliable.

---

## ✔ QC.8.4 — WebGL Runtime Tests

**Test:**

- ✅ PlaySound commands executed
- ✅ UI commands reflected
- ✅ GameObject manipulation works
- ✅ Component access works
- ✅ Scene updates visible

**Expected Result:** Blueprint graphs control Unity runtime correctly.

---

# ⭐ QC.9 — Waypoint (AI / LUNA) Testing

---

## ✔ QC.9.1 — LUNA Explain Mode

**Test:**

- ✅ Node explanation (context-aware)
- ✅ Graph explanation (overview)
- ✅ Socket purpose explanation
- ✅ Connection rationale
- ✅ Best practices suggestions

**Expected Result:** LUNA provides helpful explanations.

---

## ✔ QC.9.2 — LUNA Generate Graph

**Test:**

- ✅ Simple: "Make character jump"
- ✅ Medium: "Card capture system"
- ✅ Complex: "2D platformer enemy AI"
- ✅ Graph structure is valid
- ✅ Nodes are properly connected
- ✅ Generated code is executable

**Expected Result:** LUNA generates valid, executable graphs.

---

## ✔ QC.9.3 — LUNA Fix Graph

**Test:**

- ✅ Missing connection fix
- ✅ Missing node fix
- ✅ Incompatible types fix
- ✅ Cycle detection and resolution
- ✅ Orphan node cleanup

**Expected Result:** LUNA can identify and fix graph issues.

---

## ✔ QC.9.4 — Presence of AI Suggestions

**Test:**

- ✅ Inline tips displayed
- ✅ Suggested nodes appear
- ✅ Context-aware recommendations
- ✅ Auto-complete suggestions
- ✅ Error fix suggestions

**Expected Result:** AI assistance is contextual and helpful.

---

# ⭐ QC.10 — Storybook & Visual Regression Testing

---

## ✔ QC.10.1 — Component Stories Render

**Test:**

All Ignis, Slate, Spark components load:

- ✅ NodeRenderer stories
- ✅ WireRenderer stories
- ✅ Canvas stories
- ✅ Palette stories
- ✅ Slate component stories
- ✅ Spark template stories

**Expected Result:** All stories render without errors.

---

## ✔ QC.10.2 — MDX Docs Valid

**Test:**

- ✅ No broken links
- ✅ No missing references
- ✅ Images load correctly
- ✅ Code examples syntax-highlighted
- ✅ Tables render correctly

**Expected Result:** Documentation is complete and accurate.

---

## ✔ QC.10.3 — Chromatic Visual Snapshots

**Test:**

Automated pixel diff for:

- ✅ NodeRenderer (all node types)
- ✅ Canvas (various graph states)
- ✅ Palette (search, categories)
- ✅ Inspector (different node props)
- ✅ Full Blueprint Editor (integrated view)
- ✅ All Slate components
- ✅ All subsystem pages

**Expected Result:** Visual regressions are caught automatically.

---

## ✔ QC.10.4 — Dark Mode Snapshot

**Test:**

- ✅ Check for visual regressions in dark theme
- ✅ Color contrast meets accessibility standards
- ✅ All components render correctly
- ✅ No layout shifts between themes

**Expected Result:** Dark mode is visually consistent.

---

# ⭐ QC.11 — Performance Testing

---

## ✔ QC.11.1 — Graph Load

**Test:**

- ✅ Under 100ms for 100-node graphs
- ✅ Under 300ms for 500-node graphs
- ✅ Under 1s for 1000-node graphs
- ✅ Progress indicator shown for large graphs
- ✅ No UI freeze during load

**Expected Result:** Graphs load quickly regardless of size.

---

## ✔ QC.11.2 — Canvas Interaction

**Test:**

- ✅ 60 FPS while dragging nodes
- ✅ 60 FPS while zooming
- ✅ 60 FPS while panning
- ✅ Smooth wire rendering during drag
- ✅ No lag with 100+ nodes visible

**Expected Result:** Canvas interactions remain smooth.

---

## ✔ QC.11.3 — Memory Leaks

**Test:**

- ✅ Add nodes repeatedly (1000+ nodes)
- ✅ Drag wires repeatedly
- ✅ Create/delete connections repeatedly
- ✅ Undo/redo operations repeatedly
- ✅ No memory ballooning
- ✅ Memory usage stabilizes

**Expected Result:** No memory leaks detected.

---

# ⭐ QC.12 — End-to-End WISSIL Smoke Test

---

## Check Every Page:

### 🔹 Landing

**Test:**

- ✅ Page loads correctly
- ✅ UI renders properly
- ✅ Buttons work (navigation)
- ✅ System cards display
- ✅ Hero section renders
- ✅ Footer displays

**Expected Result:** Landing page functions correctly.

---

### 🔹 Slate (Storybook)

**Test:**

- ✅ Tokens display correctly
- ✅ Components render properly
- ✅ Storybook navigation works
- ✅ Theme switching works
- ✅ Documentation loads

**Expected Result:** Design system is accessible and documented.

---

### 🔹 Ignis

**Test:**

- ✅ Full editor loads
- ✅ Node editing works
- ✅ Wires connect correctly
- ✅ Props panel functional
- ✅ Debugger works
- ✅ Presence overlay displays
- ✅ Save/load blueprints works

**Expected Result:** Complete Blueprint Editor is functional.

---

### 🔹 Ignition

**Test:**

- ✅ WebGL sample scene loads
- ✅ Runtime hot reload works
- ✅ Build dashboard functional
- ✅ Logs display correctly
- ✅ Deployment panel works

**Expected Result:** Runtime and build systems work correctly.

---

### 🔹 Spark

**Test:**

- ✅ Create new project from template
- ✅ Load template graphs
- ✅ Template browser works
- ✅ Preview templates
- ✅ Apply template to project

**Expected Result:** Template system enables quick project creation.

---

### 🔹 Waypoint

**Test:**

- ✅ LUNA responds to queries
- ✅ Auto-build graph works
- ✅ Suggestions appear
- ✅ Error fixes suggested
- ✅ Graph explanations provided

**Expected Result:** AI assistance enhances workflow.

---

## 🎯 QA Completion Criteria

If all QC tests pass:

- 🟩 WISSIL can enter **alpha**
- 🟩 Ready for first user testing
- 🟩 You can onboard indie devs
- 🟩 Production deployment approved

---

## 📊 Test Coverage Summary

| Category | Tests | Priority | Status |
|----------|-------|----------|--------|
| QC.1 - Slate Baseline | 2 suites | Critical | 🔄 |
| QC.2 - Ignis Components | 4 suites | Critical | 🔄 |
| QC.3 - Canvas Interaction | 4 suites | Critical | 🔄 |
| QC.4 - Graph Model | 3 suites | High | 🔄 |
| QC.5 - Interpreter | 5 suites | High | 🔄 |
| QC.6 - Collaboration | 5 suites | High | 🔄 |
| QC.7 - Spark Templates | 4 suites | Medium | 🔄 |
| QC.8 - C# Generation | 4 suites | High | 🔄 |
| QC.9 - LUNA/Waypoint | 4 suites | Medium | 🔄 |
| QC.10 - Visual Regression | 4 suites | Critical | 🔄 |
| QC.11 - Performance | 3 suites | High | 🔄 |
| QC.12 - E2E Smoke | 6 pages | Critical | 🔄 |

**Total Test Suites:** 48  
**Total Test Cases:** 200+

---

## 🚀 Next Steps

After completing this QA plan:

1. **Generate Automated QA Suite** - Jest, Playwright, Chromatic automation
2. **Set up CI/CD Pipeline** - GitHub Actions for automated testing
3. **Create Test Reports** - Dashboard for test results
4. **Load Testing** - Stress test collaboration server
5. **Accessibility Testing** - WCAG compliance validation

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

