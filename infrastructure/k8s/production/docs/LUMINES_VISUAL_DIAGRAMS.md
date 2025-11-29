# LUMINES VISUAL DIAGRAMS

Visual documentation for WISSIL system architecture, data flows, and component interactions.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        WISSIL ECOSYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────┐
                          │  LANDING │  ← Main Gateway
                          │ (Port 3000)│
                          └─────┬────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
           ┌────▼────┐     ┌───▼────┐     ┌───▼─────┐
           │  SLATE  │     │IGNITION│     │  IGNIS  │
           │(Port3001)│     │(Port3002)│    │(Port3004)│
           │ Design  │     │ Scaffold│     │  Build  │
           │ System  │     │ Projects│     │ Pipeline│
           └────┬────┘     └───┬────┘     └───┬─────┘
                │              │              │
                │         ┌────▼────┐         │
                │         │  SPARK  │         │
                │         │(Port3003)│         │
                │         │   AI    │         │
                │         │Generator│         │
                │         └────┬────┘         │
                │              │              │
                └──────────────┼──────────────┘
                               │
                          ┌────▼─────┐
                          │ WAYPOINT │
                          │(Port3005)│
                          │ Deployment│
                          └──────────┘

         ┌─────────────────────────────────────┐
         │      Shared Infrastructure           │
         ├─────────────────────────────────────┤
         │ PostgreSQL (5432) │ Redis (6379)    │
         │ NATS (4222)       │ Registry (5000) │
         │ Location: Synology NAS (192.168.86.27)│
         └─────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Access WISSIL
     ▼
┌─────────────────┐
│  Cloudflare     │
│  Zero Trust     │
└────┬────────────┘
     │ 2. Identity Check
     ▼
┌─────────────────┐
│  nocturnaID.org │
│  Auth Server    │
└────┬────────────┘
     │ 3. Login + MFA
     │
     ├──────────────────┐
     │ 4. Issue JWT     │
     │ {                │
     │   "sub": "user", │
     │   "roles": [...],│
     │   "exp": 3600    │
     │ }                │
     └──────────────────┤
                        ▼
     ┌──────────────────────────┐
     │   WISSIL Application     │
     ├──────────────────────────┤
     │ 5. Store token (cookie)  │
     │ 6. Include in API calls  │
     │ 7. Token refresh (auto)  │
     └──────────────────────────┘
                ▼
     ┌──────────────────┐
     │  Protected APIs  │
     │  - Components    │
     │  - Deploy        │
     │  - Health        │
     └──────────────────┘
```

---

## Component Development Workflow

```
                   ┌─────────────────┐
                   │   DESIGN PHASE  │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │  SLATE Tokens   │
                   │  Color, Typography│
                   │  Spacing, Effects │
                   └────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
   ┌─────▼─────┐    ┌──────▼──────┐    ┌─────▼─────┐
   │  Manual   │    │   SPARK     │    │ IGNITION  │
   │  Coding   │    │   AI Gen    │    │  Template │
   └─────┬─────┘    └──────┬──────┘    └─────┬─────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                   ┌────────▼────────┐
                   │   IGNIS Dev     │
                   │  Hot Reload     │
                   │  Live Preview   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   Storybook     │
                   │  Visual Review  │
                   │  Interaction    │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │    Testing      │
                   │  Jest + RTL     │
                   │  Chromatic      │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   WAYPOINT      │
                   │  Version & Deploy│
                   │  Staging → Prod │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   Production    │
                   │  nocturna.network│
                   └─────────────────┘
```

---

## Data Flow Between Systems

```
╔══════════════════════════════════════════════════════════╗
║                    DATA FLOW DIAGRAM                      ║
╚══════════════════════════════════════════════════════════╝

  User Input                SPARK AI              SLATE Tokens
      │                        │                        │
      ▼                        ▼                        ▼
┌──────────────────────────────────────────────────────────┐
│                     Component Code                       │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ├────────────┬─────────────┬────────────┐
                   │            │             │            │
            ┌──────▼──────┐ ┌──▼──────┐  ┌───▼────┐  ┌───▼────┐
            │   Source    │ │  Tests  │  │Stories │  │  Docs  │
            │  .tsx file  │ │.test.tsx│  │.stories│  │  .mdx  │
            └──────┬──────┘ └──┬──────┘  └───┬────┘  └───┬────┘
                   │            │             │            │
                   └────────────┼─────────────┼────────────┘
                                │             │
                         ┌──────▼─────────────▼──────┐
                         │     IGNIS Builder         │
                         │  - TypeScript compile     │
                         │  - Bundle optimization    │
                         │  - Asset processing       │
                         └──────┬────────────────────┘
                                │
                         ┌──────▼───────┐
                         │  Build Output│
                         │  dist/ folder│
                         └──────┬───────┘
                                │
                         ┌──────▼────────┐
                         │   WAYPOINT    │
                         │  - Version tag│
                         │  - Registry   │
                         │  - Deploy     │
                         └──────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼───────┐ ┌▼──────────┐ ┌▼──────────┐
            │  Development  │ │  Staging  │ │Production │
            │192.168.86.115 │ │  Vercel   │ │Cloudflare │
            └───────────────┘ └───────────┘ └───────────┘
