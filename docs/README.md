# 📚 WISSIL/LUMINES Documentation Index

This directory contains comprehensive documentation for the WISSIL/LUMINES repository.

---

## 🎨 Chromatic Visual Regression Testing

### Core Documentation

- **[CHROMA_STATUS.md](./CHROMA_STATUS.md)** - Complete Chromatic status and policies
  - What is snapshotted
  - How to approve/reject changes
  - Required stories
  - Visual test policies
  - Troubleshooting guide

- **[CHROMA_STATUS_CHECKLIST.md](./CHROMA_STATUS_CHECKLIST.md)** - Visual QA checklist
  - Mandatory checklist for every PR
  - Global setup checks
  - Component-specific visual checks
  - Subsystem coverage verification
  - Acceptance criteria for releases

- **[CHROMATIC_TRIAGE_GUIDE.md](./CHROMATIC_TRIAGE_GUIDE.md)** - Visual regression triage manual
  - How to analyze and classify visual diffs
  - Regression type identification (5 categories)
  - Severity classification system (S0-S4)
  - Debugging common regression sources
  - When to accept vs reject changes
  - Pre-merge checklist

- **[VISUAL_REGRESSION_MATRIX.md](./VISUAL_REGRESSION_MATRIX.md)** - Risk matrix and severity guide
  - Severity levels (S0-S4)
  - Risk scoring system (0-30 scale)
  - Component risk matrices for all subsystems
  - Owner assignment matrix
  - Must-fix-before-merge components
  - Time-to-resolution SLAs
  - Zero-tolerance zones

- **[STORYBOOK_STATUS.md](./STORYBOOK_STATUS.md)** - Storybook & Chromatic overview
  - Subsystem coverage matrix
  - Required stories
  - Chromatic configuration
  - Review process
  - Roadmap

---

## 📖 Related Documentation

### Setup Guides

- **[../CHROMATIC_SETUP.md](../CHROMATIC_SETUP.md)** - Complete setup guide
- **[../CHROMATIC_INTEGRATION_COMPLETE.md](../CHROMATIC_INTEGRATION_COMPLETE.md)** - Integration summary
- **[../CURSOR_CHROMATIC_SETUP_PROMPT.md](../CURSOR_CHROMATIC_SETUP_PROMPT.md)** - Automation prompt

### Architecture Documentation

- **[../REPOSITORY_ARCHITECTURE.md](../REPOSITORY_ARCHITECTURE.md)** - Complete system architecture
- **[../REPOSITORY_COMPLETE_OVERVIEW.md](../REPOSITORY_COMPLETE_OVERVIEW.md)** - Master overview
- **[../REPOSITORY_DIAGRAMS.md](../REPOSITORY_DIAGRAMS.md)** - Visual diagrams
- **[../REPOSITORY_MINDMAP.md](../REPOSITORY_MINDMAP.md)** - System mindmaps
- **[../REPOSITORY_QUICK_REFERENCE.md](../REPOSITORY_QUICK_REFERENCE.md)** - Quick reference guide

### Quality Assurance

- **[WISSIL_QA_TESTING_PLAN.md](./WISSIL_QA_TESTING_PLAN.md)** - Comprehensive QA Testing Plan
  - 12 QC test suites covering all subsystems
  - 48+ test suites, 200+ test cases
  - Performance, visual regression, and E2E tests
  - Collaboration and multi-user testing
  - Alpha readiness checklist

- **[WISSIL_AUTOMATED_QA_SUITE.md](./WISSIL_AUTOMATED_QA_SUITE.md)** - Automated Testing Infrastructure
  - Complete test suite structure
  - Unit, integration, E2E, and performance tests
  - CI/CD pipeline configuration
  - Mock systems for testing
  - Test coverage goals and statistics

- **[WISSIL_QA_DASHBOARD.md](./WISSIL_QA_DASHBOARD.md)** - QA Dashboard (Notion/Linear)
  - Master QA Board (Kanban)
  - Test Cases Database
  - QA Cycle Organizer
  - Coverage Tracker
  - Regression Matrix
  - Visual Regression Dashboard
  - Performance Benchmarks
  - AI/LUNA QA Dashboard
  - Daily Scrum Board
  - Pre-Release QA Gating

- **[WISSIL_QA_DEVOPS_RELEASE_PIPELINE.md](./WISSIL_QA_DEVOPS_RELEASE_PIPELINE.md)** - Complete CI/CD Pipeline
  - 7-phase release pipeline
  - PR validation (lint, typecheck, unit tests)
  - Visual regression & accessibility
  - Integration & runtime tests
  - E2E & multi-user collaboration
  - Performance & load testing
  - Deployment automation
  - Post-deployment monitoring
  - Release gates (Alpha, Beta, RC, Production)

