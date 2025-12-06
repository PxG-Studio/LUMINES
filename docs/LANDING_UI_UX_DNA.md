# Landing UI/UX DNA - Design System Consistency

## Overview

The Landing page establishes the **canonical UI/UX DNA** for all WIS2L Framework pages in Storybook. This document outlines the patterns and how to apply them consistently.

---

## Core Design DNA Elements

### 1. **Nocturna CSS Variables**
All components should use Nocturna CSS variables for theming:

```css
/* Backgrounds */
--nv-bg-0: #0c0f1a  /* Primary background */
--nv-bg-1: #111421  /* Secondary background */
--nv-bg-2: #151827  /* Tertiary background */
--nv-bg-3: #1a1d2e  /* Quaternary background */

/* Text */
--nv-text-0: #ffffff  /* Primary text */
--nv-text-1: #c7cdf5  /* Secondary text */
--nv-text-2: #7a84a9  /* Tertiary text */
--nv-text-3: #4d5468  /* Quaternary text */

/* Borders */
--nv-border: #1f2334
--nv-border-hover: #2a2e42
--nv-border-active: #3a3f58

/* Accents */
--nv-accent: #6d8cff
--nv-accent-button: #4c5eff  /* WCAG AA compliant */
```

**Usage Pattern:**
```tsx
<div style={{ 
  background: "var(--nv-bg-0)",
  color: "var(--nv-text-0)",
  border: "1px solid var(--nv-border)"
}}>
```

### 2. **Button Component**
Use the shared Button component from `@/design-system/primitives/Button`:

```tsx
import { Button } from "@/design-system/primitives/Button";

<Button variant="accent" onClick={handleClick}>
  Primary Action
</Button>

<Button variant="default" onClick={handleClick}>
  Secondary Action
</Button>

<Button variant="ghost" onClick={handleClick}>
  Tertiary Action
</Button>
```

**Variants:**
- `accent` - Primary CTA (uses `--nv-accent-button`)
- `default` - Secondary action (uses theme background)
- `ghost` - Tertiary action (transparent)

### 3. **SimpleNav Component**
Use SimpleNav for consistent navigation:

```tsx
import { SimpleNav } from "@/wissil/Landing/SimpleNav";

<SimpleNav onNavigation={handleNavigation} />
```

### 4. **ThemeProvider**
Wrap all stories with ThemeProvider for consistent theming:

```tsx
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  render: () => <SparkPage />,
};
```

### 5. **Styling Approach**
- **Prefer inline styles with CSS variables** for dynamic theming
- Use Tailwind utilities sparingly, only for layout/spacing
- Maintain consistent spacing using `--nv-space-*` variables
- Use consistent border radius: `var(--nv-radius-md)` or `var(--nv-radius-lg)`

---

## Migration Checklist

### For Spark/Workbench Pages

- [ ] Replace custom button styles with `Button` component
- [ ] Replace Tailwind color classes with CSS variables
- [ ] Add ThemeProvider decorator to Storybook stories
- [ ] Update Navigation to match SimpleNav pattern
- [ ] Replace `glass-container` with CSS variable-based styling
- [ ] Update text colors to use `--nv-text-*` variables
- [ ] Update backgrounds to use `--nv-bg-*` variables
- [ ] Ensure consistent spacing using `--nv-space-*` variables

### For Storybook Stories

- [ ] Add ThemeProvider decorator to all WIS2L Framework stories
- [ ] Update story documentation to reference Landing DNA
- [ ] Ensure consistent button usage across all stories
- [ ] Standardize navigation patterns

---

## Example: Spark Page Alignment

### Before (Tailwind-heavy):
```tsx
<Link
  href="/spark/generator"
  className="group px-8 py-4 rounded-lg bg-gradient-spark font-semibold text-background-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 mx-auto"
>
  Try AI Generator
</Link>
```

### After (Landing DNA):
```tsx
<Button
  variant="accent"
  style={{ fontSize: "16px", padding: "14px 28px" }}
  onClick={() => handleNavigation('/spark/generator', 'Try AI Generator')}
>
  Try AI Generator
</Button>
```

---

## Storybook Decorator Pattern

Create a shared decorator for all WIS2L Framework stories:

```tsx
// .storybook/decorators.tsx
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

export const withTheme = (Story: any) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
);
```

Then use in stories:
```tsx
export default {
  decorators: [withTheme],
  // ...
} satisfies Meta<typeof Component>;
```

---

## Benefits

1. **Consistency** - All pages feel cohesive
2. **Maintainability** - Single source of truth for design tokens
3. **Accessibility** - WCAG AA compliant colors built-in
4. **Performance** - CSS variables are more performant than Tailwind classes
5. **Flexibility** - Easy to theme and customize

---

## Next Steps

1. Update Spark page to use Landing DNA
2. Create Storybook decorators for ThemeProvider
3. Update all WIS2L Framework stories
4. Document component usage patterns
5. Create shared component library

