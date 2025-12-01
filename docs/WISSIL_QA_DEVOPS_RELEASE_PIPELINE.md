# 🚀 WISSIL QA + DevOps Release Pipeline

**Complete CI/CD Pipeline for Production Releases**

*Last updated: December 2024*

---

## 📘 Overview

This pipeline ensures that all WISSIL subsystems are shipped safely, automatically, and predictably with **zero-downtime, atomic deploys, and full automation**.

**Modeled after:**
- ✅ StackBlitz deployment chain
- ✅ VS Code Web release gates
- ✅ Unity Editor LTS gating
- ✅ Figma multi-tenant CI
- ✅ Slack/Notion Web infra CI/CD

---

# ⭐ PHASE 1 — Pre-Merge Validation Pipeline (PR-Level)

**Trigger:** Pull Requests, Push to feature branches  
**Duration:** < 3 minutes  
**Purpose:** Fast feedback before merge

---

## ✔ 1.1 — Lint + Typecheck

**CI Step:**
```bash
npm run lint
npm run typecheck
```

**Blocks merges if:**
- ❌ Missing types
- ❌ Undefined tokens
- ❌ Bad imports
- ❌ TypeScript errors
- ❌ ESLint violations

**Status:** Hard gate (must pass)

---

## ✔ 1.2 — Unit Test Suite (Vitest)

**Runs:**
```bash
npm run test:unit
```

**Covers:**
- ✅ Slate tokens
- ✅ Slate components
- ✅ NodeLibrary nodes
- ✅ GraphStore operations
- ✅ BPInterpreter core logic

**Required for PR merge:** 100% passing

**Status:** Hard gate (must pass)

---

## ✔ 1.3 — Storybook Build Smoke Test

**Runs:**
```bash
npm run build-storybook
```

**Validates:**
- ✅ All stories compile
- ✅ No missing imports
- ✅ No MDX errors
- ✅ NodeRenderer/WireRenderer render correctly
- ✅ All subsystems load

**Status:** Hard gate (must pass)

---

## ✔ 1.4 — Static Asset Check

**Validates:**
- ✅ Icons load correctly
- ✅ Images accessible
- ✅ Templates available
- ✅ Unity WebGL assets present

**Status:** Hard gate (must pass)

---

## ✔ 1.5 — Bundle Analyzer Threshold Gate

**Runs:**
```bash
npm run analyze
```

**Fails if:**
- ❌ Slate bundle grows > 5%
- ❌ Ignis bundle grows > 10%
- ❌ Total bundle > 5 MB compressed
- ❌ Individual chunk > 2 MB

**Status:** Hard gate (must pass)

---

## ✔ 1.6 — PR Badge in Notion/Linear

**Automatically updates WISSIL QA Dashboard with:**
- ✅ Status (Pass/Fail)
- ✅ Coverage %
- ✅ Visual regression diff
- ✅ Pass/Fail gate status
- ✅ Test results summary

**Status:** Informational

---

# ⭐ PHASE 2 — Visual Regression & Accessibility Gate

**Trigger:** Merge to `main`, Pre-release build  
**Duration:** 5-10 minutes  
**Purpose:** Visual and accessibility validation

---

## ✔ 2.1 — Chromatic Visual Regression

