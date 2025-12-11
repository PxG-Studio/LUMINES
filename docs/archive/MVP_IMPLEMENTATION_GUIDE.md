# SLATE MVP Implementation Guide (No BoltDB/Supabase)

## Infrastructure Overview

**Status**: Phase 1 & 2 Complete ✅

### Network Architecture

```
SLATE Frontend/API: 192.168.86.114 / 192.168.86.115 (K8s cluster)
        ↓
Primary DB (SBX01): 192.168.86.27
  - PostgreSQL (port 5432)
  - Redis (port 6379)
  - NATS (port 4222)
  - Registry (port 5000)
        ↓
Replica DB (SBX02): 192.168.86.28
  - PostgreSQL Replica (port 5432)
  - Analytics & Read-heavy queries
```

### Technology Stack

| Component | Technology | Location | Purpose |
|-----------|-----------|----------|---------|
| Database | PostgreSQL 15+ | 192.168.86.27 (primary)<br>192.168.86.28 (replica) | Data persistence |
| Cache | Redis 7+ | 192.168.86.27 | Sessions, query cache |
| Messaging | NATS | 192.168.86.27 | Real-time events |
| Registry | OCI Registry | 192.168.86.27 | Asset storage |
| Auth | Cloudflare Zero Trust + nocturnaID | Cloud | Authentication |
| Frontend | React + Vite + TypeScript | 192.168.86.114/115 | UI |
| ORM | pg (direct) | - | Database client |

## ✅ Phase 1: Error Handling System (COMPLETE)

### What Was Built

1. **Error Handler** (`src/lib/errors/ErrorHandler.ts`)
   - Centralized error logging to PostgreSQL
   - NATS event publishing for errors
   - User-friendly error messages
   - Error severity classification

2. **Error Boundary** (`src/components/ErrorBoundary.tsx`)
   - React error boundary for crash recovery
   - Development error details
   - User-friendly error display
   - Recovery actions (Try Again, Go Home)

3. **Toast System** (`src/components/Toast.tsx`)
   - Success, error, warning, info notifications
   - Auto-dismiss with configurable duration
   - Context provider for app-wide access
   - Animated slide-in/out

4. **Hooks** (`src/hooks/useErrorHandler.ts`)
   - useErrorHandler hook
   - useAsyncError hook for async operations
   - Integrated toast notifications

5. **Database Migration** (`003_error_logging_and_users.sql`)
   - `slate_error_logs` table
   - Indexes for performance
   - Cleanup functions

### Usage Example

```typescript
import { useErrorHandler } from './hooks/useErrorHandler';

function MyComponent() {
  const { handleError, showSuccess } = useErrorHandler();

  const saveFile = async () => {
    try {
      await saveFileAPI(content);
      showSuccess('File saved successfully');
    } catch (error) {
      await handleError(error as Error);
    }
  };
}
```

## ✅ Phase 2: Custom Authentication (COMPLETE)

### What Was Built

1. **Auth Client** (`src/lib/auth/client.ts`)
   - Cloudflare Zero Trust integration
   - nocturnaID user management
   - JWT token validation
   - Local session storage
   - Mock auth for development

2. **Auth Middleware** (`src/lib/auth/middleware.ts`)
   - requireAuth() - Enforce authentication
   - requireRole() - Role-based access control
   - requireProjectOwnership() - Resource ownership
   - User creation from auth session

3. **AuthGuard Component** (`src/components/auth/AuthGuard.tsx`)
   - Route protection
   - Login page
   - Loading states
   - Development mode support

4. **Auth Hook** (`src/hooks/useAuth.ts`)
   - useAuth hook for components
   - User state management
   - Auto-refresh sessions
   - Role checking

5. **Database Schema** (`003_error_logging_and_users.sql`)
   - `users` table
   - `user_sessions` table
   - Foreign keys on existing tables
   - Session cleanup functions

### Authentication Flow

