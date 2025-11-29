# LUMINES QUICK REFERENCE

Quick reference guide for the WISSIL system - essential information at a glance.

---

## Systems Overview

| System | Port | Location | Color | Purpose |
|--------|------|----------|-------|---------|
| **LANDING** | 3000 | Helios Control | Gold (#FFD700) | Main gateway |
| **SLATE** | 3001 | Helios Compute | Indigo (#6366F1) | Design system |
| **IGNITION** | 3002 | Helios Control | Red (#EF4444) | Project scaffolding |
| **SPARK** | 3003 | Helios Compute | Yellow (#FBBF24) | AI generation |
| **IGNIS** | 3004 | Helios Control | Coral (#FF6B35) | Build pipeline |
| **WAYPOINT** | 3005 | Helios Compute | Green (#10B981) | Deployment |

---

## Network Information

### Servers

| Server | IP Address | Services |
|--------|-----------|----------|
| **Helios Control** | 192.168.86.114 | LANDING, IGNITION, IGNIS |
| **Helios Compute** | 192.168.86.115 | SLATE, SPARK, WAYPOINT |
| **Synology NAS** | 192.168.86.27 | PostgreSQL, Redis, NATS, Registry |

### Infrastructure Ports

| Service | Port | Protocol |
|---------|------|----------|
| PostgreSQL | 5432 | TCP |
| Redis | 6379 | TCP |
| NATS | 4222 | TCP |
| Registry | 5000 | HTTPS |
| HMR WebSocket | 24678 | WebSocket |

---

## Authentication Endpoints

```
POST   /auth/login      - User login
POST   /auth/refresh    - Token refresh
GET    /auth/verify     - Verify token
GET    /auth/roles      - Get user roles
POST   /auth/logout     - User logout
```

### User Roles

- **Designer** - SLATE, component preview
- **Engineer** - All systems, staging deploy
- **Admin** - Full access, production deploy
- **Agent** - Read-only, MCP write

---

## File Structure

```
lumines/
├── src/
│   ├── app/
│   │   ├── landing/          # Main gateway
│   │   ├── slate/            # Design system
│   │   ├── ignition/         # Project init
│   │   ├── spark/            # AI generation
│   │   ├── ignis/            # Build pipeline
│   │   ├── waypoint/         # Deployment
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Root redirect
│   ├── components/
│   │   ├── wissil/
│   │   │   └── WISSILLayout.tsx
│   │   ├── shared/           # Shared components
│   │   └── ui/               # UI primitives
│   ├── tokens/
│   │   └── slate.tokens.ts   # SLATE design tokens
│   └── styles/
│       └── globals.css       # Global styles
├── .storybook/
│   ├── main.ts               # Storybook config
│   ├── preview.ts            # Preview settings
│   └── manager.ts            # Manager config
├── scripts/
│   └── generate-wissil-stories.ts
├── infrastructure/
│   └── k8s/production/docs/
│       ├── LUMINES_AGENT_HANDOFF.md
│       ├── LUMINES_VISUAL_DIAGRAMS.md
│       └── LUMINES_QUICK_REFERENCE.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── postcss.config.js
```

---

## MCP Tools Reference

### Component Operations

```typescript
// Read component
await mcp.call('mcp_luminera_read_component', {
  component: 'Button',
  includeTests: true,
  includeStories: true
});

// Write component
await mcp.call('mcp_luminera_write_component', {
  component: 'Card',
  code: generatedCode,
  path: 'src/components/Card.tsx',
  tests: generatedTests,
  stories: generatedStories
});
```

### File System Operations

```typescript
// Read file
const content = await mcp.call('mcp_vfs_read', {
  path: 'package.json'
});

// Write file
await mcp.call('mcp_vfs_write', {
  path: 'src/utils/helper.ts',
  content: helperCode
});
```

---

## Design System Tokens

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
nocturna-twilight  #2D3561  // Border
```

### Typography Scale

```typescript
text-xs    0.75rem   // 12px
text-sm    0.875rem  // 14px
text-base  1rem      // 16px
text-lg    1.125rem  // 18px
text-xl    1.25rem   // 20px
text-2xl   1.5rem    // 24px
text-3xl   1.875rem  // 30px
text-4xl   2.25rem   // 36px
text-5xl   3rem      // 48px
text-6xl   3.75rem   // 60px
text-7xl   4.5rem    // 72px
```

### Spacing Scale

```typescript
1   0.25rem   // 4px
2   0.5rem    // 8px
4   1rem      // 16px
6   1.5rem    // 24px
8   2rem      // 32px
12  3rem      // 48px
16  4rem      // 64px
20  5rem      // 80px
24  6rem      // 96px
```

---

## Quick Deploy Commands

### Development

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook

# Sync WISSIL stories
npm run storybook:sync-wissil

# Run tests
npm test

# Run linter
npm run lint
```

### Building

```bash
# Build Next.js app
npm run build

# Build Storybook
npm run build-storybook

# Build and analyze
npm run build -- --analyze
```

### Deployment

```bash
# Deploy to staging
waypoint deploy staging

# Deploy to production (requires approval)
waypoint deploy production --confirm

# Rollback production
waypoint rollback production --to v1.2.2

# Check deployment status
waypoint status production
```

### Version Management

```bash
# Bump version
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Create Git tag
git tag v1.2.3
git push --tags
```

---

## Component Template

### Basic Component

```tsx
'use client';

import React from 'react';
import { slateTokens } from '@/tokens/slate.tokens';

export interface MyComponentProps {
  /** Component title */
  title: string;
  /** Optional description */
  description?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * MyComponent - Brief description
 *
 * Detailed description of what this component does
 * and how it should be used.
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div className="glass-container p-6">
      <h2 className="text-2xl font-bold text-white mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-neutral-300">
          {description}
        </p>
      )}
      {onClick && (
        <button
          onClick={onClick}
          className="mt-4 px-6 py-2 rounded-lg bg-slate-primary text-white"
        >
          Action
        </button>
      )}
    </div>
  );
};

export default MyComponent;
```

### Storybook Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'My Component',
    description: 'This is a description',
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'My Component',
  },
};
```

### Test File

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <MyComponent
        title="Test"
        description="Test Description"
      />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Action'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm test`)
- [ ] No linter errors (`npm run lint`)
- [ ] Storybook stories up to date
- [ ] Visual regression tests passed (Chromatic)
- [ ] Bundle size within limits (< 300 KB)
- [ ] Performance benchmarks met (Lighthouse 95+)
- [ ] Security scan clean
- [ ] Changelog updated
- [ ] Version bumped (semantic versioning)
- [ ] Git tag created

### Post-Deployment

- [ ] Health check passed (`curl /api/health`)
- [ ] Smoke tests successful
- [ ] Error monitoring active (Sentry)
- [ ] Performance monitoring active
- [ ] No critical errors in logs
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Release notes published

---

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules .next dist
npm install
npm run build
```

#### TypeScript Errors

```bash
# Regenerate types
npx tsc --noEmit

# Clear TypeScript cache
rm -rf .next/types
```

#### Storybook Not Loading

```bash
# Clear Storybook cache
rm -rf node_modules/.cache

# Rebuild Storybook
npm run build-storybook
```

#### HMR Not Working

```bash
# Check WebSocket connection
# Make sure port 24678 is open

# Restart dev server
npm run dev
```

### Health Check

```bash
# Check all services
curl https://nocturna.network/api/health

# Check specific system
curl https://slate.nocturna.network/api/health

# Check database
psql -h 192.168.86.27 -U wissil -d wissil -c "SELECT 1"

# Check Redis
redis-cli -h 192.168.86.27 PING
```

---

## Environment Variables

### Required Variables

```bash
# Authentication
NEXT_PUBLIC_NOCTURNA_ID_URL=https://nocturnaID.org
NOCTURNA_JWT_SECRET=***

# Database
DATABASE_URL=postgresql://user:pass@192.168.86.27:5432/wissil
REDIS_URL=redis://192.168.86.27:6379

# Deployment
CLOUDFLARE_API_TOKEN=***
CLOUDFLARE_ACCOUNT_ID=***
VERCEL_TOKEN=***

# Monitoring
SENTRY_DSN=***
DATADOG_API_KEY=***
```

### Optional Variables

```bash
# Development
STORYBOOK_PORT=6006
IGNIS_HMR_PORT=24678

# Features
ENABLE_SPARK_AI=true
ENABLE_CHROMATIC=true

# Logging
LOG_LEVEL=info
DEBUG=wissil:*
```

---

## Support Resources

### Documentation

- **Main Docs:** https://docs.nocturna.network
- **API Docs:** https://api.nocturna.network/docs
- **Storybook:** https://storybook.nocturna.network

### Repositories

- **WISSIL:** https://github.com/nocturna-network/wissil
- **Components:** https://github.com/nocturna-network/components
- **Docs:** https://github.com/nocturna-network/docs

### Communication

- **Slack:** #wissil-support
- **Email:** support@nocturna.network
- **Issues:** GitHub Issues

### Emergency Contacts

- **On-Call Engineer:** @oncall-engineer
- **DevOps:** @devops-team
- **Security:** @security-team

---

## Keyboard Shortcuts

### Storybook

- `S` - Show/hide sidebar
- `A` - Show/hide addons
- `D` - Toggle dark mode
- `F` - Toggle fullscreen
- `/` - Search stories

### Development

- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + P` - File finder
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar

---

## Performance Targets

### Load Time

- **Initial Load:** < 1.5s
- **Time to Interactive:** < 2s
- **First Contentful Paint:** < 1s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Bundle Size

- **JavaScript:** < 250 KB (gzipped)
- **CSS:** < 20 KB (gzipped)
- **Images:** Lazy loaded + WebP
- **Total First Load:** < 300 KB

### Lighthouse Scores

- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

---

## Version History

| Version | Date | Type | Changes |
|---------|------|------|---------|
| v1.2.3 | 2024-11-29 | Patch | Bug fixes, token updates |
| v1.2.0 | 2024-11-25 | Minor | SPARK features, IGNIS profiling |
| v1.1.0 | 2024-11-20 | Minor | SLATE improvements |
| v1.0.0 | 2024-11-15 | Major | Initial WISSIL release |

---

**End of Quick Reference**

For detailed information, see the full handoff documentation and visual diagrams.
