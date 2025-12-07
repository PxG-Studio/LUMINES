# SLATE Message Bus

NATS WebSocket messaging integration for SLATE on HELIOS_LUMINERA infrastructure.

## Architecture

### Connection Details

- **NATS Server:** `ws://192.168.86.27:4222` (SBX01)
- **Protocol:** WebSocket (browser-compatible)
- **Auto-reconnection:** Enabled with 1s retry interval

### Message Patterns

SLATE uses three primary NATS messaging patterns:

#### 1. Publish-Subscribe (Pub/Sub)
One-to-many broadcast messaging for event notifications.

```typescript
import { publish, subscribe } from '@/lib/messaging/client';

await publish('slate.project.created.user123', {
  type: 'created',
  projectId: 'abc',
  timestamp: Date.now(),
});

const sub = await subscribe('slate.project.*', (event) => {
  console.log('Project event:', event);
});
```

#### 2. Request-Reply
Synchronous request-response pattern for queries.

```typescript
import { request } from '@/lib/messaging/client';

const result = await request('slate.runtime.status.session123', {
  query: 'status',
}, 5000);
```

#### 3. Queue Groups
Load-balanced work distribution across multiple workers.

```typescript
const sub = await subscribe('slate.build.jobs', (job) => {
  console.log('Processing job:', job);
}, { queue: 'build-workers' });
```

## Subject Naming Convention

All subjects follow the pattern: `slate.{resource}.{action}.{identifier}`

### Examples

**Projects:**
- `slate.project.created.{userId}` - New project created
- `slate.project.updated.{projectId}` - Project modified
- `slate.project.deleted.{projectId}` - Project deleted

**Files:**
- `slate.file.created.{projectId}` - File created in project
- `slate.file.updated.{fileId}` - File content changed
- `slate.file.deleted.{fileId}` - File removed

**Assets:**
- `slate.asset.created.{projectId}` - Asset uploaded
- `slate.asset.updated.{assetId}` - Asset modified
- `slate.asset.component.added.{assetId}` - Component added to asset

**Runtime:**
- `slate.runtime.started.{sessionId}` - Runtime session started
- `slate.runtime.log.{sessionId}` - Runtime log entry
- `slate.runtime.error.{sessionId}` - Runtime error

**Build:**
- `slate.build.started.{projectId}` - Build initiated
- `slate.build.progress.{projectId}` - Build progress update
- `slate.build.completed.{projectId}` - Build finished successfully

**Editor:**
- `slate.editor.opened.{userId}.{fileId}` - User opened file
- `slate.editor.cursor.{userId}.{fileId}` - Cursor position update

**Collaboration:**
- `slate.collab.joined.{projectId}` - User joined project
- `slate.collab.presence.{projectId}` - User presence heartbeat

## Event Types

### ProjectEvent
```typescript
{
  type: 'created' | 'updated' | 'deleted',
  projectId: string,
  userId: string,
  timestamp: number,
  data?: any
}
```

### FileEvent
```typescript
{
  type: 'created' | 'updated' | 'deleted' | 'content_changed',
  fileId: string,
  projectId: string,
  userId: string,
  timestamp: number,
  data?: any
}
```

### RuntimeEvent
```typescript
{
  type: 'started' | 'stopped' | 'status' | 'log' | 'error',
  sessionId: string,
  projectId: string,
  timestamp: number,
  data?: any
}
```

## Usage in Components

### Publishing Events

```typescript
import { publishProjectEvent } from '@/lib/messaging/events';

await publishProjectEvent({
  type: 'created',
  projectId: 'abc123',
  userId: 'user456',
  timestamp: Date.now(),
  data: projectData,
});
```

### Subscribing to Events

```typescript
import { useProjectEvents } from '@/hooks/useMessaging';

function MyComponent() {
  useProjectEvents('user123', (event) => {
    console.log('Project event received:', event);

    if (event.type === 'created') {
      queryClient.invalidateQueries(['projects']);
    }
  });

  return <div>Component content</div>;
}
```

### Multiple Subscriptions

```typescript
import { useFileEvents, useBuildEvents } from '@/hooks/useMessaging';

function ProjectView({ projectId }: { projectId: string }) {
  useFileEvents(projectId, (event) => {
    console.log('File event:', event);
  });

  useBuildEvents(projectId, (event) => {
    if (event.type === 'completed') {
      toast.success('Build completed!');
    }
  });

  return <div>Project view</div>;
}
```

## Integration with Cache

NATS events trigger cache invalidation for real-time consistency:

```typescript
useProjectEvents(userId, (event) => {
  if (event.type === 'updated') {
    invalidateCache(CacheKeys.project(event.projectId));
  }
});
```

## React Hooks

### useMessaging()
General-purpose messaging hook.

```typescript
const { publish } = useMessaging();

await publish('slate.custom.subject', { data: 'value' });
```

### useProjectEvents(userId, callback)
Subscribe to project events for a user.

### useFileEvents(projectId, callback)
Subscribe to file events in a project.

### useAssetEvents(projectId, callback)
Subscribe to asset events in a project.

### useRuntimeEvents(sessionId, callback)
Subscribe to runtime events for a session.

### useBuildEvents(projectId, callback)
Subscribe to build events for a project.

## Connection Management

### Auto-Reconnection

The NATS client automatically reconnects on connection loss:

