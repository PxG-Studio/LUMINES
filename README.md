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

### 🚧 Next: Phase 1.2-1.7 (Planned)

- **Phase 1.2**: Client-side caching with React Query (see `PHASE_1_2_CACHE_ARCHITECTURE.md`)
- **Phase 1.3**: Redis cache integration (server-side, when needed)
- **Phase 1.4**: Authentication (Cloudflare Zero Trust + nocturnaID)
- **Phase 1.5**: State management (Zustand for UI state)
- **Phase 1.6**: Real-time sync (Supabase Realtime or NATS)
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
```

### Development

```bash
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

## Project Structure

```
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
