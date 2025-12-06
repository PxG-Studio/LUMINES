# LUMINES - Browser-Based Unity Development IDE

**LUMINES** is a comprehensive Unity development IDE running entirely in the browser.

**WIS2L** (Workspace, Identity, Spark, Slate, Ignis, Landing) is the core framework powering LUMINES.

![WIS2L](https://img.shields.io/badge/WIS2L-v1.0.0-6366F1)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Storybook](https://img.shields.io/badge/Storybook-10.1-FF4785)

---

## Overview

**LUMINES** is the product: A browser-based Unity IDE with visual scripting, AI assistance, and real-time collaboration.

**WIS2L** is the framework: A comprehensive development ecosystem consisting of 6 integrated subsystems:

1. **LANDING** - Main gateway and navigation hub
2. **SLATE** - Design system, token management, and Unity asset management
3. **IGNITION** - Project initialization and scaffolding
4. **SPARK** - AI-powered component generation (MoE + MCP)
5. **IGNIS** - Build pipeline and hot-reload development server
6. **WAYPOINT** - Deployment and version control

---

## SLATE Integration

**SLATE** has been fully integrated into LUMINES, providing:

- ✅ Unity asset management and parsing
- ✅ Asset deconstruction and reconstruction
- ✅ Full code editor with auto-save
- ✅ Runtime execution environment
- ✅ Database integration (PostgreSQL)
- ✅ Real-time collaboration features

See `src/slate/` for SLATE components and `src/lib/database/` for database operations.

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/PxG-Studio/LUMINES.git
cd LUMINES

# Install dependencies
npm install

# Start development server
npm run dev                    # → http://localhost:3000

# Start Storybook
npm run storybook              # → http://localhost:6006
```

### Environment Variables

Create a `.env` file (see `docs/ENV_EXAMPLE.md`):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://192.168.86.27:6379

# NATS
NATS_URL=nats://192.168.86.27:4222

# Authentication
NOCTURNA_JWT_SECRET=your-secret-key
NEXT_PUBLIC_NOCTURNA_ID_URL=https://nocturnaID.org

# SLATE (if using Supabase)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
# Run Next.js dev server
npm run dev                    # → http://localhost:3000

# Run Storybook
npm run storybook              # → http://localhost:6006

# Sync WIS2L stories
npm run storybook:sync-wis2l

# Run tests
npm test                       # Unit tests
npm run test:e2e               # E2E tests
npm run test:coverage          # Coverage report

# Run linter
npm run lint
```

### Building

```bash
# Build for production
npm run build

# Build Storybook
npm run build-storybook

# Preview production build
npm start
```

---

## Project Structure

```
lumines/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── landing/           # Main gateway (Port 3000)
│   │   ├── slate/             # Design system + Unity IDE (Port 3001)
│   │   ├── ignition/          # Project init (Port 3002)
│   │   ├── spark/             # AI generation (Port 3003)
│   │   ├── ignis/             # Build pipeline (Port 3004)
│   │   ├── waypoint/          # Deployment (Port 3005)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root page
│   ├── slate/                 # SLATE Unity IDE components
│   │   ├── components/        # Layout components
│   │   └── modules/           # Feature modules
│   │       └── assets/        # Unity asset management
│   ├── components/            # Shared React components
│   ├── lib/                   # Core libraries
│   │   ├── database/          # Database operations (SLATE)
│   │   ├── cache/             # Redis cache client
│   │   ├── auth/              # Authentication
│   │   └── security/          # Security utilities
│   ├── hooks/                 # React hooks
│   ├── tokens/                # Design tokens
│   └── styles/                # Global styles
├── apps/                       # Turborepo apps
│   ├── web/                   # Main web app
│   └── storybook/             # Storybook app
├── packages/                   # Shared packages
│   ├── ui/                    # UI components
│   ├── tokens/                # Design tokens
│   ├── spark/                 # Spark package
│   └── slate/                 # Slate package
├── .storybook/                # Storybook configuration
├── scripts/                   # Automation scripts
├── infrastructure/            # K8s & deployment configs
└── tests/                     # Test suites
    ├── e2e/                   # E2E tests
    └── performance/           # Performance tests
```

---

## WIS2L Subsystems

### LANDING - Main Gateway
**Port:** 3000 | **Color:** Gold (#FFD700)

Entry point and navigation hub for all WIS2L subsystems.
- System overview with status indicators
- Quick navigation to all systems
- Real-time health monitoring

### SLATE - Design System & Unity IDE
**Port:** 3001 | **Color:** Indigo (#6366F1)

Design token management, theming engine, and Unity asset management.
- 6 color systems (Landing, Slate, Ignition, Spark, Ignis, Waypoint)
- Typography scale (xs - 9xl)
- Spacing system (0 - 96)
- Token explorer with copy-to-clipboard
- Unity asset upload and parsing
- Code editor with auto-save
- Runtime execution environment

### IGNITION - Project Scaffolding
**Port:** 3002 | **Color:** Red (#EF4444)

Project initialization with intelligent templates.
- Next.js Application template
- Component Library template
- API Service template
- 5-step configuration wizard

### SPARK - AI Component Generator
**Port:** 3003 | **Color:** Yellow (#FBBF24)

AI-powered component creation using Mixture of Experts.
- Natural language prompts
- 3 specialized AI experts (Design, Logic, Performance)
- MCP integration for context awareness
- Real-time code generation

### IGNIS - Build Pipeline
**Port:** 3004 | **Color:** Coral (#FF6B35)

Development server with lightning-fast hot-reload.
- Sub-200ms hot module replacement
- Build optimization (tree shaking, code splitting)
- Performance metrics dashboard
- Live preview

### WAYPOINT - Deployment
**Port:** 3005 | **Color:** Green (#10B981)

Version control and deployment automation.
- 3 environment management (Production, Staging, Development)
- Semantic versioning
- Deployment history
- Automated health checks

---

## Technology Stack

- **Framework:** Next.js 14 (App Router) - Primary
- **Build Tool:** Vite (for SLATE components and Storybook)
- **Language:** TypeScript 5.5 (strict mode)
- **Styling:** Tailwind CSS + SLATE tokens
- **Components:** React 18.3
- **Documentation:** Storybook 10.1
- **Testing:** Vitest + Playwright + React Testing Library
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis (ioredis)
- **Messaging:** NATS
- **Deployment:** Cloudflare Pages (prod), Vercel (staging)

---

## Database Operations (SLATE)

See `src/lib/database/README.md` for complete documentation.

**Example: Create a Project**

```typescript
import { useProjects } from '@/hooks/useProjects';

function MyComponent() {
  const { projects, createProject } = useProjects('user-id');

  const handleCreate = async () => {
    await createProject({
      user_id: 'user-id',
      name: 'My Unity Project',
      metadata: { unity_version: '2022.3' }
    });
  };
}
```

**Example: Manage Files**

```typescript
import { useFiles } from '@/hooks/useFiles';

function FileManager({ projectId }: { projectId: string }) {
  const { files, fileTree, createFile } = useFiles(projectId);
  // fileTree is hierarchical, files is flat
}
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run Storybook tests
npm run test-storybook

# Visual regression tests
npm run chromatic          # Chromatic (primary)
npm run percy:storybook   # Percy (cross-browser)
```

---

## Deployment

### Environments

- **Production:** https://lumenforge.io (Cloudflare Pages)
- **Staging:** https://staging.lumenforge.io (Vercel)
- **Development:** https://dev.lumenforge.io (Local)
- **Storybook:** https://storybook.lumenforge.io

### CI/CD

Automated deployment via GitHub Actions:
- **Develop branch** → Staging (auto)
- **Main branch** → Production (manual approval)

---

## Network Topology

```
Cloudflare CDN → Cloudflare Zero Trust
    ↓
    ├─→ Helios Control (192.168.86.114)
    │   ├─→ LANDING (3000)
    │   ├─→ IGNITION (3002)
    │   └─→ IGNIS (3004)
    │
    ├─→ Helios Compute (192.168.86.115)
    │   ├─→ SLATE (3001)
    │   ├─→ SPARK (3003)
    │   └─→ WAYPOINT (3005)
    │
    └─→ Synology NAS (192.168.86.27)
        ├─→ PostgreSQL (5432)
        ├─→ Redis (6379)
        └─→ NATS (4222)
```

---

## Documentation

Comprehensive documentation available in:

- **Documentation Index:** `docs/README.md` - Complete documentation index
- **SLATE Integration:** `SLATE_INTEGRATION_ANALYSIS.md` - Integration details
- **Environment Setup:** `docs/ENV_EXAMPLE.md` - Environment variables
- **Production Runbook:** `docs/PRODUCTION_RUNBOOK.md` - Operations guide
- **Disaster Recovery:** `docs/DISASTER_RECOVERY.md` - DR procedures
- **Security Hardening:** `docs/SECURITY_HARDENING.md` - Security guide
- **Component Docs:** MDX files in each `src/app/*/` folder
- **Storybook:** Auto-generated component documentation

---

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm test`
3. Ensure code quality: `npm run lint`
4. Commit changes: `git commit -m "feat: Add new feature"`
5. Push to branch: `git push origin feature/my-feature`
6. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

---

## License

Proprietary - PxG Studio © 2025

---

## Support

- **Documentation:** https://docs.lumenforge.io
- **Issues:** https://github.com/PxG-Studio/LUMINES/issues

---

**Made for developers, by developers.**