```typescript
{
  maxReconnectAttempts: -1,  // Infinite retries
  reconnectTimeWait: 1000,   // 1 second between attempts
  waitOnFirstConnect: true,  // Wait for initial connection
}
```

### Connection Status

```typescript
import { isNatsConnected } from '@/lib/messaging/client';

if (isNatsConnected()) {
  console.log('NATS is connected');
}
```

### Cleanup

```typescript
import { closeNatsConnection } from '@/lib/messaging/client';

await closeNatsConnection();
```

## Error Handling

All messaging operations include error handling:

```typescript
await publishProjectEvent(event).catch((err) => {
  console.error('Failed to publish event:', err);
});
```

Subscriptions handle message parsing errors:

```typescript
try {
  const data = JSON.parse(payload);
  callback(data);
} catch (error) {
  console.error('Message parse error:', error);
}
```

## Wildcard Subscriptions

NATS supports wildcards for flexible subscriptions:

- `*` - Matches one token: `slate.project.*`
- `>` - Matches multiple tokens: `slate.project.>`

```typescript
await subscribe('slate.project.>', (event) => {
  console.log('Any project event:', event);
});
```

## Performance Considerations

### Message Size

Keep messages under 1MB for best performance. Large payloads should be stored in the database with only references in messages.

### Subscription Limits

Each component creates its own subscription. Limit to essential subscriptions to reduce connection overhead.

### Batching

For high-frequency events (like cursor positions), consider batching:

```typescript
let batch: Event[] = [];

setInterval(() => {
  if (batch.length > 0) {
    publish('slate.editor.cursors.batch', batch);
    batch = [];
  }
}, 100);
```

## Security

### Subject Permissions

NATS supports subject-level permissions. Configure on the server:

```conf
authorization {
  users = [
    {
      user: slate_user
      password: $PASSWORD
      permissions {
        publish = ["slate.>"]
        subscribe = ["slate.>"]
      }
    }
  ]
}
```

### Event Validation

Always validate event data before processing:

```typescript
useFileEvents(projectId, (event) => {
  if (!event.fileId || !event.projectId) {
    console.warn('Invalid file event:', event);
    return;
  }

  processFileEvent(event);
});
```

## Real-Time Collaboration

NATS enables multi-user collaboration features:

### Presence Tracking

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    publishCollaborationEvent({
      type: 'presence',
      projectId,
      userId,
      timestamp: Date.now(),
      data: { location: currentFile },
    });
  }, 5000);

  return () => clearInterval(interval);
}, [projectId, userId, currentFile]);
```

### Cursor Synchronization

```typescript
const debouncedCursorUpdate = debounce((position) => {
  publishEditorEvent({
    type: 'cursor',
    userId,
    fileId,
    timestamp: Date.now(),
    data: { position },
  });
}, 100);
```

## Use Cases

### 1. Real-Time Notifications

Notify users of events happening in their projects:

```typescript
useProjectEvents(userId, (event) => {
  if (event.type === 'updated' && event.userId !== currentUserId) {
    toast.info(`Project ${event.projectId} was updated`);
  }
});
```

### 2. Build Status Updates

Stream build progress to the UI:

```typescript
useBuildEvents(projectId, (event) => {
  switch (event.type) {
    case 'started':
      setBuildStatus('building');
      break;
    case 'progress':
      setBuildProgress(event.data.percent);
      break;
    case 'completed':
      setBuildStatus('success');
      break;
    case 'failed':
      setBuildStatus('error');
      break;
  }
});
```

### 3. Runtime Logs

Stream runtime logs to the console panel:

```typescript
useRuntimeEvents(sessionId, (event) => {
  if (event.type === 'log') {
    appendLog(event.data.message);
  } else if (event.type === 'error') {
    appendError(event.data.error);
  }
});
```

### 4. Multi-User Awareness

Show which users are currently active in a project:

```typescript
const [activeUsers, setActiveUsers] = useState<string[]>([]);

useEffect(() => {
  const sub = subscribe(NatsSubjects.collaboration.presence(projectId), (event) => {
    if (event.type === 'presence') {
      setActiveUsers((prev) => [...new Set([...prev, event.userId])]);
    }
  });

  return () => sub.then((s) => s.unsubscribe());
}, [projectId]);
```

## Production Deployment

### Browser Compatibility

NATS WebSocket client works in all modern browsers. No additional configuration needed.

### Connection Limits

NATS supports thousands of concurrent connections. Scale horizontally by adding more NATS servers in a cluster.

### Monitoring

Monitor NATS metrics:
- Connection count
- Message rate
- Subscription count
- Error rate

### High Availability

For production, configure NATS clustering:

```
SBX01: Primary NATS server
SBX02: Secondary NATS server (cluster peer)
```

Clients automatically reconnect to available servers.

## Testing

### Manual Testing

Test messaging with NATS CLI:

```bash
nats sub 'slate.>'
nats pub slate.test '{"hello":"world"}'
```

### Integration Testing

```typescript
test('publishes project created event', async () => {
  const received = new Promise((resolve) => {
    subscribe('slate.project.created.test-user', resolve);
  });

  await publishProjectEvent({
    type: 'created',
    projectId: 'test',
    userId: 'test-user',
    timestamp: Date.now(),
  });

  const event = await received;
  expect(event.projectId).toBe('test');
});
```

## Next Steps

Ready for **Phase 1.4: Containerization & Runtime Integration**

Implement:
- Docker container management
- Unity runtime coordination via NATS
- Build system with progress streaming
- Asset processing pipeline
