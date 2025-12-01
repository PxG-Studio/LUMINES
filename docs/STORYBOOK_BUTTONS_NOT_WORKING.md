# STORYBOOK BUTTONS NOT WORKING — DIAGNOSIS

**Status:** 🔍 **INVESTIGATING**  
**Issue:** Landing page buttons not working in Storybook

---

## BUTTONS AFFECTED

### SimpleNav
- ❌ Docs
- ❌ Templates  
- ❌ Open Editor

### HeroSection
- ❌ Start Coding
- ❌ View Templates

---

## CURRENT STRUCTURE

Buttons are wrapped in Next.js `Link` components:

```tsx
<Link href="/waypoint">
  <Button onClick={...}>Docs</Button>
</Link>
```

---

## POTENTIAL ISSUES

1. **Link Wrapper Blocking Clicks**
   - Next.js Link mock may be preventing button clicks
   - Button onClick handlers may not be firing

2. **Event Propagation**
   - Link's onClick prevents default
   - Button's onClick may not be receiving events

3. **Storybook Context**
   - Links don't navigate in Storybook
   - Buttons need explicit handlers

---

## FIXES APPLIED

✅ Added onClick handlers to all buttons  
✅ Added preventDefault to button handlers  
✅ Console logging for debugging  

---

## NEXT STEPS

Check if buttons are actually clickable in Storybook browser and verify event handlers are firing.

