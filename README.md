# WISSIL - Workspace Integrated Subsystem Structuring & Interfacing Layer

The unified development environment for the Nocturna Network.

![WISSIL](https://img.shields.io/badge/WISSIL-v1.0.0-6366F1)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Storybook](https://img.shields.io/badge/Storybook-8.0-FF4785)

---

## Overview

WISSIL is a comprehensive development ecosystem consisting of 6 integrated subsystems:

1. **LANDING** - Main gateway and navigation hub
2. **SLATE** - Design system and token management
3. **IGNITION** - Project initialization and scaffolding
4. **SPARK** - AI-powered component generation (MoE + MCP)
5. **IGNIS** - Build pipeline and hot-reload development server
6. **WAYPOINT** - Deployment and version control

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/nocturna-network/wissil.git
cd wissil

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### Development

```bash
# Run Next.js dev server
npm run dev                    # → http://localhost:3000

# Run Storybook
npm run storybook              # → http://localhost:6006

# Sync WISSIL stories
npm run storybook:sync-wissil

# Run tests
npm test

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
│   │   ├── slate/             # Design system (Port 3001)
│   │   ├── ignition/          # Project init (Port 3002)
│   │   ├── spark/             # AI generation (Port 3003)
│   │   ├── ignis/             # Build pipeline (Port 3004)
│   │   ├── waypoint/          # Deployment (Port 3005)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root page
│   ├── components/
│   │   └── wissil/
│   │       └── WISSILLayout.tsx
│   ├── tokens/
│   │   └── slate.tokens.ts    # SLATE design tokens
│   └── styles/
│       └── globals.css        # Global styles
├── .storybook/                # Storybook configuration
├── scripts/                   # Automation scripts
├── infrastructure/            # K8s & deployment configs
└── package.json
```

---

## WISSIL Subsystems

### LANDING - Main Gateway
**Port:** 3000 | **Color:** Gold (#FFD700)

Entry point and navigation hub for all WISSIL subsystems.
- System overview with status indicators
- Quick navigation to all systems
- Real-time health monitoring

### SLATE - Design System
**Port:** 3001 | **Color:** Indigo (#6366F1)

Design token management and theming engine.
- 6 color systems (Landing, Slate, Ignition, Spark, Ignis, Waypoint)
- Typography scale (xs - 9xl)
- Spacing system (0 - 96)
- Token explorer with copy-to-clipboard

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

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + SLATE tokens
- **Components:** React 18
- **Documentation:** Storybook 8
- **Testing:** Jest + React Testing Library
- **Build:** Vite (dev) + Next.js (prod)
- **Deployment:** Cloudflare Pages (prod), Vercel (staging)

---

## Design System (SLATE)

### Color Systems

```typescript
// System colors
landing-primary    #FFD700  // Gold
slate-primary      #6366F1  // Indigo
ignition-primary   #EF4444  // Red
spark-primary      #FBBF24  // Yellow
ignis-primary      #FF6B35  // Coral
waypoint-primary   #10B981  // Green

// Base colors
nocturna-dark      #0A0E27  // Background
nocturna-midnight  #1A1F3A  // Surface
```

### Typography

```css
/* Font families */
font-sans: Inter, system-ui, sans-serif
font-mono: JetBrains Mono, monospace
font-display: Space Grotesk, sans-serif

/* Font sizes */
text-xs to text-9xl (12px to 128px)
```

### Usage

```tsx
import { slateTokens } from '@/tokens/slate.tokens';

// In components
<div className="bg-slate-primary text-white">
  <h1 className="text-7xl font-bold text-gradient-landing">
    WISSIL
  </h1>
</div>
```

---

## Storybook

View all components and pages in Storybook:

```bash
npm run storybook
```

Access at: http://localhost:6006

### Story Organization

```
WISSIL/
├── Landing/
│   ├── Main Gateway
│   └── Documentation
├── Slate/
│   ├── Design System
│   └── Documentation
├── Ignition/
│   ├── Project Scaffolding
│   └── Documentation
├── Spark/
│   ├── AI Component Generator
│   └── Documentation
├── Ignis/
│   ├── Build Pipeline
│   └── Documentation
└── Waypoint/
    ├── Deployment
    └── Documentation
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run Storybook tests
npm run test-storybook

# Visual regression tests
npm run chromatic
```

---

## Deployment

### Environments

- **Production:** https://nocturna.network (Cloudflare Pages)
- **Staging:** https://staging.nocturna.network (Vercel)
- **Development:** https://dev.nocturna.network (Local)
- **Storybook:** https://storybook.nocturna.network

### Deploy Commands

```bash
# Deploy to staging
waypoint deploy staging

# Deploy to production (requires approval)
waypoint deploy production --confirm

# Rollback
waypoint rollback production --to v1.2.2
```

### CI/CD

Automated deployment via GitHub Actions:
- **Develop branch** → Staging (auto)
- **Main branch** → Production (manual approval)

---

## Authentication

**Provider:** nocturnaID.org
**Protocol:** OAuth 2.0 + JWT

### User Roles

- **Designer** - Design system management, component preview
- **Engineer** - Full development access, staging deployment
- **Admin** - Full system access, production deployment
- **Agent** - Read-only access for AI agents

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

- **Handoff:** `infrastructure/k8s/production/docs/LUMINES_AGENT_HANDOFF.md`
- **Visual Diagrams:** `infrastructure/k8s/production/docs/LUMINES_VISUAL_DIAGRAMS.md`
- **Quick Reference:** `infrastructure/k8s/production/docs/LUMINES_QUICK_REFERENCE.md`
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

Proprietary - Nocturna Network © 2024

---

## Support

- **Documentation:** https://docs.nocturna.network
- **Slack:** #wissil-support
- **Email:** support@nocturna.network
- **Issues:** https://github.com/nocturna-network/wissil/issues

---

## Acknowledgments

Built with ❤️ by the Nocturna Network team.

**Agents:**
- **Lumines** - UI/UX Specialist
- **Luminera** - System Architecture

**Technologies:**
- Next.js, React, TypeScript
- Tailwind CSS, Storybook
- Cloudflare, Vercel
- nocturnaID Authentication

---

**Made for developers, by developers.**