```
1. User visits SLATE → AuthGuard checks authentication
2. Not authenticated → Show login page
3. Click "Sign In" → Redirect to Cloudflare Zero Trust
4. Zero Trust validates → Redirect back with JWT token
5. Validate token with nocturnaID → Get user data
6. Create/update user in PostgreSQL → Store session
7. User authenticated → Access granted
```

### Development Mode

In development (when Cloudflare Zero Trust is not configured), SLATE automatically creates a mock user:

```typescript
{
  id: 'mock-user-id-xxx',
  email: 'developer@slate.local',
  name: 'Local Developer',
  roles: ['developer', 'admin']
}
```

### Usage Example

```typescript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## 🚧 Phase 3: Real File System (Days 8-12) - NEXT

### Planned Implementation

1. **File Operations API** (`src/lib/api/files.ts`)
   - Create, read, update, delete files
   - File tree generation
   - Search functionality
   - Auto-save with debouncing

2. **File Tree Component** (`src/components/FileTree.tsx`)
   - Hierarchical file browser
   - Drag & drop support
   - Context menus
   - File type icons

3. **File Persistence**
   - Store content in PostgreSQL
   - Cache in Redis
   - Version history
   - Conflict resolution

4. **Integration**
   - Replace mocked file system
   - Connect to database
   - Real-time updates via NATS

## 🚧 Phase 4: Monaco Editor Integration (Days 13-14)

### Planned Implementation

1. **Monaco Setup**
   - Install @monaco-editor/react
   - Custom theme (LumenForge)
   - Language support (C#, Shader, JS, TS)

2. **Editor Features**
   - Syntax highlighting
   - IntelliSense
   - Auto-save
   - Keyboard shortcuts

3. **File Integration**
   - Load from database
   - Save to database
   - Real-time collaboration

## 🚧 Phase 5: Runtime Execution (Days 15-19)

### Planned Implementation

1. **Runtime Engine**
   - Code validation
   - Syntax checking
   - Error reporting
   - Console output

2. **Session Management**
   - Start/stop sessions
   - Log streaming
   - Resource monitoring

## 🚧 Phase 6: Testing Infrastructure (Days 20-22)

### Planned Implementation

1. **Unit Tests**
   - Vitest setup
   - Component tests
   - Hook tests
   - Utility tests

2. **Integration Tests**
   - Database operations
   - API endpoints
   - Auth flows

3. **E2E Tests**
   - Critical user paths
   - File operations
   - Project management

## 🚧 Phase 7: Production Polish (Days 23-28)

### Planned Implementation

1. **Performance**
   - Code splitting
   - Lazy loading
   - Bundle optimization
   - Query optimization

2. **UX Enhancements**
   - Loading states
   - Keyboard shortcuts
   - Tooltips
   - Help documentation

3. **Deployment**
   - Kubernetes manifests
   - CI/CD pipeline
   - Monitoring setup
   - Health checks

## Database Migrations

### How to Run Migrations

1. Connect to PostgreSQL:
   ```bash
   psql -h 192.168.86.27 -U slate_user -d wissil_db
   ```

2. Run migration files in order:
   ```bash
   psql -h 192.168.86.27 -U slate_user -d wissil_db -f src/lib/database/migrations/001_initial_schema.sql
   psql -h 192.168.86.27 -U slate_user -d wissil_db -f src/lib/database/migrations/002_runtime_and_builds.sql
   psql -h 192.168.86.27 -U slate_user -d wissil_db -f src/lib/database/migrations/003_error_logging_and_users.sql
   ```

3. Verify migrations:
   ```sql
   \dt -- List tables
   SELECT * FROM users LIMIT 1;
   SELECT * FROM slate_error_logs LIMIT 1;
   ```

## Environment Variables

Required variables in `.env`:

```env
# Database
VITE_DB_HOST=192.168.86.27
VITE_DB_PORT=5432
VITE_DB_NAME=wissil_db
VITE_DB_USER=slate_user
VITE_DB_PASSWORD=your_password_here

# Replica (optional)
VITE_DB_REPLICA_HOST=192.168.86.28

# Redis
VITE_REDIS_HOST=192.168.86.27
VITE_REDIS_PORT=6379

