# 🔥 CHROMATIC_TRIAGE_GUIDE.md

**WISSIL / LUMINES — Visual Regression Triage Manual**

*Last updated: December 2024*

---

# 📘 Purpose

This guide explains how to **analyze, classify, and resolve Chromatic visual diffs** when they appear in:

- ✅ Ignis (Blueprint Node Editor)
- ✅ Unity-style Tools (SceneGraph, Prefab Inspector, UI Canvas, Shader Editor, etc.)
- ✅ Spark Template Graphs
- ✅ Slate Design System
- ✅ Ignition Runtime UI
- ✅ Full subsystem pages (Landing / Slate / Ignition / Spark / Ignis / Waypoint)

Because WISSIL is a **multi-surface IDE**, visual regressions can occur anywhere.

This manual ensures you respond with precision.

---

# ⚠️ THE GOLDEN RULE

> **NEVER ACCEPT A CHANGE IF YOU DON'T KNOW EXACTLY WHAT CAUSED IT.**

Visual regressions in an IDE compound quickly:

- 1px shift in NodeRenderer affects all nodes
- Color token change affects entire IDE
- Layout change in Inspector affects 12 panels
- Canvas drift impacts all template previews
- WireRenderer bugs break blueprint graphs

Be deliberate.

---

# 🧭 1. Identify the Regression Type

All visual diffs fall into **5 categories**.

## 🟦 A. Intended Visual Updates (Safe)

Examples:

- ✅ You updated Slate color tokens
- ✅ You redesigned NodeRenderer
- ✅ You improved Prefab Inspector UI
- ✅ You fixed a misaligned panel

**Action:**

✔ Accept snapshot change  
✔ Commit with message explaining intended change

---

## 🟧 B. Unintended UI Breaks (Unsafe)

Examples:

- ❌ Node titlebar misaligned
- ❌ Sockets moved by 1px
- ❌ Wires attach incorrectly
- ❌ Inspector panel jumps
- ❌ SceneGraph indentation off
- ❌ Template preview nodes drift

**Action:**

❌ Do NOT accept  
🔧 Investigate: CSS, component props, Slate tokens, layout wrappers  
🛠 Fix underlying code  
📸 Run Chromatic again

---

## 🟥 C. Catastrophic Regression (Block Merge)

Examples:

- 🚨 Node graph canvas fails to render
- 🚨 Inspector disappears
- 🚨 Blueprint editor shows blank page
- 🚨 SceneGraph tree unreadable
- 🚨 Tabs or top navigation broken
- 🚨 Panels collapse or overlap

**Action:**

🚨 BLOCK MERGE immediately  
🧩 Identify root cause (likely TS error, missing provider, Zustand store update)  
🔁 Revert or patch  
📸 Re-run Chromatic

---

## 🟩 D. Non-deterministic Rendering (Must Fix)

Examples:

- 🟡 Animated transitions causing diffs
- 🟡 Random canvas jitter
- 🟡 Race conditions with state initialization
- 🟡 React-spring animations breaking stories
- 🟡 Timestamps or randomness in nodes

**Action:**

🟡 Stabilize story environments:

- disable animation
- mock random values
- set deterministic props
- freeze clock / disable timers

Use:

```typescript
parameters: {
  chromatic: { disableAnimation: true },
}
```

---

## 🟨 E. Environment-Dependent Differences

Examples:

- 🟨 OS-level font rendering differences
- 🟨 Browser default font fallback
- 🟨 Floating-point rounding in wire curves
- 🟨 GPU anti-alias variance

**Action:**

🟡 Consider:

- using static fonts
- forcing pixel-snapping
- disabling hardware-accelerated artifacts
- adjusting diffThreshold slightly (max 0.02)

---

# 🔍 2. Triaging the Diff in Chromatic UI

When Chromatic shows a diff:

### **Step 1 — Read the diff summary**

- What changed?
- Component?
- Page?
- Subsystem?

### **Step 2 — Check the snapshot side-by-side**

Look for:

- Layout shifts
- Missing UI elements
- Color/token changes
- Unexpected shadows
- Geometry distortions
- Alignment issues

### **Step 3 — Check if the diff affects:**

- **Only one story?**
  → likely local component issue
- **All stories using Slate?**
  → design-token change
- **All Blueprint nodes?**
  → NodeRenderer / Slate panel CSS changed
- **All templates?**
  → GraphCanvas layout drift

### **Step 4 — Does the change map to recent commits?**

Check:

- UI component updates
- Slate tokens
- Node renderer changes
- Zustand store changes
- Theme resets
- CSS module adjustments

---

# 🧪 3. Debugging Common Regression Sources

## **1. CSS Drift or Token Changes**

Look for:

- margin/padding changes
- font size increased
- border radius changed
- color tokens updated
- shadow tokens changed

### Fix:

- Adjust token
- Update Slate component
- Re-run snapshots

---

## **2. NodeRenderer Layout Drift**

