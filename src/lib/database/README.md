# SLATE Database Integration

## Overview

Phase 1.1 of the HELIOS_LUMINERA architecture implementation. This provides the foundation for real data persistence using Supabase (PostgreSQL).

## Architecture

```
src/lib/database/
├── client.ts              # Supabase client singleton
├── types.ts               # TypeScript types for all tables
├── index.ts               # Main exports
└── operations/
    ├── projects.ts        # Project CRUD operations
    ├── files.ts           # File operations + tree builder
    └── assets.ts          # Asset operations + components
```

## Database Schema

### Tables

- **slate_projects**: Top-level projects with metadata
- **slate_files**: Code files within projects (versioned)
- **slate_assets**: Unity assets (prefabs, materials, textures, etc.)
- **slate_asset_components**: Deconstructed asset components
- **slate_asset_dependencies**: Asset dependency graph
- **slate_runtime_sessions**: Runtime execution sessions
- **slate_editor_tabs**: User session state (open tabs)

All tables have RLS (Row Level Security) enabled.

## Usage

### Using Hooks (Recommended)

```typescript
import { useProjects } from '@/hooks/useProjects';
import { useFiles } from '@/hooks/useFiles';
import { useAssets } from '@/hooks/useAssets';

function MyComponent() {
  const { projects, createProject, loading } = useProjects('user-id');
  const { files, fileTree, createFile } = useFiles(projectId);
  const { assets, createAsset } = useAssets(projectId);

  // Use the data and operations
}
```

### Using Operations Directly

```typescript
import { projectOps, fileOps, assetOps } from '@/lib/database';

// Create a project
const project = await projectOps.createProject({
  user_id: 'user-123',
  name: 'My Unity Project',
  metadata: { unity_version: '2022.3' }
});

// Create a file
const file = await fileOps.createFile({
  project_id: project.id,
  path: 'Assets/Scripts/PlayerController.cs',
  content: '// C# code here',
  type: 'csharp'
});

// Create an asset
const asset = await assetOps.createAsset({
  project_id: project.id,
  name: 'PlayerPrefab',
  type: 'prefab',
  metadata: { guid: '123abc', fileID: 1234567890 }
});
```

### File Tree Builder

```typescript
import { buildFileTree } from '@/lib/database/operations/files';

const files = await fileOps.listFiles(projectId);
const tree = buildFileTree(files);
// Returns hierarchical structure: FileTreeNode[]
```

### Asset with Components

```typescript
import { getAssetWithComponents } from '@/lib/database/operations/assets';

const asset = await getAssetWithComponents(assetId);
// Returns asset with components[] and dependencies[]
```

## React Hooks

### `useProjects(userId)`

Returns: `{ projects, loading, error, createProject, updateProject, deleteProject, refresh }`

### `useProject(projectId)`

Returns: `{ project, loading, error }`

### `useFiles(projectId)`

Returns: `{ files, fileTree, loading, error, createFile, updateFile, deleteFile, searchFiles, refresh }`

### `useFile(fileId)`

Returns: `{ file, loading, error, updateFile, refresh }`

### `useAssets(projectId)`

Returns: `{ assets, loading, error, createAsset, updateAsset, deleteAsset, refresh }`

### `useAsset(assetId)`

Returns: `{ asset, loading, error, createComponent, updateComponent, deleteComponent, refresh }`

## Environment Variables

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Features

- Full CRUD operations for all entities
- File versioning (auto-increment on content updates)
- File tree builder (converts flat list to hierarchy)
- Asset component management (deconstruction/reconstruction)
- Asset dependency tracking
- Search functionality for files
- Optimistic UI updates in hooks
- Automatic timestamp management (created_at, updated_at)
- TypeScript types for all operations

## Next Steps (Phase 1.2+)

- Redis cache integration for performance
- NATS message bus for real-time updates
- Container Registry for asset storage
- Authentication integration (Cloudflare Zero Trust)
- Error logging and monitoring

## Notes

- All database operations use `maybeSingle()` for safety (returns null instead of throwing)
- File content updates automatically increment version number
- File tree builder creates folder nodes automatically
- All operations return strongly-typed data
- RLS policies ensure data security (user-level isolation)
