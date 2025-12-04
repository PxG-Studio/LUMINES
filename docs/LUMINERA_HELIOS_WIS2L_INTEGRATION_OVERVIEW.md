## Luminera / Helios / WIS2L – End‑to‑End Integration (SBX01 / SBX02)

This is a **single‑page, brutally honest view** of how **Luminera (architecture + MCP tools)**, the **Helios** infrastructure, and the **WIS2L/WISSIL application stack** fit together, including **IPs, ports, and data pipelines** to **192.168.86.27 (SBX01)** and **192.168.86.28 (SBX02)**.

> **Reality check / assumptions**
> - SBX01 (192.168.86.27) is already your **Synology NAS** hosting **PostgreSQL, Redis, NATS, and the container registry** – this is confirmed by existing docs.
> - SBX02 (192.168.86.28) is **not yet defined anywhere in the repo**. In this doc it is treated as a **planned/secondary services node** (replica / DR / analytics / cold storage). If that is wrong, adjust the SBX02 roles here first before touching infra.

---

## 1. High‑Level Mindmap

Mindmap of the stack, from **Luminera (control & AI agents)** down to **SBX01/SBX02 storage and messaging**:

```
                         LUMINERA (Architecture + MCP)
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
        Helios Control        Helios Compute        SBX Services
        192.168.86.114        192.168.86.115   192.168.86.27 / .28
             │                     │                     │
   ┌─────────┼─────────┐   ┌───────┼────────┐     ┌──────┼─────────┐
   │         │         │   │       │        │     │      │         │
 LANDING  IGNITION  IGNIS SLATE  SPARK  WAYPOINT  SBX01  SBX02  External
 3000     3002      3004 3001   3003    3005     Core   Replica  Backups
   │         │         │   │       │        │     │      │
   └─────────┴─────────┴───┴───────┴────────┴─────┴──────┴─────────────┐
                                 WIS2L/WISSIL                           │
                   (Workspace, Identity, Spark, Slate, Ignis, Landing)  │
                                                                        │
         ┌───────────────────────────────────────────────────────────────┘
         │  Data Plane:
         │  - App → PostgreSQL @ SBX01 (5432)
         │  - App → Redis @ SBX01 (6379)
         │  - App → NATS @ SBX01 (4222)
         │  - App → Registry @ SBX01 (5000)
         │  - SBX01 → SBX02 (replication/backup/DR, planned)
         └───────────────────────────────────────────────────────────────
```

---

## 2. Concrete IPs, Ports, and Roles

**Application layer (Helios Control / Helios Compute):**

| System    | Node            | IP             | Port | Protocol      | Role                    |
|----------:|-----------------|----------------|------|---------------|-------------------------|
| LANDING   | Helios Control  | 192.168.86.114 | 3000 | HTTPS         | Public gateway / UI     |
| IGNITION  | Helios Control  | 192.168.86.114 | 3002 | HTTPS         | Project bootstrap       |
| IGNIS     | Helios Control  | 192.168.86.114 | 3004 | HTTPS + WS    | Runtime / build engine  |
| SLATE     | Helios Compute  | 192.168.86.115 | 3001 | HTTPS         | Design system / tokens  |
| SPARK     | Helios Compute  | 192.168.86.115 | 3003 | HTTPS + WS    | AI generation (MoE)     |
| WAYPOINT  | Helios Compute  | 192.168.86.115 | 3005 | HTTPS         | Deployments / registry  |

**Core services – SBX01 (Synology NAS, existing):**

| Service         | Hostname | IP             | Port | Protocol | Purpose                         |
|-----------------|----------|----------------|------|---------|---------------------------------|
| PostgreSQL      | SBX01    | 192.168.86.27  | 5432 | TCP     | Primary DB for WIS2L metadata   |
| Redis           | SBX01    | 192.168.86.27  | 6379 | TCP     | Cache, sessions, queues         |
| NATS            | SBX01    | 192.168.86.27  | 4222 | TCP     | Message bus / events            |
| Registry        | SBX01    | 192.168.86.27  | 5000 | HTTPS   | Container + component registry  |

**Secondary / DR / analytics – SBX02 (planned mapping):**

