# Chromatic Comprehensive Guide for Storybook
## Visual Testing & UI Review Integration

**Version:** 1.0.0
**Date:** December 2024
**Tool:** Chromatic 11.0.0
**Framework:** Storybook 8.0 + WISSIL

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What is Chromatic?](#what-is-chromatic)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Visual Testing Workflow](#visual-testing-workflow)
6. [CI/CD Integration](#cicd-integration)
7. [Review & Collaboration](#review--collaboration)
8. [Best Practices](#best-practices)
9. [Visual Diagrams](#visual-diagrams)
10. [Troubleshooting](#troubleshooting)
11. [Advanced Features](#advanced-features)

---

## Executive Summary

Chromatic is a visual testing and review platform that integrates seamlessly with Storybook. It provides:

- **Visual Regression Testing**: Automatically detect UI changes
- **UI Review**: Collaborative review of component changes
- **Visual Testing**: Screenshot comparison across browsers and viewports
- **CI/CD Integration**: Automated testing in pull requests
- **Component Documentation**: Enhanced Storybook with visual diffs

This guide covers complete Chromatic integration for the WISSIL Storybook system.

---

## What is Chromatic?

### Core Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CHROMATIC CORE FEATURES                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. VISUAL REGRESSION TESTING
   ├── Automatic screenshot capture
   ├── Pixel-perfect comparison
   ├── Change detection
   └── Baseline management

2. UI REVIEW & COLLABORATION
   ├── Visual diffs in PRs
   ├── Comment threads
   ├── Approval workflow
   └── Design handoff

3. CROSS-BROWSER TESTING
   ├── Chrome, Firefox, Safari, Edge
   ├── Multiple viewports
   ├── Responsive testing
   └── Mobile device testing

4. CI/CD INTEGRATION
   ├── GitHub Actions
   ├── GitLab CI
   ├── CircleCI
   └── Jenkins

5. STORYBOOK ENHANCEMENT
   ├── Visual test results
   ├── Component gallery
   ├── Design tokens visualization
   └── Interactive documentation
```

### How Chromatic Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HOW CHROMATIC WORKS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Developer Workflow:
1. Build Storybook → npm run build-storybook
2. Run Chromatic → npm run chromatic
3. Chromatic captures screenshots of all stories
4. Compares against baseline (first run or approved)
5. Detects visual differences
6. Generates visual diff report
7. Posts results to PR (if in CI/CD)
8. Team reviews and approves/rejects changes

Baseline Management:
├── First Run: Establishes baseline
├── Subsequent Runs: Compares against baseline
├── Approved Changes: Updates baseline
└── Rejected Changes: Keeps old baseline
```

---

## Setup & Installation

### Prerequisites

```bash
# Already installed in WISSIL project
✅ Node.js >= 18.0.0
✅ Storybook 8.0
✅ Chromatic 11.0.0
✅ Git repository
```

### Initial Setup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CHROMATIC SETUP STEPS                                │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: Create Chromatic Account
├── Visit: https://www.chromatic.com
├── Sign up with GitHub/GitLab
└── Create new project

STEP 2: Get Project Token
├── Navigate to project settings
├── Copy project token
└── Format: chromatic-xxxxxxxxxxxxx

STEP 3: Configure Environment
├── Add token to CI/CD secrets
├── Add token to local .env (optional)
└── Configure package.json script

STEP 4: First Run
├── Build Storybook: npm run build-storybook
├── Run Chromatic: npm run chromatic
└── Establish baseline snapshots
```

### Package.json Configuration

```json
{
  "scripts": {
    "chromatic": "chromatic --exit-zero-on-changes",
    "chromatic:ci": "chromatic --exit-once-uploaded",
    "chromatic:local": "chromatic --only-changed"
  }
}
```

### Environment Variables

```bash
# .env.local (for local development)
CHROMATIC_PROJECT_TOKEN=chromatic-xxxxxxxxxxxxx

# CI/CD Environment Variables
CHROMATIC_PROJECT_TOKEN=chromatic-xxxxxxxxxxxxx
CHROMATIC_BUILD_TOKEN=chromatic-build-xxxxxxxxxxxxx
```

---

## Configuration

### Chromatic Configuration File

Create `.chromatic.config.json`:

```json
{
  "projectToken": "${CHROMATIC_PROJECT_TOKEN}",
  "buildScriptName": "build-storybook",
  "storybookBaseDir": ".",
  "storybookBuildDir": "storybook-static",
  "exitZeroOnChanges": true,
  "exitOnceUploaded": false,
  "onlyChanged": false,
  "autoAcceptChanges": false,
  "zip": true,
  "skip": false,
  "untraced": [],
  "externals": [],
  "ignoreLastBuildOnBranch": "main",
  "preserveMissingSpecs": false,
  "onlyStoryFiles": [],
  "onlyStoryNames": [],
  "skipStoryFiles": [],
  "skipStoryNames": [],
  "uploadTimeout": 300000,
  "tunnel": false,
  "tunnelTimeout": 300000,
  "ci": false,
  "debug": false
}
```

### Storybook Configuration for Chromatic

Update `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    // Chromatic addon (optional, for enhanced features)
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  // Chromatic-specific configuration
  features: {
    interactionsDebugger: true, // For Chromatic interaction testing
  },
  // Ensure consistent rendering for visual tests
  staticDirs: ['../public'],
};

export default config;
```

### Viewport Configuration

Update `.storybook/preview.ts` for consistent visual testing:

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    // Chromatic viewport configuration
    chromatic: {
      // Viewports to test
      viewports: [375, 768, 1280, 1920],
      // Delay before screenshot (for animations)
      delay: 100,
      // Disable animations for consistent screenshots
      disableAnimations: true,
      // Pause animations at end
      pauseAnimationAtEnd: true,
      // Ignore elements (e.g., timestamps, random data)
      ignore: [
        '[data-testid="timestamp"]',
        '[data-testid="random-id"]',
      ],
      // Diff threshold (0-1, default 0.63)
      diffThreshold: 0.2,
      // Mode: 'snapshot' or 'interaction'
      modes: {
        'default': {},
        'dark': {
          backgrounds: { default: 'dark' },
        },
        'light': {
          backgrounds: { default: 'light' },
        },
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        wide: {
          name: 'Wide',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },
};

export default preview;
```

### Story-Level Configuration

Configure individual stories for Chromatic:

```typescript
// Example: src/app/landing/landing.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import LandingPage from './page';

const meta = {
  title: 'WISSIL/Landing/Main Gateway',
  component: LandingPage,
  parameters: {
    // Chromatic-specific parameters
    chromatic: {
      // Skip this story in visual tests
      // skip: false,

      // Delay before screenshot (ms)
      delay: 500,

      // Viewports to test
      viewports: [375, 768, 1920],

      // Disable animations
      disableAnimations: true,

      // Pause at animation end
      pauseAnimationAtEnd: true,

      // Ignore specific elements
      ignore: [
        '[data-chromatic="ignore"]',
      ],
    },
  },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    chromatic: {
      // Story-specific overrides
      delay: 1000, // Wait for animations
    },
  },
};
```

---

## Visual Testing Workflow

### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHROMATIC VISUAL TESTING WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    Developer Makes Changes
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Create/Update Component    │
            │  Add/Update Story            │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Build Storybook             │
            │  npm run build-storybook     │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Run Chromatic               │
            │  npm run chromatic           │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Chromatic Process           │
            │  ├── Capture Screenshots     │
            │  ├── Compare to Baseline     │
            │  └── Generate Diff Report   │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  No Changes  │  │   Changes   │  │    Errors   │
│  Detected    │  │  Detected   │  │  Detected   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Pass ✅    │  │  Review      │  │  Fix Issues  │
│   Continue   │  │  Required    │  │  & Retry     │
└──────────────┘  └──────┬───────┘  └──────┬───────┘
                          │                  │
                          │                  │
                          ▼                  │
            ┌──────────────────────────────┐ │
            │  Team Reviews Changes       │ │
            │  ├── Visual Diff Review     │ │
            │  ├── Approve Changes        │ │
            │  └── Request Updates        │ │
            └──────────────┬───────────────┘ │
                           │                 │
                           ▼                 │
            ┌──────────────────────────────┐ │
            │  Changes Approved?           │ │
            └───┬──────────────┬───────────┘ │
                │              │             │
              YES│            │NO           │
                │              │             │
                ▼              ▼             │
    ┌──────────────────┐  ┌──────────────┐ │
    │  Update Baseline │  │  Reject &    │ │
    │  Merge PR        │  │  Request Fix │ │
    └──────────────────┘  └──────┬───────┘ │
                                  │         │
                                  └─────────┘
                                  │
                                  ▼
                            Retry Process
```

### Local Testing Workflow

```bash
# Step 1: Make component changes
# Edit component file

# Step 2: Update or create story
# Edit or create .stories.tsx file

# Step 3: Build Storybook
npm run build-storybook

# Step 4: Run Chromatic locally
npm run chromatic:local

# Step 5: Review results
# Open Chromatic dashboard URL provided

# Step 6: Approve or reject changes
# Use Chromatic UI to manage baseline
```

### CI/CD Workflow

```yaml
# .github/workflows/chromatic.yml
name: Chromatic Visual Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Required for Chromatic

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
          exitZeroOnChanges: true
          exitOnceUploaded: true
          onlyChanged: true
          autoAcceptChanges: false
```

---

## CI/CD Integration

### GitHub Actions Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS INTEGRATION                                │
└─────────────────────────────────────────────────────────────────────────────┘

Workflow Triggers:
├── Pull Request: On PR open/update
├── Push to Main: On merge to main
└── Manual: Workflow dispatch

Workflow Steps:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build Storybook
5. Run Chromatic
6. Post results to PR

Chromatic Action:
├── projectToken: From secrets
├── buildScriptName: build-storybook
├── exitZeroOnChanges: true
├── exitOnceUploaded: true
├── onlyChanged: true (only test changed stories)
└── autoAcceptChanges: false (require review)
```

### GitLab CI Integration

```yaml
# .gitlab-ci.yml
chromatic:
  image: node:18
  stage: test
  before_script:
    - npm ci
  script:
    - npm run build-storybook
    - npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
  only:
    - merge_requests
    - main
```

### CircleCI Integration

```yaml
# .circleci/config.yml
version: 2.1
jobs:
  chromatic:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package-lock.json" }}
      - run: npm ci
      - run: npm run build-storybook
      - run: npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

### PR Comment Integration

Chromatic automatically posts results to PRs:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PR COMMENT FORMAT                                        │
└─────────────────────────────────────────────────────────────────────────────┘

✅ Visual tests passed! No changes detected.
   View build: https://www.chromatic.com/build?appId=...

⚠️  Visual changes detected
   - 3 stories changed
   - 5 new stories
   - 2 stories removed
   Review changes: https://www.chromatic.com/build?appId=...

❌ Visual tests failed
   - 2 visual differences detected
   - Review and approve changes: https://www.chromatic.com/build?appId=...
```

---

## Review & Collaboration

### Review Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHROMATIC REVIEW WORKFLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. VISUAL DIFF DETECTION
   ├── Chromatic detects changes
   ├── Generates side-by-side comparison
   ├── Highlights pixel differences
   └── Shows before/after screenshots

2. TEAM NOTIFICATION
   ├── PR comment posted
   ├── Email notification (optional)
   ├── Slack integration (optional)
   └── Dashboard update

3. REVIEW PROCESS
   ├── Open Chromatic dashboard
   ├── Review each changed story
   ├── Compare across viewports
   ├── Check cross-browser differences
   └── Add comments/feedback

4. APPROVAL WORKFLOW
   ├── Approve: Update baseline
   ├── Reject: Request changes
   ├── Comment: Add feedback
   └── Merge: After approval

5. BASELINE MANAGEMENT
   ├── Approved changes → New baseline
   ├── Rejected changes → Keep old baseline
   └── Auto-approve: For specific branches
```

### Collaboration Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLLABORATION FEATURES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

COMMENTS & FEEDBACK
├── Inline comments on visual diffs
├── Thread discussions
├── @mentions for team members
└── Resolve comments

APPROVAL SYSTEM
├── Required approvals (configurable)
├── Auto-approve for trusted users
├── Branch-specific rules
└── Approval history

NOTIFICATIONS
├── Email notifications
├── Slack integration
├── GitHub/GitLab webhooks
└── Custom webhooks

SHARING
├── Shareable build links
├── Public story links
├── Embed in documentation
└── Export screenshots
```

---

## Best Practices

### Story Organization for Chromatic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BEST PRACTICES FOR CHROMATIC                               │
└─────────────────────────────────────────────────────────────────────────────┘

1. STORY NAMING
   ├── Use descriptive names
   ├── Group related stories
   ├── Consistent naming convention
   └── Avoid special characters

2. STORY STRUCTURE
   ├── One story per visual state
   ├── Separate stories for variants
   ├── Clear story hierarchy
   └── Logical grouping

3. VISUAL CONSISTENCY
   ├── Disable animations for tests
   ├── Use fixed data (no random)
   ├── Consistent viewports
   └── Stable component states

4. PERFORMANCE
   ├── Test only changed stories (onlyChanged)
   ├── Skip unnecessary stories
   ├── Optimize build time
   └── Cache dependencies

5. BASELINE MANAGEMENT
   ├── Review before approving
   ├── Document intentional changes
   ├── Keep baseline up to date
   └── Use auto-approve carefully

6. ERROR HANDLING
   ├── Handle loading states
   ├── Handle error states
   ├── Handle empty states
   └── Test edge cases

7. ACCESSIBILITY
   ├── Test with a11y addon
   ├── Test keyboard navigation
   ├── Test screen readers
   └── Verify ARIA labels
```

### Story Configuration Best Practices

```typescript
// ✅ GOOD: Stable, testable story
export const Default: Story = {
  args: {
    // Fixed data, no randomness
    title: 'WISSIL System',
    status: 'online',
    // Stable timestamps
    timestamp: '2024-12-01T00:00:00Z',
  },
  parameters: {
    chromatic: {
      // Disable animations for consistency
      disableAnimations: true,
      // Wait for async operations
      delay: 500,
      // Test specific viewports
      viewports: [375, 768, 1920],
    },
  },
};

// ❌ BAD: Unstable, unpredictable story
export const BadExample: Story = {
  args: {
    // Random data changes every run
    id: Math.random().toString(),
    // Current time changes every run
    timestamp: new Date().toISOString(),
    // Random colors
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
  },
};
```

### Ignoring Elements

```typescript
// Ignore dynamic/timestamp elements
parameters: {
  chromatic: {
    ignore: [
      '[data-testid="timestamp"]',
      '[data-testid="random-id"]',
      '.animated-element', // If animations cause issues
      '[data-chromatic="ignore"]', // Custom attribute
    ],
  },
};

// In component:
<div data-chromatic="ignore">
  {/* This element will be ignored in visual tests */}
  <Timestamp />
</div>
```

---

## Visual Diagrams

### Chromatic Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHROMATIC ARCHITECTURE DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────────┘

                    Developer/CI/CD
                           │
                           │ npm run chromatic
                           ▼
            ┌──────────────────────────────┐
            │  Local/CI Environment        │
            │  ├── Build Storybook         │
            │  ├── Run Chromatic CLI       │
            │  └── Upload Build            │
            └──────────────┬───────────────┘
                           │
                           │ HTTPS Upload
                           ▼
            ┌──────────────────────────────┐
            │  Chromatic Cloud Service     │
            │  ├── Receive Build           │
            │  ├── Capture Screenshots     │
            │  ├── Compare to Baseline     │
            │  └── Generate Diff Report   │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Dashboard   │  │  PR Comment │  │  Notifications│
│  Web UI      │  │  (GitHub)   │  │  (Email/Slack)│
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                         ▼
            ┌──────────────────────────────┐
            │  Team Review & Approval      │
            │  ├── Visual Diff Review     │
            │  ├── Approve Changes        │
            │  └── Update Baseline        │
            └──────────────────────────────┘
```

### Visual Testing Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VISUAL TESTING PROCESS FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    Storybook Build
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Chromatic CLI               │
            │  ├── Parse Storybook         │
            │  ├── Identify Stories       │
            │  └── Prepare Test Plan      │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Upload to Chromatic          │
            │  ├── Storybook Build         │
            │  ├── Configuration          │
            │  └── Metadata                │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Chromatic Cloud              │
            │  ├── Load Stories            │
            │  ├── Render Components       │
            │  ├── Capture Screenshots     │
            │  └── Process Viewports       │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Baseline Comparison          │
            │  ├── Load Baseline           │
            │  ├── Pixel Comparison        │
            │  ├── Diff Detection          │
            │  └── Generate Report         │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  No Changes  │  │   Changes    │  │    Errors    │
│  ✅ Pass     │  │  ⚠️ Review   │  │  ❌ Fail     │
└──────────────┘  └──────┬───────┘  └──────┬───────┘
                         │                  │
                         ▼                  ▼
            ┌──────────────────────────────┐
            │  Review & Approval            │
            │  ├── Visual Diff UI          │
            │  ├── Team Comments           │
            │  ├── Approve/Reject          │
            │  └── Update Baseline         │
            └──────────────────────────────┘
```

### Baseline Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BASELINE MANAGEMENT FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                    First Run
                           │
                           ▼
            ┌──────────────────────────────┐
            │  No Baseline Exists          │
            │  ├── Capture Screenshots    │
            │  ├── Create Baseline        │
            │  └── Mark as Approved       │
            └──────────────┬───────────────┘
                           │
                           ▼
                    Baseline Created
                           │
                           │
                    Subsequent Runs
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Load Baseline                │
            │  ├── Get Approved Screenshots│
            │  └── Compare New Screenshots │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  No Changes  │  │   Changes   │  │    Errors    │
│  Detected    │  │  Detected   │  │  Detected   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Keep        │  │  Review      │  │  Fix &       │
│  Baseline    │  │  Required   │  │  Retry       │
└──────────────┘  └──────┬───────┘  └──────────────┘
                         │
                         ▼
            ┌──────────────────────────────┐
            │  Team Reviews Changes         │
            │  ├── Visual Diff              │
            │  ├── Approve Intentional      │
            │  └── Reject Unintentional     │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  │
┌──────────────┐  ┌──────────────┐           │
│  Approved    │  │  Rejected    │           │
│  Changes     │  │  Changes     │           │
└──────┬───────┘  └──────┬───────┘           │
       │                 │                    │
       │                 │                    │
       ▼                 ▼                    │
┌──────────────┐  ┌──────────────┐           │
│  Update      │  │  Keep        │           │
│  Baseline    │  │  Old         │           │
│  ✅          │  │  Baseline    │           │
└──────────────┘  └──────────────┘           │
                                              │
                                              │
                                              ▼
                                    Retry After Fix
```

---

## Troubleshooting

### Common Issues & Solutions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING GUIDE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

ISSUE: Build Fails
├── Cause: Storybook build errors
├── Solution: Fix Storybook build first
└── Check: npm run build-storybook

ISSUE: Upload Timeout
├── Cause: Large build or slow network
├── Solution: Increase uploadTimeout
└── Config: uploadTimeout: 600000 (10 minutes)

ISSUE: Flaky Screenshots
├── Cause: Animations, timers, random data
├── Solution:
│   ├── Disable animations
│   ├── Use fixed data
│   └── Add delay for async operations
└── Config: disableAnimations: true, delay: 500

ISSUE: False Positives
├── Cause: Dynamic content (timestamps, IDs)
├── Solution: Ignore dynamic elements
└── Config: ignore: ['[data-testid="timestamp"]']

ISSUE: Missing Stories
├── Cause: Story not found or excluded
├── Solution: Check story file path and naming
└── Check: Story matches pattern in main.ts

ISSUE: Baseline Not Updating
├── Cause: Changes not approved
├── Solution: Approve changes in dashboard
└── Check: Approval workflow settings

ISSUE: CI/CD Integration Fails
├── Cause: Missing token or permissions
├── Solution: Check secrets and permissions
└── Check: CHROMATIC_PROJECT_TOKEN in secrets

ISSUE: Slow Performance
├── Cause: Too many stories or viewports
├── Solution:
│   ├── Use onlyChanged: true
│   ├── Reduce viewports
│   └── Skip unnecessary stories
└── Config: onlyChanged: true, viewports: [375, 1920]
```

### Debug Mode

```bash
# Enable debug mode for troubleshooting
npm run chromatic -- --debug

# Or in config
{
  "debug": true
}
```

### Logs & Diagnostics

```bash
# Check Chromatic logs
# Logs are printed to console during run

# Common log messages:
# ✅ Build uploaded successfully
# ⚠️  Visual changes detected
# ❌ Build failed
# ℹ️  Baseline not found, creating new baseline
```

---

## Advanced Features

### Interaction Testing

```typescript
// Test user interactions
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click button
    const button = canvas.getByRole('button');
    await userEvent.click(button);

    // Wait for state change
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
  },
  parameters: {
    chromatic: {
      // Capture after interaction
      delay: 500,
    },
  },
};
```

### Cross-Browser Testing

```typescript
// Configure multiple browsers
parameters: {
  chromatic: {
    browsers: ['chrome', 'firefox', 'safari', 'edge'],
    viewports: [375, 768, 1920],
  },
};
```

### Custom Modes

```typescript
// Test different themes/modes
parameters: {
  chromatic: {
    modes: {
      'default': {},
      'dark': {
        backgrounds: { default: 'dark' },
      },
      'light': {
        backgrounds: { default: 'light' },
      },
      'mobile': {
        viewport: { width: 375, height: 667 },
      },
    },
  },
};
```

### Snapshot Testing

```typescript
// Capture snapshots at specific points
export const WithSnapshots: Story = {
  play: async ({ canvasElement }) => {
    // Initial state
    await expect(canvasElement).toMatchSnapshot('initial');

    // After interaction
    await userEvent.click(button);
    await expect(canvasElement).toMatchSnapshot('after-click');
  },
};
```

### Custom Thresholds

```typescript
// Adjust diff sensitivity
parameters: {
  chromatic: {
    // Lower = more sensitive (0.0 - 1.0)
    diffThreshold: 0.1, // Very sensitive
    // Or
    diffThreshold: 0.5, // Balanced (default)
    // Or
    diffThreshold: 0.9, // Less sensitive
  },
};
```

---

## WISSIL-Specific Configuration

### WISSIL Chromatic Setup

```json
// .chromatic.config.json for WISSIL
{
  "projectToken": "${CHROMATIC_PROJECT_TOKEN}",
  "buildScriptName": "build-storybook",
  "storybookBaseDir": ".",
  "storybookBuildDir": "storybook-static",
  "exitZeroOnChanges": true,
  "onlyChanged": true,
  "autoAcceptChanges": false,
  "ignoreLastBuildOnBranch": "main",
  "untraced": [
    "node_modules/**",
    ".next/**",
    "storybook-static/**"
  ],
  "onlyStoryFiles": [
    "src/app/**/*.stories.tsx"
  ],
  "skipStoryFiles": [
    "**/*.test.tsx",
    "**/*.spec.tsx"
  ]
}
```

### WISSIL Story Configuration

```typescript
// Example: WISSIL story with Chromatic config
export const Default: Story = {
  parameters: {
    chromatic: {
      // WISSIL-specific settings
      delay: 500, // Wait for animations
      disableAnimations: true, // Consistent screenshots
      viewports: [375, 768, 1920], // Mobile, Tablet, Desktop
      ignore: [
        '[data-testid="timestamp"]',
        '[data-testid="random-id"]',
      ],
      modes: {
        'default': {},
        'dark': {
          backgrounds: { default: 'dark' },
        },
      },
    },
  },
};
```

### CI/CD Integration for WISSIL

```yaml
# .github/workflows/chromatic-wissil.yml
name: WISSIL Chromatic Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  chromatic-wissil:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Sync WISSIL stories
        run: npm run storybook:sync-wissil

      - name: Build Storybook
        run: npm run build-storybook

      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
          exitZeroOnChanges: true
          exitOnceUploaded: true
          onlyChanged: true
          autoAcceptChanges: false
```

---

## Summary

This comprehensive guide covers:

1. **Chromatic Overview**: What it is and how it works
2. **Setup & Installation**: Complete setup process
3. **Configuration**: Storybook and Chromatic configuration
4. **Visual Testing Workflow**: Complete testing process
5. **CI/CD Integration**: GitHub, GitLab, CircleCI
6. **Review & Collaboration**: Team workflow and features
7. **Best Practices**: Story organization and configuration
8. **Visual Diagrams**: Architecture and workflow diagrams
9. **Troubleshooting**: Common issues and solutions
10. **Advanced Features**: Interaction testing, cross-browser, modes

### Key Takeaways

- **Visual Regression Testing**: Automatically detect UI changes
- **Baseline Management**: Approve intentional changes, reject bugs
- **CI/CD Integration**: Automated testing in pull requests
- **Team Collaboration**: Review and approve visual changes together
- **Performance**: Use `onlyChanged` to test only modified stories
- **Stability**: Disable animations, use fixed data for consistent tests

Chromatic ensures visual consistency across all WISSIL components and provides a seamless workflow for visual testing and review.

---

**Document Version:** 1.0.0
**Last Updated:** December 2024
**Maintained By:** WISSIL Quality Assurance Team
