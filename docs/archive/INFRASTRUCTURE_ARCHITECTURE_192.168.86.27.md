# Complete Infrastructure & Architecture Documentation
## Synology NAS Servers (192.168.86.27 & 192.168.86.28) - Comprehensive Guide

**Version:** 2.0.0
**Date:** December 2024
**Focus:** Synology NAS Infrastructure Hubs - Primary & Secondary

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Network Architecture](#network-architecture)
3. [Synology NAS (192.168.86.27) Deep Dive](#synology-nas-1921688627-deep-dive)
4. [Data Pipeline Architecture](#data-pipeline-architecture)
5. [Service Ports & Protocols](#service-ports--protocols)
6. [Network Topology Diagrams](#network-topology-diagrams)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [System Interaction Maps](#system-interaction-maps)
9. [Infrastructure Mindmaps](#infrastructure-mindmaps)
10. [Deployment Architecture](#deployment-architecture)
11. [Security & Network Policies](#security--network-policies)
12. [Monitoring & Health Checks](#monitoring--health-checks)

---

## Executive Summary

The WISSIL (Workspace, Identity, Spark, Slate, Ignis, Landing) ecosystem is built on a distributed architecture with high availability:

- **Helios Control** (192.168.86.114) - Control plane services
- **Helios Compute** (192.168.86.115) - Compute-intensive services
- **Synology NAS Primary** (192.168.86.27) - **Primary Data & Infrastructure Hub** ⭐
- **Synology NAS Secondary** (192.168.86.28) - **Secondary/Backup Data Hub** ⭐

### Primary Server (192.168.86.27)
The Synology NAS at **192.168.86.27** serves as the critical infrastructure backbone, hosting:
- PostgreSQL database (primary/master)
- Redis cache (master)
- NATS message bus (primary)
- Container Registry (primary)

### Secondary Server (192.168.86.28)
The Synology NAS at **192.168.86.28** provides high availability and backup:
- PostgreSQL replica (read-only, failover-ready)
- Redis Sentinel (high availability monitoring)
- NATS cluster node (message bus redundancy)
- Registry Mirror (backup and disaster recovery)

---

## Network Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTERNET / CLOUDFLARE CDN                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Cloudflare      │
                    │ Zero Trust      │
                    │ Authentication  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│ Helios Control│   │Helios Compute  │   │ Synology NAS   │   │ Synology NAS   │
│ 192.168.86.114│   │192.168.86.115 │   │ Primary        │   │ Secondary      │
│               │   │               │   │ 192.168.86.27 │   │ 192.168.86.28 │
│ LANDING  :3000│   │ SLATE   :3001 │   │                │   │                │
│ IGNITION :3002│   │ SPARK   :3003 │   │ PostgreSQL:5432│   │ PostgreSQL:5432│
│ IGNIS    :3004│   │ WAYPOINT:3005 │   │ Redis    :6379 │   │ Sentinel:26379│
│               │   │               │   │ NATS     :4222 │   │ NATS     :4222 │
│               │   │               │   │ Registry :5000 │   │ Registry :5000 │
└───────┬───────┘   └───────┬───────┘   └───────┬────────┘   └───────┬────────┘
        │                   │                   │                   │
        └───────────────────┼───────────────────┼───────────────────┘
                            │                   │
                    Internal Network
                    (192.168.86.0/24)
```

### Network Segmentation

| Network Zone | IP Range | Purpose | Services |
|-------------|----------|---------|----------|
| **DMZ / Edge** | Cloudflare | Public-facing | CDN, Zero Trust |
| **Control Plane** | 192.168.86.114 | Management | LANDING, IGNITION, IGNIS |
| **Compute Plane** | 192.168.86.115 | Processing | SLATE, SPARK, WAYPOINT |
| **Data Plane Primary** | 192.168.86.27 | Storage & Messaging | PostgreSQL (Primary), Redis (Master), NATS (Primary), Registry (Primary) |
| **Data Plane Secondary** | 192.168.86.28 | Backup & HA | PostgreSQL (Replica), Redis Sentinel, NATS (Cluster), Registry (Mirror) |

---

## Synology NAS (192.168.86.27) Deep Dive

### Server Specifications

| Property | Value |
|----------|-------|
| **Hostname** | Synology NAS |
| **IP Address** | 192.168.86.27 |
| **Role** | Infrastructure Hub / Data Backend |
| **Network** | 192.168.86.0/24 (Private) |
| **Access** | Internal only (via Cloudflare Tunnel) |

### Services Running on 192.168.86.27

#### 1. PostgreSQL Database (Port 5432)

**Purpose:** Primary persistent data storage

**Data Stored:**
- User accounts and authentication data
- Component metadata and versions
- Deployment history and logs
- Project configurations
- Workspace data
- System audit logs

**Connection String:**
```
postgresql://wissil:****@192.168.86.27:5432/wissil
```

**Database Schema Overview:**
```
wissil/
├── users              # User accounts
├── workspaces         # Workspace definitions
├── components         # Component metadata
├── deployments        # Deployment history
├── versions           # Version control
├── sessions           # Active sessions
└── audit_logs         # System audit trail
```

**Performance:**
- Connection Pool: 20-50 connections
- Query Timeout: 30s
- Backup: Daily automated backups
- Replication: Standby replica (if configured)

#### 2. Redis Cache (Port 6379)

**Purpose:** High-performance caching and session management

**Data Stored:**
- User sessions (TTL: 1 hour)
- Build cache (TTL: 24 hours)
- Rate limiting counters
- Real-time application state
- Hot component data
- API response cache

**Connection String:**
```
redis://192.168.86.27:6379/0
```

**Key Patterns:**
```
sessions:{user_id}           # User sessions
cache:build:{project_id}     # Build artifacts
ratelimit:{ip}:{endpoint}    # Rate limiting
realtime:{workspace_id}       # Real-time state
components:{component_id}    # Hot component data
```

**Configuration:**
- Max Memory: 2GB (configurable)
- Eviction Policy: allkeys-lru
- Persistence: RDB snapshots + AOF
- Replication: Master-Slave (if configured)

#### 3. NATS Message Bus (Port 4222)

**Purpose:** Inter-service messaging and event streaming

**Connection String:**
```
nats://192.168.86.27:4222
```

**Topics/Subjects:**
```
wissil.build.*              # Build events
  ├── wissil.build.started
  ├── wissil.build.completed
  ├── wissil.build.failed
  └── wissil.build.progress

wissil.deploy.*             # Deployment events
  ├── wissil.deploy.started
  ├── wissil.deploy.completed
  ├── wissil.deploy.rolled_back
  └── wissil.deploy.health_check

wissil.component.*          # Component events
  ├── wissil.component.created
  ├── wissil.component.updated
  ├── wissil.component.published
  └── wissil.component.deprecated

wissil.user.*               # User events
  ├── wissil.user.login
  ├── wissil.user.logout
  └── wissil.user.role_changed

wissil.system.*             # System events
  ├── wissil.system.health
  ├── wissil.system.alert
  └── wissil.system.maintenance
```

**Message Flow:**
```
Publisher (IGNIS) → NATS (192.168.86.27:4222) → Subscribers (WAYPOINT, LANDING)
```

**Configuration:**
- Max Payload: 1MB
- Max Connections: 1000
- Cluster Mode: Single node (expandable)
- Authentication: Token-based

#### 4. Container Registry (Port 5000)

**Purpose:** Docker image and artifact storage

**Registry URL:**
```
https://192.168.86.27:5000
```

**Stored Artifacts:**
- Docker images for all WISSIL services
- Component packages (npm-like)
- Build artifacts and binaries
- Version archives
- Deployment packages

**Image Naming Convention:**
```
192.168.86.27:5000/wissil/{service}:{version}
  ├── wissil/landing:v1.2.3
  ├── wissil/slate:v1.2.3
  ├── wissil/spark:v1.2.3
  ├── wissil/ignis:v1.2.3
  ├── wissil/ignition:v1.2.3
  └── wissil/waypoint:v1.2.3
```

**Storage:**
- Local filesystem: `/docker/registry`
- Backup: Daily to external storage
- Retention: 30 days for old versions
- Garbage Collection: Weekly automated

---

## Data Pipeline Architecture

### Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PIPELINE ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────┘

USER INPUT
    │
    ├─→ [SLATE] Design Tokens
    │       │
    │       └─→ Redis Cache (192.168.86.27:6379)
    │               └─→ Hot reload to all services
    │
    ├─→ [SPARK] AI Generation
    │       │
    │       ├─→ PostgreSQL (192.168.86.27:5432)
    │       │       └─→ Store component metadata
    │       │
    │       └─→ NATS (192.168.86.27:4222)
    │               └─→ Publish: wissil.component.created
    │
    ├─→ [IGNIS] Build Process
    │       │
    │       ├─→ PostgreSQL (192.168.86.27:5432)
    │       │       └─→ Store build metadata
    │       │
    │       ├─→ Redis (192.168.86.27:6379)
    │       │       └─→ Cache build artifacts
    │       │
    │       ├─→ NATS (192.168.86.27:4222)
    │       │       └─→ Publish: wissil.build.* events
    │       │
    │       └─→ Registry (192.168.86.27:5000)
    │               └─→ Store Docker images
    │
    └─→ [WAYPOINT] Deployment
            │
            ├─→ PostgreSQL (192.168.86.27:5432)
            │       └─→ Store deployment history
            │
            ├─→ NATS (192.168.86.27:4222)
            │       └─→ Publish: wissil.deploy.* events
            │
            └─→ Registry (192.168.86.27:5000)
                    └─→ Pull images for deployment
```

### Component Lifecycle Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPONENT LIFECYCLE DATA PIPELINE                   │
└─────────────────────────────────────────────────────────────────┘

1. DESIGN PHASE
   SLATE (192.168.86.115:3001)
       │
       ├─→ PostgreSQL (192.168.86.27:5432)
       │       └─→ INSERT INTO design_tokens (...)
       │
       └─→ Redis (192.168.86.27:6379)
               └─→ SET design:cache:{token_id} {...}

2. GENERATION PHASE
   SPARK (192.168.86.115:3003)
       │
       ├─→ PostgreSQL (192.168.86.27:5432)
       │       └─→ INSERT INTO components (...)
       │
       ├─→ Redis (192.168.86.27:6379)
       │       └─→ SET component:hot:{id} {...}
       │
       └─→ NATS (192.168.86.27:4222)
               └─→ PUBLISH wissil.component.created

3. BUILD PHASE
   IGNIS (192.168.86.114:3004)
       │
       ├─→ PostgreSQL (192.168.86.27:5432)
       │       └─→ UPDATE components SET build_status = 'building'
       │
       ├─→ Redis (192.168.86.27:6379)
       │       └─→ SET cache:build:{project_id} {...}
       │
       ├─→ NATS (192.168.86.27:4222)
       │       └─→ PUBLISH wissil.build.started
       │
       └─→ Registry (192.168.86.27:5000)
               └─→ PUSH wissil/component:{version}

4. DEPLOYMENT PHASE
   WAYPOINT (192.168.86.115:3005)
       │
       ├─→ Registry (192.168.86.27:5000)
       │       └─→ PULL wissil/component:{version}
       │
       ├─→ PostgreSQL (192.168.86.27:5432)
       │       └─→ INSERT INTO deployments (...)
       │
       └─→ NATS (192.168.86.27:4222)
               └─→ PUBLISH wissil.deploy.completed
```

### Real-Time Data Synchronization

```
┌─────────────────────────────────────────────────────────────────┐
│           REAL-TIME DATA SYNCHRONIZATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

Service A (e.g., SPARK)
    │
    ├─→ Writes to PostgreSQL (192.168.86.27:5432)
    │       └─→ Transaction committed
    │
    └─→ Publishes to NATS (192.168.86.27:4222)
            └─→ Topic: wissil.component.updated

NATS Message Bus (192.168.86.27:4222)
    │
    ├─→ Subscriber: SLATE
    │       └─→ Updates design system cache
    │
    ├─→ Subscriber: IGNIS
    │       └─→ Triggers hot reload
    │
    ├─→ Subscriber: WAYPOINT
    │       └─→ Updates deployment status
    │
    └─→ Subscriber: LANDING
            └─→ Updates system health dashboard

All Subscribers
    │
    └─→ Update Redis Cache (192.168.86.27:6379)
            └─→ Invalidate/refresh relevant keys
```

---

## Service Ports & Protocols

### Complete Port Matrix

| Service | IP Address | Port | Protocol | Purpose | Access |
|---------|-----------|------|----------|---------|--------|
| **LANDING** | 192.168.86.114 | 3000 | HTTPS | Main gateway | Public (via Cloudflare) |
| **SLATE** | 192.168.86.115 | 3001 | HTTPS | Design system | Public (via Cloudflare) |
| **IGNITION** | 192.168.86.114 | 3002 | HTTPS | Project init | Public (via Cloudflare) |
| **SPARK** | 192.168.86.115 | 3003 | HTTPS + WS | AI generation | Public (via Cloudflare) |
| **IGNIS** | 192.168.86.114 | 3004 | HTTPS + WS | Build server | Public (via Cloudflare) |
| **WAYPOINT** | 192.168.86.115 | 3005 | HTTPS | Deployment | Public (via Cloudflare) |
| **PostgreSQL** | **192.168.86.27** | **5432** | **TCP** | **Database** | **Internal Only** |
| **Redis** | **192.168.86.27** | **6379** | **TCP** | **Cache** | **Internal Only** |
| **NATS** | **192.168.86.27** | **4222** | **TCP** | **Message bus** | **Internal Only** |
| **Registry** | **192.168.86.27** | **5000** | **HTTPS** | **Container registry** | **Internal Only** |
| **HMR WebSocket** | 192.168.86.114/115 | 24678 | WebSocket | Hot module reload | Internal Only |

### Synology NAS (192.168.86.27) Port Details

#### Port 5432 - PostgreSQL

```yaml
Service: PostgreSQL Database
Port: 5432
Protocol: TCP
Access: Internal network only (192.168.86.0/24)
Authentication: Username/Password + SSL
Connection Pool: 20-50 connections
Max Connections: 100
SSL Mode: require
Backup Port: N/A (uses same port)
```

**Connection Examples:**
```bash
# Direct connection
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil

# Connection string
postgresql://wissil:password@192.168.86.27:5432/wissil?sslmode=require

# Health check
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil -c "SELECT 1"
```

#### Port 6379 - Redis

```yaml
Service: Redis Cache
Port: 6379
Protocol: TCP
Access: Internal network only (192.168.86.0/24)
Authentication: Password (AUTH command)
Database Count: 16 (0-15)
Max Memory: 2GB
Persistence: RDB + AOF
```

**Connection Examples:**
```bash
# Direct connection
redis-cli -h 192.168.86.27 -p 6379 -a password

# Connection string
redis://:password@192.168.86.27:6379/0

# Health check
redis-cli -h 192.168.86.27 -p 6379 PING
# Expected: PONG
```

#### Port 4222 - NATS

```yaml
Service: NATS Message Bus
Port: 4222
Protocol: TCP
Access: Internal network only (192.168.86.0/24)
Authentication: Token-based
Max Payload: 1MB
Max Connections: 1000
Cluster Port: 6222 (if clustered)
Monitoring Port: 8222 (HTTP monitoring)
```

**Connection Examples:**
```javascript
// Node.js
const nats = require('nats');
const nc = await nats.connect({
  servers: ['nats://192.168.86.27:4222'],
  token: 'your-token'
});

// Health check
curl http://192.168.86.27:8222/varz
```

#### Port 5000 - Container Registry

```yaml
Service: Docker Container Registry
Port: 5000
Protocol: HTTPS
Access: Internal network only (192.168.86.0/24)
Authentication: Basic Auth or Token
Storage: Local filesystem
API Version: v2
```

**Connection Examples:**
```bash
# Docker login
docker login 192.168.86.27:5000

# Pull image
docker pull 192.168.86.27:5000/wissil/landing:v1.2.3

# Push image
docker push 192.168.86.27:5000/wissil/landing:v1.2.3

# Health check
curl -k https://192.168.86.27:5000/v2/
```

---

## Network Topology Diagrams

### Complete Network Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE NETWORK TOPOLOGY                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │    Internet     │
                    │   (Public IP)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Cloudflare CDN │
                    │  + DDoS Protect │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Cloudflare      │
                    │ Zero Trust      │
                    │ + Auth Gateway  │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
     ┌──────────▼──────────┐ │ ┌─────────▼─────────┐
     │  Helios Control     │ │ │ Helios Compute    │
     │  192.168.86.114     │ │ │ 192.168.86.115   │
     │                     │ │ │                  │
     │  ┌──────────────┐  │ │ │  ┌────────────┐ │
     │  │ LANDING      │  │ │ │  │ SLATE       │ │
     │  │ Port: 3000   │  │ │ │  │ Port: 3001  │ │
     │  │ HTTPS        │  │ │ │  │ HTTPS       │ │
     │  └──────────────┘  │ │ │  └────────────┘ │
     │                     │ │ │                  │
     │  ┌──────────────┐  │ │ │  ┌────────────┐ │
     │  │ IGNITION     │  │ │ │  │ SPARK       │ │
     │  │ Port: 3002   │  │ │ │  │ Port: 3003  │ │
     │  │ HTTPS        │  │ │ │  │ HTTPS+WS    │ │
     │  └──────────────┘  │ │ │  └────────────┘ │
     │                     │ │ │                  │
     │  ┌──────────────┐  │ │ │  ┌────────────┐ │
     │  │ IGNIS        │  │ │ │  │ WAYPOINT   │ │
     │  │ Port: 3004   │  │ │ │  │ Port: 3005 │ │
     │  │ HTTPS+WS     │  │ │ │  │ HTTPS      │ │
     │  └──────────────┘  │ │ │  └────────────┘ │
     └──────────┬──────────┘ │ └─────────┬───────┘
                │            │           │
                └────────────┼───────────┘
                             │
                    ┌────────▼────────┐
                    │ Synology NAS    │
                    │ 192.168.86.27  │
                    │                │
                    │  ┌──────────┐ │
                    │  │PostgreSQL │ │
                    │  │Port: 5432 │ │
                    │  │TCP        │ │
                    │  └──────────┘ │
                    │                │
                    │  ┌──────────┐ │
                    │  │ Redis    │ │
                    │  │Port: 6379│ │
                    │  │TCP       │ │
                    │  └──────────┘ │
                    │                │
                    │  ┌──────────┐ │
                    │  │ NATS     │ │
                    │  │Port: 4222│ │
                    │  │TCP       │ │
                    │  └──────────┘ │
                    │                │
                    │  ┌──────────┐ │
                    │  │ Registry │ │
                    │  │Port: 5000│ │
                    │  │HTTPS     │ │
                    │  └──────────┘ │
                    └────────────────┘

Network: 192.168.86.0/24 (Private)
Gateway: 192.168.86.1
DNS: 192.168.86.1 (or external)
```

### Data Flow Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW TOPOLOGY                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ Helios       │         │ Helios       │         │ Synology NAS │
│ Control      │         │ Compute      │         │ 192.168.86.27│
│ 192.168.86.  │         │ 192.168.86.  │         │              │
│ 114          │         │ 115          │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                       │                       │
       │                       │                       │
       │  ┌────────────────────┼────────────────────┐ │
       │  │                    │                    │ │
       │  │  ┌──────────────┐  │  ┌──────────────┐ │ │
       │  │  │ PostgreSQL   │◄─┼──┼─ Read/Write   │ │ │
       │  │  │ :5432        │  │  │  Data         │ │ │
       │  │  └──────────────┘  │  └──────────────┘ │ │
       │  │                    │                    │ │
       │  │  ┌──────────────┐  │  ┌──────────────┐ │ │
       │  │  │ Redis        │◄─┼──┼─ Cache/Session│ │ │
       │  │  │ :6379        │  │  │  Data         │ │ │
       │  │  └──────────────┘  │  └──────────────┘ │ │
       │  │                    │                    │ │
       │  │  ┌──────────────┐  │  ┌──────────────┐ │ │
       │  │  │ NATS         │◄─┼──┼─ Pub/Sub      │ │ │
       │  │  │ :4222        │  │  │  Messages     │ │ │
       │  │  └──────────────┘  │  └──────────────┘ │ │
       │  │                    │                    │ │
       │  │  ┌──────────────┐  │  ┌──────────────┐ │ │
       │  │  │ Registry    │◄─┼──┼─ Push/Pull   │ │ │
       │  │  │ :5000        │  │  │  Images       │ │ │
       │  │  └──────────────┘  │  └──────────────┘ │ │
       │  │                    │                    │ │
       │  └────────────────────┼────────────────────┘ │
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                    All services connect to
                    Synology NAS (192.168.86.27)
                    for data persistence and
                    inter-service communication
```

---

## Data Flow Diagrams

### Request Flow Through Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│           REQUEST FLOW THROUGH INFRASTRUCTURE                    │
└─────────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
Cloudflare CDN (Edge)
    │
    ▼
Cloudflare Zero Trust (Auth)
    │
    ▼
┌─────────────────────────────────────────┐
│  Application Layer (Helios Servers)     │
│                                         │
│  ┌──────────┐  ┌──────────┐          │
│  │ LANDING  │  │  SPARK   │          │
│  │ SLATE    │  │  IGNIS   │          │
│  │ IGNITION │  │ WAYPOINT │          │
│  └────┬─────┘  └────┬─────┘          │
└───────┼──────────────┼─────────────────┘
        │              │
        └──────┬───────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Data Layer (Synology NAS 192.168.86.27)│
│                                         │
│  ┌──────────┐  ┌──────────┐          │
│  │PostgreSQL│  │  Redis   │          │
│  │  :5432   │  │  :6379   │          │
│  └──────────┘  └──────────┘          │
│                                         │
│  ┌──────────┐  ┌──────────┐          │
│  │  NATS    │  │ Registry │          │
│  │  :4222   │  │  :5000   │          │
│  └──────────┘  └──────────┘          │
└─────────────────────────────────────────┘
```

### Component Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPONENT CREATION DATA FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION
   User creates component in SPARK
       │
       ▼
2. SPARK (192.168.86.115:3003)
   Generates component code
       │
       ├─→ Write to PostgreSQL (192.168.86.27:5432)
       │       └─→ INSERT INTO components (metadata)
       │
       ├─→ Cache in Redis (192.168.86.27:6379)
       │       └─→ SET component:hot:{id} (code)
       │
       └─→ Publish to NATS (192.168.86.27:4222)
               └─→ wissil.component.created
       │
       ▼
3. NATS SUBSCRIBERS
   ┌─────────────────────────────────────┐
   │ SLATE    → Update design cache      │
   │ IGNIS    → Trigger hot reload       │
   │ WAYPOINT → Update deployment queue  │
   │ LANDING  → Update status dashboard  │
   └─────────────────────────────────────┘
       │
       ▼
4. IGNIS BUILD (192.168.86.114:3004)
   Builds component
       │
       ├─→ Update PostgreSQL (192.168.86.27:5432)
       │       └─→ UPDATE components SET build_status
       │
       ├─→ Publish to NATS (192.168.86.27:4222)
       │       └─→ wissil.build.completed
       │
       └─→ Push to Registry (192.168.86.27:5000)
               └─→ docker push wissil/component:v1.0.0
       │
       ▼
5. WAYPOINT DEPLOY (192.168.86.115:3005)
   Deploys component
       │
       ├─→ Pull from Registry (192.168.86.27:5000)
       │       └─→ docker pull wissil/component:v1.0.0
       │
       ├─→ Write to PostgreSQL (192.168.86.27:5432)
       │       └─→ INSERT INTO deployments
       │
       └─→ Publish to NATS (192.168.86.27:4222)
               └─→ wissil.deploy.completed
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION DATA FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User Login Request
    │
    ▼
Cloudflare Zero Trust
    │
    ▼
nocturnaID.org (External Auth Provider)
    │
    ▼
JWT Token Issued
    │
    ▼
Application Service (e.g., LANDING)
    │
    ├─→ Validate Token
    │       │
    │       └─→ Query PostgreSQL (192.168.86.27:5432)
    │               └─→ SELECT * FROM users WHERE id = ?
    │
    └─→ Store Session
            │
            └─→ Redis (192.168.86.27:6379)
                    └─→ SET sessions:{user_id} {token, expires}
    │
    ▼
Subsequent Requests
    │
    ├─→ Check Redis Cache (192.168.86.27:6379)
    │       └─→ GET sessions:{user_id}
    │
    └─→ If expired, refresh from PostgreSQL (192.168.86.27:5432)
```

---

## System Interaction Maps

### Complete System Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLETE SYSTEM INTERACTION MAP                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │ LANDING  │
                    │ :3000    │
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │  SLATE  │      │  SPARK  │     │  IGNIS   │
   │ :3001   │      │ :3003   │     │ :3004    │
   └────┬────┘      └────┬────┘     └────┬────┘
        │                │                │
        │                │                │
        │         ┌───────┼───────┐       │
        │         │       │       │       │
        │    ┌────▼────┐ │ ┌─────▼────┐ │
        │    │IGNITION │ │ │ WAYPOINT │ │
        │    │ :3002   │ │ │ :3005    │ │
        │    └────┬────┘ │ └─────┬────┘ │
        │         │      │       │      │
        └─────────┼──────┼───────┼──────┘
                  │      │       │
                  │      │       │
        ┌─────────┼──────┼───────┼─────────┐
        │         │      │       │         │
   ┌────▼────┐ ┌──▼────┐ │ ┌─────▼────┐ ┌─▼────┐
   │PostgreSQL│ │ Redis │ │ │  NATS   │ │Registry│
   │ :5432    │ │ :6379 │ │ │ :4222   │ │ :5000 │
   └──────────┘ └───────┘ │ └─────────┘ └───────┘
                          │
                  All on Synology NAS
                  192.168.86.27

Interactions:
  LANDING ↔ ALL:      Navigation, status queries
  SLATE → PostgreSQL: Store design tokens
  SLATE → Redis:      Cache token data
  SPARK → PostgreSQL: Store component metadata
  SPARK → Redis:      Cache generated code
  SPARK → NATS:       Publish component events
  IGNIS → PostgreSQL: Store build metadata
  IGNIS → Redis:      Cache build artifacts
  IGNIS → NATS:       Publish build events
  IGNIS → Registry:   Push Docker images
  WAYPOINT → Registry: Pull Docker images
  WAYPOINT → PostgreSQL: Store deployment history
  WAYPOINT → NATS:    Publish deployment events
  ALL → Redis:       Session management
  ALL → NATS:        Inter-service communication
```

### Service Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVICE DEPENDENCY GRAPH                           │
└─────────────────────────────────────────────────────────────────┘

Application Services (Depend on Data Services)
    │
    ├─→ LANDING (192.168.86.114:3000)
    │       ├─→ PostgreSQL (192.168.86.27:5432) [Read/Write]
    │       ├─→ Redis (192.168.86.27:6379) [Read/Write]
    │       └─→ NATS (192.168.86.27:4222) [Subscribe]
    │
    ├─→ SLATE (192.168.86.115:3001)
    │       ├─→ PostgreSQL (192.168.86.27:5432) [Read/Write]
    │       ├─→ Redis (192.168.86.27:6379) [Read/Write]
    │       └─→ NATS (192.168.86.27:4222) [Publish/Subscribe]
    │
    ├─→ SPARK (192.168.86.115:3003)
    │       ├─→ PostgreSQL (192.168.86.27:5432) [Read/Write]
    │       ├─→ Redis (192.168.86.27:6379) [Read/Write]
    │       └─→ NATS (192.168.86.27:4222) [Publish]
    │
    ├─→ IGNIS (192.168.86.114:3004)
    │       ├─→ PostgreSQL (192.168.86.27:5432) [Read/Write]
    │       ├─→ Redis (192.168.86.27:6379) [Read/Write]
    │       ├─→ NATS (192.168.86.27:4222) [Publish]
    │       └─→ Registry (192.168.86.27:5000) [Push]
    │
    ├─→ IGNITION (192.168.86.114:3002)
    │       ├─→ PostgreSQL (192.168.86.27:5432) [Read]
    │       └─→ Redis (192.168.86.27:6379) [Read]
    │
    └─→ WAYPOINT (192.168.86.115:3005)
            ├─→ PostgreSQL (192.168.86.27:5432) [Read/Write]
            ├─→ NATS (192.168.86.27:4222) [Publish]
            └─→ Registry (192.168.86.27:5000) [Pull]

Data Services (Synology NAS 192.168.86.27)
    │
    ├─→ PostgreSQL (:5432) - Primary Data Store
    ├─→ Redis (:6379) - Cache & Sessions
    ├─→ NATS (:4222) - Message Bus
    └─→ Registry (:5000) - Artifact Storage
```

---

## Infrastructure Mindmaps

### Synology NAS (192.168.86.27) Mindmap

```
┌─────────────────────────────────────────────────────────────────┐
│         SYNOLOGY NAS (192.168.86.27) MINDMAP                     │
└─────────────────────────────────────────────────────────────────┘

                    Synology NAS
                    192.168.86.27
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    PostgreSQL        Redis            NATS
    Port: 5432       Port: 6379       Port: 4222
        │                 │                 │
    ┌───┼───┐         ┌───┼───┐       ┌───┼───┐
    │   │   │         │   │   │       │   │   │
Users Comps Deploys  Cache Sess Rate  Pub Sub Events
        │                 │                 │
    Metadata        Sessions         Messages
    Versions        Hot Data         Notifications
    History         Build Cache      Build Events
    Logs            Rate Limits      Deploy Events
                          │
                    ┌─────┴─────┐
                    │  Registry │
                    │ Port: 5000│
                    └─────┬─────┘
                          │
                    ┌─────┼─────┐
                    │     │     │
                Images Packages Artifacts
                    │     │     │
                Docker  NPM   Builds
                Images  Pkgs  Binaries
```

### Data Pipeline Mindmap

```
┌─────────────────────────────────────────────────────────────────┐
│              DATA PIPELINE MINDMAP                               │
└─────────────────────────────────────────────────────────────────┘

                    Data Pipeline
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Input Layer      Processing Layer   Storage Layer
        │                 │                 │
    ┌───┼───┐         ┌───┼───┐       ┌────┼────┐
    │   │   │         │   │   │       │    │    │
  User  API  Events  SPARK IGNIS  PostgreSQL Redis
  Input Calls        AI    Build   Database Cache
        │            Gen   Process      │      │
        │                 │          ┌──┼──┐ ┌─┼─┐
        │                 │          │  │  │ │ │ │
        │                 │        Users Comps Sessions
        │                 │          │  │  │ │ │ │
        │                 │        Vers Deploys Cache
        │                 │          │  │  │ │ │ │
        │                 │        Logs Hist Hot Data
        │                 │
        │            ┌─────┴─────┐
        │            │  NATS Bus  │
        │            │  :4222     │
        │            └─────┬──────┘
        │                  │
        │            ┌─────┼─────┐
        │            │     │     │
        │        Events Messages Notify
        │            │     │     │
        │        Build Deploy System
        │        Events Events Events
        │
        └──────────────┼──────────────┘
                       │
                ┌──────▼──────┐
                │  Registry   │
                │  :5000      │
                └──────┬──────┘
                       │
                ┌──────┼──────┐
                │      │      │
            Images Packages Artifacts
                │      │      │
            Docker   NPM   Builds
            Images   Pkgs  Binaries
```

### Network Architecture Mindmap

```
┌─────────────────────────────────────────────────────────────────┐
│            NETWORK ARCHITECTURE MINDMAP                          │
└─────────────────────────────────────────────────────────────────┘

                    Network Architecture
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    External Layer   Application Layer  Data Layer
        │                 │                 │
    ┌───┼───┐         ┌───┼───┐       ┌────┼────┐
    │   │   │         │   │   │       │    │    │
Internet CDN Zero   Helios Helios  Synology NAS
        │   Trust   Control Compute  192.168.86.27
        │     │      │      │            │
        │     │   ┌──┼──┐ ┌─┼─┐      ┌───┼───┐
        │     │   │  │  │ │ │ │      │   │   │
        │     │ LANDING SLATE SPARK PostgreSQL Redis
        │     │ IGNITION WAYPOINT    │   │   │
        │     │ IGNIS                │   │   │
        │     │                      │   │   │
        │     │                  ┌────┼───┼───┼───┐
        │     │                  │    │   │   │   │
        │     │                NATS Registry
        │     │                :4222 :5000
        │     │                  │     │
        │     │              Messages Images
        │     │              Events  Artifacts
        │     │
        └─────┼──────────────────────┘
              │
        All traffic flows
        through Cloudflare
        Zero Trust for
        authentication
```

---

## Deployment Architecture

### Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────┘

Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    │ webhook
    ▼
GitHub Actions CI/CD
    │
    ├─→ Lint & Test
    │
    ├─→ Build
    │       │
    │       └─→ IGNIS (192.168.86.114:3004)
    │               └─→ Build artifacts
    │
    ├─→ Package
    │       │
    │       └─→ Create Docker image
    │
    └─→ Push to Registry
            │
            └─→ Registry (192.168.86.27:5000)
                    └─→ docker push wissil/service:v1.2.3
    │
    ▼
Deployment
    │
    ├─→ Staging (Auto)
    │       │
    │       └─→ WAYPOINT (192.168.86.115:3005)
    │               ├─→ Pull from Registry (192.168.86.27:5000)
    │               ├─→ Deploy to Vercel
    │               └─→ Log to PostgreSQL (192.168.86.27:5432)
    │
    └─→ Production (Manual Approval)
            │
            └─→ WAYPOINT (192.168.86.115:3005)
                    ├─→ Pull from Registry (192.168.86.27:5000)
                    ├─→ Deploy to Cloudflare Pages
                    ├─→ Log to PostgreSQL (192.168.86.27:5432)
                    └─→ Publish to NATS (192.168.86.27:4222)
                            └─→ wissil.deploy.completed
```

### Container Registry Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│              CONTAINER REGISTRY WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

Build Phase
    │
    └─→ IGNIS (192.168.86.114:3004)
            │
            ├─→ Build Docker image
            │       └─→ docker build -t wissil/service:v1.2.3
            │
            └─→ Push to Registry
                    │
                    └─→ Registry (192.168.86.27:5000)
                            └─→ docker push 192.168.86.27:5000/wissil/service:v1.2.3
    │
    ▼
Storage Phase
    │
    └─→ Registry (192.168.86.27:5000)
            │
            ├─→ Store image layers
            │       └─→ /docker/registry/v2/repositories/wissil/service/
            │
            ├─→ Store metadata
            │       └─→ /docker/registry/v2/repositories/wissil/service/_manifests/
            │
            └─→ Update index
                    └─→ Tag mapping stored
    │
    ▼
Deployment Phase
    │
    └─→ WAYPOINT (192.168.86.115:3005)
            │
            ├─→ Pull image
            │       └─→ docker pull 192.168.86.27:5000/wissil/service:v1.2.3
            │
            ├─→ Deploy to environment
            │       └─→ Kubernetes / Cloudflare / Vercel
            │
            └─→ Log deployment
                    └─→ PostgreSQL (192.168.86.27:5432)
                            └─→ INSERT INTO deployments (...)
```

---

## Security & Network Policies

### Network Security Policies

```yaml
# Network Policy for Synology NAS (192.168.86.27)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: synology-nas-policy
  namespace: wissil
spec:
  podSelector:
    matchLabels:
      app: synology-nas
  policyTypes:
  - Ingress
  - Egress
  ingress:
  # Allow PostgreSQL (5432) from WISSIL services only
  - from:
    - podSelector:
        matchLabels:
          app: wissil
    ports:
    - protocol: TCP
      port: 5432
  # Allow Redis (6379) from WISSIL services only
  - from:
    - podSelector:
        matchLabels:
          app: wissil
    ports:
    - protocol: TCP
      port: 6379
  # Allow NATS (4222) from WISSIL services only
  - from:
    - podSelector:
        matchLabels:
          app: wissil
    ports:
    - protocol: TCP
      port: 4222
  # Allow Registry (5000) from WISSIL services only
  - from:
    - podSelector:
        matchLabels:
          app: wissil
    ports:
    - protocol: TCP
      port: 5000
  egress:
  # Allow DNS resolution
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
  # Deny all other egress
  - {}
```

### Access Control Matrix

| Service | PostgreSQL | Redis | NATS | Registry | Notes |
|---------|-----------|-------|------|----------|-------|
| **LANDING** | ✅ Read/Write | ✅ Read/Write | ✅ Subscribe | ❌ No Access | Main gateway |
| **SLATE** | ✅ Read/Write | ✅ Read/Write | ✅ Pub/Sub | ❌ No Access | Design system |
| **SPARK** | ✅ Read/Write | ✅ Read/Write | ✅ Publish | ❌ No Access | AI generation |
| **IGNIS** | ✅ Read/Write | ✅ Read/Write | ✅ Publish | ✅ Push | Build server |
| **IGNITION** | ✅ Read Only | ✅ Read Only | ❌ No Access | ❌ No Access | Project init |
| **WAYPOINT** | ✅ Read/Write | ❌ No Access | ✅ Publish | ✅ Pull | Deployment |

### Firewall Rules

```bash
# Synology NAS (192.168.86.27) Firewall Rules

# Allow PostgreSQL from internal network
iptables -A INPUT -p tcp --dport 5432 -s 192.168.86.0/24 -j ACCEPT

# Allow Redis from internal network
iptables -A INPUT -p tcp --dport 6379 -s 192.168.86.0/24 -j ACCEPT

# Allow NATS from internal network
iptables -A INPUT -p tcp --dport 4222 -s 192.168.86.0/24 -j ACCEPT

# Allow Registry from internal network
iptables -A INPUT -p tcp --dport 5000 -s 192.168.86.0/24 -j ACCEPT

# Deny all other incoming connections
iptables -A INPUT -j DROP
```

---

## Monitoring & Health Checks

### Health Check Endpoints

#### PostgreSQL Health Check

```bash
# Basic connectivity
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil -c "SELECT 1"

# Database size
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil -c "SELECT pg_size_pretty(pg_database_size('wissil'))"

# Active connections
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil -c "SELECT count(*) FROM pg_stat_activity"
```

#### Redis Health Check

```bash
# Ping test
redis-cli -h 192.168.86.27 -p 6379 PING
# Expected: PONG

# Info
redis-cli -h 192.168.86.27 -p 6379 INFO

# Memory usage
redis-cli -h 192.168.86.27 -p 6379 INFO memory
```

#### NATS Health Check

```bash
# HTTP monitoring endpoint (if enabled on port 8222)
curl http://192.168.86.27:8222/varz

# Connection test
nc -zv 192.168.86.27 4222
```

#### Registry Health Check

```bash
# API v2 check
curl -k https://192.168.86.27:5000/v2/

# Catalog
curl -k https://192.168.86.27:5000/v2/_catalog
```

### Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│              MONITORING DASHBOARD                                 │
└─────────────────────────────────────────────────────────────────┘

Synology NAS (192.168.86.27) Metrics
    │
    ├─→ PostgreSQL (:5432)
    │       ├─→ Connection count
    │       ├─→ Query performance
    │       ├─→ Database size
    │       └─→ Replication lag
    │
    ├─→ Redis (:6379)
    │       ├─→ Memory usage
    │       ├─→ Hit rate
    │       ├─→ Connection count
    │       └─→ Key count
    │
    ├─→ NATS (:4222)
    │       ├─→ Message rate
    │       ├─→ Connection count
    │       ├─→ Subscription count
    │       └─→ Queue depth
    │
    └─→ Registry (:5000)
            ├─→ Storage usage
            ├─→ Image count
            ├─→ Pull rate
            └─→ Push rate
```

### Alert Thresholds

| Service | Metric | Warning | Critical |
|---------|--------|---------|----------|
| **PostgreSQL** | Connection count | > 80 | > 95 |
| **PostgreSQL** | Query time | > 1s | > 5s |
| **Redis** | Memory usage | > 80% | > 95% |
| **Redis** | Hit rate | < 90% | < 80% |
| **NATS** | Message queue depth | > 1000 | > 5000 |
| **Registry** | Storage usage | > 80% | > 95% |

---

## Quick Reference

### Connection Strings

```bash
# PostgreSQL
DATABASE_URL=postgresql://wissil:password@192.168.86.27:5432/wissil?sslmode=require

# Redis
REDIS_URL=redis://:password@192.168.86.27:6379/0

# NATS
NATS_URL=nats://192.168.86.27:4222

# Registry
REGISTRY_URL=https://192.168.86.27:5000
```

### Common Commands

```bash
# PostgreSQL
psql -h 192.168.86.27 -p 5432 -U wissil -d wissil

# Redis
redis-cli -h 192.168.86.27 -p 6379

# NATS (using nats CLI)
nats -s nats://192.168.86.27:4222

# Registry
docker login 192.168.86.27:5000
```

### Port Summary

| Port | Service | Protocol | Access |
|------|---------|----------|--------|
| **5432** | PostgreSQL | TCP | Internal (192.168.86.0/24) |
| **6379** | Redis | TCP | Internal (192.168.86.0/24) |
| **4222** | NATS | TCP | Internal (192.168.86.0/24) |
| **5000** | Registry | HTTPS | Internal (192.168.86.0/24) |

---

## Secondary Server (192.168.86.28) Configuration

### Server Specifications

| Property | Value |
|----------|-------|
| **Hostname** | Synology NAS Secondary |
| **IP Address** | 192.168.86.28 |
| **Role** | Secondary/Backup Infrastructure Hub |
| **Network** | 192.168.86.0/24 (Private) |
| **Access** | Internal only (via Cloudflare Tunnel) |

### Services Running on 192.168.86.28

#### 1. PostgreSQL Replica (Port 5432)

**Purpose:** Read-only database replica for high availability

**Configuration:**
- Replicates from: 192.168.86.27:5432
- Replication user: replicator
- Replication slot: replica_slot
- Mode: Hot standby (read-only)

**Connection String:**
```
postgresql://wissil:****@192.168.86.28:5432/wissil?sslmode=require
```

**Failover:** Automatic promotion to primary on primary failure

#### 2. Redis Sentinel (Port 26379)

**Purpose:** High availability monitoring for Redis

**Configuration:**
- Monitors: 192.168.86.27:6379
- Quorum: 2
- Failover timeout: 10 seconds
- Down after: 5 seconds

**Connection:**
```
redis-cli -h 192.168.86.28 -p 26379
```

#### 3. NATS Cluster Node (Port 4222)

**Purpose:** Message bus redundancy

**Configuration:**
- Cluster with: 192.168.86.27:6222
- Routes: Bidirectional
- Authentication: Token-based

**Connection:**
```
nats://192.168.86.28:4222
```

#### 4. Registry Mirror (Port 5000)

**Purpose:** Backup and disaster recovery for container registry

**Configuration:**
- Mirrors from: 192.168.86.27:5000
- Sync schedule: Daily at 2 AM
- Storage: Local filesystem

**Registry URL:**
```
https://192.168.86.28:5000
```

---

## High Availability Architecture

### Replication Flow

```
Primary (192.168.86.27)          Secondary (192.168.86.28)
├── PostgreSQL                    ├── PostgreSQL Replica
│   └──[WAL Streaming]──────────>│   └──[Read-Only]
│                                  │
├── Redis Master                  ├── Redis Sentinel
│   └──[Replication]─────────────>│   └──[Monitoring]
│                                  │
├── NATS Primary                  ├── NATS Cluster
│   └──[Cluster Routes]──────────>│   └──[Redundancy]
│                                  │
└── Registry Primary              └── Registry Mirror
    └──[Sync]────────────────────>    └──[Backup]
```

### Failover Procedures

#### PostgreSQL Failover

```bash
# On secondary server (192.168.86.28)
# Promote to primary
sudo -u postgres pg_ctl promote -D /var/lib/postgresql/14/main

# Update application connection strings
# Point to 192.168.86.28:5432
```

#### Redis Failover

```bash
# Redis Sentinel automatically promotes replica
# Check status
redis-cli -h 192.168.86.28 -p 26379 SENTINEL masters
```

---

## Conclusion

The Synology NAS servers serve as the critical infrastructure backbone for the WISSIL ecosystem:

### Primary Server (192.168.86.27)
1. **PostgreSQL** - Primary persistent data storage
2. **Redis** - Master cache and session management
3. **NATS** - Primary message bus
4. **Container Registry** - Primary artifact storage

### Secondary Server (192.168.86.28)
1. **PostgreSQL Replica** - High availability and read scaling
2. **Redis Sentinel** - Automatic failover monitoring
3. **NATS Cluster** - Message bus redundancy
4. **Registry Mirror** - Backup and disaster recovery

All services are accessible only from the internal network (192.168.86.0/24), ensuring security while providing high-performance data services with high availability to the WISSIL application layer.

---

## Production Readiness Documentation

For complete production readiness procedures, see:
- **Production Readiness Guide:** `PRODUCTION_READINESS_192.168.86.27_192.168.86.28.md`
- **Configuration Script:** `scripts/configure-192.168.86.28.sh`
- **Verification Script:** `scripts/verify-production-readiness.sh`

---

**Document Version:** 2.0.0
**Last Updated:** December 2024
**Maintained By:** Infrastructure Team
