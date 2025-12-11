# SLATE MVP Architecture (No BoltDB/Supabase)

## Infrastructure Overview

### Production Environment
- **SLATE Frontend/API**: 192.168.86.114 / 192.168.86.115 (K8s cluster)
- **Primary DB (SBX01)**: 192.168.86.27 (PostgreSQL + Redis + NATS + Registry)
- **Replica DB (SBX02)**: 192.168.86.28 (PostgreSQL replica + Analytics)

### Stack Components

#### Database Layer
- **PostgreSQL 15+** on SBX01 (primary)
- **PostgreSQL 15+** on SBX02 (read replica)
- **Connection**: Direct TCP connections, no Supabase client
- **ORM**: Drizzle ORM (lightweight, TypeScript-native)
- **Migrations**: Custom SQL migrations

#### Cache Layer
- **Redis 7+** on SBX01
- **Purpose**: Session storage, file cache, query cache
- **Client**: ioredis

#### Message Queue
- **NATS** on SBX01
- **Purpose**: Real-time events, pub/sub
- **Client**: nats.ws

#### Authentication
- **Cloudflare Zero Trust** for SSO
- **nocturnaID** for user management
- **Sessions**: Redis-backed JWT tokens
- **No Supabase Auth**

#### File Storage
- **Registry** on SBX01 (OCI-compliant)
- **Database**: Metadata in PostgreSQL
- **Content**: Large files in Registry

## Directory Structure

```
slate/
├── src/
│   ├── lib/
│   │   ├── database/
│   │   │   ├── client.ts          # Direct PostgreSQL client
│   │   │   ├── schema.ts          # Drizzle schema
│   │   │   ├── migrations/        # SQL migrations
│   │   │   └── operations/        # Database operations
│   │   ├── auth/
│   │   │   ├── client.ts          # Custom auth client
│   │   │   ├── middleware.ts      # Auth middleware
│   │   │   └── session.ts         # Redis session management
│   │   ├── cache/
│   │   │   ├── redis.ts           # Redis client
│   │   │   └── strategies.ts      # Caching strategies
│   │   ├── messaging/
│   │   │   ├── nats.ts            # NATS client
│   │   │   └── events.ts          # Event types
│   │   ├── registry/
│   │   │   └── client.ts          # OCI registry client
│   │   └── errors/
│   │       ├── handler.ts         # Error handler
│   │       └── types.ts           # Error types
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── Toast.tsx
│   │   └── auth/
│   │       ├── AuthGuard.tsx
│   │       └── LoginPage.tsx
│   └── hooks/
│       ├── useAuth.ts
│       ├── useDatabase.ts
│       └── useErrorHandler.ts
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── drizzle.config.ts
```

## Database Schema

### Users & Authentication
```sql
-- users table
id UUID PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
name VARCHAR(255)
avatar TEXT
roles TEXT[]
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()

-- sessions table (Redis-backed)
session_id VARCHAR(255) PRIMARY KEY
user_id UUID REFERENCES users(id)
token TEXT NOT NULL
expires_at TIMESTAMPTZ NOT NULL
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Projects & Files
```sql
-- slate_projects
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id UUID REFERENCES users(id) NOT NULL
name VARCHAR(255) NOT NULL
description TEXT
metadata JSONB DEFAULT '{}'
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
deleted_at TIMESTAMPTZ

-- slate_files
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id UUID REFERENCES slate_projects(id) ON DELETE CASCADE
path VARCHAR(1024) NOT NULL
content TEXT
type VARCHAR(50)
size BIGINT DEFAULT 0
version INT DEFAULT 1
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
deleted_at TIMESTAMPTZ

UNIQUE(project_id, path) WHERE deleted_at IS NULL
```

### Assets
```sql
-- slate_assets
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id UUID REFERENCES slate_projects(id) ON DELETE CASCADE
name VARCHAR(255) NOT NULL
type VARCHAR(50) NOT NULL
guid VARCHAR(36) UNIQUE NOT NULL
file_id BIGINT
metadata JSONB DEFAULT '{}'
registry_path VARCHAR(1024)
size BIGINT DEFAULT 0
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
deleted_at TIMESTAMPTZ