- **[PHASE_6.2_STORYBOOK_GIT_ARCHITECTURE.md](./PHASE_6.2_STORYBOOK_GIT_ARCHITECTURE.md)** - Storybook Git Architecture
  - Repository folder structure (canonical)
  - GitHub branch strategy (3-tier)
  - CODEOWNERS configuration
  - Protected branch rules
  - Chromatic workflow enhancement
  - Multi-package Storybook architecture
  - GitHub Pages publishing
  - Versioning strategy
  - Snapshot baseline management
  - Multi-maintainer governance

- **[STORYBOOK_BRANCH_PROTECTION.md](./STORYBOOK_BRANCH_PROTECTION.md)** - Branch Protection Guide
  - Main branch protection rules
  - Develop branch settings
  - Feature branch recommendations
  - GitHub configuration steps

- **[STORYBOOK_QUICK_REFERENCE.md](./STORYBOOK_QUICK_REFERENCE.md)** - Storybook Quick Reference
  - Quick commands
  - Story locations by subsystem
  - Chromatic thresholds
  - Workflow guide
  - Storybook URLs

- **[PHASE_6.3_STORYBOOK_CACHING_AND_SPEED.md](./PHASE_6.3_STORYBOOK_CACHING_AND_SPEED.md)** - Storybook Performance Optimization
  - Vite builder migration (20-60× faster)
  - Turborepo caching
  - Nx task graph for partial rebuilds
  - Subsystem-level code splitting
  - Lazy compilation
  - Chromatic TurboSnap optimization
  - GitHub Actions caching
  - Pre-bundling optimization
  - Subsystem bundle isolation
  - Performance metrics (before/after)

- **[STORYBOOK_VITE_MIGRATION.md](./STORYBOOK_VITE_MIGRATION.md)** - Vite Migration Guide
  - Step-by-step migration from Next.js to Vite
  - Breaking changes and solutions
  - Performance comparison
  - Rollback plan

- **[PHASE_6.4_DDD_STORYBOOK_SYSTEM.md](./PHASE_6.4_DDD_STORYBOOK_SYSTEM.md)** - Documentation-Driven Development
  - MDX documentation architecture
  - Auto-doc generation (API pages)
  - MDX templates
  - Figma integration
  - System docs for all 6 subsystems
  - Documentation coverage markers
  - LUNA autodoc generation pipeline
  - DDD CI rules
  - Cross-linking with repo architecture
  - Storybook as DX portal
  - ADRs (Architecture Decision Records)
  - DDD workflow

- **[adr/001-storybook-ddd.md](./adr/001-storybook-ddd.md)** - Storybook DDD ADR
  - Decision to use Storybook as DDD system
  - Rationale and consequences
  - Implementation plan

- **[mdx-templates/](./mdx-templates/)** - MDX Documentation Templates
  - Component template
  - Subsystem index template
  - Overview template
  - Interactive example template

- **[PHASE_6.5_CROSS_SUBSYSTEM_INTERACTIVE_DIAGRAMS.md](./PHASE_6.5_CROSS_SUBSYSTEM_INTERACTIVE_DIAGRAMS.md)** - Interactive Diagrams & Cross-Linking
  - Interactive architecture maps
  - Live Ignis Blueprint graphs in docs
  - Interactive Spark template docs
  - Unity WebGL runtime preview
  - Interactive Unity tooling panels
  - Cross-subsystem linking engine
  - Mermaid JS diagrams
  - Interactive Blueprint Node Library docs
  - LUNA-driven interactive docs
  - Multi-subsystem IDE at-a-glance

- **[PHASE_6.6_IDE_SIMULATION_MODE.md](./PHASE_6.6_IDE_SIMULATION_MODE.md)** - Full IDE Simulation Mode
  - IDE Shell component (mini-IDE layout)
  - Mode switcher (UI Ribbon)
  - Spark template loading into Ignis
  - Live Unity WebGL runtime integration
  - Waypoint Assistant floating panel
  - SceneGraph and Prefab Inspector live-linking
  - Interactive Shader Editor integration
  - Runtime Event Inspector and Timeline
  - Record mode (tutorial bundle export)
  - Chromatic integration for IDE simulation

- **[PHASE_6.7_MULTIPLAYER_COLLAB_IDE.md](./PHASE_6.7_MULTIPLAYER_COLLAB_IDE.md)** - Multi-IDE Collaborative Mode
  - Y.js + WebRTC real-time sync layer
  - Figma-style presence cursors
  - Shared Ignis graph editing
  - Shared SceneGraph selection
  - Shared Inspector panel state
  - Shared ShaderGraph editor
  - Shared Timeline editor/sequencer
  - Shared runtime logs & console
  - Waypoint multiplayer AI facilitator
  - Locking rules (collision-free editing)
  - Activity timeline & replay
  - Multiplayer scaling rules (enterprise-level)

- **[PHASE_6.8_OPTION_C_NATS_JETSTREAM_PERSISTENCE.md](./PHASE_6.8_OPTION_C_NATS_JETSTREAM_PERSISTENCE.md)** - NATS JetStream Persistence Layer
  - Event-sourced storage system
  - Stream definitions per subsystem
  - Message format and schema
  - NATS + Y.js real-time multiplayer
  - Session persistence with durable streams
  - Versioning (JetStream-native)
  - Branching (sessions = Git branches)
  - Replay system (event timeline player)
  - Multi-subsystem merges (LUNA-assisted)
  - Cloud-shared sessions (Figma-style links)
  - Unity WebGL integration
  - Storage retention strategy
  - Security model