Very common.

**Symptoms:**

- Socket shifts
- Titlebar clipped
- Node body height too tall/short
- Props panel overlaps

### Fix:

- Normalize Flexbox settings
- Lock sizes using Slate tokens
- Avoid percentage-based heights

---

## **3. WireRenderer Jitter**

**Caused by:**

- incorrect bounds calculation
- missing ref measurements
- unstable cubic bezier control points

### Fix:

- memoize node positions
- force pixel rounding in wire paths

---

## **4. Canvas Pan/Zoom Variation**

If the canvas is initialized with:

- random zoom
- scroll based on last viewport
- dynamic fit-to-view

It breaks snapshots.

### Fix:

```typescript
initialZoom={1}
initialOffset={{ x: 0, y: 0 }}
```

---

## **5. Animation / Motion Effects**

Disable in stories:

```typescript
chromatic: { disableAnimation: true }
```

Or wrap:

```css
* {
  transition: none !important;
  animation: none !important;
}
```

---

## **6. Data or Time-Based Drift**

Eliminate:

- timestamps
- Math.random()
- UUIDs

Replace with deterministic:

```typescript
import seedrandom from "seedrandom";

const rng = seedrandom("wissil");
```

Or stub UUIDs:

```typescript
vi.mock("uuid", () => ({ v4: () => "TEST_ID" }));
```

---

# 📌 4. Critical WISSIL Components That MUST ALWAYS BE CLEAN

These are catastrophic if diffs appear:

### 🔥 Ignis Blueprint Editor

- NodeRenderer
- WireRenderer
- BPGraphCanvas
- NodePalette
- Inspector
- Debugger
- Multi-user cursors

### 🔥 Slate

- Colors
- Shadows
- Typography
- Panels
- SplitView

### 🔥 Unity Tools

- SceneGraph tree
- Prefab Inspector
- ShaderEditor
- UI Canvas
- AnimationTimeline

### 🔥 Spark

- Template preview graphs
- Template metadata cards

### 🔥 Ignition

- Build dashboard
- Logs console
- Preview frame shell

---

# 🧭 5. Severity Classification (MANDATORY FOR PR REVIEW)

| Severity                        | Meaning                    | Action           |
| ------------------------------- | -------------------------- | ---------------- |
| 🟥 **S0 – Critical Break**      | IDE no longer functional   | Block PR         |
| 🟧 **S1 – Major UI Regression** | Editor/scene/layout broken | Fix before merge |
| 🟨 **S2 – Minor Drift**         | 1–2px misalignment         | Fix recommended  |
| 🟦 **S3 – Intended Update**     | Verified design change     | Accept           |
| 🟩 **S4 – Cosmetic**            | No risk                    | Accept           |

---

# 🧩 6. When to Accept vs Reject

### **ACCEPT if:**

- ✅ You intentionally redesigned the component
- ✅ A designer verified the change
- ✅ It fixes a known bug
- ✅ It improves accessibility
- ✅ It normalizes layout

### **REJECT if:**

- ❌ You don't understand the cause
- ❌ It affects multiple unrelated stories
- ❌ It moves UI elements unintentionally
- ❌ It breaks baseline alignment
- ❌ It appears nondeterministic

---

# 🔄 7. Updating Baselines (the safe way)

### Never accept multiple baseline changes at once.

**Correct flow:**

1. Fix code.
2. Run Chromatic locally or in PR.
3. Inspect every diff.
4. Accept only intended changes.

### Wrong flow (dangerous):

- ❌ Accept all diffs at once
  → This hides regressions permanently.

---

# 🛠️ 8. Tools for Faster Debugging

You may use:

- ✅ **Storybook's "View Code"** to inspect markup
- ✅ **React Profiler** for components
- ✅ **CSS tracing**
- ✅ **Boundary boxing** for debugging misalignment:

```css
* { outline: 1px solid rgba(255,0,0,0.3); }
```

- ✅ **Absolute overlay grid** to detect pixel drift

---

# 🏁 9. Final Pre-Merge Checklist

Before approving a PR:

### 🔲 All Chromatic diffs reviewed

### 🔲 Severity ≤ S2 only

### 🔲 No regressions in critical Ignis stories

### 🔲 No drift in Slate tokens

### 🔲 No drift in Canvas, Wires, or NodeRenderer

### 🔲 Multi-user stories stable

### 🔲 All subsystem page snapshots clean

### 🔲 CI passed

### 🔲 Code reviewed

### 🔲 PR description matches visual changes

If any critical failures appear:

❌ **BLOCK MERGE**

---

# 🎯 Final Notes

This guide must be followed by:

- ✅ Frontend engineering
- ✅ Ignis Editor team
- ✅ Slate design system team
- ✅ Spark template maintainers
- ✅ QA & Tools Engineering
- ✅ Runtime & Ignition team
- ✅ LUMINES AI tooling team

This manual keeps your entire IDE stable as WISSIL evolves.

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