-- slate_asset_components
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
asset_id UUID REFERENCES slate_assets(id) ON DELETE CASCADE
component_type VARCHAR(100) NOT NULL
component_name VARCHAR(255)
properties JSONB DEFAULT '{}'
editable BOOLEAN DEFAULT true
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Runtime
```sql
-- slate_runtime_sessions
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id UUID REFERENCES users(id) NOT NULL
project_id UUID REFERENCES slate_projects(id) ON DELETE CASCADE
status VARCHAR(20) NOT NULL
logs JSONB DEFAULT '[]'
started_at TIMESTAMPTZ DEFAULT NOW()
ended_at TIMESTAMPTZ

-- slate_error_logs
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id UUID REFERENCES users(id)
project_id UUID REFERENCES slate_projects(id)
error_type VARCHAR(100)
error_message TEXT
error_stack TEXT
context JSONB DEFAULT '{}'
severity VARCHAR(20) DEFAULT 'error'
created_at TIMESTAMPTZ DEFAULT NOW()
```

## API Architecture

### Backend Services (Node.js on K8s)

```
slate-api/
├── src/
│   ├── routes/
│   │   ├── auth.ts       # /api/auth/*
│   │   ├── projects.ts   # /api/projects/*
│   │   ├── files.ts      # /api/files/*
│   │   ├── assets.ts     # /api/assets/*
│   │   └── runtime.ts    # /api/runtime/*
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── logging.ts
│   └── server.ts
└── Dockerfile
```

### Frontend (Vite + React)
- Direct PostgreSQL queries via API
- Redis session storage
- NATS real-time events
- No Supabase client

## Connection Configuration

### Environment Variables
```env
# Database (Primary - SBX01)
DB_HOST=192.168.86.27
DB_PORT=5432
DB_NAME=slate_production
DB_USER=slate_user
DB_PASSWORD=<from-secrets>
DB_SSL=false

# Database (Replica - SBX02)
DB_REPLICA_HOST=192.168.86.28
DB_REPLICA_PORT=5432

# Redis (SBX01)
REDIS_HOST=192.168.86.27
REDIS_PORT=6379
REDIS_PASSWORD=<from-secrets>

# NATS (SBX01)
NATS_URL=nats://192.168.86.27:4222
NATS_USER=slate
NATS_PASSWORD=<from-secrets>

# Registry (SBX01)
REGISTRY_URL=http://192.168.86.27:5000
REGISTRY_USERNAME=slate
REGISTRY_PASSWORD=<from-secrets>

# Auth
CLOUDFLARE_ZERO_TRUST_URL=https://slate.nocturna.cloudflareaccess.com
NOCTURNA_ID_API_URL=https://id.nocturna.dev

# Application
NODE_ENV=production
PORT=3001
SESSION_SECRET=<from-secrets>
JWT_SECRET=<from-secrets>
```

## Authentication Flow

1. User visits SLATE (192.168.86.114)
2. Redirect to Cloudflare Zero Trust
3. Zero Trust validates against nocturnaID
4. User redirected back with JWT token
5. Backend validates JWT with Cloudflare
6. Create session in Redis
7. Store user in PostgreSQL
8. Return session cookie

## Data Flow

### Write Path
1. User action → Frontend
2. Frontend → Backend API (192.168.86.114)
3. Backend → PostgreSQL Primary (192.168.86.27)
4. Backend → Redis cache invalidation
5. Backend → NATS event publish
6. Other clients receive update via NATS

### Read Path
1. User request → Frontend
2. Check Redis cache
3. If miss → Query PostgreSQL Replica (192.168.86.28)
4. Cache result in Redis
5. Return to frontend

## Performance Optimizations

- **Connection Pooling**: 20 max connections per service
- **Query Caching**: 5-minute TTL for reads
- **Read Replica**: All SELECT queries go to SBX02
- **Write Primary**: All INSERT/UPDATE/DELETE go to SBX01
- **Redis Sessions**: Sub-millisecond session lookups
- **NATS Streaming**: Real-time updates without polling

## Security

- **Network**: Private K8s network, no public DB access
- **Auth**: Cloudflare Zero Trust + JWT
- **Sessions**: HTTP-only cookies, Redis-backed
- **Database**: Separate user with limited permissions
- **Secrets**: K8s secrets, never in code
- **TLS**: All connections encrypted

## Deployment

```bash
# Build
docker build -t 192.168.86.27:5000/slate:latest .

# Push to registry
docker push 192.168.86.27:5000/slate:latest

# Deploy
kubectl apply -f k8s/
```

## Monitoring

- **Logs**: Aggregated to central logging
- **Metrics**: Prometheus + Grafana
- **Errors**: PostgreSQL error_logs table
- **Performance**: Query timing, cache hit rates
- **Uptime**: Health checks on /health endpoint

## Migration from Bolt/Supabase

1. Remove all @supabase/* imports
2. Replace supabase.from() with direct queries
3. Replace supabase.auth with custom auth
4. Replace RLS with application-level permissions
5. Test all operations against new infrastructure
