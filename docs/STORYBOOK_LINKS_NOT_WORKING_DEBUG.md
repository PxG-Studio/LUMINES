# STORYBOOK LINKS NOT WORKING — DEBUG GUIDE

**Status:** 🔍 **DEBUGGING**  
**Issue:** Landing page buttons/links not working in Storybook

---

## CURRENT SETUP

### Components
- `SimpleNav.tsx` - Has 3 buttons (Docs, Templates, Open Editor)
- `HeroSection.tsx` - Has 2 buttons (Start Coding, View Templates)

### Structure
Buttons are wrapped in Next.js `Link` components:
```tsx
<Link href="/waypoint">
  <Button onClick={...}>Docs</Button>
</Link>
```

---

## POSSIBLE ISSUES

### 1. Link Wrapper Blocking Clicks
- Link's anchor tag might be preventing button clicks
- Button onClick handlers might not be firing

### 2. Event Propagation
- Link's onClick might be blocking button's onClick
- preventDefault/stopPropagation might not be working

### 3. Storybook Context
- Next.js routing doesn't work in Storybook
- Links need to be mocked properly

---

## FIXES APPLIED

✅ Added onClick handlers to all buttons  
✅ Added preventDefault() and stopPropagation()  
✅ Updated Link mock to allow button clicks  

---

## DEBUGGING STEPS

1. **Check Browser Console**
   - Open DevTools
   - Look for console.log messages
   - Check for errors

2. **Test Button Clicks**
   - Click each button
   - See if console.log appears
   - Check Actions panel

3. **Verify Event Handlers**
   - Inspect button elements
   - Check if onClick is attached
   - Verify event listeners

---

## NEXT STEPS

If buttons still don't work, we may need to:
- Remove Link wrapper for Storybook
- Use conditional rendering
- Create Storybook-specific versions

