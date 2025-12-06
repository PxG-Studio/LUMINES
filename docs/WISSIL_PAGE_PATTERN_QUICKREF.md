# WISSIL Page Pattern Quick Reference

**Quick reference guide for building WISSIL subsystem pages**

---

## Standard Page Template

```tsx
'use client';

import React from 'react';
import { SystemIcon } from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      <Navigation />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-{system}-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-{system}-accent rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-{system}-primary/30 mb-8">
              <SystemIcon className="w-4 h-4 text-{system}-primary" />
              <span className="text-sm font-medium text-text-secondary">Tagline</span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold mb-6 text-gradient-{system}">SYSTEM NAME</h1>
            <p className="text-xl text-text-secondary mb-4">Description</p>
            <p className="text-lg text-text-tertiary mb-12 max-w-2xl mx-auto">Details</p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Icon className="w-6 h-6 text-{system}-primary" />
              <h2 className="text-3xl font-bold text-text-primary">Section Title</h2>
            </div>
            <div className="glass-container p-6">Content</div>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## System Color Tokens

| System | Primary | Secondary | Accent | Gradient |
|--------|---------|-----------|--------|----------|
| **Waypoint** | `waypoint-primary` | `waypoint-secondary` | `waypoint-accent` | `gradient-waypoint` |
| **Ignition** | `ignition-primary` | `ignition-secondary` | `ignition-accent` | `gradient-ignition` |
| **Slate** | `slate-primary` | `slate-secondary` | `slate-accent` | `gradient-slate` |
| **Spark** | `spark-primary` | `spark-secondary` | `spark-accent` | `gradient-spark` |
| **Ignis** | `ignis-primary` | `ignis-secondary` | `ignis-accent` | `gradient-ignis` |
| **Landing** | `landing-primary` | `landing-secondary` | `landing-accent` | `gradient-landing` |

---

## Common Patterns

### Glass Container
```tsx
<div className="glass-container p-6 transition-all duration-300 hover:-translate-y-1">
  Content
</div>
```

### Section Header
```tsx
<div className="flex items-center gap-3 mb-8">
  <Icon className="w-6 h-6 text-{system}-primary" />
  <h2 className="text-3xl font-bold text-text-primary">Title</h2>
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### CTA Button (Primary)
```tsx
<button className="group px-8 py-4 rounded-lg bg-gradient-{system} font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
  Action
</button>
```

### CTA Button (Secondary)
```tsx
<button className="px-8 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 font-semibold text-text-primary transition-all duration-300 hover:bg-white/10">
  Action
</button>
```

---

## Page Checklist

- [ ] Navigation component at top
- [ ] Background effects with system colors
- [ ] Hero section with badge, title, description
- [ ] System-specific color tokens (no hardcoded colors)
- [ ] Glass containers for cards
- [ ] Responsive spacing (`sm:` breakpoints)
- [ ] JSDoc comment with system metadata
- [ ] Integration info section at bottom

---

## File Locations

- **Navigation**: `src/components/wissil/Navigation.tsx`
- **Tokens**: `src/tokens/slate.tokens.ts`
- **Pages**: `src/app/{system}/page.tsx`
- **Stories**: `src/app/{system}/{system}.stories.tsx`
- **Docs**: `src/app/{system}/{system}.mdx`

---

**See full documentation**: `docs/WISSIL_PAGE_ARCHITECTURE.md`
