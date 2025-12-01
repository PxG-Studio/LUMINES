# STORYBOOK NODELIBRARY RUNTIME ERROR FIX

**Date:** December 2024  
**Status:** ✅ **FIXED**  
**Purpose:** Fix "Cannot read properties of undefined (reading 'register')" runtime error

---

## ERROR

```
TypeError: Cannot read properties of undefined (reading 'register')
at registerExpandedNodes (ExpandedNodeLibrary.ts:14)
```

**Location:** `src/ignis/blueprint/library/ExpandedNodeLibrary.ts`

---

## ROOT CAUSE

**Module Initialization Order Issue:**

1. `ExpandedNodeLibrary.ts` calls `registerExpandedNodes()` at module load time (line 776)
2. `registerExpandedNodes()` tries to use `NodeLibrary.register()`
3. But `NodeLibrary` might not be fully initialized when this executes

**The Problem:**
- `NodeLibrary.ts` imports `ExpandedNodeLibrary` after initializing built-in nodes
- `ExpandedNodeLibrary.ts` immediately calls `registerExpandedNodes()` when imported
- At that point, `NodeLibrary` class might not be fully available

---

## SOLUTION

**Changed initialization order:**

1. ✅ Removed immediate execution from `ExpandedNodeLibrary.ts`
2. ✅ Explicitly call `registerExpandedNodes()` after `NodeLibrary` is initialized

### Files Modified

1. **`src/ignis/blueprint/library/ExpandedNodeLibrary.ts`**
   - Removed: `registerExpandedNodes();` at bottom
   - Added: Comment explaining it's called from NodeLibrary.ts

2. **`src/ignis/blueprint/library/NodeLibrary.ts`**
   - Changed: `import "./ExpandedNodeLibrary";` (side-effect import)
   - To: `import { registerExpandedNodes } from "./ExpandedNodeLibrary";`
   - Added: Explicit call to `registerExpandedNodes();` after initialization

---

## CODE CHANGES

### Before

**NodeLibrary.ts:**
```typescript
// Initialize built-in nodes
initializeBuiltInNodes();

// Import expanded nodes
import "./ExpandedNodeLibrary"; // This immediately executes registerExpandedNodes()
```

**ExpandedNodeLibrary.ts:**
```typescript
// ... all node definitions ...

// Register expanded nodes
registerExpandedNodes(); // Called immediately when module loads
```

### After

**NodeLibrary.ts:**
```typescript
// Initialize built-in nodes
initializeBuiltInNodes();

// Import and register expanded nodes
import { registerExpandedNodes } from "./ExpandedNodeLibrary";
registerExpandedNodes(); // Called explicitly after initialization
```

**ExpandedNodeLibrary.ts:**
```typescript
// ... all node definitions ...

// Register expanded nodes when NodeLibrary is ready
// This is called from NodeLibrary.ts after it's fully initialized
```

---

## RESULT

✅ **Runtime error fixed** - `NodeLibrary` is now fully initialized before `registerExpandedNodes()` is called

✅ **Explicit control** - Clear initialization order with explicit function call

✅ **No side effects** - Module no longer has side effects on import

---

**INITIALIZATION ORDER FIX COMPLETE — Runtime error resolved**