**Runs:**
```bash
npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

**Gates:**
- ✅ NodeRenderer (all variants)
- ✅ WireRenderer (all types)
- ✅ BPGraphCanvas (empty, populated)
- ✅ BlueprintEditor (full view)
- ✅ Inspector Panels
- ✅ Slate Components (all primitives)
- ✅ Subsystem Pages (6 pages)

**Thresholds:**
- 0.01% pixel diff for component stories
- 0.05% diff for complex components
- 0.1% diff for full BlueprintEditor

**If ANY diff exceeds thresholds → BLOCKED**

**Status:** Hard gate (must pass)

---

## ✔ 2.2 — Accessibility Audit (Axe CI)

**Runs:**
```bash
npm run test:a11y
```

**Checks for:**
- ✅ Color contrast (WCAG AA)
- ✅ ARIA roles and labels
- ✅ Keyboard navigation
- ✅ Tab traversal
- ✅ Screen reader compatibility
- ✅ Focus management

**Critical for real-world developers**

**Status:** Hard gate (must pass)

---

# ⭐ PHASE 3 — Integration & Runtime Pipeline

**Trigger:** Merge to `main`  
**Duration:** 10-15 minutes  
**Purpose:** Validate IGNIS → IGNITION → UNITY pipeline

---

## ✔ 3.1 — Integration Tests (Vitest)

**Runs:**
```bash
npm run test:integration
```

**Tests:**
- ✅ Canvas pan/zoom interactions
- ✅ Node dragging and positioning
- ✅ Wire creation and deletion
- ✅ Inspector property updates
- ✅ Graph state management
- ✅ Template loader validation
- ✅ C# Generator minimal build

**Status:** Hard gate (must pass)

---

## ✔ 3.2 — Mock Unity Runtime (Ignition) Tests

**Uses mocked WebGL runtime**

**Tests:**
- ✅ UnityBinder event forwarding
- ✅ Hot reload script injection
- ✅ Log roundtrip (Unity → JS)
- ✅ Execution path mapping
- ✅ Runtime state sync

**Status:** Hard gate (must pass)

---

## ✔ 3.3 — C# Syntax Validation

**Uses Roslyn-based checker:**
```bash
dotnet-script WISSIL/check-csharp.csx
```

**Ensures:**
- ✅ Generated C# code is syntactically valid
- ✅ No compilation errors
- ✅ Proper Unity API usage
- ✅ Valid MonoBehaviour structure

**Status:** Hard gate (must pass)

---

## ✔ 3.4 — Wasm/WebGL Artifact Check

**Validates:**
- ✅ Unity WebGL builds sync correctly
- ✅ Hash-based updates work
- ✅ No corrupted assets
- ✅ Asset loading paths valid

**Status:** Hard gate (must pass)

---

# ⭐ PHASE 4 — Full E2E & Multi-User Collab Gate

**Trigger:** Nightly OR pre-release  
**Duration:** 20-30 minutes  
**Purpose:** Full workflow validation

---

## ✔ 4.1 — E2E: Blueprint Editor

**Tests:**
- ✅ Editor loads correctly
- ✅ Add node from palette
- ✅ Connect nodes with wires
- ✅ Execute preview mode
- ✅ Export to C#
- ✅ Delete node
- ✅ Undo/redo operations
- ✅ Save/load blueprints

**Status:** Hard gate (must pass)

---

## ✔ 4.2 — E2E: Multi-user Real-time Collab

**Simulate 3 browser clients:**

**Tests:**
- ✅ Move node (syncs to all clients)
- ✅ Add connection (visible to all)
- ✅ Remote cursor presence
- ✅ Sync latency < 80ms
- ✅ No merge conflicts
- ✅ Conflict resolution works

**If desync detected → BLOCKED**

**Status:** Hard gate (must pass)

---

## ✔ 4.3 — E2E: Spark Templates

**Tests:**
- ✅ Load platformer template
- ✅ Load card game template
- ✅ Load VN template
- ✅ Blueprint validity check
- ✅ Editor interactions work
- ✅ Template metadata correct

**Status:** Hard gate (must pass)

---

## ✔ 4.4 — E2E: Hot Reload with Unity WebGL

**Steps:**
1. Change blueprint graph
2. Generate C# code
3. Send to Unity runtime
4. Unity recompiles
5. WebGL runtime updates
6. Behavior changes live

**Threshold:**
- Hot reload under **700ms**

**Status:** Hard gate (must pass)

---

## ✔ 4.5 — E2E: Waypoint/LUNA Behavior

**Tests:**
- ✅ Generate graph from prompt
- ✅ Explain graph structure
- ✅ Fix graph errors
- ✅ Suggest relevant nodes
- ✅ No hallucinated node types
- ✅ Valid graph output

**Status:** Hard gate (must pass)

---

# ⭐ PHASE 5 — Performance & Load Testing

**Trigger:** Weekly OR before major beta  
**Duration:** 15-20 minutes  
**Purpose:** Performance validation

---

## ✔ 5.1 — Canvas FPS Benchmark

**Thresholds:**
- ✅ > 55 FPS while dragging nodes
- ✅ > 55 FPS with 50 nodes visible
- ✅ > 45 FPS with 150 nodes visible
- ✅ > 30 FPS with 300 nodes visible

**Status:** Hard gate (must pass)

---

## ✔ 5.2 — Graph Load Times

**Thresholds:**
- ✅ < 100ms for 100-node graph
- ✅ < 200ms for 300-node graph
- ✅ < 400ms for 500-node graph
- ✅ < 1s for 1000-node graph

**Status:** Hard gate (must pass)

---

## ✔ 5.3 — Collab Load Test

**Simulate:**
- ✅ 25 concurrent users
- ✅ 200 operations/second
- ✅ 5-minute session

**Check:**
- ✅ Latency < 100ms p95
- ✅ No dropped operations
- ✅ No exponential CPU usage
- ✅ Memory stable

**Status:** Hard gate (must pass)

---

## ✔ 5.4 — WebGL Memory

**Thresholds:**
- ✅ Initial load < 300 MB
- ✅ No >20MB leak after hot reload
- ✅ Memory stable over 10 reloads

**Status:** Hard gate (must pass)

---

# ⭐ PHASE 6 — Deploy Pipeline

**Trigger:** Tag push OR manual release  
**Duration:** 10-15 minutes  
**Purpose:** Production deployment

---

## ✔ 6.1 — Build Artifacts

**Runs:**
```bash
npm run build
npm run build-storybook
npm run build-wissil
```

**Creates:**
- ✅ Storybook static site
- ✅ WISSIL IDE bundle
- ✅ Template packs
- ✅ Static runtime scripts
- ✅ Unity WebGL runtime assets

**Status:** Hard gate (must pass)

---

## ✔ 6.2 — Asset Hashing + CDN Deployment

**Push to:**
- ✅ Cloudflare Pages
- ✅ AWS S3
- ✅ Cloudflare R2
- ✅ Custom CDN bucket

**Atomic deploy ensures:**
- ✅ No broken imports
- ✅ No stale node palettes
- ✅ No outdated C# runners
- ✅ Zero-downtime deployment

**Status:** Hard gate (must pass)

---

## ✔ 6.3 — Versioning & Release Notes (Auto)

**Generates:**
- ✅ Changelog (`CHANGELOG.md`)
- ✅ Release notes (Notion)
- ✅ Release summary (Discord/Slack)
- ✅ GitHub Release

**Status:** Informational

---

## ✔ 6.4 — Git Tag + Linear Release

**Automatically:**
- ✅ Creates release version tag
- ✅ Moves issues to "Done"
- ✅ Summarizes QA results
- ✅ Updates Linear release

**Status:** Informational

---

## ✔ 6.5 — Canary Deployment

**Deploys canary to `wissil.dev/canary`:**

**Validates:**
- ✅ Canary server loads IDE
- ✅ Auto-checks major flows
- ✅ Monitors errors in real-time
- ✅ Performance metrics tracked

**Status:** Soft gate (monitoring)

---

# ⭐ PHASE 7 — Post-Deployment Monitoring

**Trigger:** Continuous  
**Purpose:** Production health monitoring

---

## ✔ 7.1 — Error Monitoring (Sentry)

**Monitors:**
- ✅ FPS drops
- ✅ WebGL crashes
- ✅ C# hot reload failures
- ✅ UnityBinder errors
- ✅ WebSocket disconnects
- ✅ AI hallucinations / invalid output

**Alerts to Discord if:**
- 🚨 Error rate > 1%
- 🚨 FPS < 40
- 🚨 Collab desync event
- 🚨 Unity hot reload fails
- 🚨 Memory leak detected

**Status:** Monitoring (alerts only)

---

## ✔ 7.2 — Performance Monitoring

**Tracks:**
- ✅ Canvas FPS (real user metrics)
- ✅ Graph load times
- ✅ Hot reload latency
- ✅ Collab sync latency
- ✅ Memory usage trends

**Status:** Monitoring (alerts only)

---

## ✔ 7.3 — User Analytics

**Tracks:**
- ✅ Feature usage
- ✅ Error patterns
- ✅ Performance bottlenecks
- ✅ User workflows

**Status:** Monitoring (analytics)

---

# 📊 Pipeline Summary

| Stage | Purpose | Duration | Gate Type |
|-------|---------|----------|-----------|
| **1. PR → Pre-Merge** | Lint, type, unit, Storybook build | < 3 min | Hard |
| **2. Visual + Accessibility** | Chromatic, a11y | 5-10 min | Hard |
| **3. Integration** | Canvas, wires, interpreter, templates | 10-15 min | Hard |
| **4. E2E + Collab + Hot Reload** | Playwright multi-client | 20-30 min | Hard |
| **5. Performance & Load** | FPS + memory + latency | 15-20 min | Hard |
| **6. Build + Deploy** | Artifacts, hashing, CDN | 10-15 min | Hard |
| **7. Monitoring** | Sentry / Logs / Alerts | Continuous | Soft |

**Total Pipeline Time:** ~60-90 minutes (full release)

---

# 🎯 Release Gates

## Alpha Release

**Requirements:**
- ✅ 60%+ automation coverage
- ✅ Major flows work
- ✅ 0 P0 bugs
- ✅ Visual regression green (critical stories)
- ✅ Performance benchmarks pass

## Beta Release

**Requirements:**
- ✅ 85%+ automation coverage
- ✅ All critical paths automated
- ✅ Visual regression 100% green
- ✅ 0 P0 bugs, ≤2 P1 bugs
- ✅ All E2E tests pass

## RC (Release Candidate)

**Requirements:**
- ✅ 95%+ automation coverage
- ✅ 0 P0/P1 bugs
- ✅ All visual regressions approved
- ✅ Performance within targets
- ✅ Canary deployment successful

## Production Release

**Requirements:**
- ✅ 100% critical paths automated
- ✅ 0 P0/P1 bugs
- ✅ All tests passing
- ✅ Performance validated
- ✅ Canary monitoring clean (24h)
- ✅ Manual QA sign-off

---

# 🔧 Pipeline Configuration

## GitHub Actions Workflows

- ✅ `.github/workflows/pr-validation.yml` - Phase 1
- ✅ `.github/workflows/visual-regression.yml` - Phase 2
- ✅ `.github/workflows/integration.yml` - Phase 3
- ✅ `.github/workflows/e2e.yml` - Phase 4
- ✅ `.github/workflows/performance.yml` - Phase 5
- ✅ `.github/workflows/deploy.yml` - Phase 6
- ✅ `.github/workflows/monitoring.yml` - Phase 7

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

