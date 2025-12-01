# ⭐ PHASE 6.2 — GitHub + Git Repository Architecture for Storybook

**Production-Grade Storybook Management for WISSIL**

*Last updated: December 2024*

---

## 📘 Overview

This phase ensures Storybook is stable, Chromatic is binding PRs, component owners are assigned, snapshots map to subsystem structure, and publishing pipelines are automated.

**Modeled after:**
- ✅ Figma Storybook architecture
- ✅ Notion component system
- ✅ Slack design system
- ✅ Shopify Polaris
- ✅ Vercel dashboard
- ✅ StackBlitz IDE

---

# 🧩 6.2.1 — Repository Folder Structure (Canonical)

This aligns with the WISSIL repo architecture and visual maps.

```
root/
├── apps/
│   ├── web/                # Next.js or Vite main app
│   ├── storybook/          # Storybook instance (if separate)
│   └── docs/               # Technical documentation website
│
├── packages/
│   ├── slate/              # Design system
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── tokens/
│   │   └── stories/
│   ├── ignis/              # Node editor components
│   │   ├── src/
│   │   │   ├── blueprint/
│   │   │   └── canvas/
│   │   └── stories/
│   ├── ignition/           # Runtime build UI
│   │   ├── src/
│   │   └── stories/
│   ├── spark/              # Templates + template renderer
│   │   ├── src/
│   │   └── stories/
│   ├── waypoint/           # Assistant + AI integration
│   │   ├── src/
│   │   └── stories/
│   └── unity-tools/        # SceneGraph, Prefabs, Shader Editor, etc.
│       ├── src/
│       └── stories/
│
├── .github/
│   ├── workflows/
│   │   ├── chromatic.yml   # Chromatic CI
│   │   ├── storybook-build.yml
│   │   ├── storybook-publish.yml
│   │   ├── pr-validation.yml
│   │   └── visual-regression.yml
│   └── CODEOWNERS
│
├── storybook-static/        # Build output (ignored by git)
├── .storybook/              # Global Storybook config
│   ├── main.ts
│   ├── preview.ts
│   └── manager.ts
├── package.json
├── turbo.json              # TurboRepo config (if using)
└── nx.json                  # Nx config (if using)
```

**This structure is storybook-first, component-driven, and CI-consistent.**

---

# 🛠️ 6.2.2 — GitHub Branch Strategy for Storybook

WISSIL requires a **3-tier branch model**:

## 1️⃣ `main`

- ✅ Production snapshots
- ✅ Chromatic baseline enforced
- ✅ Protected branch (blocked on regressions)
- ✅ All visual tests must pass
- ✅ CODEOWNERS review required

## 2️⃣ `develop`

- ✅ Integration branch for multi-subsystem features
- ✅ Chromatic runs, but snapshots update less frequently
- ✅ Used by Ignis, Ignition, Spark development
- ✅ Visual regressions allowed (with approval)
- ✅ Daily baseline updates

## 3️⃣ `feature/*`

- ✅ Component-level changes
- ✅ Each PR runs Chromatic on only changed stories
- ✅ Used by Slate, Unity-tools, etc.
- ✅ TurboSnap enabled (only changed stories)
- ✅ Auto-reject on visual diffs

---

# 📘 6.2.3 — CODEOWNERS (Essential)

**File:** `.github/CODEOWNERS`

Assign Storybook story directories to subsystem owners.

