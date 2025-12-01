# WISSIL Page Architecture

**Based on LUMINERA Architecture & HELIOS Infrastructure Patterns**

This document explains how pages are structured for the WISSIL framework subsystems: **Waypoint**, **Ignition**, **Slate**, **Spark**, **Ignis**, and **Landing** (Lumenforge.io Landing Page).

> **Related Documentation:**
> - **[Storybook Comprehensive Organization](./../STORYBOOK_COMPREHENSIVE_ORGANIZATION.md)** - Complete Storybook organization patterns and component structure
> - **[WISSIL Comprehensive Architecture](./../WISSIL_COMPREHENSIVE_ARCHITECTURE.md)** - Full infrastructure, network topology, and service interactions
> - **[WISSIL Page Pattern Quick Reference](./WISSIL_PAGE_PATTERN_QUICKREF.md)** - Quick reference guide for building pages

---

## Overview

WISSIL pages follow a consistent architectural pattern derived from:
- **LUMINERA**: System architecture and design patterns (monorepo structure: `apps/{system}/`)
- **HELIOS**: Deployment infrastructure (Helios Control/Compute nodes)
- **Storybook Organization**: Atomic Design principles for component documentation

All WISSIL subsystem pages share a common structure while maintaining their unique identity through system-specific tokens and styling. Each page is fully documented in Storybook following the comprehensive organization guide.

---

## Page Structure Pattern

### 1. Root Container

Every WISSIL page follows this root structure:

```tsx
<div className="min-h-screen bg-background-primary relative overflow-hidden">
  <Navigation />
  
  {/* Background Effects */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Animated orbs with system colors */}
  </div>

  <div className="relative z-10 pt-16">
    {/* Page Content */}
  </div>
</div>
```

**Key Elements:**
- `min-h-screen`: Full viewport height
- `bg-background-primary`: Base background color from SLATE tokens
- `relative overflow-hidden`: Contains background effects
- `Navigation`: Fixed top navigation bar (shared component)
- `pt-16`: Padding-top to account for fixed navigation

---

### 2. Background Effects Pattern

All pages include animated background effects using system-specific colors:

```tsx
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-0 right-1/4 w-96 h-96 bg-{system}-primary rounded-full blur-3xl opacity-20 animate-float" />
  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-{system}-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
</div>
```

**System Color Mapping:**
- **Waypoint**: `waypoint-primary`, `waypoint-accent` (Purple/Cyan)
- **Ignition**: `ignition-primary`, `ignition-accent` (Red/Orange)
- **Slate**: `slate-primary`, `slate-accent` (Indigo/Blue)
- **Spark**: `spark-primary`, `spark-accent` (Yellow/Amber)
- **Ignis**: `ignis-primary`, `ignis-accent` (Coral/Orange)
- **Landing**: `landing-primary`, `landing-accent` (Gold/Amber)

---

### 3. Hero Section Pattern

Every page includes a hero section with consistent structure:

```tsx
<section className="container mx-auto px-4 py-20 sm:py-32">
  <div className="max-w-4xl mx-auto text-center">
    {/* System Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-{system}-primary/30 mb-8">
      <Icon className="w-4 h-4 text-{system}-primary" />
      <span className="text-sm font-medium text-text-secondary">System Tagline</span>
    </div>

    {/* Main Heading */}
    <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-{system}">
      SYSTEM NAME
    </h1>

    {/* Description */}
    <p className="text-xl text-text-secondary mb-4 leading-relaxed">
      Primary Description
    </p>

    {/* Secondary Description */}
    <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
      Extended description with more details.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Primary CTA */}
      {/* Secondary CTA */}
    </div>
  </div>
</section>
```

---

### 4. Content Sections Pattern

Content sections use consistent spacing and glass-container styling:

```tsx
<section className="container mx-auto px-4 py-12">
  <div className="max-w-6xl mx-auto">
    {/* Section Header */}
    <div className="flex items-center gap-3 mb-8">
      <Icon className="w-6 h-6 text-{system}-primary" />
      <h2 className="text-3xl font-bold text-text-primary">Section Title</h2>
    </div>

    {/* Content Grid/Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards with glass-container class */}
    </div>
  </div>
</section>
```

**Glass Container Pattern:**
```tsx
<div className="glass-container p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
  {/* Card content */}
</div>
```

---

### 5. Navigation Component

All pages import and use the shared `Navigation` component:

```tsx
import { Navigation } from '@/components/wissil/Navigation';
```

The Navigation component provides:
- Fixed top navigation bar
- System icons and names
- Active state highlighting with system colors
- Mobile-responsive dropdown
- Link to LANDING page

---

## System-Specific Patterns

### Landing Page (Lumenforge.io)

