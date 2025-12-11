# SLATE Runtime Management

Container orchestration and Unity runtime integration for SLATE on HELIOS_LUMINERA.

## Architecture

### Components

1. **Container Client** - Docker container lifecycle management
2. **Runtime Sessions** - Database-backed session tracking
3. **Build System** - Distributed build orchestration
4. **Asset Processing** - Parallel asset conversion pipeline
5. **Log Streaming** - Real-time log aggregation via NATS

### Infrastructure

- **Container Registry:** `https://192.168.86.27:5000` (SBX01)
- **Runtime Images:** Unity, Unreal, Godot, Custom
- **Orchestration:** Docker via NATS messaging
- **Storage:** Project and asset volumes on SBX01

## Container Management

### Starting a Runtime Session

```typescript
import { createRuntimeSession } from '@/lib/database/operations/runtime';
import { startContainer, getDefaultUnityConfig } from '@/lib/runtime/client';

const session = await createRuntimeSession({
  project_id: 'abc123',
  user_id: 'user456',
  runtime_type: 'unity',
  container_config: getDefaultUnityConfig('abc123'),
});

const result = await startContainer(session.id, session.container_config);

if (result.success) {
  console.log('Container started:', result.output);
} else {
  console.error('Failed to start:', result.error);
}
```

### Container Operations

```typescript
import {
  stopContainer,
  restartContainer,
  executeCommand,
  getContainerStats,
} from '@/lib/runtime/client';

await stopContainer(sessionId);

await restartContainer(sessionId);

const result = await executeCommand(sessionId, 'unity-build', ['--platform', 'windows']);

const stats = await getContainerStats(sessionId);
console.log('CPU:', stats.cpu_percent);
console.log('Memory:', stats.memory_usage);
```

### Container Configuration

```typescript
import { getDefaultUnityConfig, getDefaultUnrealConfig } from '@/lib/runtime/client';

const unityConfig = getDefaultUnityConfig('project-id');

const unrealConfig = getDefaultUnrealConfig('project-id');

const customConfig: ContainerConfig = {
  image: 'slate/unity-runtime',
  tag: 'latest',
  name: 'slate-unity-myproject',
  ports: {
    '8080': 8080,
    '7777': 7777,
  },
  env: {
    PROJECT_ID: 'myproject',
    UNITY_LOG_LEVEL: 'info',
  },
  volumes: [
    {
      host: '/var/slate/projects/myproject',
      container: '/app/project',
      readOnly: false,
    },
  ],
  memory: '4g',
  cpus: 2,
  gpu: true,
  networkMode: 'bridge',
};
```

## Runtime Sessions

### Database Schema

Runtime sessions are tracked in PostgreSQL:

```sql
CREATE TABLE slate_runtime_sessions (
  id uuid PRIMARY KEY,
  project_id uuid REFERENCES slate_projects(id),
  user_id text NOT NULL,
  runtime_type text NOT NULL,
  status text NOT NULL,
  container_id text,
  container_config jsonb,
  started_at timestamptz,
  stopped_at timestamptz,
  error_message text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Session Management

```typescript
import {
  createRuntimeSession,
  getRuntimeSession,
  listRuntimeSessions,
  updateRuntimeSession,
  deleteRuntimeSession,
  getActiveRuntimeSessions,
} from '@/lib/database/operations/runtime';

const session = await createRuntimeSession({
  project_id: 'abc',
  user_id: 'user',
  runtime_type: 'unity',
  container_config: config,
});

const session = await getRuntimeSession(sessionId);

const sessions = await listRuntimeSessions(projectId);

await updateRuntimeSession(sessionId, {
  status: 'running',
  container_id: 'abc123',
  started_at: new Date().toISOString(),
});

await deleteRuntimeSession(sessionId);

const active = await getActiveRuntimeSessions(userId);
```

### Session Status Flow

```
creating → starting → running → stopping → stopped
                           ↓
                        failed/error
```

## Build System

### Starting a Build

```typescript
import { createBuildJob } from '@/lib/database/operations/builds';
import { startBuild, getDefaultBuildOptions } from '@/lib/runtime/build';

const job = await createBuildJob({
  project_id: 'abc123',
  user_id: 'user456',
  build_type: 'production',
  target_platform: 'windows',
  source_commit: 'a1b2c3d',
  metadata: {},
});

await startBuild('abc123', 'user456', job, getDefaultBuildOptions('production'));
```

### Build Progress Updates

```typescript
import {
  updateBuildProgress,
  completeBuild,
  failBuild,
} from '@/lib/runtime/build';

await updateBuildProgress('abc123', jobId, 25, 'Compiling scripts...');