```gitattributes
# SLATE Design System
packages/slate/**/*.stories.*              @DesignSystemTeam
packages/slate/**/*.stories.@(js|jsx|ts|tsx|mdx)  @DesignSystemTeam

# IGNIS Node Editor
packages/ignis/**/*.stories.*              @IgnisTeam
packages/ignis/**/*.stories.@(js|jsx|ts|tsx|mdx)  @IgnisTeam

# UNITY-STYLE TOOLS
packages/unity-tools/**/*.stories.*        @UnityToolsTeam
packages/unity-tools/**/*.stories.@(js|jsx|ts|tsx|mdx)  @UnityToolsTeam

# IGNITION Runtime
packages/ignition/**/*.stories.*           @RuntimeTeam
packages/ignition/**/*.stories.@(js|jsx|ts|tsx|mdx)  @RuntimeTeam

# SPARK Templates
packages/spark/**/*.stories.*              @TemplatesTeam
packages/spark/**/*.stories.@(js|jsx|ts|tsx|mdx)  @TemplatesTeam

# WAYPOINT AI Assistant
packages/waypoint/**/*.stories.*           @AIUXTeam
packages/waypoint/**/*.stories.@(js|jsx|ts|tsx|mdx)  @AIUXTeam

# Global Storybook Configuration
apps/storybook/**                          @FrontendInfra
.storybook/**                              @FrontendInfra
.storybook/main.ts                         @FrontendInfra
.storybook/preview.ts                      @FrontendInfra

# Storybook Workflows
.github/workflows/storybook-*.yml          @FrontendInfra
.github/workflows/chromatic.yml            @FrontendInfra
```

**Why?**
- Chromatic diffs trigger owner reviews automatically
- Prevents unauthorized visual changes
- Ensures subsystem expertise reviews changes

---

# 🛡️ 6.2.4 — Protected Branch + Required Checks

## On `main` Branch

**Required Status Checks:**
- ✅ **Chromatic UI Review** (required)
- ✅ **Build Storybook** (required)
- ✅ **TypeScript** (required)
- ✅ **Lint** (required)
- ✅ **Unit Tests** (required)
- ✅ **E2E Tests** (optional, but recommended)
- ✅ **CODEOWNERS review** (required)

**Branch Protection Rules:**
- ✅ Require pull request reviews before merging
- ✅ Require CODEOWNERS approval
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ✅ Require linear history (no merge commits)

**Merges will be blocked if:**
- ❌ Any visual regression is not approved
- ❌ Any required story snapshot is missing
- ❌ Storybook build fails
- ❌ CODEOWNERS haven't approved

**This prevents "silent UI breakage."**

---

# 🧪 6.2.5 — Chromatic Workflow (Enhanced)

**File:** `.github/workflows/chromatic.yml`

Enhanced configuration with owner enforcement:

```yaml
name: "Chromatic Visual Tests"

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for TurboSnap

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Publish to Chromatic
        id: chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          autoAcceptChanges: false
          onlyChanged: true
          exitZeroOnChanges: false
          turboSnap: true
          traceChanges: true
          externals: true
          buildScriptName: build-storybook

      - name: Output visual test results
        if: steps.chromatic.outputs.buildNumber
        run: |
          echo "Chromatic build completed!"
          echo "Build Number: ${{ steps.chromatic.outputs.buildNumber }}"
          echo "Build URL: ${{ steps.chromatic.outputs.buildUrl }}"
```

**This automatically rejects PRs if:**
- ❌ NodeRenderer shifts
- ❌ WireRenderer changes shape
- ❌ Slate tokens drift
- ❌ SceneGraph indentation shifts
- ❌ Any visual diff exceeds threshold

---

# 🎨 6.2.6 — Storybook Multi-Package Architecture

**File:** `.storybook/main.ts`

Your Storybook config must support **6 subsystem folders**:

```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    // Slate Design System
    "../packages/slate/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Ignis Blueprint Editor
    "../packages/ignis/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Unity Tools
    "../packages/unity-tools/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Ignition Runtime
    "../packages/ignition/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Spark Templates
    "../packages/spark/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Waypoint AI
    "../packages/waypoint/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    
    // Web App Stories
    "../apps/web/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  
  docs: {
    autodocs: 'tag',
  },
  
  staticDirs: ['../public'],
  
  // Subsystem grouping
  features: {
    buildStoriesJson: true,
  },
};

export default config;
```

**File:** `.storybook/preview.ts`

Subsystem grouping via `storySort`:

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Subsystem grouping
    options: {
      storySort: {
        order: [
          'Slate',
          'Ignis',
          'Unity Tools',
          'Ignition',
          'Spark',
          'Waypoint',
          'Web',
        ],
        method: 'alphabetical',
      },
    },
    // Chromatic configuration
    chromatic: {
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true,
    },
  },
};

