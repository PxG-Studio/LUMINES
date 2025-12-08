# Migration Guide: Phase 1.3-1.7

This guide helps you integrate the new Phase 1.3-1.7 features into your existing LUMINES/WIS2L deployment.

## Prerequisites

- Existing Phase 1.1 (Database) and Phase 1.2 (Client-side caching) implementations
- Redis server running (already required)
- NATS server running (already required)
- Node.js 18+ and npm 9+

## Step 1: Update Environment Variables

1. Copy `.env.phase1.example` to `.env` or merge with your existing `.env`:

```bash
cp .env.phase1.example .env.new
# Merge with your existing .env manually
```

2. Configure the new variables:

### Required (Phase 1.3 - Cache Enhancement)
```bash
# Already configured in Phase 1.1, verify these exist:
REDIS_HOST=192.168.86.27
REDIS_PORT=6379
REDIS_DB=0
REDIS_TTL=300
```

### Optional (Phase 1.4 - Cloudflare Zero Trust)
```bash
# Only if using Cloudflare Zero Trust:
CLOUDFLARE_TEAM_DOMAIN=your-team-domain
```

### Optional (Phase 1.4 - nocturnaID)
```bash
# Only if using nocturnaID:
NOCTURNAID_CLIENT_ID=your-client-id
NOCTURNAID_CLIENT_SECRET=your-client-secret
NOCTURNAID_URL=https://id.nocturna.io  # Can be omitted for default
```

### Required (Phase 1.6 - Collaboration)
```bash
# Already configured, verify it exists:
VITE_NATS_URL=ws://192.168.86.27:4222
```

## Step 2: Install/Verify Dependencies

All new features use existing dependencies. Verify they're installed:

```bash
npm install
```

Key dependencies used:
- `ioredis` - Redis client (already installed)
- `zustand` - State management (already installed)
- `jose` - JWT verification for Cloudflare (already installed)
- `next-auth` - Authentication (already installed)

## Step 3: Enable Cache Warming (Phase 1.3)

### Option A: Enable on Server Startup

In your server initialization file (e.g., `server/index.ts` or `src/lib/startup/init.ts`):

```typescript
import { warmOnStartup, startCacheWarmingTask } from '@/lib/cache';

// On server startup
await warmOnStartup();

// Optional: Start background warming (every 5 minutes)
startCacheWarmingTask(300000);
```

### Option B: Enable Cache Monitoring

```typescript
import { startCacheMonitoring } from '@/lib/cache';

// Start monitoring (every 1 minute)
startCacheMonitoring(60000);
```

## Step 4: Configure Authentication (Phase 1.4)

### Existing OAuth (No Changes Required)

Google and GitHub OAuth continue to work as before. No migration needed.

### Add nocturnaID (Optional)

1. Register your application at nocturnaID
2. Add environment variables (see Step 1)
3. Restart your application - nocturnaID provider is automatically enabled

### Add Cloudflare Zero Trust (Optional)

1. Set up Cloudflare Access for your domain
2. Configure team domain in environment variables
3. Add middleware check in `middleware.ts`:

```typescript
import { validateCloudflareAccess } from '@/lib/auth/cloudflare';

export async function middleware(request: NextRequest) {
  // Check Cloudflare Access for internal APIs
  if (request.nextUrl.pathname.startsWith('/api/internal')) {
    const cfAccess = await validateCloudflareAccess(request);
    if (!cfAccess) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }
  
  return NextResponse.next();
}
```

## Step 5: Migrate to Persistent State (Phase 1.5)

### For Existing Zustand Stores

Update your stores to use the new persistence middleware:

**Before:**
```typescript
import { create } from 'zustand';

export const useMyStore = create<MyState>((set) => ({
  // ... your state
}));
```

**After:**
```typescript
import { create } from 'zustand';
import { createPersistence } from '@/state/persistence';
import { createDevtools } from '@/state/devtools';

export const useMyStore = create<MyState>(
  createDevtools({ name: 'MyStore' })(
    createPersistence<MyState>({
      name: 'my-store-state',
      version: 1,
      partialize: (state) => ({
        // Only persist specific fields
        field1: state.field1,
        field2: state.field2,
      }),
    })((set) => ({
      // ... your state
    }))
  )
);
```

### UI State Migration

The UI state is already migrated (`src/state/uiState.ts`). Your existing code continues to work:

```typescript
import { useUIState } from '@/state/uiState';

// Usage remains the same
const { theme, setTheme } = useUIState();
```

## Step 6: Enable Presence Tracking (Phase 1.6)

### In Your Collaboration Components

```typescript
import { getPresenceManager } from '@/lib/collaboration/presence';
import { useEffect } from 'react';

function CollaborativeEditor({ projectId, userId, userName }) {
  useEffect(() => {
    const presence = getPresenceManager();
    
    // Start tracking
    presence.startTracking(projectId, userId, userName);
    
    return () => {
      // Cleanup on unmount
      presence.stopTracking(projectId, userId);
    };
  }, [projectId, userId, userName]);
  
  // Update cursor on editor change
  const handleCursorChange = (line: number, column: number) => {
    const presence = getPresenceManager();
    presence.updateCursor(projectId, userId, fileId, line, column);
  };
  
  return (
    <Editor onCursorChange={handleCursorChange} />
  );
}
```

### Add Conflict Resolution

