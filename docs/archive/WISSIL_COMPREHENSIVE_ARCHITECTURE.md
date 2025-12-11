# WISSIL Comprehensive Architecture Documentation
## Workspace Integrated Subsystem Structuring & Interfacing Layer

**Version:** 2.0.0
**Date:** December 2024
**Framework:** WISSIL (Waypoint, Ignition, Slate, Spark, Ignis, Landing)
**Infrastructure:** Luminera + Helos (Kubernetes Control/Compute)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Infrastructure Overview](#infrastructure-overview)
3. [IP Address & Port Mapping](#ip-address--port-mapping)
4. [System Architecture Diagrams](#system-architecture-diagrams)
5. [User Interaction Flows](#user-interaction-flows)
6. [Swim Lane Diagrams](#swim-lane-diagrams)
7. [Flowcharts](#flowcharts)
8. [Mindmaps](#mindmaps)
9. [Data Flow & Integration](#data-flow--integration)
10. [Network Topology](#network-topology)
11. [Service Dependencies](#service-dependencies)

---

## Executive Summary

WISSIL is a comprehensive 6-subsystem development ecosystem integrated with Luminera (design system) and Helos (Kubernetes infrastructure). The system operates across multiple physical and virtual layers:

- **Frontend Layer:** 6 Next.js applications (Waypoint, Ignition, Slate, Spark, Ignis, Landing)
- **Control Layer:** Helios Control Node (192.168.86.114) - Orchestration & Management
- **Compute Layer:** Helos Compute Node (192.168.86.115) - Execution & Processing
- **Data Layer:** Synology NAS Servers (192.168.86.27, 192.168.86.28) - Storage & Services
- **Network Layer:** Cloudflare CDN + Zero Trust - Security & Distribution

---

## Infrastructure Overview

### Physical Infrastructure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WISSIL INFRASTRUCTURE LAYERS                     │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: Internet & CDN
├── Cloudflare CDN (Global Distribution)
└── Cloudflare Zero Trust (Authentication Gateway)

Layer 2: Kubernetes Control Plane (Helios Control)
├── IP: 192.168.86.114
├── Role: Orchestration, API Gateway, Control Services
└── Services: LANDING, IGNITION, IGNIS

Layer 3: Kubernetes Compute Nodes (Helos Compute)
├── IP: 192.168.86.115
├── Role: Application Execution, Processing
└── Services: SLATE, SPARK, WAYPOINT

Layer 4: Middle Layer / Data Services (Synology NAS)
├── IP: 192.168.86.27 (Primary Data Server)
│   ├── PostgreSQL (Database)
│   ├── Redis (Cache)
│   ├── NATS (Message Bus)
│   └── Container Registry
│
└── IP: 192.168.86.28 (Secondary/Backup Data Server)
    ├── PostgreSQL Replica
    ├── Redis Sentinel
    └── Backup Storage

Layer 5: Storage & Persistence
└── Synology NAS (192.168.86.27, 192.168.86.28)
    └── Persistent Volumes, Backups, Archives
```

---

## IP Address & Port Mapping

### Complete Service Matrix

| Service | IP Address | Port | Protocol | Node Type | Purpose |
|---------|-----------|------|----------|-----------|---------|
| **LANDING** | 192.168.86.114 | 3000 | HTTPS | Helios Control | Main gateway & navigation |
| **SLATE** | 192.168.86.115 | 3001 | HTTPS | Helos Compute | Design system & tokens |
| **IGNITION** | 192.168.86.114 | 3002 | HTTPS | Helios Control | Project scaffolding |
| **SPARK** | 192.168.86.115 | 3003 | HTTPS + WS | Helos Compute | AI component generation |
| **IGNIS** | 192.168.86.114 | 3004 | HTTPS + WS | Helios Control | Build pipeline & HMR |
| **WAYPOINT** | 192.168.86.115 | 3005 | HTTPS | Helos Compute | Deployment & versioning |
| **PostgreSQL** | 192.168.86.27 | 5432 | TCP | Synology NAS | Primary database |
| **PostgreSQL Replica** | 192.168.86.28 | 5432 | TCP | Synology NAS | Database replica |
| **Redis** | 192.168.86.27 | 6379 | TCP | Synology NAS | Cache & sessions |
| **Redis Sentinel** | 192.168.86.28 | 26379 | TCP | Synology NAS | Redis HA |
| **NATS** | 192.168.86.27 | 4222 | TCP | Synology NAS | Message bus |
| **NATS Cluster** | 192.168.86.28 | 4222 | TCP | Synology NAS | Message bus replica |
| **Container Registry** | 192.168.86.27 | 5000 | HTTPS | Synology NAS | Docker images |
| **Registry Mirror** | 192.168.86.28 | 5000 | HTTPS | Synology NAS | Registry backup |
| **HMR WebSocket** | 192.168.86.114 | 24678 | WebSocket | Helios Control | Hot module reload |
| **Kubernetes API** | 192.168.86.114 | 6443 | HTTPS | Helios Control | K8s control plane |
| **Kubernetes API** | 192.168.86.115 | 6443 | HTTPS | Helos Compute | K8s worker API |

### Port Range Summary

```
Helios Control (192.168.86.114):
├── 3000  → LANDING (HTTPS)
├── 3002  → IGNITION (HTTPS)
├── 3004  → IGNIS (HTTPS + WebSocket)
├── 24678 → HMR WebSocket
└── 6443  → Kubernetes API

Helos Compute (192.168.86.115):
├── 3001  → SLATE (HTTPS)
├── 3003  → SPARK (HTTPS + WebSocket)
├── 3005  → WAYPOINT (HTTPS)
└── 6443  → Kubernetes API

Synology NAS Primary (192.168.86.27):
├── 5432  → PostgreSQL
├── 6379  → Redis
├── 4222  → NATS
└── 5000  → Container Registry

Synology NAS Secondary (192.168.86.28):
├── 5432  → PostgreSQL Replica
├── 26379 → Redis Sentinel
├── 4222  → NATS Cluster
└── 5000  → Registry Mirror
```

---

## System Architecture Diagrams

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          WISSIL ECOSYSTEM ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

                                    Internet
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │  Cloudflare CDN      │
                            │  + Zero Trust        │
                            └──────────┬───────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │  Helios Control      │      │      │  Helos Compute       │
         │  192.168.86.114      │      │      │  192.168.86.115      │
         ├──────────────────────┤      │      ├──────────────────────┤
         │ LANDING    :3000     │      │      │ SLATE     :3001      │
         │ IGNITION   :3002     │      │      │ SPARK     :3003      │
         │ IGNIS      :3004     │      │      │ WAYPOINT  :3005      │
         │ HMR WS     :24678    │      │      │                      │
         │ K8s API    :6443     │      │      │ K8s API    :6443     │
         └──────────┬───────────┘      │      └───────────┬──────────┘
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │ Synology NAS        │      │      │ Synology NAS        │
         │ Primary             │      │      │ Secondary           │
         │ 192.168.86.27       │      │      │ 192.168.86.28       │
         ├─────────────────────┤      │      ├─────────────────────┤
         │ PostgreSQL  :5432   │      │      │ PostgreSQL  :5432   │
         │ Redis        :6379   │      │      │ Redis Sentinel      │
         │ NATS         :4222   │      │      │ NATS Cluster :4222  │
         │ Registry     :5000   │      │      │ Registry     :5000   │
         └─────────────────────┘      │      └─────────────────────┘
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  Persistent Storage │
                            │  Backups & Archives │
                            └─────────────────────┘
```

### Service Interaction Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WISSIL SERVICE INTERACTION MAP                         │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   LANDING     │
                    │  (Gateway)    │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐         ┌─────▼─────┐       ┌────▼────┐
   │ SLATE   │◄───────►│  SPARK    │◄─────►│ IGNIS   │
   │ Design  │  Tokens │  AI Gen   │ Build │ HMR     │
   │ System  │         │  MoE      │ Code  │ Server  │
   └────┬────┘         └─────┬─────┘       └────┬────┘
        │                    │                   │
        │              ┌─────▼─────┐             │
        │              │ IGNITION  │             │
        │              │ Templates │             │
        │              └─────┬─────┘             │
        │                    │                   │
        └────────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   WAYPOINT      │
                    │  Deployment     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐      ┌──────▼──────┐
   │PostgreSQL│         │   Redis   │      │    NATS    │
   │  :5432   │         │   :6379   │      │   :4222    │
   └────┬────┘         └─────┬─────┘      └──────┬──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Container Reg.  │
                    │     :5000       │
                    └─────────────────┘

Interaction Types:
  ───► Direct API Call
  ◄──► Bidirectional Communication
  ───► Data Flow
  ───► Event Stream
```

---

## User Interaction Flows

### 1. Landing Page Access Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE USER INTERACTION                     │
└─────────────────────────────────────────────────────────────────────┘

User Browser
    │
    │ 1. GET https://lumenforge.io
    ▼
Cloudflare CDN
    │
    │ 2. Route to Zero Trust
    ▼
Cloudflare Zero Trust
    │
    │ 3. Authenticate User
    ▼
nocturnaID.org
    │
    │ 4. Login + MFA
    │
    │ 5. Issue JWT Token
    ▼
Helios Control (192.168.86.114:3000)
    │
    │ 6. LANDING Service
    │    ├── Validate JWT
    │    ├── Load System Status
    │    │   ├── Query Redis (192.168.86.27:6379) for cache
    │    │   ├── Query PostgreSQL (192.168.86.27:5432) for metadata
    │    │   └── Publish status to NATS (192.168.86.27:4222)
    │    └── Render Landing Page
    │
    │ 7. Response with HTML + System Cards
    ▼
User Browser
    │
    │ 8. Display Landing Page
    │    ├── Hero Section
    │    ├── 6 System Cards (Waypoint, Ignition, Slate, Spark, Ignis, Landing)
    │    └── Real-time Health Indicators
    │
    │ 9. User Clicks System Card (e.g., SPARK)
    │
    │ 10. Navigate to https://spark.lumenforge.io
    ▼
Helos Compute (192.168.86.115:3003)
    │
    │ 11. SPARK Service
    └──► Continue to SPARK Interaction Flow
```

### 2. SPARK AI Component Generation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                  SPARK AI GENERATION USER INTERACTION                │
└─────────────────────────────────────────────────────────────────────┘

User (SPARK Interface)
    │
    │ 1. Enter Prompt: "Create a responsive card component"
    ▼
SPARK Service (192.168.86.115:3003)
    │
    │ 2. Analyze Prompt
    │    ├── Extract keywords
    │    ├── Determine expert routing
    │    └── Load context from SLATE tokens
    │
    │ 3. Query SLATE Service (192.168.86.115:3001)
    │    └── GET /api/tokens/colors
    │    └── GET /api/tokens/typography
    ▼
SLATE Service
    │
    │ 4. Return Design Tokens
    │    └── Color palette, typography scale, spacing
    ▼
SPARK Service
    │
    │ 5. Route to MoE Experts
    │    ├── Design Expert → Visual design & SLATE tokens
    │    ├── Logic Expert → State management & hooks
    │    └── Performance Expert → Optimization & memoization
    │
    │ 6. Generate Component Code
    │    ├── Component (.tsx)
    │    ├── Tests (.test.tsx)
    │    └── Stories (.stories.tsx)
    │
    │ 7. Send to IGNIS for Preview (192.168.86.114:3004)
    │    └── POST /api/preview
    ▼
IGNIS Service
    │
    │ 8. Build & Hot Reload
    │    ├── TypeScript compilation
    │    ├── Bundle optimization
    │    └── WebSocket notification (24678)
    │
    │ 9. Return Preview URL
    ▼
SPARK Service
    │
    │ 10. Display Generated Code + Preview
    │     ├── Code Editor (Monaco)
    │     ├── Live Preview (iframe)
    │     └── Save/Edit Options
    ▼
User
    │
    │ 11. Review & Approve
    │
    │ 12. Click "Save Component"
    │
    │ 13. POST /api/components/save
    ▼
SPARK Service
    │
    │ 14. Save to PostgreSQL (192.168.86.27:5432)
    │     ├── Component metadata
    │     ├── Version info
    │     └── User association
    │
    │ 15. Publish Event to NATS (192.168.86.27:4222)
    │     └── "component.created"
    ▼
WAYPOINT Service (192.168.86.115:3005)
    │
    │ 16. Listen to NATS event
    │     └── Update component registry
    ▼
User
    │
    │ 17. Component Available in IGNIS & Storybook
```

### 3. IGNITION Project Creation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              IGNITION PROJECT CREATION USER INTERACTION               │
└─────────────────────────────────────────────────────────────────────┘

User (IGNITION Interface)
    │
    │ 1. Click "Create New Project"
    ▼
IGNITION Service (192.168.86.114:3002)
    │
    │ 2. Load Template Gallery
    │    ├── Query PostgreSQL (192.168.86.27:5432) for templates
    │    └── Cache in Redis (192.168.86.27:6379)
    │
    │ 3. Display Templates
    │    ├── Next.js Application
    │    ├── Component Library
    │    └── API Service
    ▼
User
    │
    │ 4. Select Template: "Next.js Application"
    │
    │ 5. Configuration Wizard (5 Steps)
    │    ├── Step 1: Project Name & Description
    │    ├── Step 2: Dependencies Selection
    │    ├── Step 3: SLATE Token Integration
    │    ├── Step 4: GitHub Repository Setup
    │    └── Step 5: Initial Deployment Target
    ▼
IGNITION Service
    │
    │ 6. Generate Project Structure
    │    ├── File system scaffolding
    │    ├── Package.json configuration
    │    ├── TypeScript config
    │    ├── Tailwind + SLATE integration
    │    └── GitHub Actions CI/CD
    │
    │ 7. Create GitHub Repository (via API)
    │
    │ 8. Push Initial Commit
    │
    │ 9. Register in PostgreSQL (192.168.86.27:5432)
    │    ├── Project metadata
    │    ├── User association
    │    └── Deployment config
    │
    │ 10. Publish Event to NATS (192.168.86.27:4222)
    │     └── "project.created"
    ▼
WAYPOINT Service
    │
    │ 11. Listen to Event
    │     └── Initialize deployment pipeline
    ▼
IGNIS Service
    │
    │ 12. Setup Development Environment
    │     ├── WebContainer initialization
    │     └── Hot reload configuration
    ▼
User
    │
    │ 13. Project Ready
    │     ├── GitHub repo created
    │     ├── Local dev environment
    │     └── Deploy to staging option
```

### 4. IGNIS Build & Hot Reload Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              IGNIS BUILD PIPELINE USER INTERACTION                   │
└─────────────────────────────────────────────────────────────────────┘

User (IGNIS Interface)
    │
    │ 1. Open Project in IGNIS
    ▼
IGNIS Service (192.168.86.114:3004)
    │
    │ 2. Load Project from PostgreSQL (192.168.86.27:5432)
    │
    │ 3. Initialize WebContainer
    │    ├── File system mount
    │    ├── NPM package installation
    │    └── Development server start
    │
    │ 4. Establish WebSocket Connection (24678)
    │    └── Hot Module Replacement channel
    ▼
User
    │
    │ 5. Edit Component File
    │    └── Save changes
    ▼
IGNIS Service
    │
    │ 6. File System Watcher Detects Change
    │
    │ 7. Build Pipeline
    │    ├── TypeScript compilation
    │    ├── Tree shaking
    │    ├── Code splitting
    │    ├── CSS purging
    │    └── Image optimization
    │
    │ 8. Build Metrics
    │    ├── Bundle size
    │    ├── Build time
    │    ├── Optimization impact
    │    └── Store in Redis (192.168.86.27:6379)
    │
    │ 9. Hot Reload (<200ms)
    │    ├── WebSocket notification (24678)
    │    └── Browser auto-refresh
    │
    │ 10. Update Build History
    │     └── PostgreSQL (192.168.86.27:5432)
    ▼
User Browser
    │
    │ 11. See Changes Instantly
    │     └── Live preview updated
    │
    │ 12. View Build Metrics Dashboard
    │     ├── Performance graphs
    │     ├── Optimization suggestions
    │     └── Build history timeline
```

### 5. WAYPOINT Deployment Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              WAYPOINT DEPLOYMENT USER INTERACTION                    │
└─────────────────────────────────────────────────────────────────────┘

User (WAYPOINT Interface)
    │
    │ 1. Select Project for Deployment
    ▼
WAYPOINT Service (192.168.86.115:3005)
    │
    │ 2. Load Project Metadata
    │    └── PostgreSQL (192.168.86.27:5432)
    │
    │ 3. Display Environments
    │    ├── Development (Auto-deploy)
    │    ├── Staging (Manual approval)
    │    └── Production (Admin approval)
    ▼
User
    │
    │ 4. Select Environment: "Staging"
    │
    │ 5. Review Deployment Config
    │    ├── Version tag
    │    ├── Build artifacts
    │    └── Health check endpoints
    │
    │ 6. Click "Deploy to Staging"
    ▼
WAYPOINT Service
    │
    │ 7. Build Docker Image
    │    ├── Pull from IGNIS build output
    │    ├── Create container image
    │    └── Tag with version
    │
    │ 8. Push to Container Registry
    │    └── POST to 192.168.86.27:5000
    ▼
Container Registry (192.168.86.27:5000)
    │
    │ 9. Store Image
    │    └── Replicate to 192.168.86.28:5000 (backup)
    ▼
WAYPOINT Service
    │
    │ 10. Deploy to Kubernetes
    │     ├── Create Deployment manifest
    │     ├── Apply to K8s cluster (192.168.86.114:6443)
    │     └── Wait for rollout
    │
    │ 11. Health Check
    │     ├── API endpoint check
    │     ├── Database connectivity
    │     └── Redis availability
    │
    │ 12. Publish Event to NATS (192.168.86.27:4222)
    │     └── "deployment.staging.completed"
    │
    │ 13. Update Deployment History
    │     └── PostgreSQL (192.168.86.27:5432)
    ▼
User
    │
    │ 14. View Deployment Status
    │     ├── Success/Failure
    │     ├── Deployment URL
    │     ├── Version timeline
    │     └── Rollback option
    │
    │ 15. (If Production) Admin Approval Required
    │     └── Additional security checks
```

### 6. SLATE Design System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              SLATE DESIGN SYSTEM USER INTERACTION                     │
└─────────────────────────────────────────────────────────────────────┘

User (SLATE Interface)
    │
    │ 1. Access Design System Explorer
    ▼
SLATE Service (192.168.86.115:3001)
    │
    │ 2. Load Design Tokens
    │    ├── Colors (6 system palettes)
    │    ├── Typography (xs - 9xl)
    │    ├── Spacing (0 - 96, 4px base)
    │    ├── Shadows & Effects
    │    └── Animation tokens
    │
    │ 3. Display Token Explorer
    │    ├── Visual preview
    │    ├── Copy-to-clipboard
    │    └── Usage examples
    ▼
User
    │
    │ 4. Modify Token Value
    │    └── Update color/spacing/etc.
    │
    │ 5. Save Changes
    ▼
SLATE Service
    │
    │ 6. Validate Token
    │    ├── Format check
    │    ├── Dependency validation
    │    └── Breaking change detection
    │
    │ 7. Update Token Store
    │    └── PostgreSQL (192.168.86.27:5432)
    │
    │ 8. Invalidate Cache
    │    └── Redis (192.168.86.27:6379)
    │
    │ 9. Publish Event to NATS (192.168.86.27:4222)
    │    └── "tokens.updated"
    ▼
SPARK Service
    │
    │ 10. Listen to Event
    │     └── Reload token cache
    ▼
IGNIS Service
    │
    │ 11. Hot Reload All Projects
    │     └── WebSocket broadcast (24678)
    ▼
User
    │
    │ 12. See Changes Across All Systems
    │     ├── SPARK generation uses new tokens
    │     ├── IGNIS previews update
    │     └── All components reflect changes
```

---

## Swim Lane Diagrams

### Component Generation Swimlane (SPARK → IGNIS → WAYPOINT)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           COMPONENT GENERATION SWIMLANE (SPARK → IGNIS → WAYPOINT)            │
└─────────────────────────────────────────────────────────────────────────────┘

User        SPARK          SLATE        Design      Logic      Performance    IGNIS        WAYPOINT      PostgreSQL    Redis
            Service        Service      Expert      Expert     Expert         Service      Service       (192.168.      (192.168.
            (115:3003)     (115:3001)                                                      (115:3005)     86.27:5432)   86.27:6379)
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │──prompt──────▶│            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │──get───────▶           │          │              │            │              │             │
            │              │  tokens    │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │◄──tokens───│           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │───────────────────────▶│          │              │            │              │             │
            │              │  design req            │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │◄───────────────────────│          │              │            │              │             │
            │              │  design code           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │───────────────────────────────────▶│              │            │              │             │
            │              │  logic req                          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │◄───────────────────────────────────│              │            │              │             │
            │              │  logic code                         │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │───────────────────────────────────────────────────▶│            │              │             │
            │              │  perf req                                          │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │◄───────────────────────────────────────────────────│            │              │             │
            │              │  perf code                                         │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │──merge─────│───────────│───────────│              │            │              │             │
            │              │  code      │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │◄──code───────│            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │──preview─────▶│            │           │          │              │            │              │             │
            │  request     │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │───────────────────────────────────────────────────────────────▶│            │              │
            │              │  build request                                                  │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │──build────▶│            │              │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │──store─────┼──────────────▶│             │
            │              │            │           │          │              │  metrics   │              │             │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │◄──preview──│            │              │
            │              │            │           │          │              │  URL       │            │              │
            │              │            │           │          │              │            │              │             │
            │              │◄──preview──│           │          │              │            │              │             │
            │              │  URL       │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │◄──preview────│            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │──save───────▶│            │           │          │              │            │              │             │
            │  component  │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │───────────────────────────────────────────────────────────────────────────────▶│             │
            │              │  save metadata                                                                 │             │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │──deploy───────▶│             │
            │              │            │           │          │              │            │  request      │             │
            │              │            │           │          │              │            │              │             │
            │              │            │           │          │              │            │──register─────┼─────────────▶│
            │              │            │           │          │              │            │  component    │             │
            │              │            │           │          │              │            │              │             │
            │◄──success────│            │           │          │              │            │              │             │
            │              │            │           │          │              │            │              │             │
```

### Authentication & Authorization Swimlane

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              AUTHENTICATION & AUTHORIZATION SWIMLANE                          │
└─────────────────────────────────────────────────────────────────────────────┘

User        Browser      Cloudflare    nocturnaID    LANDING      PostgreSQL    Redis
            │            Zero Trust     (Auth)        (114:3000)   (27:5432)     (27:6379)
            │            │              │             │            │             │
            │──GET──────▶│              │             │            │             │
            │  /         │              │             │            │             │
            │            │              │             │            │             │
            │            │──redirect───▶│             │            │             │
            │            │  to auth     │             │            │             │
            │            │              │             │            │             │
            │            │              │──login──────▶│            │             │
            │            │              │  form        │            │             │
            │            │              │             │            │             │
            │            │              │◄──credentials│            │             │
            │            │              │              │            │             │
            │            │              │──validate────┼───────────▶│             │
            │            │              │  user        │            │             │
            │            │              │             │            │             │
            │            │              │◄──user───────┼────────────│             │
            │            │              │  data        │            │             │
            │            │              │             │            │             │
            │            │              │──MFA────────▶│            │             │
            │            │              │  request     │            │             │
            │            │              │             │            │             │
            │            │              │◄──MFA───────│            │             │
            │            │              │  code        │            │             │
            │            │              │             │            │             │
            │            │              │──verify─────┼───────────▶│             │
            │            │              │  MFA         │            │             │
            │            │              │             │            │             │
            │            │              │──issue──────▶│            │             │
            │            │              │  JWT         │            │             │
            │            │              │             │            │             │
            │            │              │◄──JWT────────│            │             │
            │            │              │  token       │            │             │
            │            │              │             │            │             │
            │            │◄──redirect───│              │            │             │
            │            │  with token  │             │            │             │
            │            │              │             │            │             │
            │            │──GET─────────┼──────────────▶│            │             │
            │            │  / + JWT     │             │            │             │
            │            │              │             │            │             │
            │            │              │             │──validate──┼─────────────▶│
            │            │              │             │  JWT        │             │
            │            │              │             │            │             │
            │            │              │             │◄──valid────┼─────────────│
            │            │              │             │  + user     │             │
            │            │              │             │            │             │
            │            │              │             │──store─────┼─────────────▶│
            │            │              │             │  session   │             │
            │            │              │             │            │             │
            │            │◄──HTML───────┼──────────────│            │             │
            │            │  + cookies   │             │            │             │
            │            │              │             │            │             │
            │◄──page─────│              │             │            │             │
            │            │              │             │            │             │
            │──API───────┼──────────────▶│            │             │             │
            │  request   │              │             │            │             │
            │  + JWT     │              │             │            │             │
            │            │              │             │──verify────┼─────────────▶│
            │            │              │             │  token     │             │
            │            │              │             │            │             │
            │            │              │             │◄──valid────┼─────────────│
            │            │              │             │  + roles   │             │
            │            │              │             │            │             │
            │            │◄──response───│             │            │             │
            │            │              │             │            │             │
            │◄──data─────│              │             │            │             │
            │            │              │             │            │             │
```

### Deployment Pipeline Swimlane

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE SWIMLANE                              │
└─────────────────────────────────────────────────────────────────────────────┘

Developer   GitHub      GitHub      WAYPOINT     IGNIS        Container    Kubernetes   PostgreSQL   NATS
            │           Actions     (115:3005)   (114:3004)   Registry     (114:6443)   (27:5432)   (27:4222)
            │           │           │            │            (27:5000)    │            │           │
            │──push─────▶│           │            │            │            │            │           │
            │  code      │           │            │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │──webhook──▶│           │            │            │            │           │
            │            │  trigger  │           │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │──lint──────▶│           │            │            │           │
            │            │           │  request  │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │◄──pass─────│            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │──test─────▶│           │            │            │           │
            │            │           │  request  │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │◄──pass─────│            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │──build─────▶│           │            │            │           │
            │            │           │  request  │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │            │──compile───▶│           │            │           │
            │            │           │            │  TS         │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │            │──optimize──▶│           │            │           │
            │            │           │            │  bundle     │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │            │◄──artifacts│            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │◄──build─────│            │            │            │           │
            │            │           │  output    │            │            │            │           │
            │            │           │            │            │            │            │           │
            │            │           │──docker────┼────────────┼───────────▶│            │           │
            │            │           │  build     │            │  create   │            │           │
            │            │           │            │            │  image     │            │           │
            │            │           │            │            │            │            │           │
            │            │           │            │            │◄──image────│            │           │
            │            │           │            │            │  stored    │            │           │
            │            │           │            │            │            │            │           │
            │            │           │──deploy────┼────────────┼────────────┼───────────▶│           │
            │            │           │  request  │            │            │  apply     │           │
            │            │           │            │            │            │  manifest  │           │
            │            │           │            │            │            │            │           │
            │            │           │            │            │            │──rollout───▶│           │
            │            │           │            │            │            │  pods      │           │
            │            │           │            │            │            │            │           │
            │            │           │            │            │            │◄──ready────│           │
            │            │           │            │            │            │            │           │
            │            │           │──health────┼────────────┼────────────┼────────────┼───────────▶│
            │            │           │  check     │            │            │            │  verify   │
            │            │           │            │            │            │            │           │
            │            │           │            │            │            │            │◄──status───│
            │            │           │            │            │            │            │           │
            │            │           │──record────┼────────────┼────────────┼────────────┼───────────▶│
            │            │           │  history   │            │            │            │  save     │
            │            │           │            │            │            │            │           │
            │            │           │──publish───┼────────────┼────────────┼────────────┼───────────▶│
            │            │           │  event     │            │            │            │  "deploy" │
            │            │           │            │            │            │            │           │
            │            │           │◄──success──│            │            │            │           │
            │            │           │            │            │            │            │           │
            │◄──notify───│           │            │            │            │            │           │
            │            │           │            │            │            │            │           │
```

---

## Flowcharts

### Complete User Journey Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE USER JOURNEY FLOWCHART                        │
└─────────────────────────────────────────────────────────────────────────────┘

                    START
                      │
                      ▼
            ┌─────────────────┐
            │  Access Landing │
            │  (114:3000)     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Cloudflare Auth │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  nocturnaID     │
            │  Login + MFA    │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  JWT Token      │
            │  Issued         │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Landing Page   │
            │  Displayed      │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  SLATE    │ │  SPARK    │ │ IGNITION  │
│ (115:3001)│ │(115:3003) │ │ (114:3002)│
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      │             │             │
      ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ View      │ │ Generate  │ │ Create    │
│ Tokens    │ │ Component │ │ Project   │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      │             │             │
      │             ▼             │
      │     ┌───────────────┐     │
      │     │  IGNIS Build  │     │
      │     │  (114:3004)   │     │
      │     └───────┬───────┘     │
      │             │             │
      │             ▼             │
      │     ┌───────────────┐     │
      │     │  Preview      │     │
      │     │  Hot Reload   │     │
      │     └───────┬───────┘     │
      │             │             │
      └─────────────┼─────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   WAYPOINT    │
            │  (115:3005)   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │   Deploy      │
            │   Project     │
            └───────┬───────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   Dev    │ │ Staging  │ │  Prod    │
│  Env     │ │  Env     │ │  Env     │
└─────┬────┘ └─────┬────┘ └─────┬────┘
      │            │            │
      └────────────┼────────────┘
                   │
                   ▼
            ┌───────────────┐
            │   Monitor     │
            │   Health      │
            └───────┬───────┘
                    │
                    ▼
                   END
```

### Data Flow Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW FLOWCHART                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    User Input
                      │
                      ▼
            ┌─────────────────┐
            │  WISSIL Service │
            │  (Any System)   │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Validate │ │  Process  │ │  Cache    │
│  Input    │ │  Logic    │ │  Check    │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Redis Cache   │
      │             │     │  (27:6379)    │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Cache Hit?   │
      │             │     └───┬───────┬───┘
      │             │         │       │
      │             │      YES│       │NO
      │             │         │       │
      │             │         ▼       ▼
      │             │     ┌───────────────┐
      │             │     │  Return      │
      │             │     │  Cached Data │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Query        │
      │             │     │  PostgreSQL   │
      │             │     │  (27:5432)    │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Store in     │
      │             │     │  Cache        │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Publish      │
      │             │     │  NATS Event   │
      │             │     │  (27:4222)    │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Other       │
      │             │     │  Services    │
      │             │     │  Subscribe   │
      │             │     └───────┬───────┘
      │             │             │
      │             │             ▼
      │             │     ┌───────────────┐
      │             │     │  Response     │
      │             │     │  to User      │
      │             │     └───────┬───────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  User Receives│
            │  Response     │
            └───────────────┘
```

### Error Handling & Rollback Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING & ROLLBACK FLOWCHART                        │
└─────────────────────────────────────────────────────────────────────────────┘

                    Operation
                      │
                      ▼
            ┌─────────────────┐
            │  Execute Action  │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Success?       │
            └───┬─────────┬───┘
                │         │
              YES│         │NO
                │         │
                ▼         ▼
        ┌───────────┐ ┌───────────────┐
        │  Continue │ │  Log Error    │
        │  Process  │ │  (PostgreSQL) │
        └───────────┘ └───────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Error Type?    │
                    └───┬─────────┬───┘
                        │         │
                  Recoverable│   │Critical
                        │         │
                        ▼         ▼
            ┌───────────────┐ ┌───────────────┐
            │  Retry Logic  │ │  Rollback     │
            │  (3 attempts) │ │  Procedure    │
            └───────┬───────┘ └───────┬───────┘
                    │                 │
                    ▼                 ▼
            ┌───────────────┐ ┌───────────────┐
            │  Success?     │ │  Restore      │
            └───┬─────────┬─┘ │  Previous     │
                │         │   │  State        │
              YES│         │NO │  (Registry)   │
                │         │   └───────┬───────┘
                │         │           │
                ▼         ▼           ▼
        ┌───────────┐ ┌───────────────┐
        │  Continue │ │  Notify Admin  │
        │  Process  │ │  (NATS Event)  │
        └───────────┘ └───────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Alert User     │
                    │  (Error Message) │
                    └─────────────────┘
```

---

## Mindmaps

### WISSIL System Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          WISSIL SYSTEM MINDMAP                               │
└─────────────────────────────────────────────────────────────────────────────┘

                                    WISSIL
                                      │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
    FRONTEND                      INFRASTRUCTURE              DATA LAYER
        │                            │                            │
        ├── LANDING                  ├── Helios Control          ├── PostgreSQL
        │   (114:3000)               │   (192.168.86.114)        │   (27:5432)
        │                            │                            │
        ├── SLATE                    │   ├── Kubernetes API      ├── PostgreSQL Replica
        │   (115:3001)               │   │   (6443)              │   (28:5432)
        │                            │                            │
        ├── IGNITION                 │   ├── LANDING Pod         ├── Redis
        │   (114:3002)               │   │   (3000)              │   (27:6379)
        │                            │                            │
        ├── SPARK                    │   ├── IGNITION Pod        ├── Redis Sentinel
        │   (115:3003)               │   │   (3002)              │   (28:26379)
        │                            │                            │
        ├── IGNIS                    │   ├── IGNIS Pod           ├── NATS
        │   (114:3004)               │   │   (3004)              │   (27:4222)
        │                            │                            │
        └── WAYPOINT                 │   └── HMR WebSocket       ├── NATS Cluster
            (115:3005)               │       (24678)             │   (28:4222)
                                     │                            │
                                     ├── Helos Compute           ├── Container Registry
                                     │   (192.168.86.115)         │   (27:5000)
                                     │                            │
                                     │   ├── Kubernetes API      ├── Registry Mirror
                                     │   │   (6443)              │   (28:5000)
                                     │                            │
                                     │   ├── SLATE Pod           └── Backup Storage
                                     │   │   (3001)                  (28)
                                     │
                                     │   ├── SPARK Pod
                                     │   │   (3003)
                                     │
                                     │   └── WAYPOINT Pod
                                     │       (3005)
                                     │
                                     └── Cloudflare
                                         │
                                         ├── CDN
                                         │
                                         └── Zero Trust
```

### User Role & Permission Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    USER ROLE & PERMISSION MINDMAP                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                    USER ROLES
                                      │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
    DESIGNER                      ENGINEER                      ADMIN
        │                            │                            │
        ├── SLATE Access            ├── All Systems              ├── Full Access
        │   ├── View Tokens        │   ├── SPARK                │   ├── All Permissions
        │   ├── Edit Tokens        │   ├── IGNIS                │   ├── Production Deploy
        │   └── Preview            │   ├── IGNITION             │   ├── User Management
        │                          │   └── WAYPOINT (Staging)   │   └── System Config
        │                          │                            │
        ├── LANDING Access         ├── Staging Deploy           ├── Database Access
        │   └── View Only         │   └── Manual Approval      │   └── Direct Queries
        │                          │                            │
        ├── Component Preview     ├── GitHub Integration       ├── Infrastructure
        │   └── Read Only         │   └── Repo Creation         │   └── K8s Management
        │                          │                            │
        └── Storybook Access      ├── Build Management         └── Audit Logs
            └── View Stories      │   └── IGNIS Control            └── Full History
                                  │
                                  └── MCP Integration
                                      └── AI Tools

                                    AGENT ROLE
                                      │
                                  ┌───┴───┐
                                  │       │
                            READ ACCESS  WRITE ACCESS
                                  │       │
                          ┌───────┼───────┼───────┐
                          │       │       │       │
                    Components  Code    MCP     File System
                    Metadata   Read    Tools   Operations
```

### Integration Points Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION POINTS MINDMAP                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                INTEGRATIONS
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
    EXTERNAL                    INTERNAL                  INFRASTRUCTURE
        │                           │                           │
        ├── Cloudflare             ├── WISSIL Services         ├── Kubernetes
        │   ├── CDN                │   ├── LANDING ↔ ALL       │   ├── Control Plane
        │   └── Zero Trust         │   ├── SLATE → SPARK      │   └── Compute Nodes
        │                          │   ├── SPARK → IGNIS      │
        │                          │   ├── IGNIS → WAYPOINT   │
        │                          │   └── IGNITION → SLATE   │
        ├── nocturnaID             │                           │
        │   ├── OAuth 2.0          ├── Data Services          ├── Synology NAS
        │   ├── JWT Tokens         │   ├── PostgreSQL         │   ├── Primary (27)
        │   └── MFA                │   ├── Redis              │   └── Secondary (28)
        │                          │   └── NATS                │
        ├── GitHub                 │                           │
        │   ├── Repository         ├── Message Bus             │
        │   ├── CI/CD              │   ├── Component Events    │
        │   └── Webhooks           │   ├── Deployment Events  │
        │                          │   └── Token Updates       │
        ├── MCP Protocol           │                           │
        │   ├── Component Read     ├── Caching Layer           │
        │   ├── Component Write     │   ├── Session Cache      │
        │   └── File System        │   ├── Build Cache        │
        │                          │   └── Token Cache        │
        └── WebContainer           │                           │
            ├── File System        └── Registry                │
            ├── NPM Packages           └── Container Images     │
            └── Hot Reload                                     │
```

---

## Data Flow & Integration

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
```

### Service Communication Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVICE COMMUNICATION PATTERNS                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. Synchronous API Calls (HTTP/HTTPS)
   ┌──────────┐      HTTP Request      ┌──────────┐
   │ Service A│ ──────────────────────▶│ Service B│
   │          │ ◀────────────────────── │          │
   └──────────┘      HTTP Response      └──────────┘

2. Asynchronous Events (NATS)
   ┌──────────┐      Publish Event     ┌──────────┐
   │ Service A│ ──────────────────────▶│   NATS   │
   │          │                         │  (27:4222)│
   └──────────┘                         └─────┬────┘
                                               │
                                               │ Subscribe
                                               ▼
                                          ┌──────────┐
                                          │ Service B│
                                          │          │
                                          └──────────┘

3. WebSocket (Real-time)
   ┌──────────┐      WebSocket         ┌──────────┐
   │  Browser │ ◀─────────────────────▶│  IGNIS   │
   │          │      Bidirectional      │(114:24678)│
   └──────────┘      Hot Reload         └──────────┘

4. Database Queries (PostgreSQL)
   ┌──────────┐      SQL Query        ┌──────────┐
   │ Service A│ ──────────────────────▶│PostgreSQL│
   │          │ ◀────────────────────── │ (27:5432)│
   └──────────┘      Result Set        └──────────┘

5. Cache Operations (Redis)
   ┌──────────┐      GET/SET          ┌──────────┐
   │ Service A│ ──────────────────────▶│  Redis   │
   │          │ ◀────────────────────── │ (27:6379)│
   └──────────┘      Cached Data       └──────────┘
```

---

## Network Topology

### Complete Network Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE NETWORK TOPOLOGY                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                    Internet
                                       │
                                       │ HTTPS (443)
                                       ▼
                            ┌──────────────────────┐
                            │  Cloudflare CDN       │
                            │  Global Edge Network  │
                            └──────────┬───────────┘
                                       │
                                       │ HTTPS (443)
                                       ▼
                            ┌──────────────────────┐
                            │ Cloudflare Zero Trust│
                            │  Authentication      │
                            │  WAF & DDoS          │
                            └──────────┬───────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │  Helios Control      │      │      │  Helos Compute        │
         │  192.168.86.114      │      │      │  192.168.86.115      │
         │                      │      │      │                      │
         │  Kubernetes Master   │      │      │  Kubernetes Worker    │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ LANDING Pod    │  │      │      │  │ SLATE Pod      │  │
         │  │ :3000 (HTTPS)  │  │      │      │  │ :3001 (HTTPS)  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ IGNITION Pod   │  │      │      │  │ SPARK Pod     │  │
         │  │ :3002 (HTTPS)  │  │      │      │  │ :3003 (HTTPS) │  │
         │  └────────────────┘  │      │      │  │      + WS     │  │
         │                      │      │      │  └────────────────┘  │
         │  ┌────────────────┐  │      │      │                      │
         │  │ IGNIS Pod      │  │      │      │  ┌────────────────┐  │
         │  │ :3004 (HTTPS)  │  │      │      │  │ WAYPOINT Pod   │  │
         │  │      + WS      │  │      │      │  │ :3005 (HTTPS)  │  │
         │  └────────────────┘  │      │      │  └────────────────┘  │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │                      │
         │  │ HMR WebSocket  │  │      │      │                      │
         │  │ :24678 (WS)    │  │      │      │                      │
         │  └────────────────┘  │      │      │                      │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │                      │
         │  │ K8s API        │  │      │      │  ┌────────────────┐  │
         │  │ :6443 (HTTPS)  │  │      │      │  │ K8s API        │  │
         │  └────────────────┘  │      │      │  │ :6443 (HTTPS)  │  │
         │                      │      │      │  └────────────────┘  │
         └──────────┬───────────┘      │      └───────────┬──────────┘
                    │                  │                  │
                    │ Internal Network │                  │
                    │ (192.168.86.0/24)│                  │
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
         ┌──────────▼──────────┐      │      ┌───────────▼──────────┐
         │ Synology NAS        │      │      │ Synology NAS        │
         │ Primary             │      │      │ Secondary           │
         │ 192.168.86.27       │      │      │ 192.168.86.28       │
         │                      │      │      │                      │
         │  ┌────────────────┐  │      │      │  ┌────────────────┐  │
         │  │ PostgreSQL     │  │      │      │  │ PostgreSQL     │  │
         │  │ :5432 (TCP)    │  │      │      │  │ Replica        │  │
         │  └────────────────┘  │      │      │  │ :5432 (TCP)    │  │
         │                      │      │      │  └────────────────┘  │
         │  ┌────────────────┐  │      │      │                      │
         │  │ Redis          │  │      │      │  ┌────────────────┐  │
         │  │ :6379 (TCP)    │  │      │      │  │ Redis Sentinel │  │
         │  └────────────────┘  │      │      │  │ :26379 (TCP)   │  │
         │                      │      │      │  └────────────────┘  │
         │  ┌────────────────┐  │      │      │                      │
         │  │ NATS            │  │      │      │  ┌────────────────┐  │
         │  │ :4222 (TCP)     │  │      │      │  │ NATS Cluster   │  │
         │  └────────────────┘  │      │      │  │ :4222 (TCP)     │  │
         │                      │      │      │  └────────────────┘  │
         │  ┌────────────────┐  │      │      │                      │
         │  │ Container Reg. │  │      │      │  ┌────────────────┐  │
         │  │ :5000 (HTTPS)  │  │      │      │  │ Registry Mirror│  │
         │  └────────────────┘  │      │      │  │ :5000 (HTTPS)  │  │
         │                      │      │      │  └────────────────┘  │
         └──────────────────────┘      │      └──────────────────────┘
                                       │
                                       │
                            ┌──────────▼──────────┐
                            │  Backup Storage     │
                            │  Archives           │
                            │  Persistent Volumes │
                            └─────────────────────┘
```

### Network Security Zones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NETWORK SECURITY ZONES                              │
└─────────────────────────────────────────────────────────────────────────────┘

Zone 1: Public Internet
├── Cloudflare CDN
└── Cloudflare Zero Trust
    └── Authentication Gateway

Zone 2: DMZ (Demilitarized Zone)
├── Cloudflare Tunnels
└── Load Balancers

Zone 3: Application Layer
├── Helios Control (192.168.86.114)
│   ├── LANDING (3000)
│   ├── IGNITION (3002)
│   └── IGNIS (3004)
│
└── Helos Compute (192.168.86.115)
    ├── SLATE (3001)
    ├── SPARK (3003)
    └── WAYPOINT (3005)

Zone 4: Data Layer
├── Synology NAS Primary (192.168.86.27)
│   ├── PostgreSQL (5432)
│   ├── Redis (6379)
│   ├── NATS (4222)
│   └── Container Registry (5000)
│
└── Synology NAS Secondary (192.168.86.28)
    ├── PostgreSQL Replica (5432)
    ├── Redis Sentinel (26379)
    ├── NATS Cluster (4222)
    └── Registry Mirror (5000)

Zone 5: Storage & Backup
└── Persistent Volumes
    └── Backup Archives

Security Policies:
├── Zone 1 → Zone 2: HTTPS only, Zero Trust auth
├── Zone 2 → Zone 3: Internal network, K8s service mesh
├── Zone 3 → Zone 4: Database credentials, TLS
└── Zone 4 → Zone 5: Encrypted backups, scheduled sync
```

---

## Service Dependencies

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE DEPENDENCY GRAPH                            │
└─────────────────────────────────────────────────────────────────────────────┘

LANDING (114:3000)
├── Depends on:
│   ├── PostgreSQL (27:5432) - User metadata, system status
│   ├── Redis (27:6379) - Cache, session storage
│   └── NATS (27:4222) - System health events
│
└── Provides:
    └── Navigation hub for all systems

SLATE (115:3001)
├── Depends on:
│   ├── PostgreSQL (27:5432) - Token storage
│   └── Redis (27:6379) - Token cache
│
└── Provides:
    ├── Design tokens to SPARK
    └── Theme updates to IGNIS

IGNITION (114:3002)
├── Depends on:
│   ├── PostgreSQL (27:5432) - Template metadata, project records
│   ├── GitHub API - Repository creation
│   └── SLATE (115:3001) - Token integration
│
└── Provides:
    └── Project scaffolding

SPARK (115:3003)
├── Depends on:
│   ├── SLATE (115:3001) - Design tokens
│   ├── IGNIS (114:3004) - Preview service
│   ├── PostgreSQL (27:5432) - Component storage
│   └── NATS (27:4222) - Component events
│
└── Provides:
    ├── Generated components to IGNIS
    └── Component metadata to WAYPOINT

IGNIS (114:3004)
├── Depends on:
│   ├── PostgreSQL (27:5432) - Project metadata, build history
│   ├── Redis (27:6379) - Build cache
│   ├── NATS (27:4222) - Build events
│   └── Container Registry (27:5000) - Image storage
│
└── Provides:
    ├── Build artifacts to WAYPOINT
    └── Hot reload to SPARK preview

WAYPOINT (115:3005)
├── Depends on:
│   ├── PostgreSQL (27:5432) - Deployment history
│   ├── Container Registry (27:5000) - Image pull
│   ├── Kubernetes API (114:6443) - Deployment
│   └── NATS (27:4222) - Deployment events
│
└── Provides:
    └── Deployment orchestration

PostgreSQL (27:5432)
├── Primary: 192.168.86.27
├── Replica: 192.168.86.28
└── Used by: All WISSIL services

Redis (27:6379)
├── Primary: 192.168.86.27
├── Sentinel: 192.168.86.28:26379
└── Used by: All WISSIL services

NATS (27:4222)
├── Primary: 192.168.86.27
├── Cluster: 192.168.86.28
└── Used by: All WISSIL services for events

Container Registry (27:5000)
├── Primary: 192.168.86.27
├── Mirror: 192.168.86.28
└── Used by: IGNIS, WAYPOINT
```

### Health Check Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HEALTH CHECK DEPENDENCIES                             │
└─────────────────────────────────────────────────────────────────────────────┘

Service Health Checks:
├── LANDING
│   ├── Self: GET /api/health
│   ├── PostgreSQL: SELECT 1
│   └── Redis: PING
│
├── SLATE
│   ├── Self: GET /api/health
│   ├── PostgreSQL: SELECT 1
│   └── Redis: PING
│
├── IGNITION
│   ├── Self: GET /api/health
│   ├── PostgreSQL: SELECT 1
│   └── GitHub API: GET /user
│
├── SPARK
│   ├── Self: GET /api/health
│   ├── SLATE: GET /api/health
│   ├── IGNIS: GET /api/health
│   └── PostgreSQL: SELECT 1
│
├── IGNIS
│   ├── Self: GET /api/health
│   ├── PostgreSQL: SELECT 1
│   ├── Redis: PING
│   └── Container Registry: GET /v2/
│
└── WAYPOINT
    ├── Self: GET /api/health
    ├── PostgreSQL: SELECT 1
    ├── Container Registry: GET /v2/
    └── Kubernetes API: GET /healthz

Infrastructure Health Checks:
├── PostgreSQL
│   ├── Primary (27:5432): SELECT 1
│   └── Replica (28:5432): SELECT 1, replication lag
│
├── Redis
│   ├── Primary (27:6379): PING
│   └── Sentinel (28:26379): SENTINEL masters
│
├── NATS
│   ├── Primary (27:4222): PING
│   └── Cluster (28:4222): PING, cluster status
│
└── Container Registry
    ├── Primary (27:5000): GET /v2/
    └── Mirror (28:5000): GET /v2/
```

---

## Summary

This comprehensive documentation covers:

1. **Infrastructure Overview**: Complete physical and logical architecture
2. **IP/Port Mapping**: All services with their network addresses
3. **User Interaction Flows**: 6 detailed flows for each major function
4. **Swim Lane Diagrams**: Component generation, authentication, deployment
5. **Flowcharts**: User journey, data flow, error handling
6. **Mindmaps**: System structure, roles, integrations
7. **Network Topology**: Complete network diagram with security zones
8. **Service Dependencies**: Dependency graph and health checks

All systems integrate through:
- **Luminera**: Design system (SLATE tokens)
- **Helos**: Kubernetes infrastructure (Control + Compute nodes)
- **Synology NAS**: Data layer (Primary + Secondary for HA)

The architecture supports high availability, scalability, and comprehensive monitoring across all 6 WISSIL subsystems.

---

**Document Version:** 2.0.0
**Last Updated:** December 2024
**Maintained By:** Luminera Architecture Team