await updateBuildProgress('abc123', jobId, 75, 'Packaging assets...');

await completeBuild('abc123', jobId, '/builds/output.exe', [
  { name: 'game.exe', path: '/builds/game.exe', size: 52428800 },
  { name: 'data.pak', path: '/builds/data.pak', size: 104857600 },
]);

await failBuild('abc123', jobId, 'Compilation error', [
  'Error CS0103: The name "foo" does not exist',
  'Build failed with 1 error(s)',
]);
```

### Build Platforms

```typescript
import { getBuildPlatforms, getBuildTypes } from '@/lib/runtime/build';

const platforms = getBuildPlatforms();

const types = getBuildTypes();
```

### Build Options

```typescript
import { getDefaultBuildOptions } from '@/lib/runtime/build';

const devOptions = getDefaultBuildOptions('development');

const prodOptions = getDefaultBuildOptions('production');

const customOptions: BuildOptions = {
  clean: true,
  verbose: false,
  parallelJobs: 8,
  optimization: 'full',
  compressionFormat: 'gzip',
  includeDebugSymbols: false,
};
```

### Build Statistics

```typescript
import { getBuildStatistics } from '@/lib/database/operations/builds';

const stats = await getBuildStatistics(projectId);

console.log('Total builds:', stats.total);
console.log('Completed:', stats.completed);
console.log('Failed:', stats.failed);
console.log('Average duration:', stats.averageDuration, 'seconds');
```

## Asset Processing

### Processing Textures

```typescript
import {
  processTexture,
  getDefaultTextureOptions,
} from '@/lib/runtime/assets';

const jobId = await processTexture('asset-id', 'project-id', {
  format: 'webp',
  compression: 'bc7',
  generateMipmaps: true,
  quality: 90,
  resize: { width: 2048, height: 2048 },
});
```

### Processing Models

```typescript
import {
  processModel,
  getDefaultModelOptions,
} from '@/lib/runtime/assets';

const jobId = await processModel('asset-id', 'project-id', {
  format: 'glb',
  scale: 1.0,
  optimize: true,
  generateLODs: true,
  lodLevels: [0.75, 0.5, 0.25],
  bakeLighting: false,
});
```

### Processing Audio

```typescript
import {
  processAudio,
  getDefaultAudioOptions,
} from '@/lib/runtime/assets';

const jobId = await processAudio('asset-id', 'project-id', {
  format: 'ogg',
  bitrate: 192,
  sampleRate: 48000,
  channels: 2,
  normalize: true,
});
```

### Batch Processing

```typescript
import { batchProcessAssets } from '@/lib/runtime/assets';

const jobIds = await batchProcessAssets(
  [
    { assetId: 'tex1', type: 'texture', options: { format: 'webp' } },
    { assetId: 'model1', type: 'model', options: { format: 'glb' } },
    { assetId: 'audio1', type: 'audio', options: { format: 'ogg' } },
  ],
  'project-id'
);
```

## Log Streaming

### Runtime Logs

```typescript
import {
  addRuntimeLog,
  getRuntimeLogs,
} from '@/lib/database/operations/runtime';

await addRuntimeLog(sessionId, 'info', 'Unity runtime started');

await addRuntimeLog(sessionId, 'error', 'Shader compilation failed', {
  shader: 'Standard',
  line: 42,
});

const logs = await getRuntimeLogs(sessionId, 100, 0);
```

### Streaming Logs via NATS

Logs are automatically streamed via NATS when created:

```typescript
useRuntimeEvents(sessionId, (event) => {
  if (event.type === 'log') {
    console.log('[' + event.data.level + ']', event.data.message);
  }
});
```

## React Hooks

### useRuntimeSession

```typescript
import { useRuntimeSession } from '@/hooks/useRuntime';

function RuntimePanel({ sessionId }: { sessionId: string }) {
  const { session, logs, stats, isLoading, start, stop, restart } = useRuntimeSession(sessionId);

  return (
    <div>
      <p>Status: {session?.status}</p>
      <p>CPU: {stats?.cpu_percent}%</p>
      <p>Memory: {stats?.memory_usage} / {stats?.memory_limit}</p>

      <button onClick={start} disabled={isLoading}>Start</button>
      <button onClick={stop} disabled={isLoading}>Stop</button>
      <button onClick={restart} disabled={isLoading}>Restart</button>

      <div>
        {logs.map((log) => (
          <div key={log.id}>[{log.level}] {log.message}</div>
        ))}
      </div>
    </div>
  );
}
```

### useBuildJob

```typescript
import { useBuildJob } from '@/hooks/useRuntime';