| Service (planned) | Hostname | IP             | Port  | Protocol | Proposed Purpose                     |
|-------------------|----------|----------------|-------|----------|--------------------------------------|
| PostgreSQL‑Replica| SBX02    | 192.168.86.28  | 5432  | TCP      | Hot/warm replica of SBX01 DB        |
| Redis‑Replica     | SBX02    | 192.168.86.28  | 6379  | TCP      | Cache / queue redundancy            |
| NATS Leaf / Jet   | SBX02    | 192.168.86.28  | 4223* | TCP      | Cross‑site messaging / DR           |
| Cold Registry     | SBX02    | 192.168.86.28  | 5001* | HTTPS    | Long‑term artifact storage / mirror |
| Backups           | SBX02    | 192.168.86.28  | 22/445| SSH/SMB  | Off‑box backups from SBX01          |

\*Ports marked `*` are **not defined in code yet** – they are suggested defaults. Adjust to whatever you actually configure in k8s/Helios manifests.

---

## 3. Data Pipelines – WIS2L → SBX01 / SBX02

### 3.1 Write‑path (core pipeline to SBX01)

**Typical flow when a user designs, generates, and deploys a component:**

1. **LANDING / SLATE / SPARK**
   - User signs in via **Cloudflare Zero Trust + nocturnaID**.
   - SPARK prompt + MoE experts generate component code / tests / stories.
   - Frontend or MCP tools call WIS2L APIs authenticated with JWT.

2. **IGNIS (build + runtime)**
   - Receives code from SPARK / MCP:
     - Compiles, bundles, and runs in WebContainer.
     - Publishes build events over **NATS @ SBX01:4222**.
   - Writes build metadata to **PostgreSQL @ SBX01:5432**.
   - Pushes HMR status via WebSockets back to SLATE/SPARK.

3. **WAYPOINT (deploy)**
   - Pulls build artifacts from IGNIS / registry.
   - Writes deployment records and version history to **PostgreSQL @ SBX01**.
   - Pushes deployment events (success/failure) over **NATS**.
   - Publishes images / component versions to **Registry @ SBX01:5000**.

4. **Shared infra (SBX01)**
   - **PostgreSQL** holds:
     - Users, workspaces, components, builds, deployments, audit records.
   - **Redis** backs:
     - Sessions, rate limiting, build queue state, transient MoE outputs.
   - **NATS** carries:
     - Build pipeline events, deployment notifications, system‑health pings.

**Critical URLs & DSNs in current config (already present in other docs):**

```bash
DATABASE_URL=postgresql://user:pass@192.168.86.27:5432/wissil
REDIS_URL=redis://192.168.86.27:6379
NATS_URL=nats://192.168.86.27:4222
REGISTRY_URL=https://192.168.86.27:5000
```

### 3.2 Read‑path and replication to SBX02 (proposed)

To avoid SBX01 being a single ugly bottleneck:

- **PostgreSQL**
  - SBX01 as **primary**.
  - SBX02 as **streaming replica** (hot or warm).
  - WIS2L apps:
    - **Writes** → SBX01 only.
    - **Read‑heavy analytics / dashboards** → optionally point to SBX02.

- **Redis**
  - SBX01 as primary cache.
  - SBX02 as replica / failover node.
  - Keep TTL‑based keys to make a Redis failover survivable.

- **NATS**
  - SBX01 cluster as core.
  - SBX02 can host **leaf node / JetStream** for offline queues and DR.

- **Registry**
  - SBX01 hosts the main registry.
  - SBX02 pulls/pushes as a **mirror** used for:
    - Long‑term retention.
    - Disaster recovery if SBX01 dies.

From a data‑flow point of view:

```
WIS2L Apps (Helios 114/115)
        │
        │ writes / hot traffic
        ▼
   SBX01 (192.168.86.27)
   [Postgres, Redis, NATS, Registry]
        │
        │ replication / backup (async)
        ▼
   SBX02 (192.168.86.28)
   [Replica DB, backup cache, NATS leaf, mirror registry]
```

---

## 4. Helios / WIS2L Network Topology (One‑Glance Diagram)

