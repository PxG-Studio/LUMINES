# HELIOS & LUMINERA Comprehensive Architecture Documentation

**Version:** 1.0.0  
**Date:** December 2024  
**System:** Helios Infrastructure + Luminera Design System + WISSIL Application Stack  
**Infrastructure:** Kubernetes Control/Compute Nodes + Synology NAS Data Layer

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Infrastructure Overview](#infrastructure-overview)
3. [Complete IP Address & Port Matrix](#complete-ip-address--port-matrix)
4. [Service Topology & Architecture Diagrams](#service-topology--architecture-diagrams)
5. [Data Pipelines to Synology Infrastructure](#data-pipelines-to-synology-infrastructure)
6. [Network Topology Flowcharts](#network-topology-flowcharts)
7. [System Architecture Mindmaps](#system-architecture-mindmaps)
8. [Service Interaction Flowcharts](#service-interaction-flowcharts)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Security & Network Zones](#security--network-zones)
11. [Deployment Architecture](#deployment-architecture)

---

## Executive Summary

The **Helios & Luminera** ecosystem is a comprehensive development platform that combines:

- **Helios Infrastructure:** Kubernetes-based control and compute nodes for orchestration and execution
- **Luminera Design System:** Unified design tokens and component architecture
- **WISSIL Application Stack:** 6 integrated subsystems (Landing, Ignition, Slate, Spark, Ignis, Waypoint)
- **Synology Data Layer:** Primary and secondary NAS servers for persistent storage and services

### Key Components

| Component | Role | Primary IP | Purpose |
|-----------|------|------------|---------|
| **Helios Control** | Kubernetes Master | 192.168.86.114 | Orchestration, API Gateway, Control Services |
| **Helos Compute** | Kubernetes Worker | 192.168.86.115 | Application Execution, Processing |
| **Synology NAS Primary (SBX01)** | Data Services | 192.168.86.27 | Database, Cache, Message Bus, Registry |
| **Synology NAS Secondary (SBX02)** | DR/Replica | 192.168.86.28 | Backup, Replication, Disaster Recovery |
| **Luminera** | Design System | Architecture Layer | Design tokens, MCP tools, Component standards |

---

## Infrastructure Overview

### Physical & Logical Infrastructure Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HELIOS & LUMINERA INFRASTRUCTURE LAYERS                   │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 0: External Access
├── Internet (Global)
└── Cloudflare CDN + Zero Trust (Authentication Gateway)

Layer 1: Kubernetes Control Plane (Helios Control)
├── IP: 192.168.86.114
├── Role: Orchestration, API Gateway, Control Services
├── Services:
│   ├── LANDING (Port 3000) - Main gateway & navigation
│   ├── IGNITION (Port 3002) - Project scaffolding
│   └── IGNIS (Port 3004) - Build pipeline & HMR
├── Kubernetes API: Port 6443
└── HMR WebSocket: Port 24678

Layer 2: Kubernetes Compute Nodes (Helos Compute)
├── IP: 192.168.86.115
├── Role: Application Execution, Processing
├── Services:
│   ├── SLATE (Port 3001) - Design system & tokens
│   ├── SPARK (Port 3003) - AI component generation
│   └── WAYPOINT (Port 3005) - Deployment & versioning
└── Kubernetes API: Port 6443

Layer 3: Data Services (Synology NAS Primary - SBX01)
├── IP: 192.168.86.27
├── Services:
│   ├── PostgreSQL (Port 5432) - Primary database
│   ├── Redis (Port 6379) - Cache & sessions
│   ├── NATS (Port 4222) - Message bus
│   └── Container Registry (Port 5000) - Docker images
└── Role: Primary data layer, active services

Layer 4: Data Services Replica (Synology NAS Secondary - SBX02)
├── IP: 192.168.86.28
├── Services:
│   ├── PostgreSQL Replica (Port 5432) - Database replication
│   ├── Redis Sentinel (Port 26379) - Cache HA
│   ├── NATS Cluster (Port 4222) - Message bus replica
│   └── Registry Mirror (Port 5000) - Registry backup
└── Role: Disaster recovery, backup, replication

Layer 5: Storage & Persistence
├── Synology NAS Primary (192.168.86.27)
│   └── Persistent Volumes, Active Storage
└── Synology NAS Secondary (192.168.86.28)
    └── Backup Archives, Replicated Data
```

### Infrastructure Components Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE COMPONENTS                           │
└─────────────────────────────────────────────────────────────────────────────┘

HELIOS INFRASTRUCTURE
├── Control Node (192.168.86.114)
│   ├── Kubernetes Master
│   ├── API Gateway
│   ├── Service Orchestration
│   └── Control Plane Services
│
└── Compute Node (192.168.86.115)
    ├── Kubernetes Worker
    ├── Application Pods
    ├── Resource Scheduling
    └── Execution Layer

LUMINERA DESIGN SYSTEM
├── Design Tokens (SLATE)
├── Component Library
├── MCP Tools
│   ├── mcp_luminera_read_component
│   └── mcp_luminera_write_component
└── Architecture Standards

WISSIL APPLICATION STACK
├── LANDING (Gateway)
├── SLATE (Design System)
├── IGNITION (Project Bootstrap)
├── SPARK (AI Generation)
├── IGNIS (Build Engine)
└── WAYPOINT (Deployment)

SYNOLOGY DATA LAYER
├── SBX01 (Primary)
│   ├── PostgreSQL
│   ├── Redis
│   ├── NATS
│   └── Container Registry
│
└── SBX02 (Secondary/DR)
    ├── PostgreSQL Replica
    ├── Redis Sentinel
    ├── NATS Cluster
    └── Registry Mirror
```

---

## Complete IP Address & Port Matrix

### Service Matrix - All Systems

| Service | Node Type | IP Address | Port | Protocol | Endpoint | Purpose |
|---------|-----------|------------|------|----------|----------|---------|
| **LANDING** | Helios Control | 192.168.86.114 | 3000 | HTTPS | `https://lumenforge.io` | Main gateway & navigation hub |
| **SLATE** | Helos Compute | 192.168.86.115 | 3001 | HTTPS | `https://slate.lumenforge.io` | Design system & token management |
| **IGNITION** | Helios Control | 192.168.86.114 | 3002 | HTTPS | `https://ignition.lumenforge.io` | Project scaffolding & templates |
| **SPARK** | Helos Compute | 192.168.86.115 | 3003 | HTTPS + WS | `https://spark.lumenforge.io` | AI component generation (MoE) |
| **IGNIS** | Helios Control | 192.168.86.114 | 3004 | HTTPS + WS | `https://ignis.lumenforge.io` | Build pipeline & hot module reload |
| **WAYPOINT** | Helos Compute | 192.168.86.115 | 3005 | HTTPS | `https://waypoint.lumenforge.io` | Deployment & versioning |
| **PostgreSQL** | Synology NAS (SBX01) | 192.168.86.27 | 5432 | TCP | `postgresql://192.168.86.27:5432` | Primary database |
| **PostgreSQL Replica** | Synology NAS (SBX02) | 192.168.86.28 | 5432 | TCP | `postgresql://192.168.86.28:5432` | Database replica/DR |
| **Redis** | Synology NAS (SBX01) | 192.168.86.27 | 6379 | TCP | `redis://192.168.86.27:6379` | Cache & session storage |
| **Redis Sentinel** | Synology NAS (SBX02) | 192.168.86.28 | 26379 | TCP | `redis://192.168.86.28:26379` | Redis high availability |
| **NATS** | Synology NAS (SBX01) | 192.168.86.27 | 4222 | TCP | `nats://192.168.86.27:4222` | Message bus & events |
| **NATS Cluster** | Synology NAS (SBX02) | 192.168.86.28 | 4222 | TCP | `nats://192.168.86.28:4222` | Message bus replication |
| **Container Registry** | Synology NAS (SBX01) | 192.168.86.27 | 5000 | HTTPS | `https://192.168.86.27:5000` | Docker image registry |
| **Registry Mirror** | Synology NAS (SBX02) | 192.168.86.28 | 5000 | HTTPS | `https://192.168.86.28:5000` | Registry backup/mirror |
| **HMR WebSocket** | Helios Control | 192.168.86.114 | 24678 | WebSocket | `ws://192.168.86.114:24678` | Hot module reload |
| **Kubernetes API (Control)** | Helios Control | 192.168.86.114 | 6443 | HTTPS | `https://192.168.86.114:6443` | K8s control plane API |
| **Kubernetes API (Compute)** | Helos Compute | 192.168.86.115 | 6443 | HTTPS | `https://192.168.86.115:6443` | K8s worker API |

### Port Allocation Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PORT ALLOCATION SUMMARY                             │
└─────────────────────────────────────────────────────────────────────────────┘

HELIOS CONTROL (192.168.86.114)
├── 3000  → LANDING (HTTPS) - Main gateway
├── 3002  → IGNITION (HTTPS) - Project bootstrap
├── 3004  → IGNIS (HTTPS + WebSocket) - Build engine
├── 24678 → HMR WebSocket - Hot module reload
└── 6443  → Kubernetes API - Control plane

HELOS COMPUTE (192.168.86.115)
├── 3001  → SLATE (HTTPS) - Design system
├── 3003  → SPARK (HTTPS + WebSocket) - AI generation
├── 3005  → WAYPOINT (HTTPS) - Deployment
└── 6443  → Kubernetes API - Worker node

SYNOLOGY NAS PRIMARY - SBX01 (192.168.86.27)
├── 5432  → PostgreSQL - Primary database
├── 6379  → Redis - Cache & sessions
├── 4222  → NATS - Message bus
└── 5000  → Container Registry - Docker images

SYNOLOGY NAS SECONDARY - SBX02 (192.168.86.28)
├── 5432  → PostgreSQL Replica - Database replication
├── 26379 → Redis Sentinel - Cache HA
├── 4222  → NATS Cluster - Message bus replication
└── 5000  → Registry Mirror - Registry backup
```

### Connection String Examples

```bash
# Database Connections
DATABASE_URL=postgresql://wissil_user:***@192.168.86.27:5432/wissil_db
DATABASE_REPLICA_URL=postgresql://wissil_user:***@192.168.86.28:5432/wissil_db

# Cache Connections
REDIS_URL=redis://192.168.86.27:6379/0
REDIS_SENTINEL_URL=redis://192.168.86.28:26379

# Message Bus
NATS_URL=nats://192.168.86.27:4222
NATS_CLUSTER_URL=nats://192.168.86.28:4222

# Container Registry
REGISTRY_URL=https://192.168.86.27:5000
REGISTRY_MIRROR_URL=https://192.168.86.28:5000

# Kubernetes
K8S_CONTROL_API=https://192.168.86.114:6443
K8S_COMPUTE_API=https://192.168.86.115:6443
```

---

## Service Topology & Architecture Diagrams

### Complete System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HELIOS & LUMINERA SYSTEM ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                    Internet
                                       │
                                       │ HTTPS (443)
                                       ▼
                            ┌──────────────────────┐
                            │  Cloudflare CDN      │
                            │  Global Edge         │
                            └──────────┬───────────┘
                                       │
                                       │ HTTPS (443)
                                       ▼
                            ┌──────────────────────┐
                            │ Cloudflare Zero Trust│
                            │  Authentication      │
                            │  nocturnaID OAuth    │
                            └──────────┬───────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │  Helios Control      │      │      │  Helos Compute       │
         │  192.168.86.114      │      │      │  192.168.86.115      │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ LANDING Pod    │  │      │      │  │ SLATE Pod      │  │
         │  │ :3000 (HTTPS)  │  │      │      │  │ :3001 (HTTPS)  │  │
         │  │ Gateway        │  │      │      │  │ Design System  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ IGNITION Pod   │  │      │      │  │ SPARK Pod      │  │
         │  │ :3002 (HTTPS)  │  │      │      │  │ :3003 (HTTPS)  │  │
         │  │ Bootstrap      │  │      │      │  │ AI Generation  │  │
         │  └────────────────┘  │      │      │  │      + WS      │  │
         │                      │      │      │  └────────────────┘  │
         │  ┌────────────────┐  │      │      │                      │
         │  │ IGNIS Pod      │  │      │      │  ┌────────────────┐  │
         │  │ :3004 (HTTPS)  │  │      │      │  │ WAYPOINT Pod   │  │
         │  │ Build Engine   │  │      │      │  │ :3005 (HTTPS)  │  │
         │  │      + WS      │  │      │      │  │ Deployment     │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │                      │
         │  │ HMR WebSocket  │  │      │      │                      │
         │  │ :24678 (WS)    │  │      │      │                      │
         │  └────────────────┘  │      │      │                      │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ K8s API        │  │      │      │  │ K8s API        │  │
         │  │ :6443 (HTTPS)  │  │      │      │  │ :6443 (HTTPS)  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         └──────────┬───────────┘      │      └───────────┬──────────┘
                    │                  │                  │
                    │ Internal Network (192.168.86.0/24) │
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │ Synology NAS        │      │      │ Synology NAS        │
         │ Primary (SBX01)     │      │      │ Secondary (SBX02)   │
         │ 192.168.86.27       │      │      │ 192.168.86.28       │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ PostgreSQL     │  │      │      │  │ PostgreSQL     │  │
         │  │ :5432 (TCP)    │  │      │      │  │ Replica        │  │
         │  │ Primary DB     │  │      │      │  │ :5432 (TCP)    │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ Redis          │  │      │      │  │ Redis Sentinel │  │
         │  │ :6379 (TCP)    │  │      │      │  │ :26379 (TCP)   │  │
         │  │ Cache          │  │      │      │  │ HA Monitoring  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ NATS           │  │      │      │  │ NATS Cluster   │  │
         │  │ :4222 (TCP)    │  │      │      │  │ :4222 (TCP)    │  │
         │  │ Message Bus    │  │      │      │  │ Replication    │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ Container Reg. │  │      │      │  │ Registry Mirror│  │
         │  │ :5000 (HTTPS)  │  │      │      │  │ :5000 (HTTPS)  │  │
         │  │ Docker Images  │  │      │      │  │ Backup/Mirror  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         └──────────────────────┘      │      └──────────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  Persistent Storage │
                            │  Backups & Archives │
                            │  Volume Storage     │
                            └─────────────────────┘
```

### Service Interaction Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SERVICE INTERACTION TOPOLOGY                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   LANDING     │
                    │  (Gateway)    │
                    │ 114:3000      │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌─────▼─────┐       ┌────▼────┐
   │ SLATE   │◄───────►│  SPARK    │◄─────►│ IGNIS   │
   │ Design  │ Tokens  │  AI Gen   │ Build │ HMR     │
   │ System  │         │  MoE      │ Code  │ Server  │
   │115:3001 │         │115:3003   │       │114:3004 │
   └────┬────┘         └─────┬─────┘       └────┬────┘
        │                    │                   │
        │              ┌─────▼─────┐             │
        │              │ IGNITION  │             │
        │              │ Templates │             │
        │              │ 114:3002  │             │
        │              └─────┬─────┘             │
        │                    │                   │
        └────────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   WAYPOINT      │
                    │  Deployment     │
                    │  115:3005       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐      ┌──────▼──────┐
   │PostgreSQL│         │   Redis   │      │    NATS    │
   │ 27:5432  │         │  27:6379  │      │  27:4222   │
   └────┬────┘         └─────┬─────┘      └──────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Container Reg.  │
                    │    27:5000      │
                    └─────────────────┘

Interaction Types:
  ───► Direct API Call (HTTP/HTTPS)
  ◄──► Bidirectional Communication (WebSocket)
  ───► Data Flow (Database/Registry)
  ───► Event Stream (NATS Message Bus)
```

---

## Data Pipelines to Synology Infrastructure

### Complete Data Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              DATA PIPELINES TO SYNOLOGY INFRASTRUCTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

WISSIL APPLICATION LAYER (Helios Control/Compute)
        │
        │ User Actions & Data Operations
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PIPELINE LAYERS                         │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Application Write Path
├── LANDING → User metadata → PostgreSQL (SBX01:5432)
├── SLATE → Design tokens → PostgreSQL (SBX01:5432)
├── SPARK → Component metadata → PostgreSQL (SBX01:5432)
├── IGNITION → Project records → PostgreSQL (SBX01:5432)
├── IGNIS → Build history → PostgreSQL (SBX01:5432)
└── WAYPOINT → Deployment records → PostgreSQL (SBX01:5432)

Layer 2: Cache Layer
├── All Services → Session data → Redis (SBX01:6379)
├── All Services → Build cache → Redis (SBX01:6379)
├── All Services → Token cache → Redis (SBX01:6379)
└── All Services → Rate limiting → Redis (SBX01:6379)

Layer 3: Message Bus
├── All Services → Component events → NATS (SBX01:4222)
├── All Services → Deployment events → NATS (SBX01:4222)
├── All Services → Build events → NATS (SBX01:4222)
└── All Services → Token updates → NATS (SBX01:4222)

Layer 4: Container Registry
├── IGNIS → Build artifacts → Registry (SBX01:5000)
└── WAYPOINT → Docker images → Registry (SBX01:5000)

Layer 5: Replication & Backup (SBX02)
├── PostgreSQL → Streaming replication → SBX02:5432
├── Redis → Sentinel replication → SBX02:26379
├── NATS → Cluster replication → SBX02:4222
└── Registry → Mirror sync → SBX02:5000
```

### Write Path Pipeline (SBX01)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WRITE PATH TO SYNOLOGY (SBX01)                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Action/Request
    │
    ▼
WISSIL Service (Helios 114/115)
    │
    ├───┐
    │   │ 1. Validate Request
    │   │    ├── Check authentication (JWT)
    │   │    └── Validate permissions
    │   │
    │   │ 2. Check Cache (Redis SBX01:6379)
    │   │    ├── Cache Hit? → Return cached data
    │   │    └── Cache Miss? → Continue to database
    │   │
    │   │ 3. Write to Database (PostgreSQL SBX01:5432)
    │   │    ├── Begin transaction
    │   │    ├── Insert/Update data
    │   │    ├── Commit transaction
    │   │    └── Return result
    │   │
    │   │ 4. Update Cache (Redis SBX01:6379)
    │   │    ├── Invalidate related cache keys
    │   │    ├── Store new data with TTL
    │   │    └── Update session data
    │   │
    │   │ 5. Publish Event (NATS SBX01:4222)
    │   │    ├── component.created
    │   │    ├── deployment.started
    │   │    ├── build.completed
    │   │    └── token.updated
    │   │
    │   │ 6. Store Artifacts (Registry SBX01:5000)
    │   │    ├── Docker images (IGNIS builds)
    │   │    ├── Component packages (WAYPOINT)
    │   │    └── Version archives
    │   │
    └───┘
    │
    ▼
Response to User
```

### Read Path Pipeline (SBX01/SBX02)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      READ PATH FROM SYNOLOGY                                 │
└─────────────────────────────────────────────────────────────────────────────┘

User Request
    │
    ▼
WISSIL Service
    │
    ├───┐
    │   │ 1. Check Redis Cache (SBX01:6379)
    │   │    ├── Cache Hit? → Return immediately
    │   │    └── Cache Miss? → Continue to database
    │   │
    │   │ 2. Query Database
    │   │    ├── Read-heavy analytics → SBX02:5432 (Replica)
    │   │    ├── Real-time data → SBX01:5432 (Primary)
    │   │    └── User metadata → SBX01:5432 (Primary)
    │   │
    │   │ 3. Process Results
    │   │    ├── Transform data format
    │   │    ├── Apply business logic
    │   │    └── Format response
    │   │
    │   │ 4. Update Cache (SBX01:6379)
    │   │    ├── Store result with TTL
    │   │    └── Update session cache
    │   │
    └───┘
    │
    ▼
Response to User
```

### Replication Pipeline (SBX01 → SBX02)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              REPLICATION PIPELINE (SBX01 → SBX02)                            │
└─────────────────────────────────────────────────────────────────────────────┘

SBX01 (Primary - 192.168.86.27)
    │
    │ Continuous Replication
    │
    ├──► PostgreSQL Replication
    │    ├── WAL Streaming → SBX02:5432
    │    ├── Hot Standby Mode
    │    └── Replication Lag Monitoring
    │
    ├──► Redis Replication
    │    ├── Redis Sentinel → SBX02:26379
    │    ├── Master-Slave Setup
    │    └── Automatic Failover
    │
    ├──► NATS Clustering
    │    ├── Cluster Connection → SBX02:4222
    │    ├── JetStream Replication
    │    └── Message Replication
    │
    └──► Registry Mirroring
         ├── Image Sync → SBX02:5000
         ├── Scheduled Backups
         └── Version Retention

SBX02 (Secondary/DR - 192.168.86.28)
    │
    ├── PostgreSQL Replica (Read-only)
    ├── Redis Sentinel (Monitoring)
    ├── NATS Cluster Node (Replication)
    └── Registry Mirror (Backup storage)

Failover Scenarios:
├── SBX01 PostgreSQL Down
│   └── Promote SBX02 to Primary
├── SBX01 Redis Down
│   └── Sentinel promotes SBX02
├── SBX01 NATS Down
│   └── SBX02 takes over cluster
└── SBX01 Registry Down
    └── Use SBX02 mirror
```

### Specific Service Data Pipelines

#### SPARK → Synology Pipeline

```
User Prompt (SPARK Interface)
    │
    ▼
SPARK Service (Helos Compute 115:3003)
    │
    ├── 1. Load Design Tokens
    │    └── Query SLATE → Redis Cache (SBX01:6379)
    │
    ├── 2. Generate Component
    │    └── AI MoE Experts Processing
    │
    ├── 3. Save Component Metadata
    │    └── Write to PostgreSQL (SBX01:5432)
    │        ├── Component definition
    │        ├── Version info
    │        └── User association
    │
    ├── 4. Cache Generated Code
    │    └── Store in Redis (SBX01:6379)
    │
    ├── 5. Publish Event
    │    └── NATS (SBX01:4222)
    │        └── "component.generated"
    │
    └── 6. Trigger Build
        └── IGNIS listens to NATS event
```

#### IGNIS → Synology Pipeline

```
Build Request (IGNIS Service)
    │
    ▼
IGNIS Service (Helios Control 114:3004)
    │
    ├── 1. Load Project Metadata
    │    └── PostgreSQL (SBX01:5432)
    │
    ├── 2. Check Build Cache
    │    └── Redis (SBX01:6379)
    │
    ├── 3. Execute Build
    │    ├── TypeScript compilation
    │    ├── Bundle optimization
    │    └── Asset generation
    │
    ├── 4. Store Build Artifacts
    │    └── Container Registry (SBX01:5000)
    │        └── Docker image with version tag
    │
    ├── 5. Save Build History
    │    └── PostgreSQL (SBX01:5432)
    │        ├── Build metadata
    │        ├── Performance metrics
    │        └── Error logs
    │
    ├── 6. Update Build Cache
    │    └── Redis (SBX01:6379)
    │
    └── 7. Publish Build Event
        └── NATS (SBX01:4222)
            └── "build.completed"
```

#### WAYPOINT → Synology Pipeline

```
Deployment Request (WAYPOINT Service)
    │
    ▼
WAYPOINT Service (Helos Compute 115:3005)
    │
    ├── 1. Load Deployment Config
    │    └── PostgreSQL (SBX01:5432)
    │
    ├── 2. Pull Docker Image
    │    └── Container Registry (SBX01:5000)
    │
    ├── 3. Deploy to Kubernetes
    │    └── K8s API (Helios Control 114:6443)
    │
    ├── 4. Record Deployment
    │    └── PostgreSQL (SBX01:5432)
    │        ├── Deployment history
    │        ├── Version tracking
    │        └── Status updates
    │
    ├── 5. Publish Deployment Event
    │    └── NATS (SBX01:4222)
    │        └── "deployment.completed"
    │
    └── 6. Update Deployment Cache
        └── Redis (SBX01:6379)
```

---

## Network Topology Flowcharts

### Complete Network Topology Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPLETE NETWORK TOPOLOGY FLOWCHART                      │
└─────────────────────────────────────────────────────────────────────────────┘

                            START
                              │
                              ▼
                    ┌─────────────────┐
                    │   Internet      │
                    │  (Public)       │
                    └────────┬────────┘
                             │
                             │ HTTPS (443)
                             ▼
                    ┌─────────────────┐
                    │ Cloudflare CDN  │
                    │ Global Edge     │
                    └────────┬────────┘
                             │
                             │ HTTPS (443)
                             ▼
                    ┌─────────────────┐
                    │Cloudflare Zero  │
                    │Trust + nocturnaID│
                    │Authentication   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Helios       │    │ Helos        │    │ Synology NAS │
│ Control      │    │ Compute      │    │ Primary      │
│ 192.168.86.114│    │ 192.168.86.115│    │ 192.168.86.27│
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                    │                    │
       │                    │                    │
       │ Internal Network (192.168.86.0/24)      │
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            │
                            ▼
                  ┌─────────────────┐
                  │ Synology NAS    │
                  │ Secondary (DR)  │
                  │ 192.168.86.28   │
                  └─────────────────┘
                            │
                            ▼
                           END
```

### Service Communication Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVICE COMMUNICATION FLOWCHART                           │
└─────────────────────────────────────────────────────────────────────────────┘

Request Initiated
    │
    ▼
┌─────────────────┐
│ Authentication  │
│ (Zero Trust)    │
└────────┬────────┘
         │
         │ JWT Token
         ▼
┌─────────────────┐
│  Service Router │
│  (LANDING)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Control │ │Compute │
│ Node   │ │ Node   │
└───┬────┘ └───┬────┘
    │          │
    │          │
    ▼          ▼
┌─────────────────┐
│ Data Services   │
│ (Synology)      │
└────────┬────────┘
         │
         ▼
    Response
```

### Data Flow Topology Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW TOPOLOGY FLOWCHART                            │
└─────────────────────────────────────────────────────────────────────────────┘

Application Request
    │
    ▼
┌─────────────────┐
│  Cache Check    │
│  (Redis)        │
└───────┬─────────┘
        │
        ├─── Cache Hit? ────► Return Cached Data
        │
        └─── Cache Miss? ────► Continue
                │
                ▼
        ┌─────────────────┐
        │  Database Query │
        │  (PostgreSQL)   │
        └───────┬─────────┘
                │
                ▼
        ┌─────────────────┐
        │  Process Data   │
        └───────┬─────────┘
                │
                ▼
        ┌─────────────────┐
        │  Update Cache   │
        │  (Redis)        │
        └───────┬─────────┘
                │
                ▼
        ┌─────────────────┐
        │  Publish Event  │
        │  (NATS)         │
        └───────┬─────────┘
                │
                ▼
        ┌─────────────────┐
        │  Store Artifacts│
        │  (Registry)     │
        └───────┬─────────┘
                │
                ▼
            Response
```

---

## System Architecture Mindmaps

### Complete System Architecture Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HELIOS & LUMINERA SYSTEM MINDMAP                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    HELIOS & LUMINERA
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
    HELIOS                            LUMINERA                        SYNOLOGY
  Infrastructure                    Design System                      Data Layer
        │                                 │                                 │
        ├── Control Node                  ├── Design Tokens                ├── SBX01 (Primary)
        │   (192.168.86.114)              │   └── SLATE                    │   ├── PostgreSQL :5432
        │   ├── K8s Master                │                                 │   ├── Redis :6379
        │   ├── LANDING :3000             ├── Component Library            │   ├── NATS :4222
        │   ├── IGNITION :3002            │   └── Standards                │   └── Registry :5000
        │   ├── IGNIS :3004               │                                 │
        │   └── HMR :24678                ├── MCP Tools                    ├── SBX02 (Secondary)
        │                                 │   ├── read_component            │   ├── PG Replica :5432
        │   └── Compute Node              │   └── write_component           │   ├── Redis Sent. :26379
        │       (192.168.86.115)          │                                 │   ├── NATS Cluster :4222
        │       ├── K8s Worker            └── Architecture Patterns        │   └── Registry Mirror :5000
        │       ├── SLATE :3001                                              │
        │       ├── SPARK :3003                                              │
        │       └── WAYPOINT :3005                                           │
        │                                                                     │
        └── WISSIL Stack                                                     │
            ├── LANDING - Gateway                                            │
            ├── SLATE - Design System                                        │
            ├── IGNITION - Bootstrap                                         │
            ├── SPARK - AI Generation                                        │
            ├── IGNIS - Build Engine                                         │
            └── WAYPOINT - Deployment                                        │
```

### Service Dependency Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVICE DEPENDENCY MINDMAP                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                  SERVICES
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
   APPLICATION                    DATA LAYER                  INFRASTRUCTURE
        │                             │                             │
        ├── LANDING                   ├── PostgreSQL                ├── Kubernetes
        │   ├── Needs:                │   ├── Used by: All          │   ├── Control Plane
        │   │   ├── PostgreSQL        │   ├── Primary: SBX01        │   └── Compute Nodes
        │   │   ├── Redis             │   └── Replica: SBX02        │
        │   │   └── NATS              │                             ├── Cloudflare
        │   └── Provides: Gateway     ├── Redis                     │   ├── CDN
        │                             │   ├── Used by: All          │   └── Zero Trust
        │   ├── SLATE                 │   ├── Primary: SBX01        │
        │   │   ├── Needs:            │   └── Sentinel: SBX02       └── Network
        │   │   │   ├── PostgreSQL    │                                 └── 192.168.86.0/24
        │   │   │   └── Redis         ├── NATS
        │   │   └── Provides: Tokens  │   ├── Used by: All
        │                             │   ├── Primary: SBX01
        │   ├── SPARK                 │   └── Cluster: SBX02
        │   │   ├── Needs:            │
        │   │   │   ├── SLATE         ├── Container Registry
        │   │   │   ├── IGNIS         │   ├── Used by: IGNIS, WAYPOINT
        │   │   │   ├── PostgreSQL    │   ├── Primary: SBX01
        │   │   │   └── NATS          │   └── Mirror: SBX02
        │   │   └── Provides: Components
        │                             
        │   ├── IGNIS                 
        │   │   ├── Needs:
        │   │   │   ├── PostgreSQL
        │   │   │   ├── Redis
        │   │   │   ├── NATS
        │   │   │   └── Registry
        │   │   └── Provides: Builds
        │                             
        │   └── WAYPOINT              
        │       ├── Needs:
        │       │   ├── PostgreSQL
        │       │   ├── Registry
        │       │   ├── K8s API
        │       │   └── NATS
        │       └── Provides: Deployments
```

### Data Flow Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW MINDMAP                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                                  DATA FLOW
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
    WRITE PATH                    READ PATH                   REPLICATION
        │                             │                             │
        ├── User Action               ├── User Request              ├── PostgreSQL
        │   │                         │   │                         │   ├── WAL Streaming
        │   ├── Validate              │   ├── Check Cache           │   └── Hot Standby
        │   ├── Process               │   │   └── Redis SBX01       │
        │   ├── Write DB              │   ├── Query Database        ├── Redis
        │   │   └── PostgreSQL        │   │   ├── Primary (SBX01)   │   ├── Master-Slave
        │   ├── Update Cache          │   │   └── Replica (SBX02)   │   └── Sentinel
        │   │   └── Redis             │   ├── Process Results       │
        │   ├── Publish Event         │   └── Return Response       ├── NATS
        │   │   └── NATS              │                             │   ├── Clustering
        │   └── Store Artifacts       │                             │   └── JetStream
        │       └── Registry          │                             │
        │                                                                      │
        └── Services                     └── Cache Update                     └── Registry
            ├── LANDING                     └── Redis                            └── Mirror Sync
            ├── SLATE
            ├── SPARK
            ├── IGNIS
            └── WAYPOINT
```

---

## Service Interaction Flowcharts

### Component Generation Flowchart (SPARK → IGNIS → WAYPOINT)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              COMPONENT GENERATION INTERACTION FLOWCHART                      │
└─────────────────────────────────────────────────────────────────────────────┘

                    START
                      │
                      ▼
            ┌─────────────────┐
            │  User Enters    │
            │  Prompt (SPARK) │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  SPARK Service  │
            │  (115:3003)     │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Load      │ │ Route to  │ │ Generate  │
│ Tokens    │ │ MoE       │ │ Code      │
│ (SLATE)   │ │ Experts   │ │           │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │  Save to DB     │
            │  (SBX01:5432)   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Publish Event  │
            │  (SBX01:4222)   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  IGNIS Builds   │
            │  (114:3004)     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Store Image    │
            │  (SBX01:5000)   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  WAYPOINT       │
            │  Deploys        │
            │  (115:3005)     │
            └────────┬────────┘
                     │
                     ▼
                    END
```

### Authentication Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOWCHART                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    START
                      │
                      ▼
            ┌─────────────────┐
            │  User Requests  │
            │  Resource       │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Cloudflare     │
            │  Zero Trust     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Authenticated? │
            └───┬─────────┬───┘
                │         │
              NO│         │YES
                │         │
                ▼         ▼
        ┌───────────┐ ┌───────────┐
        │ Redirect  │ │  Validate │
        │ to        │ │  JWT Token│
        │ nocturnaID│ │           │
        └─────┬─────┘ └─────┬─────┘
              │             │
              │             ▼
              │     ┌─────────────────┐
              │     │  Check Session  │
              │     │  (Redis)        │
              │     └─────┬───────────┘
              │           │
              │           ▼
              │     ┌─────────────────┐
              │     │  User Data      │
              │     │  (PostgreSQL)   │
              │     └─────┬───────────┘
              │           │
              └───────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Grant Access   │
            └────────┬────────┘
                     │
                     ▼
                    END
```

### Deployment Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT FLOWCHART                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                    START
                      │
                      ▼
            ┌─────────────────┐
            │  User Initiates │
            │  Deployment     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  WAYPOINT       │
            │  Service        │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Load      │ │ Pull      │ │ Create    │
│ Config    │ │ Image     │ │ K8s       │
│ (DB)      │ │ (Registry)│ │ Manifest  │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │  Deploy to K8s  │
            │  (Helios)       │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Health Check   │
            └───┬─────────┬───┘
                │         │
            PASS│         │FAIL
                │         │
                ▼         ▼
        ┌───────────┐ ┌───────────┐
        │ Record    │ │  Rollback │
        │ Success   │ │  & Alert  │
        │ (DB)      │ │           │
        └─────┬─────┘ └─────┬─────┘
              │             │
              └─────┬───────┘
                    │
                    ▼
            ┌─────────────────┐
            │  Publish Event  │
            │  (NATS)         │
            └────────┬────────┘
                     │
                     ▼
                    END
```

---

## Data Flow Diagrams

### Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE DATA FLOW DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────┘

User Input
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WISSIL SERVICE LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ LANDING  │  │  SLATE    │  │  SPARK    │  │ IGNITION  │     │
│  │ (114:3k) │  │ (115:3k1) │  │(115:3k3) │  │ (114:3k2) │     │
│  └────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘     │
│       │              │               │              │           │
│  ┌────▼─────┐  ┌────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐   │
│  │ IGNIS    │  │ WAYPOINT  │  │           │  │           │   │
│  │(114:3k4) │  │(115:3k5)  │  │           │  │           │   │
│  └────┬─────┘  └─────┬─────┘  └───────────┘  └───────────┘   │
└───────┼──────────────┼─────────────────────────────────────────┘
        │              │
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING LAYER (Redis)                         │
│  Primary: 192.168.86.27:6379                                    │
│  Sentinel: 192.168.86.28:26379                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Session      │  │ Build Cache   │  │ Token Cache  │        │
│  │ Storage      │  │               │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
        │              │
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                  │
│  Primary: 192.168.86.27:5432                                    │
│  Replica: 192.168.86.28:5432                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ User Data    │  │ Components   │  │ Deployments   │        │
│  │ Metadata     │  │ Versions     │  │ History       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
        │              │
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MESSAGE BUS (NATS)                            │
│  Primary: 192.168.86.27:4222                                    │
│  Cluster: 192.168.86.28:4222                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Component    │  │ Deployment   │  │ Token        │        │
│  │ Events       │  │ Events       │  │ Updates      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
        │              │
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE LAYER (Container Registry)            │
│  Primary: 192.168.86.27:5000                                    │
│  Mirror: 192.168.86.28:5000                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Docker       │  │ Component    │  │ Build        │        │
│  │ Images       │  │ Packages     │  │ Artifacts    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
        │              │
        │              │
        ▼              ▼
    Response to User
```

### Inter-Service Communication Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTER-SERVICE COMMUNICATION PATTERNS                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. Synchronous API Calls (HTTP/HTTPS)
   ┌──────────┐      HTTP Request      ┌──────────┐
   │ Service A│ ──────────────────────▶│ Service B│
   │          │ ◀────────────────────── │          │
   └──────────┘      HTTP Response      └──────────┘
   
   Example: SPARK → SLATE (Get tokens)
            SLATE → PostgreSQL (Query tokens)

2. Asynchronous Events (NATS)
   ┌──────────┐      Publish Event     ┌──────────┐
   │ Service A│ ──────────────────────▶│   NATS   │
   │          │                         │ (27:4222)│
   └──────────┘                         └─────┬────┘
                                               │
                                               │ Subscribe
                                               ▼
                                          ┌──────────┐
                                          │ Service B│
                                          │          │
                                          └──────────┘
   
   Example: SPARK → NATS → WAYPOINT (Component created event)

3. WebSocket (Real-time)
   ┌──────────┐      WebSocket         ┌──────────┐
   │  Browser │ ◀─────────────────────▶│  IGNIS   │
   │          │      Bidirectional      │(114:24678)│
   └──────────┘      Hot Reload         └──────────┘
   
   Example: Browser ↔ IGNIS (Hot module reload)

4. Database Queries (PostgreSQL)
   ┌──────────┐      SQL Query        ┌──────────┐
   │ Service A│ ──────────────────────▶│PostgreSQL│
   │          │ ◀────────────────────── │ (27:5432)│
   └──────────┘      Result Set        └──────────┘
   
   Example: All services → PostgreSQL (Read/write data)

5. Cache Operations (Redis)
   ┌──────────┐      GET/SET          ┌──────────┐
   │ Service A│ ──────────────────────▶│  Redis   │
   │          │ ◀────────────────────── │ (27:6379)│
   └──────────┘      Cached Data       └──────────┘
   
   Example: All services → Redis (Session/cache)

6. Container Registry (HTTPS)
   ┌──────────┐      Push/Pull        ┌──────────┐
   │  IGNIS   │ ──────────────────────▶│ Registry │
   │ WAYPOINT │ ◀────────────────────── │ (27:5000)│
   └──────────┘      Docker Images     └──────────┘
   
   Example: IGNIS → Registry (Push image)
            WAYPOINT → Registry (Pull image)
```

---

## Security & Network Zones

### Network Security Zones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NETWORK SECURITY ZONES                              │
└─────────────────────────────────────────────────────────────────────────────┘

Zone 0: Public Internet
├── Unrestricted public access
└── Cloudflare CDN protection

Zone 1: Edge Security (DMZ)
├── Cloudflare Zero Trust
│   ├── Authentication gateway
│   ├── WAF (Web Application Firewall)
│   └── DDoS protection
└── Access: HTTPS only (443)

Zone 2: Application Layer
├── Helios Control (192.168.86.114)
│   ├── LANDING (3000)
│   ├── IGNITION (3002)
│   └── IGNIS (3004)
│
├── Helos Compute (192.168.86.115)
│   ├── SLATE (3001)
│   ├── SPARK (3003)
│   └── WAYPOINT (3005)
│
└── Access: Internal network (192.168.86.0/24)
    ├── K8s service mesh
    └── TLS encrypted

Zone 3: Data Layer
├── Synology NAS Primary (192.168.86.27)
│   ├── PostgreSQL (5432)
│   ├── Redis (6379)
│   ├── NATS (4222)
│   └── Container Registry (5000)
│
├── Synology NAS Secondary (192.168.86.28)
│   ├── PostgreSQL Replica (5432)
│   ├── Redis Sentinel (26379)
│   ├── NATS Cluster (4222)
│   └── Registry Mirror (5000)
│
└── Access:
    ├── Database credentials required
    ├── TLS encrypted connections
    └── Network isolation

Zone 4: Storage & Backup
├── Persistent volumes
├── Backup archives
└── Access:
    ├── Encrypted backups
    └── Scheduled sync

Security Policies:
├── Zone 0 → Zone 1: HTTPS only, Cloudflare protection
├── Zone 1 → Zone 2: Zero Trust auth, JWT validation
├── Zone 2 → Zone 3: Database credentials, TLS
├── Zone 3 → Zone 4: Encrypted backups, scheduled sync
└── All zones: Network policies, firewall rules
```

### Security Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY FLOW DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────────┘

External Request
    │
    ▼
┌─────────────────┐
│ Cloudflare CDN  │
│ DDoS Protection │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare Zero │
│ Trust           │
│ Authentication  │
└────────┬────────┘
         │
         │ JWT Token
         ▼
┌─────────────────┐
│  Validate JWT   │
│  (nocturnaID)   │
└────────┬────────┘
         │
         │ Valid Token?
         ├─── NO ───► Reject Request
         │
         └─── YES ───► Continue
                    │
                    ▼
         ┌─────────────────┐
         │  Check Permissions│
         │  (PostgreSQL)    │
         └────────┬────────┘
                  │
                  │ Authorized?
                  ├─── NO ───► Reject Request
                  │
                  └─── YES ───► Grant Access
                             │
                             ▼
                      Allow Request
```

---

## Deployment Architecture

### Complete Deployment Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE DEPLOYMENT ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

Developer/CI/CD
    │
    │ Git Push
    ▼
┌─────────────────┐
│  GitHub         │
│  Repository     │
└────────┬────────┘
         │
         │ Webhook
         ▼
┌─────────────────┐
│  GitHub Actions │
│  CI/CD Pipeline │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Test   │ │ Build  │
│        │ │        │
└───┬────┘ └───┬────┘
    │          │
    └─────┬────┘
          │
          ▼
┌─────────────────┐
│  Build Docker   │
│  Image          │
└────────┬────────┘
         │
         │ Push
         ▼
┌─────────────────┐
│  Container      │
│  Registry       │
│  (SBX01:5000)   │
└────────┬────────┘
         │
         │ Replicate
         ▼
┌─────────────────┐
│  Registry       │
│  Mirror         │
│  (SBX02:5000)   │
└────────┬────────┘
         │
         │ Deploy
         ▼
┌─────────────────┐
│  Kubernetes     │
│  (Helios)       │
└────────┬────────┘
         │
         │ Monitor
         ▼
┌─────────────────┐
│  Health Checks  │
│  & Monitoring   │
└─────────────────┘
```

### Deployment Environments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT ENVIRONMENTS                               │
└─────────────────────────────────────────────────────────────────────────────┘

Development Environment
├── Auto-deploy on push to `develop` branch
├── Hot reload enabled (HMR)
├── Database: SBX01 (Development schema)
└── Access: Internal network only

Staging Environment
├── Manual approval required
├── Production-like configuration
├── Database: SBX01 (Staging schema)
└── Access: Authenticated users only

Production Environment
├── Admin approval required
├── Full production configuration
├── Database: SBX01 (Production schema)
├── Backup: SBX02 replication active
└── Access: Public via Cloudflare CDN
```

---

## Summary

This comprehensive documentation covers the complete **Helios & Luminera** architecture including:

### Infrastructure Components
- **Helios Control Node** (192.168.86.114) - Kubernetes master, control services
- **Helos Compute Node** (192.168.86.115) - Kubernetes worker, application execution
- **Synology NAS Primary** (192.168.86.27) - Primary data services (SBX01)
- **Synology NAS Secondary** (192.168.86.28) - Replica/DR services (SBX02)

### Application Stack
- **6 WISSIL Services** running across Helios infrastructure
- **Luminera Design System** providing design tokens and standards
- **Complete service topology** with all IPs, ports, and protocols

### Data Pipelines
- **Write paths** from all services to Synology SBX01
- **Read paths** with caching strategies
- **Replication pipelines** from SBX01 to SBX02
- **Event-driven architecture** using NATS message bus

### Diagrams & Visualizations
- **System architecture diagrams**
- **Service topology diagrams**
- **Network flowcharts**
- **Data flow diagrams**
- **Security zone diagrams**
- **Deployment flowcharts**
- **System mindmaps**
- **Service dependency graphs**

### Key Features
- **High Availability** - Primary/secondary setup with failover
- **Scalability** - Kubernetes-based horizontal scaling
- **Security** - Multi-layer security with Zero Trust
- **Observability** - Complete monitoring and logging
- **Disaster Recovery** - Automated replication and backups

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**Maintained By:** Helios Infrastructure Team & Luminera Architecture Team  
**Status:** Production Architecture Documentation

