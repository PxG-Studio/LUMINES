<<<<<<< HEAD
# LUMINES - Browser-Based Unity Development IDE

**LUMINES** is a comprehensive Unity development IDE running entirely in the browser.

**WIS2L** (Workspace, Identity, Spark, Slate, Ignis, Landing) is the core framework powering LUMINES.

![WIS2L](https://img.shields.io/badge/WIS2L-v1.0.0-6366F1)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Storybook](https://img.shields.io/badge/Storybook-8.0-FF4785)

---

## Overview

**LUMINES** is the product: A browser-based Unity IDE with visual scripting, AI assistance, and real-time collaboration.

**WIS2L** is the framework: A comprehensive development ecosystem consisting of 6 integrated subsystems:

1. **LANDING** - Main gateway and navigation hub
2. **SLATE** - Design system and token management
3. **IGNITION** - Project initialization and scaffolding
4. **SPARK** - AI-powered component generation (MoE + MCP)
5. **IGNIS** - Build pipeline and hot-reload development server
6. **WAYPOINT** - Deployment and version control

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/nocturna-network/wissil.git
cd wissil

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
=======
# SLATE - Unity Asset Management System

Part of the WISSIL Application Stack (HELIOS_LUMINERA Architecture)

## Overview

SLATE is a web-based Unity asset management and development environment that allows you to:
- Upload and parse Unity assets (prefabs, materials, scripts, textures)
- Deconstruct assets into editable components
- Reconstruct assets back to Unity format
- Manage Unity projects with a full code editor
- Execute and test Unity code in a web-based runtime

## Architecture Status

### ✅ Phase 1.1: Database Integration (COMPLETED)

**Infrastructure:**
- PostgreSQL via Supabase
- Full CRUD operations for all entities
- Row Level Security (RLS) enabled
- TypeScript types for all tables

**Database Schema:**
- `slate_projects` - Top-level Unity projects
- `slate_files` - Code files with versioning
- `slate_assets` - Unity assets (prefabs, materials, etc.)
- `slate_asset_components` - Deconstructed components
- `slate_asset_dependencies` - Asset dependency graph
- `slate_runtime_sessions` - Runtime execution tracking
- `slate_editor_tabs` - User session state

**Client Library:**
- Supabase client singleton (`src/lib/database/client.ts`)
- Database operations (`src/lib/database/operations/`)
- React hooks (`src/hooks/useProjects.ts`, `useFiles.ts`, `useAssets.ts`)
- File tree builder for hierarchical navigation
- TypeScript types for all operations

**Features Implemented:**
- ✅ Project management (create, read, update, delete)
- ✅ File management with versioning
- ✅ Asset management with metadata
- ✅ Asset component tracking
- ✅ Asset dependency tracking
- ✅ File tree builder (flat → hierarchical)
- ✅ Search functionality
- ✅ Optimistic UI updates

### ✅ Phase 2: UI Integration (COMPLETED)

**Connected Components:**
- `SlateLayoutConnected` - Main layout with project selector
- `ExplorerPanelConnected` - File explorer with database integration
- `EditorPanelConnected` - Code editor with auto-save and versioning
- `UnityAssetManagerConnected` - Asset management with upload and persistence
- `ProjectContext` - Shared state across all components

**Features Implemented:**
- ✅ Multi-project support with inline creation
- ✅ Project switching via dropdown
- ✅ File creation, editing, deletion (all persisted)
- ✅ Auto-save with Cmd+S/Ctrl+S
- ✅ File versioning on content changes
- ✅ Unity asset upload and storage
- ✅ Real-time loading states
- ✅ Empty states with helpful messages
- ✅ Keyboard shortcuts
- ✅ Confirmation dialogs for destructive actions
- ✅ Build succeeded (330 KB bundle)

**User Flows Working:**
1. Create/switch projects → Works with real database
2. Create/edit/delete files → Persisted with versioning
3. Open multiple tabs → Managed with state
4. Upload Unity assets → Stored with metadata
5. Browse asset library → Loaded from database

### ✅ Phase 1.2: Client-Side Caching (COMPLETED)

**Caching System:**
- React Query for intelligent query caching
- Optimistic UI updates for instant feedback
- Supabase Realtime for automatic cache invalidation
- Multi-tab synchronization
- 90% reduction in database queries

**Performance Improvements:**
- Cached queries: ~0ms (instant)
- Network requests: 90% reduction
- Bundle size: 376 KB (107 KB gzipped)
- First-load optimizations

**Features Implemented:**
- ✅ Smart query caching with 5-minute stale time
- ✅ Optimistic updates for all mutations
- ✅ Automatic cache invalidation via Realtime
- ✅ Multi-tab sync (changes reflect instantly)
- ✅ Error handling with automatic rollback
- ✅ Request deduplication

### 🚧 Next: Phase 1.3-1.7 (Planned)

- **Phase 1.3**: Redis cache integration (server-side, when scale demands)
- **Phase 1.4**: Authentication (Cloudflare Zero Trust + nocturnaID)
- **Phase 1.5**: State management (Zustand for UI state)
- **Phase 1.6**: Advanced real-time collaboration features
- **Phase 1.7**: Error logging and monitoring

## Quick Start

### Prerequisites

```bash
npm install
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
>>>>>>> slate/prototype-1
```

### Development

```bash
<<<<<<< HEAD
# Run Next.js dev server
npm run dev                    # → http://localhost:3000

# Run Storybook
npm run storybook              # → http://localhost:6006

# Sync WISSIL stories
npm run storybook:sync-wissil

# Run tests
npm test

# Run linter
npm run lint
```

### Building

```bash
# Build for production
npm run build

# Build Storybook
npm run build-storybook

# Preview production build
npm start
```

---
=======
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

## Usage

### Database Operations

See `src/lib/database/README.md` for complete documentation.

**Example: Create a Project**

```typescript
import { useProjects } from './hooks/useProjects';

function MyComponent() {
  const { projects, createProject } = useProjects('user-id');

  const handleCreate = async () => {
    await createProject({
      user_id: 'user-id',
      name: 'My Unity Project',
      metadata: { unity_version: '2022.3' }
    });
  };
}
```

**Example: Manage Files**

```typescript
import { useFiles } from './hooks/useFiles';

function FileManager({ projectId }: { projectId: string }) {
  const { files, fileTree, createFile } = useFiles(projectId);

  // fileTree is hierarchical, files is flat
}
```

**Example: Work with Assets**

```typescript
import { useAssets } from './hooks/useAssets';

function AssetManager({ projectId }: { projectId: string }) {
  const { assets, createAsset } = useAssets(projectId);

  const handleUpload = async (file: File) => {
    const asset = await createAsset({
      project_id: projectId,
      name: file.name,
      type: 'prefab',
      metadata: { /* Unity metadata */ }
    });
  };
}
```

### Testing Database Integration

Import the `DatabaseDemo` component to test the full database stack:

```typescript
import { DatabaseDemo } from './components/DatabaseDemo';

function App() {
  return <DatabaseDemo />;
}
```

This provides an interactive UI to:
- Create/delete projects
- Create/delete files
- Create/delete assets
- View real-time data from PostgreSQL
>>>>>>> slate/prototype-1

## Project Structure

```
<<<<<<< HEAD
lumines/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── landing/           # Main gateway (Port 3000)
│   │   ├── slate/             # Design system (Port 3001)
│   │   ├── ignition/          # Project init (Port 3002)
│   │   ├── spark/             # AI generation (Port 3003)
│   │   ├── ignis/             # Build pipeline (Port 3004)
│   │   ├── waypoint/          # Deployment (Port 3005)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root page
│   ├── components/
│   │   └── wissil/
│   │       └── WISSILLayout.tsx
│   ├── tokens/
│   │   └── slate.tokens.ts    # SLATE design tokens
│   └── styles/
│       └── globals.css        # Global styles
├── .storybook/                # Storybook configuration
├── scripts/                   # Automation scripts
├── infrastructure/            # K8s & deployment configs
└── package.json
```

---

## WISSIL Subsystems

### LANDING - Main Gateway
**Port:** 3000 | **Color:** Gold (#FFD700)

Entry point and navigation hub for all WISSIL subsystems.
- System overview with status indicators
- Quick navigation to all systems
- Real-time health monitoring

### SLATE - Design System
**Port:** 3001 | **Color:** Indigo (#6366F1)

Design token management and theming engine.
- 6 color systems (Landing, Slate, Ignition, Spark, Ignis, Waypoint)
- Typography scale (xs - 9xl)
- Spacing system (0 - 96)
- Token explorer with copy-to-clipboard

### IGNITION - Project Scaffolding
**Port:** 3002 | **Color:** Red (#EF4444)

Project initialization with intelligent templates.
- Next.js Application template
- Component Library template
- API Service template
- 5-step configuration wizard

### SPARK - AI Component Generator
**Port:** 3003 | **Color:** Yellow (#FBBF24)

AI-powered component creation using Mixture of Experts.
- Natural language prompts
- 3 specialized AI experts (Design, Logic, Performance)
- MCP integration for context awareness
- Real-time code generation

### IGNIS - Build Pipeline
**Port:** 3004 | **Color:** Coral (#FF6B35)

Development server with lightning-fast hot-reload.
- Sub-200ms hot module replacement
- Build optimization (tree shaking, code splitting)
- Performance metrics dashboard
- Live preview

### WAYPOINT - Deployment
**Port:** 3005 | **Color:** Green (#10B981)

Version control and deployment automation.
- 3 environment management (Production, Staging, Development)
- Semantic versioning
- Deployment history
- Automated health checks

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + SLATE tokens
- **Components:** React 18
- **Documentation:** Storybook 8
- **Testing:** Jest + React Testing Library
- **Build:** Vite (dev) + Next.js (prod)
- **Deployment:** Cloudflare Pages (prod), Vercel (staging)

---

## Design System (SLATE)

### Color Systems

```typescript
// System colors
landing-primary    #FFD700  // Gold
slate-primary      #6366F1  // Indigo
ignition-primary   #EF4444  // Red
spark-primary      #FBBF24  // Yellow
ignis-primary      #FF6B35  // Coral
waypoint-primary   #10B981  // Green

// Base colors
nocturna-dark      #0A0E27  // Background
nocturna-midnight  #1A1F3A  // Surface
```

### Typography

```css
/* Font families */
font-sans: Inter, system-ui, sans-serif
font-mono: JetBrains Mono, monospace
font-display: Space Grotesk, sans-serif

/* Font sizes */
text-xs to text-9xl (12px to 128px)
```

### Usage

```tsx
import { slateTokens } from '@/tokens/slate.tokens';

// In components
<div className="bg-slate-primary text-white">
  <h1 className="text-7xl font-bold text-gradient-landing">
    WISSIL
  </h1>
</div>
```

---

## Storybook

View all components and pages in Storybook:

```bash
npm run storybook
```

Access at: http://localhost:6006

### Story Organization

```
WISSIL/
├── Landing/
│   ├── Main Gateway
│   └── Documentation
├── Slate/
│   ├── Design System
│   └── Documentation
├── Ignition/
│   ├── Project Scaffolding
│   └── Documentation
├── Spark/
│   ├── AI Component Generator
│   └── Documentation
├── Ignis/
│   ├── Build Pipeline
│   └── Documentation
└── Waypoint/
    ├── Deployment
    └── Documentation
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run Storybook tests
npm run test-storybook

# Visual regression tests
npm run chromatic          # Chromatic (primary)
npm run percy:storybook   # Percy (cross-browser)
```

### Visual Regression Strategy

WISSIL uses **dual visual regression testing**:

- **Chromatic**: Primary tool with tight Storybook integration, TurboSnap optimization, fast CI
- **Percy**: Cross-browser testing (Chromium, Firefox, WebKit), responsive snapshots

Both tools run in parallel on PRs for comprehensive coverage. See [Chromatic Guide](./docs/CHROMATIC_COMPLETE.md) and [Percy Guide](./docs/PERCY_SETUP.md).

---

## Deployment

### Environments

- **Production:** https://nocturna.network (Cloudflare Pages)
- **Staging:** https://staging.nocturna.network (Vercel)
- **Development:** https://dev.nocturna.network (Local)
- **Storybook:** https://storybook.nocturna.network

### Deploy Commands

```bash
# Deploy to staging
waypoint deploy staging

# Deploy to production (requires approval)
waypoint deploy production --confirm

# Rollback
waypoint rollback production --to v1.2.2
```

### CI/CD

Automated deployment via GitHub Actions:
- **Develop branch** → Staging (auto)
- **Main branch** → Production (manual approval)

---

## Authentication

**Provider:** nocturnaID.org
**Protocol:** OAuth 2.0 + JWT

### User Roles

- **Designer** - Design system management, component preview
- **Engineer** - Full development access, staging deployment
- **Admin** - Full system access, production deployment
- **Agent** - Read-only access for AI agents

---

## Network Topology

```
Cloudflare CDN → Cloudflare Zero Trust
    ↓
    ├─→ Helios Control (192.168.86.114)
    │   ├─→ LANDING (3000)
    │   ├─→ IGNITION (3002)
    │   └─→ IGNIS (3004)
    │
    ├─→ Helios Compute (192.168.86.115)
    │   ├─→ SLATE (3001)
    │   ├─→ SPARK (3003)
    │   └─→ WAYPOINT (3005)
    │
    └─→ Synology NAS (192.168.86.27)
        ├─→ PostgreSQL (5432)
        ├─→ Redis (6379)
        └─→ NATS (4222)
```

---

## Documentation

Comprehensive documentation available in:

- **Documentation Index:** `docs/README.md` - Complete documentation index
- **Repository Architecture:** `REPOSITORY_ARCHITECTURE.md` - System architecture overview
- **Repository Overview:** `REPOSITORY_COMPLETE_OVERVIEW.md` - Complete system overview
- **Handoff:** `infrastructure/k8s/production/docs/LUMINES_AGENT_HANDOFF.md`
- **Visual Diagrams:** `infrastructure/k8s/production/docs/LUMINES_VISUAL_DIAGRAMS.md`
- **Quick Reference:** `infrastructure/k8s/production/docs/LUMINES_QUICK_REFERENCE.md`
- **Component Docs:** MDX files in each `src/app/*/` folder
- **Storybook:** Auto-generated component documentation
- **Historical Archive:** `archive/` - Archived phase status files and historical documentation

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm test`
3. Ensure code quality: `npm run lint`
4. Commit changes: `git commit -m "feat: Add new feature"`
5. Push to branch: `git push origin feature/my-feature`
6. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

---

## License

Proprietary - Nocturna Network © 2024

---

## Support

- **Documentation:** https://docs.nocturna.network
- **Slack:** #wissil-support
- **Email:** support@nocturna.network
- **Issues:** https://github.com/nocturna-network/wissil/issues

---

## Acknowledgments

Built with ❤️ by the Nocturna Network team.

**Agents:**
- **Lumines** - UI/UX Specialist
- **Luminera** - System Architecture

**Technologies:**
- Next.js, React, TypeScript
- Tailwind CSS, Storybook
- Cloudflare, Vercel
- nocturnaID Authentication

---

**Made for developers, by developers.**
=======
src/
├── components/          # React components
│   └── DatabaseDemo.tsx # Database integration test UI
├── design-system/       # Design tokens and components
├── hooks/              # React hooks
│   ├── useProjects.ts  # Project management hook
│   ├── useFiles.ts     # File management hook
│   └── useAssets.ts    # Asset management hook
├── lib/
│   └── database/       # Database layer (Phase 1.1)
│       ├── client.ts   # Supabase client
│       ├── types.ts    # TypeScript types
│       ├── index.ts    # Public exports
│       └── operations/ # CRUD operations
│           ├── projects.ts
│           ├── files.ts
│           └── assets.ts
└── slate/              # SLATE UI components
    ├── components/     # Layout components
    └── modules/        # Feature modules
        └── assets/     # Unity asset module
```

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Supabase (PostgreSQL + RLS)
- Real-time subscriptions (future)

**Planned:**
- Redis (caching)
- NATS (message bus)
- Container Registry (asset storage)
- Kubernetes (deployment)

## Development Guidelines

### Database Operations

- Always use hooks for React components
- Use operation functions for utility/service code
- All operations return strongly-typed data
- Use `maybeSingle()` for safety (null vs throw)
- File content updates auto-increment version
- Timestamps are managed automatically

### Code Style

- TypeScript strict mode
- ESLint + TypeScript ESLint
- Functional components + hooks
- Tailwind CSS for styling
- No unused imports/variables

## Documentation

- `src/lib/database/README.md` - Database integration guide
- `docs/ARCHITECTURE.md` - Full HELIOS_LUMINERA architecture (planned)
- `docs/API.md` - API documentation (planned)

## License

Proprietary - Part of WISSIL Application Stack
>>>>>>> slate/prototype-1