**Unique Structure:**
- Uses `LandingLayout` component instead of inline structure
- Different design approach (Bolt.new/StackBlitz style)
- Uses `SimpleNav` instead of full `Navigation`
- Custom HeroSection and FeatureGrid components

**Location:** `src/app/landing/page.tsx`

```tsx
export default function LandingPage() {
  return <LandingLayout />;
}
```

---

### Waypoint, Ignition, Slate, Spark, Ignis

**Standard Pattern:**
All these pages follow the same structure:

1. **Root Container** with Navigation
2. **Background Effects** with system colors
3. **Hero Section** with system badge and title
4. **Content Sections** with system-specific features
5. **Integration Info** section at bottom

---

## Design Token Usage

All pages use SLATE design tokens for consistency:

### Color Tokens
```tsx
// System Colors
bg-{system}-primary
bg-{system}-secondary  
bg-{system}-accent
text-gradient-{system}

// Neutral Colors
bg-background-primary
bg-background-secondary
text-text-primary
text-text-secondary
text-text-tertiary
border-border-primary
```

### Typography
- Headings: `text-6xl sm:text-7xl font-bold`
- Subheadings: `text-3xl font-bold`
- Body: `text-xl text-text-secondary`
- Small: `text-sm text-text-tertiary`

### Spacing
- Section padding: `py-20 sm:py-32` (hero)
- Section padding: `py-12` (content)
- Container max-width: `max-w-4xl` (hero), `max-w-6xl` (content)
- Gap: `gap-6` (grids), `gap-4` (flex)

---

## Component Hierarchy

Based on the LUMINERA architecture documentation:

```
Root Layout (layout.tsx)
├── ThemeProvider
└── Page Component
    ├── Navigation (fixed top)
    ├── Background Effects (fixed, pointer-events-none)
    └── Content Container (relative z-10)
        ├── Hero Section
        │   ├── System Badge
        │   ├── Main Heading
        │   ├── Description
        │   └── CTA Buttons
        ├── Content Sections
        │   ├── Features Grid
        │   ├── Status Cards
        │   └── Interactive Components
        └── Integration Info
```

---

## File Structure

```
src/app/
├── landing/
│   ├── page.tsx              # Landing page (uses LandingLayout)
│   ├── landing.stories.tsx   # Storybook stories
│   └── landing.mdx           # Documentation
├── waypoint/
│   ├── page.tsx              # Waypoint page (standard pattern)
│   ├── waypoint.stories.tsx
│   └── waypoint.mdx
├── ignition/
│   ├── page.tsx              # Ignition page (standard pattern)
│   ├── ignition.stories.tsx
│   └── ignition.mdx
├── slate/
│   ├── page.tsx              # Slate page (standard pattern)
│   ├── slate.stories.tsx
│   └── slate.mdx
├── spark/
│   ├── page.tsx              # Spark page (standard pattern)
│   ├── spark.stories.tsx
│   └── spark.mdx
├── ignis/
│   ├── page.tsx              # Ignis page (standard pattern)
│   ├── ignis.stories.tsx
│   └── ignis.mdx
└── layout.tsx                # Root layout with ThemeProvider
```

---

## Example: Complete Page Structure

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SystemIcon, FeatureIcon } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

/**
 * SYSTEM NAME - Purpose
 *
 * Brief description of the subsystem.
 *
 * Domain: system.lumenforge.io
 * Network: Helios Control/Compute
 * Port: 300X
 * Integration: Related systems
 */