export default preview;
```

**This lines up with your architecture maps and mindmaps.**

---

# 🎛️ 6.2.7 — Publishing Storybook to GitHub Pages

**File:** `.github/workflows/storybook-publish.yml`

```yaml
name: "Publish Storybook"

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: storybook-static

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**Outcome:**
- ✅ Storybook published at: `https://<user>.github.io/<repo>/`
- ✅ Public read-only docs for collaborators
- ✅ Automatic updates on `main` branch pushes

---

# 🗂️ 6.2.8 — Tagging & Versioning Strategy (Critical)

Because WISSIL is an IDE, you need **subsystem-level versions**.

## Package Versioning

### **Slate**
```
@wissil/slate@v1.0.0
```

### **Ignis**
```
@wissil/ignis@v1.0.0
```

### **Unity Tools**
```
@wissil/unity-tools@v1.0.0
```

### **Spark Templates**
```
@wissil/spark@v1.0.0
```

### **Ignition Runtime**
```
@wissil/ignition@v1.0.0
```

### **Waypoint**
```
@wissil/waypoint@v1.0.0
```

## Storybook Versioning

Tags match release cycles:
```
storybook-release-v1.0.0
storybook-release-v1.1.0
storybook-release-v2.0.0
```

## Git Tags Format

```
v{major}.{minor}.{patch}
v1.0.0
v1.1.0
v2.0.0
```

---

# 🧩 6.2.9 — Snapshot Baseline Management Strategy

## Baseline Rules

**Only update baselines when:**
- ✅ Slate tokens intentionally changed (design system update)
- ✅ NodeRenderer redesigned (approved by Ignis team)
- ✅ Unity panels updated (approved by Unity Tools team)
- ✅ Template graph layout changes (approved by Spark team)

**Never accept baselines:**
- ❌ On Fridays (prevent weekend regressions)
- ❌ >20 snapshot changes in one PR (requires review)
- ❌ Template graph layout changes without Spark team review
- ❌ `/ignis` full page diffs without Ignis team approval
- ❌ Slate token changes without Design System team approval

## Snapshot Ownership Matrix

| Subsystem   | Who Approves Snapshot Baselines | Threshold |
|-------------|----------------------------------|-----------|
| **Slate**   | Design System team               | 0.01%     |
| **Ignis**   | Node Editor team                 | 0.05%     |
| **Unity Tools** | Tools team                    | 0.05%     |
| **Ignition** | Runtime team                    | 0.1%      |
| **Spark**   | Template team                    | 0.1%      |
| **Waypoint** | AI/UX team                      | 0.1%      |

## Baseline Update Process

1. **PR created** → Chromatic runs
2. **Visual diff detected** → Owner notified
3. **Owner reviews** → Approve or request changes
4. **If approved** → Baseline updated automatically
5. **If rejected** → PR blocked until fixed

---

# 🧬 6.2.10 — Multi-Maintainer Governance

Your repo is IDE-like (Figma-level). You must require:

## ✅ CODEOWNERS Gate

- All story changes require owner approval
- Automatic review requests sent to owners
- Prevents unauthorized visual changes

## ✅ Branch Protection

- `main` branch fully protected
- `develop` branch requires status checks
- Feature branches require PR reviews

## ✅ Review Enforcement

- Minimum 1 approval required
- CODEOWNERS approval required
- Visual regression approval required

## ✅ Chromatic Diffs Approval

- All visual changes require explicit approval
- No auto-acceptance on `main`
- Owner-based approval workflow

**This prevents major regressions as the team and subsystems grow.**

---

# 📊 Summary

## ✅ What's Set Up

- ✅ GitHub repo structure (canonical)
- ✅ Storybook multi-package architecture
- ✅ Chromatic CI with owner enforcement
- ✅ Protected branches with required checks
- ✅ CODEOWNERS file
- ✅ Publishing pipeline (GitHub Pages)
- ✅ Versioning strategy (subsystem-level)
- ✅ Snapshot baseline governance
- ✅ Multi-team workflow

## 🎯 Production-Grade Features

- ✅ **Zero-downtime Storybook publishing**
- ✅ **Owner-based visual approval**
- ✅ **TurboSnap optimization** (only changed stories)
- ✅ **Multi-subsystem support** (6 packages)
- ✅ **Protected baseline management**
- ✅ **Automated versioning**

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