function BuildPanel({ projectId }: { projectId: string }) {
  const { jobs, activeJob } = useBuildJob(projectId);

  return (
    <div>
      {activeJob && (
        <div>
          <p>Building: {activeJob.target_platform}</p>
          <progress value={activeJob.progress} max={100} />
        </div>
      )}

      <div>
        {jobs.map((job) => (
          <div key={job.id}>
            {job.target_platform} - {job.status} ({job.progress}%)
          </div>
        ))}
      </div>
    </div>
  );
}
```

### useContainerStats

```typescript
import { useContainerStats } from '@/hooks/useRuntime';

function StatsPanel({ sessionId }: { sessionId: string }) {
  const { stats, isLoading } = useContainerStats(sessionId, true);

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <p>CPU: {stats?.cpu_percent}%</p>
      <p>Memory: {stats?.memory_usage} MB</p>
      <p>Network RX: {stats?.network_rx_bytes} bytes</p>
      <p>Network TX: {stats?.network_tx_bytes} bytes</p>
    </div>
  );
}
```

## NATS Integration

### Runtime Events

All runtime operations publish events via NATS:

```typescript
slate.runtime.started.{sessionId}
slate.runtime.stopped.{sessionId}
slate.runtime.status.{sessionId}
slate.runtime.log.{sessionId}
slate.runtime.error.{sessionId}
```

### Build Events

Build progress is streamed via NATS:

```typescript
slate.build.started.{projectId}
slate.build.progress.{projectId}
slate.build.completed.{projectId}
slate.build.failed.{projectId}
```

### Container Commands

Backend services listen for container commands:

```typescript
slate.container.start.{sessionId}
slate.container.stop.{sessionId}
slate.container.restart.{sessionId}
slate.container.execute.{sessionId}
slate.container.stats.{sessionId}
```

## Database Migrations

Runtime tables are created via migration `002_runtime_and_builds.sql`:

```sql
slate_runtime_sessions
slate_runtime_logs
slate_build_jobs
```

Run migrations on SBX01 PostgreSQL instance.

## Security Considerations

### Container Isolation

- Each runtime runs in isolated Docker container
- Resource limits enforced (CPU, memory, GPU)
- Network isolation via Docker networks
- Volume mounts limited to project directories

### Access Control

- Runtime sessions tied to user_id and project_id
- Only authorized users can start/stop containers
- Container registry requires authentication
- NATS subjects use project/user identifiers

### Resource Limits

Default limits per container:
- **Unity:** 4GB RAM, 2 CPUs, GPU enabled
- **Unreal:** 8GB RAM, 4 CPUs, GPU enabled
- **Godot:** 2GB RAM, 2 CPUs, GPU optional

Adjust based on project requirements.

## Performance Optimization

### Caching

Runtime session data cached in Redis:
- Session info: 30 seconds TTL
- Session lists: 30 seconds TTL
- Build jobs: 30 seconds TTL

### Container Reuse

Consider pooling idle containers for faster startup:
1. Pre-start containers in "warm pool"
2. Assign to projects on demand
3. Reset state between uses
4. Reduce cold-start time from 30s to 3s

### Parallel Builds

Build system supports parallel jobs:
- Configure `parallelJobs` in build options
- Default: 4 for dev, 8 for production
- Scales with available CPU cores

### Asset Processing

Asset pipeline processes in parallel:
- Batch operations across multiple workers
- Queue-based distribution via NATS
- Progress tracking per asset
- Automatic retry on failure

## Monitoring

### Metrics to Track

- Active runtime sessions count
- Container resource utilization
- Build success/failure rates
- Average build duration
- Asset processing throughput
- Log volume per session

### Health Checks

Implement health checks:
1. Container liveness probes
2. NATS connectivity
3. Database connection pooling
4. Storage space availability
5. Registry accessibility

## Troubleshooting

### Container Won't Start

1. Check Docker daemon on SBX01
2. Verify registry accessibility
3. Ensure image exists and is pullable
4. Check resource availability (memory, CPU)
5. Review container logs

### Build Failures

1. Check build logs in database
2. Verify source commit exists
3. Ensure build tools installed in container
4. Check disk space for artifacts
5. Review build configuration

### Missing Logs

1. Verify NATS connection
2. Check log subscription in UI
3. Ensure log level configured
4. Review database log entries
5. Check NATS subject permissions

## Next Steps

Ready for **Phase 2: Unity Integration**

Implement:
- Unity runtime container images
- Unity Editor integration
- Project synchronization
- Asset import pipeline
- Play mode testing
- Profiler integration

Runtime infrastructure is complete and ready for Unity workloads.