- **[PHASE_6.9_FEDERATED_MODULES_AND_MICRO_FE.md](./PHASE_6.9_FEDERATED_MODULES_AND_MICRO_FE.md)** - Federated Modules + Micro-FE Architecture
  - Turn WISSIL into 6 micro-frontends
  - Module Federation for Storybook
  - Subsystems as federated remote apps
  - Independent subsystem Storybooks
  - WISSIL Hub (central aggregator)
  - Dependency independence
  - Shared types via wissil-kernel
  - Cross-system runtime federation
  - Performance boost (30-60% faster builds)
  - Plugin ecosystem foundation

- **[FEDERATED_MODULES_QUICK_START.md](./FEDERATED_MODULES_QUICK_START.md)** - Quick Start Guide
  - Setup steps
  - Testing federation
  - Building for production

- **[PHASE_6.10_WISSIL_PLUGIN_ARCHITECTURE.md](./PHASE_6.10_WISSIL_PLUGIN_ARCHITECTURE.md)** - Plugin Architecture (Extension SDK)
  - Plugin SDK structure
  - Plugin manifest schema
  - Plugin loader (Module Federation + dynamic imports)
  - Plugin registration system
  - Extension points (7 types)
  - Plugin sandbox security
  - Plugin packaging (developer experience)
  - Plugin testing in Storybook
  - Plugin lifecycle
  - AI-assisted plugin development (LUNA)

- **[STORYBOOK_EXPANSION_PLAN.md](./STORYBOOK_EXPANSION_PLAN.md)** - Complete Storybook Expansion Plan (90% → 100%)
  - Current status analysis (what's complete, what's missing)
  - Complete folder structure
  - Phase 1-3 implementation guide
  - Story templates
  - Story coverage matrix
  - Success criteria
  - Implementation checklist

- **[CURSOR_PROMPTS_STORYBOOK_GENERATION.md](./CURSOR_PROMPTS_STORYBOOK_GENERATION.md)** - AI Generation Prompts
  - 10 ready-to-use Cursor AI prompts
  - Batch generation prompt
  - Verification checklist
  - Auto-generate all missing stories

- **[CI_CD_PIPELINE_STATUS.md](./CI_CD_PIPELINE_STATUS.md)** - CI/CD Pipeline Status
  - Complete GitHub Actions workflows
  - 9 production workflows (CI, Lint, Typecheck, Storybook, E2E, Release, Deploy, Chromatic, Cache Cleanup)
  - Parallel execution
  - Artifact management
  - PR comments and previews
  - Release automation
  - Deployment pipelines

- **[CI_CD_SETUP_GUIDE.md](./CI_CD_SETUP_GUIDE.md)** - CI/CD Setup Guide
  - Prerequisites and requirements
  - Required GitHub secrets
  - Workflow breakdown
  - Configuration steps
  - Troubleshooting guide
  - Success criteria

### Other Documentation

- **[WISSIL_SPARK_LANDING_PAGE.md](./WISSIL_SPARK_LANDING_PAGE.md)** - Spark landing page docs

---

## 🚀 Quick Start

### For New Team Members

1. Read **[REPOSITORY_ARCHITECTURE.md](../REPOSITORY_ARCHITECTURE.md)** for system overview
2. Review **[STORYBOOK_STATUS.md](./STORYBOOK_STATUS.md)** for Storybook setup
3. Check **[CHROMA_STATUS.md](./CHROMA_STATUS.md)** for Chromatic policies
4. Use **[CHROMA_STATUS_CHECKLIST.md](./CHROMA_STATUS_CHECKLIST.md)** for PR reviews

### For Visual Regression Testing

1. **Setup:** Follow [CHROMATIC_SETUP.md](../CHROMATIC_SETUP.md)
2. **Daily Use:** Follow [CHROMA_STATUS_CHECKLIST.md](./CHROMA_STATUS_CHECKLIST.md)
3. **Review Process:** See [CHROMA_STATUS.md](./CHROMA_STATUS.md#how-to-approve-or-reject-changes)

---

## 📊 Documentation Status

| Document | Status | Purpose |
|----------|--------|---------|
| `CHROMA_STATUS.md` | ✅ Complete | Policies and procedures |
| `CHROMA_STATUS_CHECKLIST.md` | ✅ Complete | PR checklist |
| `CHROMATIC_TRIAGE_GUIDE.md` | ✅ Complete | Triage manual |
| `VISUAL_REGRESSION_MATRIX.md` | ✅ Complete | Risk matrix and severity |
| `STORYBOOK_STATUS.md` | ✅ Complete | Overview and coverage |
| `README.md` | ✅ Complete | This index |

---

**Last Updated:** December 2024

