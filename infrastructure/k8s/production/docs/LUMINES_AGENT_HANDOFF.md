# LUMINES AGENT HANDOFF DOCUMENTATION

**Version:** 1.0.0
**Date:** November 29, 2024
**Agent:** Lumines (UI/UX Specialist)
**From:** Luminera (System Architecture Agent)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Information Architecture](#information-architecture)
3. [Authentication & Identity](#authentication--identity)
4. [Network Topology](#network-topology)
5. [Asset Management](#asset-management)
6. [Component Specifications](#component-specifications)
7. [Integration Points](#integration-points)
8. [Deployment Workflow](#deployment-workflow)
9. [MCP Interoperability](#mcp-interoperability)

---

## System Overview

### WISSIL Architecture

**WISSIL** (Workspace, Identity, Spark, Slate, Ignis, Landing) consists of 6 integrated subsystems:

1. **LANDING** - Production landing page (lumenforge.io, port 3000)
2. **WAYPOINT** - Unity Visual Scripting (waypoint.lumenforge.io, port 3006)
3. **SPARK** - IDE Experience (spark.lumenforge.io, port 3000)
4. **SLATE** - Workspace & Identity (slate.lumenforge.io, port 3004)
5. **IGNIS** - API Backend (ignis.lumenforge.io, port 3001)
6. **IGNITION** - Project Bootstrap (ignition.lumenforge.io, port 3005)

### Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + SLATE tokens
- **Components:** React 18 (Server + Client Components)
- **Documentation:** Storybook 8
- **Testing:** Jest + React Testing Library
- **Build:** Vite (development) + Next.js (production)
- **Deployment:** Kubernetes (Helios Control/Compute), Cloudflare Zero Trust
- **Repository:** PxG-Studio/LUMINERA (monorepo structure: apps/{system}/)

---

## Information Architecture

### Sitemap

```
/                       → LANDING (lumenforge.io)
/landing                → Production landing page
/landing/about          → About page ✅
/landing/demo           → Demo page
/landing/projects       → My Projects

/waypoint               → WAYPOINT (waypoint.lumenforge.io)
/waypoint/editor        → Graph Editor
/waypoint/inspector     → Node Inspector
/waypoint/registry      → Node Registry

/spark                  → SPARK (spark.lumenforge.io)
/spark/editor           → Monaco Editor
/spark/dashboard        → Project Dashboard
/spark/projects         → Project List
/spark/terminal         → Terminal
/spark/ai-chat          → AI Assistant

/slate                  → SLATE (slate.lumenforge.io)
/slate/workspace        → Workspace Selector
/slate/identity         → Identity Management
/slate/settings         → User Settings

/ignis                  → IGNIS (ignis.lumenforge.io)
/ignis/api              → API Documentation
/ignis/runtime          → Runtime Engine
/ignis/webcontainer     → WebContainer

/ignition               → IGNITION (ignition.lumenforge.io)
/ignition/bootstrap     → Project Bootstrap
/ignition/templates     → Template Gallery
/ignition/create        → Create Project

/api/auth/login         → Authentication endpoint (api.lumenforge.io)
/api/auth/refresh       → Token refresh
/api/health             → Health check
```

### Component Hierarchy

```
Root Layout
├── Global Styles (globals.css)
├── SLATE Tokens
└── Pages
    ├── Landing
    │   ├── Hero Section
    │   ├── System Cards Grid
    │   └── Features Section
    ├── Slate
    │   ├── Color Systems
    │   ├── Typography Scale
    │   └── Spacing System
    ├── Ignition
    │   ├── Template Selection
    │   ├── Configuration Wizard
    │   └── Setup Process
    ├── Spark
    │   ├── Prompt Input
    │   ├── MoE Experts Display
    │   └── Code Output
    ├── Ignis
    │   ├── Build Metrics
    │   ├── Optimization Settings
    │   └── Build History
    └── Waypoint
        ├── Environment Status
        ├── Deployment History
        └── Version Timeline
```

### Design System Structure

```
SLATE Design Tokens
├── Colors
│   ├── System Colors (landing, slate, ignition, spark, ignis, waypoint)
│   ├── Base Colors (nocturna palette)
│   └── Neutral Scale (50-900)
├── Typography
│   ├── Font Families (sans, mono, display)
│   ├── Font Sizes (xs - 9xl)
│   ├── Font Weights (thin - black)
│   └── Line Heights
├── Spacing (0 - 96, 4px base unit)
├── Border Radius (none - full)
├── Shadows (sm - 2xl, glow effects)
├── Animation (duration, easing)
├── Breakpoints (sm - 2xl)
└── Z-Index (hide - tooltip)
```

---

## Authentication & Identity

### nocturnaID Integration

**Provider:** nocturnaID.org
**Protocol:** OAuth 2.0 + JWT
**Flow:** Authorization Code with PKCE

#### Authentication Endpoints

```
POST /auth/login
  Request:
    {
      "email": "user@nocturna.network",
      "password": "***",
      "mfa_code": "123456"
    }
  Response:
    {
      "access_token": "eyJ...",
      "refresh_token": "eyJ...",
      "expires_in": 3600,
      "user": {
        "id": "user_abc123",
        "email": "user@nocturna.network",
        "roles": ["Designer", "Engineer"]
      }
    }

POST /auth/refresh
  Request:
    {
      "refresh_token": "eyJ..."
    }
  Response:
    {
      "access_token": "eyJ...",
      "expires_in": 3600
    }

GET /auth/verify
  Headers:
    Authorization: Bearer eyJ...
  Response:
    {
      "valid": true,
      "user_id": "user_abc123",
      "roles": ["Designer", "Engineer"],
      "expires_at": "2024-11-29T15:00:00Z"
    }

GET /auth/roles
  Headers:
    Authorization: Bearer eyJ...
  Response:
    {
      "roles": ["Designer", "Engineer"],
      "permissions": [
        "read:components",
        "write:components",
        "deploy:staging"
      ]
    }
```

#### User Roles

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Designer** | Design system management, component preview | SLATE, LANDING |
| **Engineer** | Full development access, staging deployment | All systems except WAYPOINT production |
| **Admin** | Full system access, production deployment | All systems |
| **Agent** | Read-only access for AI agents | Read all, Write via MCP |

#### Authentication Flow

```
1. User visits LANDING
   ↓
2. Redirected to Cloudflare Zero Trust
   ↓
3. Cloudflare validates identity
   ↓
4. User redirected to nocturnaID.org
   ↓
5. User enters credentials + MFA
   ↓
6. nocturnaID issues JWT
   ↓
7. User redirected back to LANDING with token
   ↓
8. Frontend stores token in secure cookie
   ↓
9. All API requests include token in Authorization header
```

#### JWT Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "nocturna_2024"
  },
  "payload": {
    "sub": "user_abc123",
    "email": "user@nocturna.network",
    "roles": ["Designer", "Engineer"],
    "iss": "nocturnaID.org",
    "aud": "wissil.nocturna.network",
    "exp": 1732896000,
    "iat": 1732892400,
    "nbf": 1732892400
  }
}
```

---

## Network Topology

### Infrastructure Layout

```
Internet
    ↓
Cloudflare CDN
    ↓
Cloudflare Zero Trust
    ↓
    ├─→ Helios Control (192.168.86.114)
    │   ├─→ LANDING (port 3000)
    │   ├─→ IGNITION (port 3002)
    │   └─→ IGNIS (port 3004)
    │
    ├─→ Helios Compute (192.168.86.115)
    │   ├─→ SLATE (port 3001)
    │   ├─→ SPARK (port 3003)
    │   └─→ WAYPOINT (port 3005)
    │
    └─→ Synology NAS (192.168.86.27)
        ├─→ PostgreSQL (port 5432)
        ├─→ Redis (port 6379)
        ├─→ NATS (port 4222)
        └─→ Container Registry (port 5000)
```

### IP Addresses & Ports

| Service | IP Address | Port | Protocol | Purpose |
|---------|-----------|------|----------|---------|
| LANDING | 192.168.86.114 | 3000 | HTTPS | Main gateway |
| SLATE | 192.168.86.115 | 3001 | HTTPS | Design system |
| IGNITION | 192.168.86.114 | 3002 | HTTPS | Project init |
| SPARK | 192.168.86.115 | 3003 | HTTPS + WS | AI generation |
| IGNIS | 192.168.86.114 | 3004 | HTTPS + WS | Build server |
| WAYPOINT | 192.168.86.115 | 3005 | HTTPS | Deployment |
| PostgreSQL | 192.168.86.27 | 5432 | TCP | Database |
| Redis | 192.168.86.27 | 6379 | TCP | Cache |
| NATS | 192.168.86.27 | 4222 | TCP | Message bus |
| Registry | 192.168.86.27 | 5000 | HTTPS | Container registry |

### Network Policies

```yaml
# Allow WISSIL systems to communicate
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: wissil-internal
spec:
  podSelector:
    matchLabels:
      app: wissil
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: wissil
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: wissil
    - podSelector:
        matchLabels:
          app: postgres
    - podSelector:
        matchLabels:
          app: redis
```

### Cloudflare Tunnels

```yaml
tunnel: wissil-prod
credentials-file: /etc/cloudflared/cert.json

ingress:
  - hostname: nocturna.network
    service: http://192.168.86.114:3000

  - hostname: slate.nocturna.network
    service: http://192.168.86.115:3001

  - hostname: spark.nocturna.network
    service: http://192.168.86.115:3003
    originRequest:
      noTLSVerify: true

  - service: http_status:404
```

---

## Asset Management

### Component Lifecycle

```
1. Design Phase
   ├─ Create in SLATE
   ├─ Define tokens
   └─ Document in Storybook

2. Development Phase
   ├─ Generate with SPARK
   ├─ Develop locally with IGNIS
   ├─ Test in Storybook
   └─ Visual regression (Chromatic)

3. Review Phase
   ├─ Code review (GitHub)
   ├─ Design review (Storybook)
   ├─ Accessibility audit
   └─ Performance check

4. Publishing Phase
   ├─ Version bump (semantic versioning)
   ├─ Update changelog
   ├─ Publish to registry (WAYPOINT)
   └─ Deploy to environments

5. Maintenance Phase
   ├─ Monitor usage
   ├─ Deprecation warnings
   └─ Version updates
```

### Versioning Strategy

**Semantic Versioning:** MAJOR.MINOR.PATCH

- **MAJOR:** Breaking changes (v1.0.0 → v2.0.0)
- **MINOR:** New features, backward compatible (v1.0.0 → v1.1.0)
- **PATCH:** Bug fixes (v1.0.0 → v1.0.1)

**Pre-release Labels:**
- `alpha`: Early development (v1.0.0-alpha.1)
- `beta`: Feature complete, testing (v1.0.0-beta.1)
- `rc`: Release candidate (v1.0.0-rc.1)

### Publishing Workflow

```bash
# 1. Version bump
$ npm version patch  # or minor, major

# 2. Build component
$ npm run build

# 3. Run tests
$ npm test

# 4. Visual regression
$ npm run chromatic

# 5. Publish to registry
$ waypoint publish --component Button --version 1.2.3

# 6. Deploy to staging
$ waypoint deploy --env staging

# 7. Smoke tests pass? Deploy to production
$ waypoint deploy --env production

# 8. Create Git tag
$ git tag v1.2.3
$ git push --tags
```

---

## Component Specifications

### LANDING (Production Landing Page)

**Purpose:** Main marketing landing page for LumenForge.io
**Domain:** lumenforge.io, www.lumenforge.io
**Location:** Helios Control (192.168.86.114:3000)
**Auth:** Public with Cloudflare Zero Trust + nocturnaID
**Design System:** Luminera (Amber, Cyan, Purple)

**Key Features:**
- Hero section with animated background
- 6 system cards with status indicators
- Feature highlights
- Responsive navigation
- Real-time health monitoring

**Performance Requirements:**
- Initial load: < 1.5s
- Time to Interactive: < 2s
- Lighthouse score: 95+
- Bundle size: < 200 KB

---

### WAYPOINT (Unity Visual Scripting)

**Purpose:** Visual node-based programming for Unity WebGL
**Domain:** waypoint.lumenforge.io
**Location:** Helios Compute (192.168.86.115:3006)
**Auth:** Engineer/Admin role required
**Integration:** NEC (Unity Runtime) for Unity WebGL execution

**Key Features:**
- Color system explorer (6 palettes)
- Typography scale viewer
- Spacing system visualizer
- Token copy-to-clipboard
- Theme switcher (dark/light)

**Token Categories:**
- Colors (60+ tokens)
- Typography (40+ tokens)
- Spacing (48+ tokens)
- Shadows (10+ tokens)
- Animation (8+ tokens)

---

### SPARK (IDE Experience)

**Purpose:** Full-featured IDE with Monaco editor
**Domain:** spark.lumenforge.io
**Location:** Helios Compute (192.168.86.115:3000)
**Auth:** Engineer role required
**Integration:** LUNA (AI Assistant), IGNIS (Code Execution), WebSocket HMR

**Key Features:**
- Template selection (Next.js, Library, API)
- 5-step configuration wizard
- Dependency selection
- Best practices included
- WISSIL integration

**Templates:**
1. Next.js Application
2. Component Library
3. API Service

---

### SLATE (Workspace & Identity)

**Purpose:** Workspace selector and identity management
**Domain:** slate.lumenforge.io
**Location:** Helios Compute (192.168.86.115:3004)
**Auth:** All authenticated users
**Integration:** nocturnaID, Workspace service

**Key Features:**
- Natural language input
- Mixture of Experts (3 specialized AI models)
- Real-time code generation
- Quick example prompts
- MCP integration

**Experts:**
1. Design Expert (SLATE tokens, responsive, a11y)
2. Logic Expert (state management, hooks)
3. Performance Expert (optimization, memoization)

---

### IGNIS (API Backend)

**Purpose:** Runtime engine with WebContainer support
**Domain:** ignis.lumenforge.io
**Location:** Helios Control (192.168.86.114:3001)
**Auth:** Engineer role required
**Integration:** WebContainer API, NPM package registry, Hot module replacement

**Key Features:**
- Hot Module Replacement (<200ms)
- Build metrics dashboard
- 4 optimization strategies
- Build history
- Live preview

**Optimizations:**
1. Tree Shaking (High impact)
2. Code Splitting (High impact)
3. Image Optimization (Medium impact)
4. CSS Purging (Medium impact)

---

### IGNITION (Project Bootstrap)

**Purpose:** Project creation wizard and template gallery
**Domain:** ignition.lumenforge.io, ignite.lumenforge.io
**Location:** Helios Control (192.168.86.114:3005)
**Auth:** Engineer role required
**Integration:** Template service, MCP tools, GitHub integration

**Key Features:**
- 3 environment management (prod, staging, dev)
- Deployment history
- Version timeline
- Health monitoring
- Automated rollback

**Environments:**
1. Production (99.98% uptime)
2. Staging (99.95% uptime)
3. Development (98.50% uptime)

---

## Integration Points

### MCP (Model Context Protocol)

WISSIL integrates with MCP for AI-powered workflows:

**Available Tools:**

#### mcp_luminera_read_component
Read component source code and metadata

```typescript
const result = await mcp.call('mcp_luminera_read_component', {
  component: 'Button',
  includeTests: true,
  includeStories: true,
});

// Returns: { code, tests, stories, metadata }
```

#### mcp_luminera_write_component
Write or update component files

```typescript
await mcp.call('mcp_luminera_write_component', {
  component: 'NewCard',
  code: generatedCode,
  path: 'src/components/NewCard.tsx',
  tests: generatedTests,
  stories: generatedStories,
});
```

#### mcp_vfs_read
Read files from virtual file system

```typescript
const content = await mcp.call('mcp_vfs_read', {
  path: 'package.json',
});
```

#### mcp_vfs_write
Write files to virtual file system

```typescript
await mcp.call('mcp_vfs_write', {
  path: 'src/utils/helper.ts',
  content: helperCode,
});
```

### MoE (Mixture of Experts)

SPARK uses 3 specialized expert models:

1. **Design Expert** - Visual design and styling
2. **Logic Expert** - Business logic and state management
3. **Performance Expert** - Optimization and best practices

**Routing Algorithm:**

```typescript
function routePrompt(prompt: string): Expert[] {
  const analysis = {
    hasVisualKeywords: /button|card|layout|design|color/.test(prompt),
    hasLogicKeywords: /state|hook|api|fetch|form/.test(prompt),
    hasPerformanceKeywords: /optimize|fast|memo|lazy/.test(prompt),
  };

  const experts: Expert[] = [];
  if (analysis.hasVisualKeywords) experts.push(designExpert);
  if (analysis.hasLogicKeywords) experts.push(logicExpert);
  if (analysis.hasPerformanceKeywords) experts.push(performanceExpert);

  // Default: all experts
  return experts.length > 0 ? experts : [designExpert, logicExpert, performanceExpert];
}
```

### Data Pipelines

Component data flows through these systems:

```
Design (Figma/SLATE)
    ↓
Generate (SPARK)
    ↓
Develop (IGNIS)
    ↓
Document (Storybook)
    ↓
Test (Jest + Chromatic)
    ↓
Publish (WAYPOINT)
    ↓
Registry (Synology NAS)
```

### Storage

**PostgreSQL (192.168.86.27:5432)**
- User accounts
- Component metadata
- Deployment history
- Version records

**Redis (192.168.86.27:6379)**
- Session storage
- Build cache
- Rate limiting
- Real-time data

**NATS (192.168.86.27:4222)**
- Inter-service messaging
- Event streaming
- Build notifications
- Deployment events

**Container Registry (192.168.86.27:5000)**
- Component packages
- Docker images
- Build artifacts
- Version archives

---

## Deployment Workflow

### Development → Staging → Production

```yaml
# .github/workflows/deploy.yml
name: WISSIL Deployment
on:
  push:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - uses: vercel/deploy@v1
        with:
          environment: staging

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - uses: cloudflare/pages-action@v1
        with:
          environment: production
          health-check: https://nocturna.network/api/health
```

### Deployment Checklist

Pre-deployment:
- ✅ All tests passing
- ✅ No linter errors
- ✅ Visual regression tests passed
- ✅ Bundle size within limits (<300 KB)
- ✅ Performance benchmarks met (Lighthouse 95+)
- ✅ Security scan clean
- ✅ Changelog updated
- ✅ Version bumped

Post-deployment:
- ✅ Health check passed
- ✅ Smoke tests successful
- ✅ Error monitoring active
- ✅ Performance monitoring active
- ✅ Git tag created
- ✅ Release notes published

### Rollback Procedure

```bash
# Automatic rollback on health check failure
if ! curl --fail https://nocturna.network/api/health; then
  waypoint rollback production --to v1.2.2
  notify slack "#ops" "🚨 Production rollback triggered"
fi

# Manual rollback
$ waypoint rollback production --to v1.2.2 --reason "Critical bug found"
```

---

## MCP Interoperability

### Tool Usage Examples

#### Reading Components

```typescript
// Read Button component
const button = await mcp.readComponent('Button');

console.log(button);
// {
//   code: "export const Button = ({ ... }) => { ... }",
//   tests: "describe('Button', () => { ... })",
//   stories: "export default { title: 'Button' }",
//   metadata: {
//     name: "Button",
//     version: "1.2.0",
//     dependencies: ["react", "clsx"],
//     size: 3200
//   }
// }
```

#### Writing Components

```typescript
// Generate component with SPARK
const generatedCode = await spark.generate('Create a card component');

// Write to file system
await mcp.writeComponent('Card', {
  code: generatedCode.component,
  tests: generatedCode.tests,
  stories: generatedCode.stories,
  path: 'src/components/Card.tsx',
});

// Component is immediately available in IGNIS dev server
```

#### File System Operations

```typescript
// Read configuration
const tsconfig = await mcp.vfs.read('tsconfig.json');

// Update package.json
const pkg = JSON.parse(await mcp.vfs.read('package.json'));
pkg.dependencies['new-package'] = '^1.0.0';
await mcp.vfs.write('package.json', JSON.stringify(pkg, null, 2));
```

### Workflow Integration

Complete AI-powered workflow:

```typescript
// 1. User describes component
const prompt = "Create a responsive data table with sorting";

// 2. SPARK generates component
const generated = await spark.generate(prompt);

// 3. Write to file system
await mcp.writeComponent('DataTable', {
  code: generated.code,
  tests: generated.tests,
  stories: generated.stories,
});

// 4. IGNIS hot-reloads
ignis.hotReload('DataTable');

// 5. Preview in Storybook
storybook.preview('DataTable', 'Default');

// 6. User approves, WAYPOINT deploys
if (userApproves) {
  await waypoint.publish('DataTable', '1.0.0');
  await waypoint.deploy('staging');
}
```

---

## Quick Reference

### Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run storybook              # Start Storybook
npm run storybook:sync-wissil  # Sync stories

# Building
npm run build                  # Build for production
npm run build-storybook        # Build Storybook

# Testing
npm test                       # Run tests
npm run test-storybook         # Test stories
npm run chromatic              # Visual regression

# Deployment
waypoint deploy staging        # Deploy to staging
waypoint deploy production     # Deploy to production
waypoint rollback production   # Rollback production
```

### URLs

| Environment | URL | Status |
|------------|-----|--------|
| Production | https://nocturna.network | ✅ Live |
| Staging | https://staging.nocturna.network | ✅ Live |
| Development | https://dev.nocturna.network | 🟡 Dev |
| Storybook | https://storybook.nocturna.network | ✅ Live |

### Support

**Documentation:** https://docs.nocturna.network
**Repository:** https://github.com/nocturna-network/wissil
**Issues:** https://github.com/nocturna-network/wissil/issues
**Slack:** #wissil-support

---

**End of Handoff Documentation**

This document should provide everything needed to understand and work with the WISSIL system. For questions or clarifications, contact the Lumines or Luminera agents.