```typescript
import { threeWayMerge } from '@/lib/collaboration/conflict-resolution';

async function handleSave(content: string) {
  const baseContent = await fetchOriginalContent();
  const remoteContent = await fetchLatestContent();
  
  const result = threeWayMerge(baseContent, content, remoteContent);
  
  if (result.hasConflicts) {
    // Show conflict resolution UI
    showConflictDialog(result);
  } else {
    // Auto-merged successfully
    await saveContent(result.merged);
  }
}
```

## Step 7: Add Health Monitoring (Phase 1.7)

### Create Health Check Endpoint

Create `app/api/health/route.ts`:

```typescript
import { runHealthChecks } from '@/lib/monitoring/health';
import { NextResponse } from 'next/server';

export async function GET() {
  const health = await runHealthChecks();
  
  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
  });
}
```

### Enable Background Monitoring

In your server initialization:

```typescript
import { startHealthMonitoring } from '@/lib/monitoring/health';

// Start monitoring (every 1 minute)
startHealthMonitoring(60000);
```

## Step 8: Testing

### Test Cache Warming

```bash
curl http://localhost:3000/api/health
# Should show Redis as "pass"
```

### Test Authentication

1. **Google OAuth**: Should continue working as before
2. **GitHub OAuth**: Should continue working as before
3. **nocturnaID**: Visit `/api/auth/signin` to see the new provider

### Test State Persistence

1. Open your app
2. Change theme or sidebar state
3. Refresh the page
4. State should be restored

### Test Presence Tracking

1. Open the same project in two browser tabs
2. You should see presence indicators for both tabs
3. Cursor movements should sync

### Test Health Monitoring

```bash
# Check health endpoint
curl http://localhost:3000/api/health

# Example response:
{
  "status": "healthy",
  "timestamp": 1234567890,
  "checks": [
    { "name": "redis", "status": "pass" },
    { "name": "database", "status": "pass" },
    { "name": "memory", "status": "pass" }
  ],
  "uptime": 3600
}
```

## Step 9: Production Deployment

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Redis accessible from production servers
- [ ] NATS accessible from production servers
- [ ] Cloudflare Access configured (if using)
- [ ] nocturnaID OAuth application registered (if using)
- [ ] Health check endpoint secured
- [ ] Cache warming enabled
- [ ] Monitoring enabled

### Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Test the build locally:**
   ```bash
   npm start
   curl http://localhost:3000/api/health
   ```

3. **Deploy to production:**
   - Follow your standard deployment process
   - Verify environment variables are set
   - Check health endpoint after deployment

4. **Monitor the deployment:**
   ```bash
   # Check health
   curl https://your-domain.com/api/health
   
   # Check cache metrics (if exposed)
   curl https://your-domain.com/api/metrics/cache
   ```

### Post-Deployment Verification

1. **Cache warming:** Check logs for "Cache warming completed"
2. **Authentication:** Test each OAuth provider
3. **State persistence:** Verify state persists across sessions
4. **Presence tracking:** Test with multiple users
5. **Health monitoring:** Verify health endpoint returns correct status

## Rollback Plan

If issues arise, you can safely roll back:

1. **Cache enhancements:** Simply don't call `warmOnStartup()` or `startCacheWarmingTask()`
2. **Authentication:** Remove nocturnaID environment variables to disable
3. **State persistence:** Stores will work without persistence if middleware not added
4. **Presence tracking:** Don't call `startTracking()`
5. **Health monitoring:** Don't call `startHealthMonitoring()`

All features are opt-in and backward compatible.

## Troubleshooting

### Issue: Cache warming fails

**Solution:** Check Redis connection:
```typescript
import { checkRedisHealth } from '@/lib/cache';
const isHealthy = await checkRedisHealth();
console.log('Redis healthy:', isHealthy);
```

### Issue: nocturnaID not appearing

**Solution:** Verify environment variables:
```bash
echo $NOCTURNAID_CLIENT_ID
echo $NOCTURNAID_CLIENT_SECRET
```

Both must be set for the provider to appear.

### Issue: State not persisting

**Solution:** Check browser console for localStorage errors. Ensure middleware is applied correctly.

### Issue: Presence not updating

**Solution:** Verify NATS connection:
```typescript
import { getNatsConnection } from '@/lib/messaging/client';
const nc = await getNatsConnection();
console.log('NATS connected:', nc.isClosed());
```

### Issue: Health checks failing

**Solution:** Check individual services:
```bash
# Test Redis
redis-cli -h 192.168.86.27 ping

# Test database
psql -h 192.168.86.27 -U user -d wissil_db -c "SELECT 1"
```

## Support

For issues or questions:
1. Check the main documentation: `PHASE_1_3_TO_1_7_COMPLETE.md`
2. Review existing phase documentation: `PHASE_1_3_COMPLETE.md`, `PHASE_1_4_COMPLETE.md`
3. Check GitHub issues
4. Contact the team

## Next Steps

After successful migration:
1. **Phase 2:** Unity Integration
2. **Phase 3:** UI Implementation
3. **Advanced Features:** OpenTelemetry, Advanced metrics, External monitoring

---

**Last Updated:** 2025-12-08
**Compatible With:** LUMINES WIS2L v1.0+
**Minimum Requirements:** Node.js 18+, Redis 6+, PostgreSQL 13+
