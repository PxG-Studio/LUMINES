# SPARK: Full Comprehensive Plan Overview
**Complete Build Roadmap - 10/10 Production-Ready**

_Last Updated: December 2024_
_Status: Planning Complete - Ready for Implementation_

---

## Table of Contents

1. [Plan Structure Overview](#plan-structure-overview)
2. [Core Philosophy & Vision](#core-philosophy--vision)
3. [10-Phase Implementation Roadmap](#10-phase-implementation-roadmap)
4. [337 Gap-Filling Items (10/10 Checklist)](#337-gap-filling-items-1010-checklist)
5. [Complete File Structure](#complete-file-structure)
6. [Success Metrics & Validation Gates](#success-metrics--validation-gates)
7. [Implementation Timeline](#implementation-timeline)

---

## Plan Structure Overview

The SPARK comprehensive plan consists of **three main components**:

### 1. **Core Architecture Plan** (15 Main Todos)
   - 10 sequential phases (Phase 0-10)
   - Foundation → UI → Runtime → Engines → Deployment
   - Based on Bolt.New × StackBlitz hybrid architecture

### 2. **337 Gap-Filling Items** (10/10 Production Checklist)
   - Organized into 12 comprehensive sections
   - Covers: MVP definition, testing, resources, risks, performance, security, documentation
   - Brings plan from 7.5/10 → 10/10

### 3. **Philosophy & Vision Document**
   - Part 0: Core philosophy from capstone documents
   - Parts 1-12: Technical roadmap driven by philosophy
   - Connection between "why" and "how"

**Total Scope**: 15 core phases + 337 gap-filling items = **352 comprehensive todos**

---

## Core Philosophy & Vision

### The Vision Statement

**"Bridging the Confidence Gap: Analyzing the Role of Game Design Principles in Enhancing Portfolio Development for Creative Media Students"**

SPARK is built on the belief that creative media students and indie game developers face psychological barriers when building portfolios. SPARK addresses these by applying game design principles to development itself.

### Core Principles

1. **Confidence Through Progression** - Break development into achievable milestones
2. **Feedback Loops Build Confidence** - Real-time validation and error correction
3. **Reward Systems Drive Motivation** - Celebrate achievements and progress
4. **Narrative Elements Create Engagement** - Frame development as a journey
5. **Reduce Friction, Increase Confidence** - AI-powered generation, automatic validation
6. **Empowerment Through Transparency** - Visible generation process, clear errors

### What SPARK Is

- **AI-Powered Multi-Engine Game Development IDE**
- **Vibe Coding Platform** - Natural language → working game assets
- **Confidence-Building Framework** - Gamified development experience
- **7 Engine Support** - Unity, Godot, PICO-8, GameMaker, RPG Maker, Construct, Ren'Py

---

## 10-Phase Implementation Roadmap

### Architecture: Next.js App Router + WebContainer + Docker

**SPARK = Next.js (UI + MCP) + Vite/WebContainer (Runtime Sandbox) + Docker (Engine Previews)**

- **Left Panel**: MCP AI Assistant (Chat, Plan, Actions, Agents, Files, History)
- **Right Panel**: Runtime Preview with pop-in/pop-out, supporting 7 engines
- **Tier A Preview**: Browser WASM sandbox (fast, lightweight)
- **Tier B Preview**: Docker engine containers (accurate, full fidelity)

---

### Phase 0: Project Setup & Migration
**Status**: Foundation | **Dependencies**: None

**Main Todo**: `phase0_setup`
- Migrate to Next.js App Router
- Install Next.js 14+ with App Router
- Set up project structure: `/app`, `/public`, `/runtime`, `/server`, `/engines`
- Configure TypeScript for Next.js
- Set up path aliases (`@/app`, `@/runtime`, etc.)
- Install Core Dependencies (Next.js 14+, React 18+, TypeScript, Monaco Editor, WebContainer libraries, Docker-related packages)

**Key Files**:
- `package.json` - Dependencies configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration

---

### Phase 1: Complete UI Layer (Next.js App Router)
**Status**: Current Focus | **Dependencies**: Phase 0

**Main Todos**:
- `phase1_layout` - Next.js layout.tsx, page.tsx, global styles
- `phase1_mcp_panel` - Complete MCP Left Panel with all 6 tabs
- `phase1_preview_panel` - Right Preview Panel with runtime tabs, pop-out, mode selector
- `phase1_bridge` - Bridge layer (bridge-types, bridge-client, bridge-runtime)
- `phase1_styling` - Complete UI styling with dark theme

**Files to Create** (20+ files):

**Layout & Pages**:
- `app/spark/layout.tsx` - Root layout with metadata
- `app/spark/page.tsx` - Main two-panel SPARK page
- `app/spark/styles/globals.css` - Global theme tokens

**Left Panel (MCP)**:
- `app/spark/components/MCPPanel/index.tsx` - Main MCP panel container
- `app/spark/components/MCPPanel/TabSwitcher.tsx` - Tab navigation
- `app/spark/components/MCPPanel/MCPChat.tsx` - Chat input & messages
- `app/spark/components/MCPPanel/MCPPlan.tsx` - AI reasoning steps display
- `app/spark/components/MCPPanel/MCPActions.tsx` - Executed actions log
- `app/spark/components/MCPPanel/MCPAgents.tsx` - Multi-expert agent status
- `app/spark/components/MCPPanel/MCPFiles.tsx` - Virtual FS tree viewer
- `app/spark/components/MCPPanel/MCPHistory.tsx` - Session history

**Right Panel (Preview)**:
- `app/spark/components/PreviewPanel/index.tsx` - Main preview container
- `app/spark/components/PreviewPanel/RuntimeTabs.tsx` - Engine tabs
- `app/spark/components/PreviewPanel/PopoutButton.tsx` - Pop-out window handler
- `app/spark/components/PreviewPanel/PreviewModeSelector.tsx` - Auto/Fast/Accurate mode toggle

**Bridge Layer**:
- `app/spark/bridge/bridge-types.ts` - TypeScript message contracts
- `app/spark/bridge/bridge-client.ts` - Next.js → Runtime communication
- `app/spark/bridge/bridge-runtime.ts` - Runtime → UI communication

**Styling**:
- `app/spark/styles/ui.css` - Panel, tab, component styles

**Theme**: Dark mode IDE aesthetic (#0F0F14 background, #151821 panels, #2D7FF9 accent)

---

### Phase 2: Runtime HTML Shell
**Status**: Next | **Dependencies**: Phase 1 Bridge

**Main Todo**: `phase2_runtime_html`

**Files to Create**:
- `public/spark-runtime.html` - Runtime iframe container
- Initializes WebContainer sandbox
- Sets up postMessage bridge

---

### Phase 3: Virtual Filesystem (spark-fs)
**Status**: After Phase 2 | **Dependencies**: Phase 2

**Main Todo**: `phase3_virtual_fs`

**Files to Create**:
- `runtime/spark-fs.ts` - StackBlitz-style virtual FS
- Operations: `writeFile()`, `readFile()`, `mkdir()`, `exists()`, `readdir()`, `deleteFile()`
- IndexedDB/local storage backend
- Project structure: `/project/Assets/`, `/project/Scripts/`, etc.

**Features**:
- File system events
- Snapshot/export to ZIP
- Cross-session persistence

---

### Phase 4: Runtime Sandbox (spark-worker + spark-runtime)
**Status**: After Phase 3 | **Dependencies**: Phase 3

**Main Todo**: `phase4_runtime_sandbox`

**Files to Create**:
- `runtime/spark-worker.ts` - Web Worker for heavy operations
- `runtime/spark-runtime.ts` - Main runtime execution engine
- `runtime/spark-api.ts` - Runtime API layer

**Features**:
- Code execution in sandbox
- Worker-based asset processing (PNG slicing, shader validation)
- Task execution pipeline
- Runtime state management

---

### Phase 5: Tier A Preview System (Browser WASM)
**Status**: After Phase 4 | **Dependencies**: Phase 4

**Main Todo**: `phase5_tier_a_preview`

**Files to Create**:
- `runtime/preview/spark-preview-wasm.ts` - WASM preview engine
- Preview renderers for:
  - Sprites/tilesets (Canvas)
  - Animations (Canvas player)
  - Shaders (WebGL)
  - Code syntax highlighting
  - Simple scene graph visualization

**Features**:
- Fast, instant previews
- No server required
- Offline-capable

---

### Phase 6: Tier B Preview Containers (Docker Engine Preview)
**Status**: After Phase 5 | **Dependencies**: Phase 5

**Main Todo**: `phase6_tier_b_preview`

**Files to Create**:
- `server/preview/Dockerfile` - Engine preview container base
- `server/preview/engine-preview-router.ts` - Express router for preview requests
- `server/preview/engines/unity-preview.ts` - Unity headless preview
- `server/preview/engines/godot-preview.ts` - Godot server mode preview
- `server/preview/engines/pico8-preview.ts` - PICO-8 cart preview
- `server/preview/engines/gamemaker-preview.ts` - GameMaker preview
- `server/preview/engines/construct-preview.ts` - Construct preview
- `server/preview/engines/rpgmaker-preview.ts` - RPG Maker preview
- `server/preview/engines/renpy-preview.ts` - Ren'Py preview

**Docker Compose**:
- `docker-compose.yml` - Orchestrates preview containers
- Frame streaming (WebSocket or HLS)
- Container lifecycle management

---

### Phase 7: Engine Adapters (All 7 Engines)
**Status**: After Phase 6 | **Dependencies**: Phase 6

**Main Todo**: `phase7_engine_adapters`

**Engine Interface**:
- `engines/types.ts` - `SparkEngine` interface
- Methods: `validate()`, `generate()`, `export()`, `preview()`, `schema()`

**Engine Adapters to Create**:

**Tier 1 (Full Support)**:
1. **Unity** (`engines/unity/spark-engine-unity.ts`)
   - C# script generation
   - Prefab JSON generation
   - Shader generation
   - Material generation

2. **Godot** (`engines/godot/spark-engine-godot.ts`)
   - GDScript generation
   - `.tscn` scene generation
   - `.tres` resource generation
   - Shader code generation

3. **PICO-8** (`engines/pico8/spark-engine-pico8.ts`)
   - `.p8` cart generation
   - Lua code generation
   - Sprite sheet generation
   - Sound FX generation

**Tier 2 (Schema-Level Support)**:
4. **GameMaker** (`engines/gamemaker/spark-engine-gamemaker.ts`)
5. **RPG Maker** (`engines/rpgmaker/spark-engine-rpgmaker.ts`)
6. **Construct** (`engines/construct/spark-engine-construct.ts`)
7. **Ren'Py** (`engines/renpy/spark-engine-renpy.ts`)

---

### Phase 8: MCP Agent Engine + Tool Routing
**Status**: After Phase 7 | **Dependencies**: Phase 7

**Main Todo**: `phase8_mcp_agents`

**Files to Create**:
- `server/mcp/mcp-server.ts` - MCP protocol server
- `server/mcp/tools/` - MCP tool implementations
  - `fs-tools.ts` - File system operations
  - `generator-tools.ts` - Asset/code generation
  - `engine-tools.ts` - Engine-specific operations
  - `preview-tools.ts` - Preview requests

**Next.js Server Actions**:
- `app/spark/actions/mcp-actions.ts` - Server actions for MCP
- Integration with LLM/Claude API
- Agent routing logic (LUNA, NERVA, NEC, engine specialists)

**Agent System**:
- Multi-expert MoE routing
- Agent status tracking
- Action logging

---

### Phase 9: Storybook Component Library
**Status**: After Phase 8 | **Dependencies**: Phase 8

**Main Todo**: `phase9_storybook`

**Files to Create**:
- `.storybook/main.ts` - Storybook config
- Stories for all UI components:
  - MCP panels
  - Preview panels
  - Tabs
  - Runtime mode selector
  - Engine output displays

---

### Phase 10: Docker Compose + CI/CD + Deployment
**Status**: Final | **Dependencies**: Phase 9

**Main Todo**: `phase10_deployment`

**Files to Create**:
- `docker-compose.yml` - Complete container orchestration
  - `spark-api` - Next.js API routes
  - `spark-tools` - Asset processing tools
  - `spark-vibe` - LLM inference engine
  - `spark-preview` - Engine preview containers
- `.github/workflows/ci.yml` - CI/CD pipeline
- Deployment configs (Kubernetes, Vercel, etc.)

---

## 337 Gap-Filling Items (10/10 Checklist)

These items bring the plan from **7.5/10 to 10/10** by covering all production requirements. Organized into 12 comprehensive sections:

### Section 1: MVP Definition & Incremental Delivery (26 items)
- MVP 1 Definition (Alpha Release) - 8 items
- MVP 2 Definition (Beta Release) - 5 items
- MVP 3 Definition (v1.0 Release) - 4 items
- MVP 4 Definition (v2.0 Production Release) - 3 items
- Incremental Delivery Milestones - 6 items

**Key Items**:
- Define MVP 1 scope: Unity-only engine support
- Define MVP 1 features: Basic UI, simple MCP chat, local preview, ZIP export
- Define MVP 1 success criteria: User can generate Unity C# script and export as ZIP
- Define shipping milestones after each phase
- Create milestone validation gates (go/no-go criteria)

---

### Section 2: Testing Strategy (62 items)
- Test Infrastructure Setup - 7 items
- Unit Testing Requirements - 9 items
- Integration Testing Requirements - 8 items
- E2E Testing Requirements - 10 items
- Performance Testing Requirements - 11 items
- Security Testing Requirements - 11 items
- Engine Adapter Validation Testing - 8 items

**Key Items**:
- Set up Jest/Vitest for unit testing
- Set up Playwright/Cypress for E2E testing
- Unit tests for all UI components
- Integration tests for Next.js ↔ WebContainer bridge communication
- E2E test: User generates Unity C# script from prompt
- Performance test: Preview load time < 2 seconds (Tier A)
- Security test: Code execution sandbox isolation
- Golden sample tests: 5-10 test cases per engine that must always pass

---

### Section 3: Resource Planning & Budget (29 items)
- Team Resource Planning - 6 items
- Infrastructure Cost Analysis - 10 items
- Timeline Planning - 13 items

**Key Items**:
- Define required team size for MVP 1 (e.g., 2-3 developers)
- Calculate Docker container hosting costs (7 engines × container instances)
- Calculate LLM API costs (Claude/GPT for MCP agents) - per-user estimate
- Create detailed timeline for Phase 0 (Setup): 1-2 weeks
- Create detailed timeline for Phase 1 (UI): 3-4 weeks
- Create buffer time (20-30%) for unexpected delays
- Create critical path analysis (which phases can't be delayed)

---

### Section 4: Risk Management & Mitigation (34 items)
- Technical Risks - 15 items
- Scope Risks - 9 items
- Quality Risks - 6 items
- Risk Tracking & Reporting - 4 items

**Key Risks & Mitigations**:
- **Risk**: WebContainers don't work well for game engines
  - **Mitigation**: Proof-of-concept POC before Phase 4
  - **Fallback**: Use iframe + postMessage alternative

- **Risk**: Docker preview containers are too slow/expensive
  - **Mitigation**: Container pooling and reuse strategy
  - **Fallback**: Limit to Tier A (WASM) preview only

- **Risk**: LLM API integration is unreliable or expensive
  - **Mitigation**: Multi-provider support (Claude + GPT + fallback)
  - **Fallback**: Mock responses for development, graceful degradation

---

### Section 5: Performance & Scalability (28 items)
- Performance Budgets - 8 items
- Scalability Limits - 7 items
- Optimization Strategy - 8 items
- Resource Constraints - 5 items

**Performance Budgets**:
- UI initial load < 2 seconds
- Preview load (Tier A) < 2 seconds
- Preview load (Tier B) < 10 seconds
- Code generation < 5 seconds
- File operations < 100ms
- Bridge messages < 50ms round-trip
- Memory usage < 500MB per user session

**Scalability Limits**:
- MVP 1: 10-50 concurrent users
- v1.0: 100-500 concurrent users
- v2.0: 1000+ concurrent users

---

### Section 6: Security & Sandboxing (33 items)
- Code Execution Safety - 7 items
- LLM Security - 5 items
- Docker Container Security - 6 items
- File System Security - 5 items
- UI Security - 5 items
- Security Audit & Compliance - 5 items

**Key Security Items**:
- Implement strict sandbox for runtime code execution
- Prevent arbitrary code execution in browser (WebContainer isolation)
- Implement prompt injection prevention (input sanitization)
- Harden Docker containers (minimal base images, no root user)
- Implement file path validation (prevent directory traversal)
- Schedule security audit before MVP 1 release

---

### Section 7: Documentation (30 items)
- Architecture Documentation - 7 items
- API Documentation - 6 items
- Developer Documentation - 7 items
- User Documentation - 5 items
- Operational Documentation - 5 items

**Key Documentation Items**:
- Create architecture decision records (ADRs) for major decisions
- Document bridge layer protocol specification
- Document engine adapter interface specification
- Create developer onboarding guide
- Create user guide for MVP 1 (basic usage)
- Create deployment guide

---

### Section 8: Validation Gates & Checkpoints (35 items)
- Phase 0 Validation Gate - 5 items
- Phase 1 Validation Gate - 6 items
- Phase 3 Validation Gate - 5 items
- Phase 5 Validation Gate (Tier A Preview) - 5 items
- Phase 6 Validation Gate (Tier B Preview) - 5 items
- Phase 7 Validation Gate (All Engines) - 5 items
- Go/No-Go Criteria for Each MVP - 4 items

**Validation Gates**:
- Phase 0: Next.js setup complete, project structure created, dependencies installed
- Phase 1: Two-panel UI renders correctly, MCP left panel works, bridge layer initialized
- Phase 3: Virtual filesystem can create/read/write files, files persist across sessions
- Phase 5: WASM preview renders sprites correctly, preview load time < 2 seconds
- Phase 6: Docker Unity preview works, preview streaming is stable
- Phase 7: All 7 engines can generate assets, golden sample tests pass

---

### Section 9: Monitoring & Observability (15 items)
- Application Monitoring - 5 items
- Infrastructure Monitoring - 5 items
- Business Metrics - 5 items

**Key Items**:
- Set up error tracking (Sentry or similar)
- Set up performance monitoring (APM)
- Monitor Docker container health and resource usage
- Monitor LLM API usage and costs
- Track user sign-ups and active users
- Track generation requests per engine

---

### Section 10: Rollback & Recovery Strategies (13 items)
- Deployment Rollback - 5 items
- Data Recovery - 5 items
- Feature Rollback - 3 items

**Key Items**:
- Create rollback procedure for each deployment phase
- Document how to rollback Next.js deployment
- Implement backup strategy for virtual filesystem
- Implement feature flags for major features
- Test rollback procedures in staging

---

### Section 11: Migration & Upgrade Strategies (10 items)
- Next.js Setup Strategy - 3 items
- Database Migration (if needed later) - 3 items
- Version Upgrade Strategy - 4 items

**Key Items**:
- Create "what if Next.js doesn't work" fallback plan
- Plan for future database needs (if virtual FS needs backend)
- Document how to upgrade Next.js versions
- Create compatibility matrix

---

### Section 12: Quality Assurance Processes (13 items)
- Code Review Process - 4 items
- Testing Process - 4 items
- Release Process - 5 items

**Key Items**:
- Define code review requirements (all PRs must be reviewed)
- Set up automated code quality checks (ESLint, Prettier)
- Define test requirements (all features must have tests)
- Set up test coverage gates (minimum 80%)
- Define release checklist

---

## Complete File Structure

```
SPARK/
├── app/
│   └── spark/
│       ├── layout.tsx                    # Root layout
│       ├── page.tsx                      # Main two-panel page
│       ├── components/
│       │   ├── MCPPanel/                 # Left panel (AI Assistant)
│       │   │   ├── index.tsx
│       │   │   ├── TabSwitcher.tsx
│       │   │   ├── MCPChat.tsx
│       │   │   ├── MCPPlan.tsx
│       │   │   ├── MCPActions.tsx
│       │   │   ├── MCPAgents.tsx
│       │   │   ├── MCPFiles.tsx
│       │   │   └── MCPHistory.tsx
│       │   └── PreviewPanel/             # Right panel (Runtime Preview)
│       │       ├── index.tsx
│       │       ├── RuntimeTabs.tsx
│       │       ├── PopoutButton.tsx
│       │       └── PreviewModeSelector.tsx
│       ├── bridge/                       # UI ↔ Runtime communication
│       │   ├── bridge-types.ts
│       │   ├── bridge-client.ts
│       │   └── bridge-runtime.ts
│       ├── actions/                      # Next.js Server Actions
│       │   └── mcp-actions.ts
│       └── styles/
│           ├── globals.css
│           └── ui.css
├── runtime/                              # WebContainer sandbox
│   ├── spark-fs.ts                       # Virtual filesystem
│   ├── spark-worker.ts                   # Web Worker
│   ├── spark-runtime.ts                  # Runtime execution engine
│   ├── spark-api.ts                      # Runtime API layer
│   └── preview/
│       └── spark-preview-wasm.ts         # Tier A WASM preview
├── server/                               # Docker containers & API
│   ├── preview/
│   │   ├── Dockerfile
│   │   ├── engine-preview-router.ts
│   │   └── engines/
│   │       ├── unity-preview.ts
│   │       ├── godot-preview.ts
│   │       ├── pico8-preview.ts
│   │       ├── gamemaker-preview.ts
│   │       ├── construct-preview.ts
│   │       ├── rpgmaker-preview.ts
│   │       └── renpy-preview.ts
│   └── mcp/                              # MCP agent system
│       ├── mcp-server.ts
│       └── tools/
│           ├── fs-tools.ts
│           ├── generator-tools.ts
│           ├── engine-tools.ts
│           └── preview-tools.ts
├── engines/                              # 7 engine adapters
│   ├── types.ts                          # SparkEngine interface
│   ├── unity/
│   │   └── spark-engine-unity.ts
│   ├── godot/
│   │   └── spark-engine-godot.ts
│   ├── pico8/
│   │   └── spark-engine-pico8.ts
│   ├── gamemaker/
│   │   └── spark-engine-gamemaker.ts
│   ├── rpgmaker/
│   │   └── spark-engine-rpgmaker.ts
│   ├── construct/
│   │   └── spark-engine-construct.ts
│   └── renpy/
│       └── spark-engine-renpy.ts
├── public/
│   └── spark-runtime.html                # Runtime iframe container
├── .storybook/                           # Storybook component library
│   └── main.ts
├── docker-compose.yml                    # Container orchestration
├── .github/
│   └── workflows/
│       └── ci.yml                        # CI/CD pipeline
└── package.json                          # Dependencies
```

---

## Success Metrics & Validation Gates

### Technical Success Criteria

✅ **Phase 0**: Next.js setup complete, project structure created, dependencies installed  
✅ **Phase 1**: Two-panel UI fully functional, MCP assistant integrated, bridge layer working  
✅ **Phase 3**: Virtual filesystem working, files persist across sessions, export to ZIP works  
✅ **Phase 5**: Tier A preview renders correctly, load time < 2 seconds  
✅ **Phase 6**: Tier B preview containers work, preview streaming stable, load time < 10 seconds  
✅ **Phase 7**: All 7 engines can generate assets, validate outputs, and export correctly  
✅ **Phase 8**: MCP agent system functional, tool routing works, multi-expert MoE operational  
✅ **Phase 9**: Storybook complete with all component stories  
✅ **Phase 10**: Docker containers orchestrated, CI/CD pipeline running, deployment configured  

### MVP Success Criteria

**MVP 1 (Alpha)**:
- Unity engine works
- Basic UI functional
- Simple MCP chat works
- Local preview works
- ZIP export works
- User can generate Unity C# script and export as ZIP

**MVP 2 (Beta)**:
- 3 engines work (Unity, Godot, PICO-8)
- Virtual FS works
- Tier A preview works
- Multi-engine export works

**MVP 3 (v1.0)**:
- All 7 engines work
- Tier B preview works
- Complete engine adapters
- Full validation and export pipeline

**MVP 4 (v2.0 Production)**:
- MCP agents work
- Storybook complete
- Production deployment
- Full monitoring and observability

### Performance Budgets

- UI initial load < 2 seconds
- Preview load (Tier A) < 2 seconds
- Preview load (Tier B) < 10 seconds
- Code generation < 5 seconds
- File operations < 100ms
- Bridge messages < 50ms round-trip
- Memory usage < 500MB per user session

---

## Implementation Timeline

### Phase-by-Phase Timeline

**Phase 0 (Setup)**: 1-2 weeks
- Next.js migration
- Project structure
- Dependencies installation

**Phase 1 (UI Layer)**: 3-4 weeks
- Layout and pages
- MCP panels (6 tabs)
- Preview panels
- Bridge layer
- Styling

**Phase 2 (Runtime HTML)**: 1 week
- Runtime iframe container
- WebContainer initialization

**Phase 3 (Virtual FS)**: 2-3 weeks
- IndexedDB backend
- File operations
- Export to ZIP

**Phase 4 (Runtime Sandbox)**: 3-4 weeks
- Web Worker setup
- Runtime execution engine
- Asset processing

**Phase 5 (Tier A Preview)**: 2-3 weeks
- WASM preview engine
- Canvas/WebGL renderers
- Fast preview system

**Phase 6 (Tier B Preview)**: 4-6 weeks
- Docker containers for 7 engines
- Frame streaming
- Container lifecycle management

**Phase 7 (Engine Adapters)**: 6-8 weeks
- All 7 engine adapters
- Validate/generate/export methods
- Golden sample tests

**Phase 8 (MCP Agents)**: 4-6 weeks
- MCP protocol server
- Tool routing
- Multi-expert MoE system

**Phase 9 (Storybook)**: 2 weeks
- Component stories
- Documentation

**Phase 10 (Deployment)**: 2-3 weeks
- Docker Compose
- CI/CD pipeline
- Deployment configs

**Total Estimated Timeline**: 28-40 weeks (7-10 months)

**With Buffer (20-30%)**: 34-52 weeks (8.5-13 months)

---

## Next Steps

1. **Review this comprehensive plan**
2. **Confirm MVP definitions** (MVP 1, 2, 3, 4 scope)
3. **Start Phase 0 implementation** (Next.js setup)
4. **Begin Phase 1 UI layer** (Current focus)

---

## Related Documents

- `SPARK_COMPREHENSIVE_USE_CASE.md` - Full vision & technical roadmap (philosophy-driven)
- `SPARK_10_10_GAP_FILLERS_COMPLETE.md` - Complete 337 gap-filling items (detailed)
- `SPARK_GAP_FILLERS_10_10.md` - Gap-filling checklist format
- `SPARK_PLAN_BRUTAL_FEEDBACK_REVISED.md` - Plan evaluation (7.5/10 → 10/10 roadmap)

---

**Status**: Planning Complete ✅  
**Ready for**: Implementation  
**Total Todos**: 352 (15 core + 337 gap-filling)