```
                    Internet
                        │
              Cloudflare CDN + Zero Trust
                        │
        ┌───────────────┼────────────────┐
        │                               │
┌───────▼────────┐               ┌──────▼────────┐
│ Helios Control │               │ Helios Compute│
│ 192.168.86.114 │               │ 192.168.86.115│
├───────────────┬┤               ├──────────────┬┤
│ LANDING :3000 ││               │ SLATE  :3001││
│ IGNITION:3002 ││               │ SPARK  :3003││
│ IGNIS   :3004 ││               │ WAYPOINT:3005││
└───────────────┘│               └──────────────┘│
                 │                               │
                 └──────────────┬────────────────┘
                                │
                      ┌─────────▼─────────┐
                      │   SBX01 (NAS)    │
                      │ 192.168.86.27    │
                      ├──────────────────┤
                      │ PostgreSQL :5432 │
                      │ Redis     :6379  │
                      │ NATS      :4222  │
                      │ Registry  :5000  │
                      └───────────┬──────┘
                                  │
                   replication / backup / DR
                                  │
                      ┌───────────▼─────────┐
                      │    SBX02 (DR)      │
                      │ 192.168.86.28      │
                      ├────────────────────┤
                      │ PG Replica :5432   │
                      │ Redis Rep. :6379   │
                      │ NATS Leaf :4223*   │
                      │ Registry  :5001*   │
                      └────────────────────┘
```

---

## 5. Luminera / Helios / WIS2L Integration (MCP + Control Plane)

### 5.1 Luminera as the “control brain”

**Luminera** here is the **architecture + MCP agent layer** that:

- Reads and writes WIS2L components via MCP tools:
  - `mcp_luminera_read_component`
  - `mcp_luminera_write_component`
  - `mcp_vfs_read` / `mcp_vfs_write`
- Orchestrates workflows:
  - Generate component in **SPARK → build in IGNIS → document in Storybook → deploy via WAYPOINT**.
- Does **not** run on a fixed IP in this diagram – it is assumed to be:
  - Either running locally (your IDE / agent runner).
  - Or as a logical “AI control plane” talking to WIS2L over HTTPS.

Brutal truth: **right now this is mostly an application‑level convention, not a strongly enforced infra boundary** – if you spin multiple agents in parallel without guardrails, they can stomp on each other’s changes in Git and in the registry.

### 5.2 Control‑plane interactions

End‑to‑end MCP‑driven pipeline:

```ts
// 1. Read current component state (Helios → SBX01 via APIs/DB)
const button = await mcp.call('mcp_luminera_read_component', {
  component: 'Button',
  includeTests: true,
  includeStories: true,
});

// 2. Generate/update in SPARK (Helios Compute, port 3003)
const generated = await spark.generate('Refine button for accessibility');

// 3. Write new code back into repo (VFS) and Storybook
await mcp.call('mcp_luminera_write_component', {
  component: 'Button',
  code: generated.code,
  path: 'src/components/Button.tsx',
  tests: generated.tests,
  stories: generated.stories,
});

// 4. IGNIS (3004) rebuilds; metadata & events go to SBX01 (DB + NATS)
// 5. WAYPOINT (3005) deploys; artifacts go via registry on SBX01
```

This path **always terminates on SBX01** today; SBX02 only comes into play if you wire Postgres/Redis/NATS replication and point read‑heavy or DR workloads at it.

---

## 6. Brutal Gaps / Risks and What to Fix First

- **SBX02 is undefined in code and manifests.**
  - This doc assumes it is **DR / replica / analytics**. If you actually intend SBX02 to run **active services** (e.g. separate cluster, QA, or GPU box), you must:
    - Decide whether WIS2L talks to it directly (new IPs/ports in env vars).
    - Or keep it purely infra‑side (replication, backups only).

- **Single‑point‑of‑failure on SBX01.**
  - Right now all DB/cache/messaging/registry traffic targets **192.168.86.27**.
  - Until replication/failover is configured and tested, **any outage on SBX01 takes down the entire WIS2L data plane**, regardless of Helios node health.

- **Mixed port definitions between docs.**
  - Different docs use slightly different port mappings for SLATE/IGNIS/etc.
  - **Pick one canonical matrix** (the tables above or another) and update:
    - k8s manifests
    - Cloudflare tunnel config
    - Quick reference docs
  - Otherwise debugging HMR / Storybook / API connectivity will stay painful.

- **Agent concurrency / MCP safety.**
  - Multiple Luminera‑class agents acting on the same repo + registry **can race**.
  - You currently rely on human discipline + Git history; there is **no lock / lease system** on components or registry entries yet.

Use this page as the **single truth source** for where Helios nodes live, what WIS2L services run where, and how data reaches **SBX01/SBX02**. Adjust IP roles here first whenever the physical topology changes.


