# ⭐ Storybook & Chromatic Complete Guide

**WISSIL / LUMINES — Complete Storybook & Chromatic Documentation**

*Last updated: December 2024*

---

## 📘 Purpose

This document is the **single source of truth** for Storybook and Chromatic in the WISSIL/LUMINES repository. It combines status, quick reference, and operational procedures.

**Storybook** = component documentation  
**Chromatic** = visual regression testing

Together, they guarantee:
- ✅ Pixel stability
- ✅ Consistent UX across 6 subsystems
- ✅ Safe refactoring
- ✅ Stable Ignis Blueprint Editor
- ✅ No regressions across phases A → AE

---

## 🚀 Quick Start

### Commands

```bash
# Start Storybook locally
npm run storybook                    # → http://localhost:6006

# Build Storybook
npm run build-storybook

# Run Chromatic
npx chromatic --project-token=$TOKEN

# Publish to GitHub Pages (automatic on main)
# Manual: npm run build-storybook && deploy
```

### URLs

- **Local Storybook:** http://localhost:6006
- **GitHub Pages:** https://<user>.github.io/<repo>/
- **Chromatic Dashboard:** https://www.chromatic.com/builds?appId=...

---

## 📁 Story Locations

| Subsystem | Story Path | Owner |
|-----------|------------|-------|
| **Slate** | `src/design-system/**/*.stories.*` | @DesignSystemTeam |
| **Ignis** | `src/ignis/**/*.stories.*` | @IgnisTeam |
| **Unity Tools** | `src/wissil/**/*.stories.*` | @UnityToolsTeam |
| **Ignition** | `src/app/ignition/**/*.stories.*` | @RuntimeTeam |
| **Spark** | `src/app/spark/**/*.stories.*` | @TemplatesTeam |
| **Waypoint** | `src/app/waypoint/**/*.stories.*` | @AIUXTeam |

---

## 🧩 Subsystems Covered

| Subsystem                   | Storybook Coverage                     | Chromatic Snapshots | Status           |
| --------------------------- | -------------------------------------- | ------------------- | ---------------- |
| **Landing**                 | Page previews & layout                 | Full snapshot suite | 🟢 Stable        |
| **Slate** (Design System)   | Tokens, typography, colors, primitives | Full snapshots      | 🟢 Critical      |
| **Ignition** (Runtime UI)   | Build dashboard, logs, sandboxes       | Full snapshots      | 🟡 Partial       |
| **Spark** (Templates)       | Template browser, presets, preview     | Snapshots           | 🟢 Stable        |
| **Ignis** (Node IDE Editor) | Nodes, wires, canvases, inspector      | Full snapshot suite | 🔥 High Priority |
| **Waypoint** (Assistant)    | Context panes, help flows              | Snapshots           | 🟡 Partial       |

---

## 🎨 Chromatic Configuration

### Global Settings

Set in `.storybook/preview.ts`:

```typescript
export const parameters = {
  layout: "fullscreen",
  chromatic: {
    diffThreshold: 0.01,        // 1% - catches 1px shifts
    delay: 300,                // Wait for async operations
    pauseAnimationAtEnd: true, // Prevent flaky tests
    viewports: [375, 768, 1280, 1920], // Mobile, Tablet, Desktop, Wide
  },
};
```

### Thresholds by Component Type

| Component Type | Threshold | Owner Approval |
|----------------|-----------|----------------|
| Slate Components | 0.01% | Design System Team |
| Ignis Nodes | 0.05% | Ignis Team |
| Unity Tools | 0.05% | Unity Tools Team |
| Full Pages | 0.1% | Respective Team |

---

## 🛡️ CI/CD Protection

### GitHub Actions Workflow

**File:** `.github/workflows/chromatic.yml`

| Setting                     | Meaning                    | Value  |
| --------------------------- | -------------------------- | ------ |
| `autoAcceptChanges`         | manual review required     | false  |
| `exitZeroOnChanges`         | fail the PR on regression  | false  |
| `onlyChanged`               | TurboSnap for large repo   | true   |
| `turboSnap`                 | speed & cost optimization  | true   |
| `buildScriptName`           | Storybook build command    | build-storybook |

### Branch Strategy

| Branch | Purpose | Chromatic | Protection |
|--------|---------|-----------|------------|
| `main` | Production | Required | Full |
| `develop` | Integration | Recommended | Medium |
| `feature/*` | Development | On PR | None |

---

## 📸 Snapshot Strategy

WISSIL uses a **component → subsystem → page** strategy:

1. **Component-level snapshots**
   - Catch regressions in Slate & Ignis primitives
   - Fast feedback on individual components

2. **Subsystem snapshots**
   - Catch layout shifts in:
     - Ignis Node Editor
     - Spark Template Browser
     - Ignition Build Dashboard

3. **Page snapshots**
   - Validate overall page layout:
     - `/landing`
     - `/slate`
     - `/ignition`
     - `/spark`
     - `/ignis`
     - `/waypoint`

---

## 🔄 Workflow

### Creating a Story

1. Create story file: `ComponentName.stories.tsx`
2. Place in appropriate subsystem folder
3. PR will trigger Chromatic
4. Owner will review visual changes
5. Approve or request changes

### Updating Baselines

**Only when:**
- ✅ Intentional design changes
- ✅ Approved by CODEOWNERS
- ✅ Not on Fridays
- ✅ < 20 changes per PR

**Never:**
- ❌ Unauthorized visual changes
- ❌ > 20 changes without review
- ❌ Friday deployments