# NATS
VITE_NATS_URL=ws://192.168.86.27:4222

# Registry
VITE_REGISTRY_URL=https://192.168.86.27:5000

# Auth (optional for development)
VITE_CLOUDFLARE_ZERO_TRUST_URL=https://slate.nocturna.cloudflareaccess.com
VITE_NOCTURNA_ID_API_URL=https://id.nocturna.dev
```

## Development Workflow

### 1. Start Development Server

```bash
npm install
npm run dev
```

SLATE will be available at `http://localhost:5173`

### 2. Development Mode Features

- **Mock Authentication**: Auto-login as developer@slate.local
- **Error Details**: Full stack traces in error boundary
- **Hot Reload**: Changes reflect immediately
- **Console Logging**: Detailed query logs

### 3. Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Lint
npm run lint
```

## Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Docker Image

```bash
docker build -t 192.168.86.27:5000/slate:latest .
docker push 192.168.86.27:5000/slate:latest
```

### 3. Kubernetes Deployment

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Verify Deployment

```bash
kubectl get pods -n wissil
kubectl logs -f deployment/slate -n wissil
```

SLATE will be available at `http://192.168.86.114` and `http://192.168.86.115`

## Monitoring & Debugging

### Error Logs

```sql
-- Recent errors
SELECT * FROM slate_error_logs
ORDER BY created_at DESC
LIMIT 50;

-- Errors by severity
SELECT severity, COUNT(*)
FROM slate_error_logs
GROUP BY severity;

-- Errors by user
SELECT u.email, COUNT(*) as error_count
FROM slate_error_logs e
JOIN users u ON u.id = e.user_id
GROUP BY u.email
ORDER BY error_count DESC;
```

### Active Sessions

```sql
-- Active sessions
SELECT u.email, us.created_at, us.expires_at
FROM user_sessions us
JOIN users u ON u.id = us.user_id
WHERE us.expires_at > NOW()
ORDER BY us.created_at DESC;

-- Expired sessions cleanup
SELECT cleanup_expired_sessions();
```

### Performance Monitoring

```sql
-- Slow queries (PostgreSQL)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

## Security Checklist

- [x] No Supabase dependencies
- [x] Custom authentication with Cloudflare Zero Trust
- [x] JWT token validation
- [x] Session management in Redis
- [x] Error logging without exposing sensitive data
- [x] User isolation (user_id on all tables)
- [ ] HTTPS enforced in production
- [ ] Rate limiting on API endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React auto-escaping)

## Known Limitations

1. **No RLS**: Application-level permissions instead of database RLS
2. **Development Mock Auth**: Production requires Cloudflare Zero Trust setup
3. **No Email Verification**: Users created on first login
4. **Session Storage**: Redis required for production

## Next Steps

1. ✅ Complete Phase 1 & 2 (Error Handling + Auth)
2. 🚧 Implement Phase 3 (Real File System)
3. 🚧 Add Monaco Editor (Phase 4)
4. 🚧 Build Runtime Execution (Phase 5)
5. 🚧 Set up Testing (Phase 6)
6. 🚧 Production Polish (Phase 7)

## Success Metrics

### Phase 1 & 2 Metrics ✅

- [x] Error boundaries on all major components
- [x] Error logging to PostgreSQL
- [x] User-friendly error messages
- [x] Custom auth client working
- [x] User sessions managed
- [x] Development mock auth working
- [x] Database migrations complete

### Remaining Metrics

- [ ] Real file CRUD operations
- [ ] File tree from database
- [ ] Monaco editor integrated
- [ ] Runtime validation working
- [ ] Unit tests >80% coverage
- [ ] E2E tests passing
- [ ] Production deployment ready

## Support & Resources

- **Architecture**: See `ARCHITECTURE_NO_BOLT.md`
- **Database Schema**: See `src/lib/database/migrations/`
- **Error Handling**: See `src/lib/errors/ErrorHandler.ts`
- **Authentication**: See `src/lib/auth/client.ts`

---

**Last Updated**: 2025-01-XX
**Status**: Phase 1 & 2 Complete, Ready for Phase 3