```

---

## Network Topology Diagram

```
                    ┌─────────────────┐
                    │    Internet     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Cloudflare CDN │
                    │  + Zero Trust   │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
     ┌──────────▼──────────┐ │ ┌─────────▼─────────┐
     │  Helios Control     │ │ │ Helios Compute    │
     │  192.168.86.114     │ │ │ 192.168.86.115    │
     ├─────────────────────┤ │ ├───────────────────┤
     │ LANDING    :3000    │ │ │ SLATE     :3001   │
     │ IGNITION   :3002    │ │ │ SPARK     :3003   │
     │ IGNIS      :3004    │ │ │ WAYPOINT  :3005   │
     └─────────┬───────────┘ │ └─────────┬─────────┘
               │             │           │
               └─────────────┼───────────┘
                             │
                    ┌────────▼────────┐
                    │ Synology NAS    │
                    │ 192.168.86.27   │
                    ├─────────────────┤
                    │ PostgreSQL 5432 │
                    │ Redis      6379 │
                    │ NATS       4222 │
                    │ Registry   5000 │
                    └─────────────────┘

Network Policies:
  ✓ Internal communication allowed
  ✓ External HTTPS only
  ✓ Database access restricted
  ✓ Zero Trust authentication
```

---

## Component Hierarchy Tree

```
WISSIL Components
│
├── Atomic Level
│   ├── Atoms
│   │   ├── Button
│   │   ├── Input
│   │   ├── Badge
│   │   ├── Icon
│   │   └── Spinner
│   │
│   ├── Molecules
│   │   ├── InputGroup (Input + Button)
│   │   ├── Card (Content + Actions)
│   │   ├── Navbar (Logo + Links)
│   │   └── Alert (Icon + Message)
│   │
│   └── Organisms
│       ├── Header (Navbar + Search)
│       ├── Hero (Heading + CTA + Background)
│       ├── DataTable (Headers + Rows + Pagination)
│       └── Modal (Overlay + Content + Actions)
│
├── Template Level
│   ├── WISSILLayout
│   │   ├── Header slot
│   │   ├── Main content
│   │   └── Background effects
│   │
│   ├── DashboardLayout
│   │   ├── Sidebar
│   │   ├── Main panel
│   │   └── Footer
│   │
│   └── AuthLayout
│       ├── Logo
│       ├── Form
│       └── Background
│
└── Page Level
    ├── Landing (Hero + Cards + Features)
    ├── Slate (Tokens + Typography + Spacing)
    ├── Ignition (Templates + Wizard)
    ├── Spark (Prompt + Experts + Output)
    ├── Ignis (Metrics + Optimizations + History)
    └── Waypoint (Environments + Deployments + Versions)
```

---

## WISSIL System Interaction Map

```
                          ┌──────────┐
                          │ LANDING  │
                          │  Entry   │
                          └────┬─────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐            ┌────▼────┐           ┌────▼────┐
   │  SLATE  │◄──────────►│  SPARK  │◄─────────►│ IGNIS   │
   │ Tokens  │   Design   │  AI Gen │   Build   │ HMR     │
   └────┬────┘   System   └────┬────┘   Output  └────┬────┘
        │                      │                      │
        │         ┌────────────┼────────────┐         │
        │         │            │            │         │
        │    ┌────▼────┐  ┌────▼────┐  ┌───▼──┐     │
        │    │IGNITION │  │PostgreSQL│  │Redis │     │
        │    │Templates│  │ Metadata│  │Cache │     │
        │    └────┬────┘  └────┬────┘  └───┬──┘     │
        │         │            │            │         │
        └─────────┼────────────┼────────────┼─────────┘
                  │            │            │
             ┌────▼────────────▼────────────▼──────┐
             │          WAYPOINT                   │
             │     Version Control & Deploy        │
             │  - Registry                         │
             │  - Environments                     │
             │  - Health Monitoring                │
             └─────────────────────────────────────┘

Interactions:
  LANDING ↔ ALL:      Navigation and status
  SLATE → SPARK:      Design tokens for generation
  SLATE → IGNIS:      Theme updates for hot-reload
  SPARK → IGNIS:      Generated code for preview
  IGNITION → SLATE:   Template includes tokens
  IGNIS → WAYPOINT:   Build artifacts for deployment
  ALL → PostgreSQL:   Metadata and state
  ALL → Redis:        Caching and sessions
