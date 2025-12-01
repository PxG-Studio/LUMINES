# Storybook Case Sensitivity Fix

**WISSIL / LUMINES — Resolved Case-Insensitive File System Conflict**

---

## 🐛 Problem

Storybook was generating webpack bundles with conflicting filenames on Windows (case-insensitive file system):

```
Error: Prevent writing to file that only differs in casing or query string from already written file.
- Ignition-Ignition-stories.iframe.bundle.js / ignition-ignition-stories.iframe.bundle.js
- Landing-Landing-stories.iframe.bundle.js / landing-landing-stories.iframe.bundle.js
```

## 🔍 Root Cause

Story files with similar names but different casing were being processed:

### Ignition Stories:
1. `src/app/ignition/ignition.stories.tsx` (lowercase path)
   - Title: `WISSIL/Ignition/Project Bootstrap`
   - Purpose: Page component story

2. `src/wissil/Ignition/Ignition.stories.tsx` (uppercase path)
   - Title: `WISSIL/Ignition`
   - Purpose: Component stories

### Landing Stories:
1. `src/app/landing/landing.stories.tsx` (lowercase path)
   - Title: `WISSIL/Landing/Production Landing Page`
   - Purpose: Page component story

2. `src/wissil/Landing/Landing.stories.tsx` (uppercase path)
   - Title: `WISSIL/Landing`
   - Purpose: Component stories

Webpack was generating bundle names based on file paths, causing conflicts:
- `Ignition-Ignition-stories.iframe.bundle.js` vs `ignition-ignition-stories.iframe.bundle.js`
- `Landing-Landing-stories.iframe.bundle.js` vs `landing-landing-stories.iframe.bundle.js`

On Windows, these are treated as the same file, causing a race condition.

---

## ✅ Solution

### 1. Renamed All Component Story Files

**All WISSIL subsystems fixed:**

| Subsystem | Before | After |
|-----------|--------|-------|
| **Ignition** | `Ignition.stories.tsx` → `WISSIL/Ignition` | `IgnitionComponents.stories.tsx` → `WISSIL/Ignition/Components` |
| **Landing** | `Landing.stories.tsx` → `WISSIL/Landing` | `LandingComponents.stories.tsx` → `WISSIL/Landing/Components` |
| **Slate** | `Slate.stories.tsx` → `WISSIL/Slate` | `SlateComponents.stories.tsx` → `WISSIL/Slate/Components` |
| **Spark** | `Spark.stories.tsx` → `WISSIL/Spark/Template Gallery` | `SparkComponents.stories.tsx` → `WISSIL/Spark/Components` |
| **Waypoint** | `Waypoint.stories.tsx` → `WISSIL/Waypoint/Docs Browser` | `WaypointComponents.stories.tsx` → `WISSIL/Waypoint/Components` |
| **Ignis** | `IgnisPreview.stories.tsx` → `WISSIL/Ignis/Preview` | `IgnisComponents.stories.tsx` → `WISSIL/Ignis/Components` |

### 2. Updated Story Titles

Changed story titles to be more specific and avoid conflicts:
- Ignition: `WISSIL/Ignition` → `WISSIL/Ignition/Components`
- Landing: `WISSIL/Landing` → `WISSIL/Landing/Components`

This ensures:
- ✅ Unique bundle names (no case conflicts)
- ✅ Better organization in Storybook sidebar
- ✅ Clear separation between page and component stories

### 3. Cleared Storybook Cache

Removed `node_modules/.cache/storybook` to clear stale webpack bundles.

---

## 📁 Current Story Structure

All component story files have been renamed to avoid case conflicts:

```
src/
├── app/                          # Page stories (lowercase paths)
│   ├── ignition/
│   │   └── ignition.stories.tsx
│   │       Title: "WISSIL/Ignition/Project Bootstrap"
│   ├── landing/
│   │   └── landing.stories.tsx
│   │       Title: "WISSIL/Landing/Production Landing Page"
│   ├── slate/
│   │   └── slate.stories.tsx
│   │       Title: "WISSIL/Slate/Workspace & Identity"
│   ├── spark/
│   │   └── spark.stories.tsx
│   │       Title: "WISSIL/Spark/IDE Experience"
│   ├── waypoint/
│   │   └── waypoint.stories.tsx
│   │       Title: "WISSIL/Waypoint/Unity Visual Scripting"
│   └── ignis/
│       └── ignis.stories.tsx
│           Title: "WISSIL/Ignis/API Backend"
│
└── wissil/                       # Component stories (uppercase paths, unique names)
    ├── Ignition/
    │   └── IgnitionComponents.stories.tsx
    │       Title: "WISSIL/Ignition/Components"
    ├── Landing/
    │   └── LandingComponents.stories.tsx
    │       Title: "WISSIL/Landing/Components"
    ├── Slate/
    │   └── SlateComponents.stories.tsx
    │       Title: "WISSIL/Slate/Components"
    ├── Spark/
    │   └── SparkComponents.stories.tsx
    │       Title: "WISSIL/Spark/Components"
    ├── Waypoint/
    │   └── WaypointComponents.stories.tsx
    │       Title: "WISSIL/Waypoint/Components"
    └── Ignis/
        └── IgnisComponents.stories.tsx
            Title: "WISSIL/Ignis/Components"
```

---

## 🎯 Result

- ✅ No more case-sensitivity conflicts
- ✅ Unique bundle names generated
- ✅ Clear story organization
- ✅ Windows-compatible file structure

---

## 🚀 Prevention

To avoid similar issues in the future:

1. **Use consistent casing** for story file names
2. **Use unique story titles** in the Storybook hierarchy
3. **Clear cache** when renaming story files: `Remove-Item -Recurse -Force node_modules\.cache\storybook`
4. **Test on Windows** if developing cross-platform

---

*Fixed: December 2024*

