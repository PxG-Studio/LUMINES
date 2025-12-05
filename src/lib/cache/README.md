# SLATE Cache Layer

Redis cache integration for SLATE on HELIOS_LUMINERA infrastructure.

## Architecture

### Connection Details

- **Primary Redis:** `redis://192.168.86.27:6379/0` (SBX01)
- **Sentinel (Planned):** `redis://192.168.86.28:26379` (SBX02)

### Cache Patterns

#### 1. Cache-Aside (Read-Through)
Check cache first, fetch from database on miss, then populate cache.

```typescript
import { getCached } from '@/lib/cache/strategies';
import { CacheKeys, CacheTTL } from '@/lib/cache/keys';

const project = await getCached(
  CacheKeys.project(projectId),
  async () => {
    return await fetchProjectFromDatabase(projectId);
  },
  CacheTTL.project
);
```

#### 2. Write-Through
Update cache immediately after database write.

```typescript
import { setCached } from '@/lib/cache/strategies';

await updateProjectInDatabase(projectId, data);
await setCached(CacheKeys.project(projectId), data, CacheTTL.project);
```

#### 3. Cache Invalidation
Remove stale cache entries using pattern matching.

```typescript
import { invalidateCache, invalidateProjectCache } from '@/lib/cache/strategies';

await invalidateProjectCache(projectId);
```

## Cache Keys

All cache keys follow the pattern: `slate:{resource}:{identifier}`

See `keys.ts` for complete list of cache key patterns.

### Examples

- `slate:project:abc123` - Single project
- `slate:projects:user:user123` - User's project list
- `slate:file:file456` - Single file
- `slate:assets:project:abc123` - Project's assets

## Time-To-Live (TTL)

Default TTL values in seconds:

- Projects: 3600s (1 hour)
- Files: 1800s (30 minutes)
- Assets: 3600s (1 hour)
- Runtime status: 60s (1 minute)
- Build cache: 7200s (2 hours)

## Usage in Operations

### Reading with Cache

```typescript
export async function getProject(projectId: string): Promise<Project | null> {
  return getCached(
    CacheKeys.project(projectId),
    async () => {
      const result = await query('SELECT * FROM projects WHERE id = $1', [projectId]);
      return result.rows[0] || null;
    },
    CacheTTL.project
  );
}
```

### Writing with Cache

```typescript
export async function updateProject(projectId: string, data: any): Promise<Project> {
  const result = await query('UPDATE projects SET ... WHERE id = $1 RETURNING *', [projectId]);
  const updated = result.rows[0];

  await invalidateProjectCache(projectId);
  await setCached(CacheKeys.project(projectId), updated, CacheTTL.project);

  return updated;
}
```

## Batch Operations

### Multi-Get

```typescript
import { mgetCached } from '@/lib/cache/strategies';

const keys = projectIds.map(id => CacheKeys.project(id));
const projects = await mgetCached<Project>(keys);
```

### Multi-Set

```typescript
import { msetCached } from '@/lib/cache/strategies';

await msetCached([
  { key: CacheKeys.project('id1'), value: project1, ttl: CacheTTL.project },
  { key: CacheKeys.project('id2'), value: project2, ttl: CacheTTL.project },
]);
```

## Hooks

React hooks for cache operations:

```typescript
import { useCache, useProjectCache } from '@/hooks/useCache';

function MyComponent() {
  const { get, set, invalidate } = useCache();
  const { getProject, setProject, invalidateProject } = useProjectCache();

  // Use in your component
}
```

## Failover with Sentinel

When SBX02 is configured, the cache client automatically uses Redis Sentinel for high availability:

1. Monitors primary Redis instance
2. Automatic failover if primary goes down
3. Transparent reconnection to new primary

Configure in `.env`:

```bash
VITE_REDIS_SENTINEL_HOST=192.168.86.28
VITE_REDIS_SENTINEL_PORT=26379
VITE_REDIS_MASTER_NAME=mymaster
```

## Error Handling

All cache operations include error handling:

- Cache misses fall back to database
- Cache write failures are logged but don't block operations
- Connection errors trigger retry logic with exponential backoff

## Production Considerations

**Important:** Both `ioredis` and `pg` are Node.js libraries that cannot run in browsers.

For production deployment:

1. Create a backend API service
2. Run on Helos Compute (192.168.86.115)
3. Connect to PostgreSQL, Redis, and NATS
4. Expose REST/GraphQL endpoints to frontend
5. Frontend makes HTTP requests to backend API

The current implementation is for development and architecture demonstration.
