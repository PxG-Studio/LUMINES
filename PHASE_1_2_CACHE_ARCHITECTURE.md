# Phase 1.2: Cache Layer Architecture

## Status: DESIGN PHASE

Phase 1.1 (Database Integration) is now complete with full UI connectivity. Before implementing Phase 1.2, we need to address architectural constraints for browser-based caching.

## Challenge: Redis in Browser Environment

**Problem**: Redis is a server-side service and cannot run directly in browsers. The original HELIOS_LUMINERA architecture assumes a traditional backend deployment.

**Browser Constraints**:
- No direct Redis connection from client
- CORS restrictions
- Security limitations
- State management must be client-side

## Three Possible Architectures

### Option A: Supabase Edge Functions + Redis (Server-Side Cache)

**Architecture**:
```
Browser → Edge Function → Redis Cache → PostgreSQL
```

**Pros**:
- True Redis implementation as per original plan
- Server-side caching reduces database load
- Follows HELIOS_LUMINERA architecture
- Better for scaling

**Cons**:
- Requires Edge Functions for all data access
- Additional network hop (increased latency)
- More complex to implement
- Costs more (function invocations)

**Implementation**:
1. Create Supabase Edge Functions for all CRUD operations
2. Deploy Redis instance (Upstash, Railway, or similar)
3. Implement cache-aside pattern in Edge Functions
4. Update client to call Edge Functions instead of direct Supabase

### Option B: Browser Storage + Query Caching (Client-Side Cache)

**Architecture**:
```
Browser (IndexedDB + React Query) → PostgreSQL
```

**Pros**:
- No backend changes required
- Works entirely in browser
- Fast for cached data
- Simpler implementation
- Lower operational costs

**Cons**:
- Not true Redis (deviation from plan)
- Cache per user/device only
- Limited storage capacity
- Doesn't reduce database load

**Implementation**:
1. Install React Query or SWR for query caching
2. Use IndexedDB for persistent local storage
3. Implement cache invalidation strategies
4. Add optimistic updates

### Option C: Hybrid Approach (Progressive Enhancement)

**Architecture**:
```
Browser → [Optional Edge Function + Redis] → PostgreSQL
```

**Pros**:
- Start with Option B, migrate to Option A later
- Progressive enhancement
- Works immediately
- Future-proof

**Cons**:
- Requires refactoring later
- May have two caching strategies
- More code to maintain

**Implementation**:
1. Implement Option B first (client-side caching)
2. Design Edge Function API for future migration
3. Gradually move hot paths to Edge Functions + Redis

## Recommended Approach: Option B (Client-Side) → Option A (Migration)

### Rationale

1. **Immediate Value**: Option B can be implemented quickly with React Query
2. **Cost Effective**: No additional infrastructure for MVP
3. **User Experience**: Instant cache hits for better UX
4. **Migration Path**: Can add Redis later when scale demands it

### Phase 1.2: Client-Side Caching (Immediate)

#### Stack
- React Query for server state management
- IndexedDB for persistence (via localforage)
- Optimistic updates for instant feedback

#### Implementation Plan

**1. Install Dependencies**
```bash
npm install @tanstack/react-query localforage
```

**2. Create Query Client**
```typescript
// src/lib/cache/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
});
```

**3. Wrap App with Query Provider**
```typescript
import { QueryClientProvider } from '@tanstack/react-query';

<QueryClientProvider client={queryClient}>
  <ProjectProvider>
    <SlateLayoutConnected />
  </ProjectProvider>
</QueryClientProvider>
```

**4. Convert Hooks to Use React Query**
```typescript
// Before (direct Supabase)
const { data, error } = await supabase.from('slate_projects').select();

// After (cached via React Query)
const { data, error } = useQuery({
  queryKey: ['projects', userId],
  queryFn: () => projectOps.listProjects(userId),
});
```

**Benefits**:
- Automatic background refetching
- Deduplication of requests
- Optimistic updates
- Persistent cache across sessions
- Automatic garbage collection

### Phase 1.3: Redis Migration (When Needed)

**Triggers for Migration**:
- 1000+ concurrent users
- High database costs
- Need for cross-user caching
- Real-time collaboration features

**Migration Steps**:
1. Deploy Redis instance (Upstash recommended for serverless)
2. Create Edge Functions for data operations
3. Implement cache-aside pattern
4. Update client to use Edge Functions
5. Monitor cache hit rates and adjust TTLs

## Alternative: Supabase Realtime for Cache Invalidation

**Instead of Redis**, we can use Supabase's built-in Realtime feature:

```typescript
// Subscribe to changes
supabase
  .channel('slate_projects')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'slate_projects'
  }, (payload) => {
    queryClient.invalidateQueries(['projects']);
  })
  .subscribe();
```

**Benefits**:
- No additional infrastructure
- Real-time cache invalidation
- Multi-user awareness
- Already available in Supabase

## Recommendation Summary

### For MVP (Now):
✅ **Implement Phase 1.2 with React Query + IndexedDB**
- Fastest time to value
- Excellent UX
- Low cost
- Easy to implement

### For Scale (Later):
🔄 **Migrate to Edge Functions + Redis when needed**
- Based on actual usage patterns
- When database costs justify it
- When real-time collaboration is required

## Next Steps

1. Install React Query dependencies
2. Set up query client with persistence
3. Convert existing hooks to use React Query
4. Add optimistic updates for writes
5. Implement Supabase Realtime for cache invalidation
6. Monitor performance and database costs

## Additional Considerations

### State Management (Phase 1.5)

Since we're using React Query for server state, we only need Zustand for:
- UI state (sidebar collapsed, theme, etc.)
- User preferences
- Transient application state

This is a lighter implementation than originally planned.

### NATS Message Bus (Phase 1.6)

Similar to Redis, NATS cannot run in browsers. Options:
- Use Supabase Realtime instead
- Implement WebSocket-based pub/sub via Edge Functions
- Defer until backend deployment

## Cost Analysis

### Option B (React Query):
- Storage: Free (browser storage)
- Compute: None
- Network: Direct to Supabase (existing plan)
- **Total: $0/month additional**

### Option A (Edge Functions + Redis):
- Redis: ~$10-50/month (Upstash)
- Edge Functions: $0.50 per 1M requests
- Network: Edge → Supabase
- **Total: ~$20-100/month**

## Conclusion

Implement Phase 1.2 with client-side caching (React Query) first. This provides immediate value, excellent UX, and keeps costs low. Migrate to server-side Redis when scale demands it.

The architecture remains flexible and can support both approaches simultaneously during migration.