### Review Process

When Chromatic finds a diff:

1. **Reviewer checks visual diff**
   - Click Chromatic link in PR comments
   - Examine before/after screenshots
   - Check if change is intentional

2. **If Intentional Change**
   - Go to Chromatic UI
   - Review and approve the change
   - New baseline is saved automatically

3. **If Unintended Regression**
   - Fix the code causing the regression
   - Push new commit
   - Chromatic re-runs automatically

4. **PR is blocked until resolved**
   - Status check must pass
   - Visual approval required
   - No merge until approved

---

## 🎯 Required Stories by Subsystem

### 1. Slate — Design System

**Location:** `src/design-system/`

**Required Components:**
- ✅ Buttons
- ✅ Panels
- ✅ Input fields
- ✅ Tabs
- ✅ SplitView
- ✅ List items
- ✅ Cards
- ✅ Color tokens
- ✅ Typography examples

**Chromatic Requirements:**
- `diffThreshold: 0.01`
- Fullscreen layout
- No animations unless `chromatic.disableAnimation = true`

### 2. Ignis — Node IDE Editor

**Location:** `src/ignis/blueprint/`

**Required Stories:**

| Component          | Purpose                               | Status |
| ------------------ | ------------------------------------- | ------ |
| `NodeRenderer`     | Validate node shape, padding, sockets | ✅     |
| `WireRenderer`     | Validate bezier curves, connectors    | ✅     |
| `BPGraphCanvas`    | Validate pan/zoom, node layout        | ✅     |
| `NodePalette`      | Validate search + results layout      | ✅     |
| `InspectorPanel`   | Validate controls & props             | 🔄     |
| `DebuggerView`     | Node highlighting                     | 🔄     |
| `MultiUserOverlay` | Remote cursors, selection states      | 🔄     |
| `BlueprintEditor`  | Full integrated editor                | ✅     |

**Chromatic Requirements:**
- Pixel precision (0.01 diff threshold)
- Deterministic layout
- No animated wires in snapshot mode

### 3. Unity Tools Stories

**Location:** `src/wissil/`

**Must Have:**

| Component              | Status   |
| ---------------------- | -------- |
| SceneGraphPanel        | ✅       |
| PrefabInspector        | ✅       |
| PrefabVariantEditor    | ✅       |
| LightingPanel          | ✅       |
| MaterialEditor         | ✅       |
| ShaderEditor           | ✅       |
| AnimationTimeline      | ✅       |
| UI Canvas Editor       | ✅       |

### 4. Spark Templates

**Location:** `src/app/spark/`

**Validate template previews:**
- ✅ Card Game Starter Graph
- ✅ Platformer Starter Graph
- ✅ Shooter Starter Graph
- ✅ Top-down RPG Starter Graph
- ✅ VN/Dialogue Starter Graph

### 5. Ignition Runtime UI

**Location:** `src/app/ignition/`

**Chromatic should snapshot:**
- ✅ Build dashboard
- ✅ Logs panel
- ✅ Hot Reload status
- ✅ WebGL Preview frame shell
- ✅ Deployment panel

### 6. Waypoint Assistant

**Location:** `src/app/waypoint/`

**Stories validate:**
- ✅ AI help panel
- ✅ Context tips
- ✅ Onboarding flows
- ✅ Editor-integrated hints

---

## 📊 Current Coverage Statistics

- **Total Stories:** 400+
- **Chromatic Snapshots:** 400+
- **Viewports Tested:** 4 (Mobile, Tablet, Desktop, Wide)
- **Subsystems Covered:** 6/6 (100%)
- **Critical Components:** 50+ snapshotted
- **Build Time (with TurboSnap):** 2-5 minutes
- **Build Time (full run):** 15-20 minutes

---

## 🧭 Roadmap

| Task                             | Status           | Priority |
| -------------------------------- | ---------------- | -------- |
| Full Ignis Blueprint coverage    | 🔥 High priority | P0       |
| Unity tools snapshot coverage    | 🟡 80%           | P1       |
| Waypoint flows snapshot coverage | 🟡 70%           | P2       |
| Ignition runtime shell           | 🟢 Stable        | ✅       |
| Spark template renderer          | 🟢 Complete      | ✅       |
| Slate complete token coverage    | 🟢 Stable        | ✅       |

---

## 🔍 Story Organization

Stories are organized to match WISSIL architecture:

```
WISSIL/
├── Landing
├── Slate
├── Ignition
├── Spark
├── Ignis
└── Waypoint

Ignis/
├── Blueprint Editor
├── Nodes
├── Canvas
└── Palette

WISSIL Core/
├── Scene Graph
├── Prefabs
├── Audio Mixer
├── UI Canvas
└── ...

Unity Tools/
LUNA/
Design System/
```

---

## 📝 CODEOWNERS

All visual changes require owner approval. See `.github/CODEOWNERS` for full mapping.

---

## 🎯 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `.storybook/preview.ts` | Chromatic configuration | ✅ |
| `.github/workflows/chromatic.yml` | CI/CD workflow | ✅ |
| `package.json` | Chromatic scripts | ✅ |
| `CHROMATIC_SETUP.md` | Setup guide | ✅ |

---

## 🏁 Final Notes

Storybook + Chromatic form the **foundational QA pillar** for:
- ✅ WISSIL IDE
- ✅ Ignis Node & Scene editors
- ✅ Spark templates
- ✅ 50+ subsystem phases (A → AE)
- ✅ Everything described in your repository architecture docs

This document should be updated **every sprint**.

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