export default function SystemPage() {
  const [state, setState] = useState();

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-system-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-system-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-system-primary/30 mb-8">
              <SystemIcon className="w-4 h-4 text-system-primary" />
              <span className="text-sm font-medium text-text-secondary">System Tagline</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-system">
              SYSTEM NAME
            </h1>

            <p className="text-xl text-text-secondary mb-4 leading-relaxed">
              Primary Description
            </p>

            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">
              Extended description with details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 rounded-lg bg-gradient-system font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <SystemIcon className="w-5 h-5" />
                Primary Action
              </button>
              <button className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10">
                Secondary Action
              </button>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <FeatureIcon className="w-6 h-6 text-system-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Section Title</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content cards */}
            </div>
          </div>
        </section>

        {/* Integration Info */}
        <section className="container mx-auto px-4 py-12 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="glass-container p-6">
              {/* Integration details */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## Key Differences from Landing Page

The **Landing** page differs from other WISSIL pages:

| Aspect | Landing Page | Other WISSIL Pages |
|--------|-------------|-------------------|
| **Layout** | Uses `LandingLayout` component | Inline structure |
| **Navigation** | `SimpleNav` component | Full `Navigation` component |
| **Design Style** | Bolt.new/StackBlitz clean design | Glass morphism with backgrounds |
| **Background** | Minimal background | Animated orbs with system colors |
| **Purpose** | Marketing/Production landing | System-specific functionality |

---

## Best Practices

1. **Always include Navigation** at the top
2. **Use system-specific color tokens** (don't hardcode colors)
3. **Follow the hero section pattern** for consistency
4. **Use glass-container** class for cards and containers
5. **Include JSDoc comments** with system metadata
6. **Use responsive spacing** (`py-20 sm:py-32`, etc.)
7. **Add background effects** with system colors
8. **Include integration info** section at bottom

---

## Resources

- **SLATE Design Tokens**: `src/tokens/slate.tokens.ts`
- **Navigation Component**: `src/components/wissil/Navigation.tsx`
- **WISSILLayout**: `src/components/wissil/WISSILLayout.tsx` (optional wrapper)
- **LandingLayout**: `src/wissil/Landing/LandingLayout.tsx`
- **LUMINERA Architecture**: `infrastructure/k8s/production/docs/LUMINES_AGENT_HANDOFF.md`

---

---

## Storybook Integration

### Story Organization for Pages

Each WISSIL page should have corresponding Storybook stories following the Atomic Design hierarchy:

```
WISSIL/{System}/Pages/{PageName}/
├── Default
├── WithLayout
├── Mobile (375x667)
├── Tablet (768x1024)
├── Desktop (1920x1080)
└── WideScreen (2560x1440)
```

**Example Story Structure:**

```tsx
// src/app/waypoint/waypoint.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import WaypointPage from './page';

const meta: Meta<typeof WaypointPage> = {
  title: 'WISSIL/Waypoint/Pages/Unity Visual Scripting',
  component: WaypointPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <WaypointPage />,
};

export const WithLayout: Story = {
  render: () => (
    <WISSILLayout system="waypoint" showHeader>
      <WaypointPage />
    </WISSILLayout>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1', // 375x667
    },
  },
  render: () => <WaypointPage />,
};
```

### Component Breakdown in Storybook

Each page's components should be organized in Storybook following Atomic Design:

**Page Level** (`WISSIL/{System}/Pages/`)
- Complete page implementation
- All viewport variants
- Documentation (MDX)

**Organisms** (`WISSIL/{System}/Organisms/`)
- Major page sections (Hero, Features, etc.)
- Complex interactive components

**Molecules** (`WISSIL/{System}/Molecules/`)
- Reusable component groups
- Cards, forms, button groups

**Atoms** (`WISSIL/{System}/Atoms/` or `WISSIL/Shared/Atoms/`)
- Basic building blocks
- Buttons, inputs, badges

See **[STORYBOOK_COMPREHENSIVE_ORGANIZATION.md](./../STORYBOOK_COMPREHENSIVE_ORGANIZATION.md)** for complete component breakdown per system.

---

## Infrastructure Context

### Deployment Locations

Pages are deployed according to the WISSIL infrastructure architecture:

**Helios Control Node (192.168.86.114):**
- LANDING (Port 3000)
- IGNITION (Port 3002)
- IGNIS (Port 3004)

**Helos Compute Node (192.168.86.115):**
- SLATE (Port 3001)
- SPARK (Port 3003)
- WAYPOINT (Port 3005)

### Network Topology

All pages integrate with:
- **PostgreSQL** (192.168.86.27:5432) - Data persistence
- **Redis** (192.168.86.27:6379) - Caching & sessions
- **NATS** (192.168.86.27:4222) - Event messaging
- **Container Registry** (192.168.86.27:5000) - Build artifacts

For complete infrastructure details, see **[WISSIL_COMPREHENSIVE_ARCHITECTURE.md](./../WISSIL_COMPREHENSIVE_ARCHITECTURE.md)**.

---

## Summary

WISSIL pages are built using a **consistent architectural pattern** that ensures:
- ✅ Visual consistency across all subsystems
- ✅ System-specific identity through color tokens
- ✅ Responsive design with mobile-first approach
- ✅ Reusable components (Navigation, glass containers)
- ✅ Accessibility and performance best practices
- ✅ Complete Storybook documentation following Atomic Design
- ✅ Infrastructure-aware deployment patterns

The pattern is derived from **LUMINERA** architecture principles and deployed via **HELIOS** infrastructure, providing a unified yet distinctive experience across all WISSIL subsystems.

### Documentation Cross-References

When building or maintaining WISSIL pages:

1. **For Component Structure**: See [Storybook Comprehensive Organization](./../STORYBOOK_COMPREHENSIVE_ORGANIZATION.md)
2. **For Infrastructure Details**: See [WISSIL Comprehensive Architecture](./../WISSIL_COMPREHENSIVE_ARCHITECTURE.md)
3. **For Quick Reference**: See [WISSIL Page Pattern Quick Reference](./WISSIL_PAGE_PATTERN_QUICKREF.md)