```

---

## Deployment Pipeline Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                      │
└────────────────────────────────────────────────────────────┘

  Developer
      │
      │ git push
      ▼
┌──────────────┐
│  GitHub      │
│  Repository  │
└──────┬───────┘
       │ webhook
       ▼
┌──────────────────┐
│  GitHub Actions  │
└──────┬───────────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
   ┌───▼────┐  ┌────────┐  ┌──────────┐  ┌──────▼──────┐
   │  Lint  │→ │  Test  │→ │  Build   │→ │   Docker    │
   │ESLint  │  │  Jest  │  │  IGNIS   │  │   Image     │
   └────────┘  └────────┘  └──────────┘  └──────┬──────┘
                                                 │
                                    ┌────────────┼────────────┐
                                    │            │            │
                              ┌─────▼─────┐ ┌───▼────┐ ┌────▼────┐
                              │Development│ │Staging │ │Production│
                              │   Auto    │ │ Manual │ │ Manual  │
                              └─────┬─────┘ └───┬────┘ └────┬────┘
                                    │           │            │
                                    ▼           ▼            ▼
                              ┌───────────────────────────────────┐
                              │       Health Checks              │
                              │  ✓ API responsive                │
                              │  ✓ Database connected            │
                              │  ✓ Redis available               │
                              └───────────────┬───────────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │   Success? ───────┤
                                    │   Yes │ No        │
                                    └───┬───┴───┬───────┘
                                        │       │
                                    ┌───▼───┐   │
                                    │ Done  │   │
                                    └───────┘   │
                                                │
                                        ┌───────▼───────┐
                                        │   ROLLBACK    │
                                        │ Previous Ver. │
                                        └───────────────┘
```

---

## Component Generation Swimlane

```
     User           SPARK          Design Expert    Logic Expert    Performance Expert    IGNIS
      │              │                  │                │                  │              │
      │─────prompt───▶│                 │                │                  │              │
      │              │                  │                │                  │              │
      │              │────analyze───────▶                │                  │              │
      │              │                  │                │                  │              │
      │              │◄────tokens────────                │                  │              │
      │              │                  │                │                  │              │
      │              │────────────────────state logic───▶│                  │              │
      │              │                  │                │                  │              │
      │              │◄──────────────────hooks & state───│                  │              │
      │              │                  │                │                  │              │
      │              │───────────────────────────────────────optimize──────▶│              │
      │              │                  │                │                  │              │
      │              │◄──────────────────────────────────────memo & lazy────│              │
      │              │                  │                │                  │              │
      │────code──────◀───merge──────────│────────────────│──────────────────│              │
      │              │                  │                │                  │              │
      │─────save────────────────────────────────────────────────────────────────────────▶│
      │              │                  │                │                  │              │
      │◄────preview──────────────────────────────────────────────────────────────────────│
      │              │                  │                │                  │              │
      │────approve───▶│                 │                │                  │              │
      │              │                  │                │                  │              │
      │              │────────────────────────────────────────────────────────deploy─────▶│
      │              │                  │                │                  │              │
      │◄────done────────────────────────────────────────────────────────────────────────│
      │              │                  │                │                  │              │
```

---

## SLATE Token Structure Mindmap

```
                          SLATE Tokens
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    ┌───▼───┐             ┌────▼────┐           ┌────▼────┐
    │Colors │             │Typography│           │ Spacing │
    └───┬───┘             └────┬────┘           └────┬────┘
        │                      │                      │
  ┌─────┼─────┐          ┌─────┼─────┐          ┌────┼────┐
  │     │     │          │     │     │          │    │    │
Landing Slate Spark   Family Size Weight    Micro Small Large
Ignition Ignis        Sans   xs    Thin      1-3   4-6   16+
Waypoint              Mono   9xl   Black     (4px) (24px)(64px)
         │
    ┌────┼────┐
    │    │    │
Nocturna Neutral
Dark-Dawn 50-900


           SLATE Tokens (continued)
                  │
       ┌──────────┼──────────┐
       │          │          │
   ┌───▼───┐  ┌───▼───┐  ┌──▼──┐
   │Shadows│  │Border │  │Z-Index│
   └───┬───┘  │Radius │  └───┬──┘
       │      └───┬───┘      │
  ┌────┼────┐     │     ┌────┼────┐
  │    │    │     │     │    │    │
 sm   xl  glow   sm    hide tooltip
(2px)(25px) (lg) (full) (-1) (1070)
System-colored
```

---

**Legend:**

- `│ ─ ┌ └ ┐ ┘ ├ ┤ ┬ ┴ ┼` - ASCII art connectors
- `▼ ▲ ◄ ►` - Direction indicators
- `✓ ✗` - Status indicators (success/failure)
- `◆ ●` - Emphasis markers

---

**End of Visual Diagrams**

These diagrams provide visual documentation for system architecture, workflows, and component interactions within the WISSIL ecosystem.
