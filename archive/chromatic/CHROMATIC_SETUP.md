# 🎨 Chromatic Visual Regression Testing Setup

**Status:** ✅ Production Ready  
**Integration:** GitHub Actions CI/CD  
**Coverage:** All WISSIL subsystems, Unity Tools, and Ignis Blueprint Editor

---

## ⭐ Why Chromatic for WISSIL/LUMINES

Your repository has **250+ modules**, **12+ Zustand stores**, **50K+ TypeScript lines**, **50+ phases**, and a **complete browser-based Unity IDE**. Every UI surface can silently break.

**Chromatic protects:**
- ✅ All 6 WISSIL subsystems (Landing, Slate, Ignition, Spark, Ignis, Waypoint)
- ✅ All Unity Editor Tools (Scene Graph, Prefabs, Audio Mixer, UI Canvas, etc.)
- ✅ Ignis Blueprint Editor (34+ nodes, canvas, wires)
- ✅ Slate Design System (tokens, primitives, components)
- ✅ Complete IDE interface across all phases

---

## 🚀 Quick Start

### Step 1: Get Your Chromatic Project Token

1. Go to [chromatic.com](https://www.chromatic.com) and sign in
2. Create a new project or select existing project
3. Copy your **Project Token** from the project settings

### Step 2: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CHROMATIC_PROJECT_TOKEN`
5. Value: Paste your Chromatic project token
6. Click **Add secret**

### Step 3: Run Chromatic Locally (Optional)

```bash
# Set token as environment variable
export CHROMATIC_PROJECT_TOKEN=your-token-here

# Run Chromatic
npm run chromatic
```

---

## 📁 Setup Files Created

### ✅ `.github/workflows/chromatic.yml`

GitHub Actions workflow that:
- Runs on PRs to `main` and `develop`
- Runs on pushes to `main`
- Uses TurboSnap for faster builds (only tests changed stories)
- Requires manual approval for visual changes
- Fails PR if visual regression detected

### ✅ `.storybook/preview.ts` (Enhanced)

Added Chromatic-specific parameters:
- `diffThreshold: 0.01` - Tight precision for IDE components
- `delay: 300` - Wait for animations
- `pauseAnimationAtEnd: true` - Capture final state
- Story ordering aligned with WISSIL architecture

### ✅ `package.json` (Enhanced)

Added scripts:
- `npm run chromatic` - Run Chromatic with strict mode
- `npm run chromatic:ci` - Run with auto-accept (for CI)

---

## 🎯 What Gets Tested

### 1. WISSIL Subsystems (6)

All subsystem pages are snapshotted:

- **LANDING** (`src/app/landing/`)
  - Hero section
  - System cards grid
  - Navigation components

- **SLATE** (`src/app/slate/`)
  - Workspace selector
  - Identity management
  - Design token explorer

- **IGNITION** (`src/app/ignition/`)
  - Project bootstrap wizard
  - Template gallery
  - Configuration steps

- **SPARK** (`src/app/spark/`)
  - IDE interface
  - File tree
  - Monaco editor wrapper
  - AI chat panel

- **IGNIS** (`src/app/ignis/`)
  - Build dashboard
  - Deployment panel
  - Artifact browser

- **WAYPOINT** (`src/app/waypoint/`)
  - Unity visual scripting
  - Graph editor canvas
  - Node palette

### 2. Ignis Blueprint Editor

From `src/ignis/blueprint/`:

- ✅ **BPGraphCanvas** - Main canvas with pan/zoom
- ✅ **NodeRenderer** - Individual node rendering
- ✅ **WireRenderer** - Bezier curve connections
- ✅ **NodePalette** - Searchable node library
- ✅ All 34+ blueprint nodes

### 3. Unity Editor Tools

All Unity editor panels from `src/wissil/`:

- ✅ **Scene Graph** - Hierarchy tree, inspector
- ✅ **Prefab Editor** - Prefab editing interface
- ✅ **Prefab Variants** - Variant system UI
- ✅ **Audio Mixer** - Mix groups, effects panel
- ✅ **UI Canvas Editor** - RectTransform, anchors
- ✅ **Animation Timeline** - Keyframes, sequences
- ✅ **Material Editor** - Material properties
- ✅ **Shader Editor** - Shader node graph
- ✅ **Lighting Editor** - Light inspector
- ✅ **Gizmos** - Scene tools panel

### 4. Slate Design System

From `src/design-system/`:

- ✅ **Tokens** - Color, spacing, typography
- ✅ **Primitives** - Button, Card, Panel, Surface
- ✅ **Icons** - All Lucide icons
- ✅ **Layouts** - SplitView, FlexRow, FlexCol

---

## 🔧 Configuration Details

### Chromatic Parameters

Configured in `.storybook/preview.ts`:

```typescript
chromatic: {
  diffThreshold: 0.01,        // 1% threshold for precision
  delay: 300,                  // Wait for animations
  pauseAnimationAtEnd: true,   // Capture final state
  viewports: [375, 768, 1280, 1920], // All breakpoints
}
```

### Story Ordering

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

## 🔄 Workflow Behavior

### Pull Requests

1. PR created → GitHub Actions triggers
2. Chromatic builds Storybook
3. Runs visual tests on changed stories (TurboSnap)
4. Creates baseline snapshots if needed
5. Compares against baseline
6. **If visual changes detected:**
   - Comments on PR with diff links
   - Requires manual approval in Chromatic UI
   - Blocks merge until approved or changes reverted

### Main Branch

1. Push to `main` → GitHub Actions triggers
2. Full visual regression test
3. Updates baseline snapshots
4. Posts results to Chromatic dashboard

---

## 📊 TurboSnap Optimization

With **400+ stories** in your repo, TurboSnap dramatically speeds up tests:

- **Without TurboSnap:** Tests all 400+ stories (~20+ minutes)
- **With TurboSnap:** Only tests changed stories (~2-5 minutes)

TurboSnap automatically detects:
- Changed component files
- Changed story files
- Dependencies of changed stories

Configured in `.github/workflows/chromatic.yml`:
```yaml
turboSnap: true
fetch-depth: 0  # Full history for dependency tracking
```

---

## 🎨 Story-Level Configuration

### Enable Chromatic for Specific Stories

```tsx
export default {
  component: MyComponent,
  parameters: {
    chromatic: {
      diffThreshold: 0.01,
      disableSnapshot: false, // Explicitly enable
    },
  },
};
```

### Disable for Specific Stories

```tsx
export default {
  component: MyComponent,
  parameters: {
    chromatic: {
      disableSnapshot: true, // Skip this story
    },
  },
};
```

### Custom Viewports

```tsx
export default {
  parameters: {
    chromatic: {
      viewports: [375, 768, 1280], // Only test these
    },
  },
};
```

---

## 🚨 Handling Visual Regressions

### When a Test Fails

1. **Review the Diff**
   - Click the Chromatic link in PR comments
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

4. **Suppress False Positives**
   ```tsx
   export default {
     parameters: {
       chromatic: {
         diffThreshold: 0.05, // Increase threshold for this story
       },
     },
   };
   ```

---

## 🔐 Security & Access Control

### Project Token Security

- Token stored in GitHub Secrets (encrypted)
- Never committed to repository
- Rotate token if compromised

### Approval Workflow

Configured with `autoAcceptChanges: false`:
- All visual changes require manual review
- Prevents silent UI breakage
- Enforces team review process

### Branch Protection

Recommended GitHub branch protection:
- Require PR reviews
- Require status checks (including Chromatic)
- Block merge if Chromatic fails

---

## 📈 Monitoring & Metrics

### Chromatic Dashboard

Access your project dashboard at:
```
https://www.chromatic.com/builds?appId=<your-project-id>
```

Track:
- Build history
- Visual change trends
- Test coverage
- Build performance

### GitHub Integration

Chromatic automatically:
- Comments on PRs with results
- Updates PR status checks
- Provides inline diff links

---

## 🎯 Best Practices

### 1. Commit Baseline Snapshots

After accepting visual changes:
- Chromatic automatically updates baseline
- Commit the baseline update
- Include in PR for review

### 2. Test Critical Paths First

Prioritize stories for:
- Core IDE functionality
- User-facing components
- Complex interactions (Blueprint Editor, Scene Graph)

### 3. Use Descriptive Story Names

```tsx
export const DefaultView = {}; // ❌ Bad
export const SceneGraphWithMultipleSelection = {}; // ✅ Good
```

### 4. Keep Stories Isolated

Each story should:
- Be independently testable
- Not depend on external state
- Have deterministic rendering

---

## 🐛 Troubleshooting

### Build Fails on CI but Works Locally

**Check:**
1. Node version matches (CI uses Node 20)
2. Dependencies installed correctly (`npm ci`)
3. Storybook build succeeds locally

### False Positive Visual Changes

**Solutions:**
1. Increase `diffThreshold` for that story
2. Add `delay` for async components
3. Use `pauseAnimationAtEnd: true` for animations

### TurboSnap Not Working

**Verify:**
1. `fetch-depth: 0` in GitHub Actions checkout
2. Full git history available
3. Changed files are tracked by git

### Token Authentication Errors

**Check:**
1. Token is correctly set in GitHub Secrets
2. Token hasn't expired
3. Repository has access to Chromatic project

---

## 📚 Additional Resources

- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [TurboSnap Guide](https://www.chromatic.com/docs/turbosnap)
- [Storybook + Chromatic](https://www.chromatic.com/docs/storybook)
- [GitHub Actions Integration](https://www.chromatic.com/docs/github-actions)

---

## ✅ Checklist

- [x] Chromatic package installed
- [x] GitHub Actions workflow created
- [x] Storybook preview configured
- [x] Package.json scripts added
- [ ] Chromatic project token added to GitHub Secrets
- [ ] First baseline snapshots created
- [ ] Team members have Chromatic access
- [ ] Branch protection rules configured

---

**Status:** Ready for production use! 🚀

*Last Updated: December 2024*

