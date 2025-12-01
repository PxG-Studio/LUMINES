# 📊 VISUAL_REGRESSION_MATRIX.md

**WISSIL / LUMINES — Visual Regression Risk Matrix & Severity Guide**

*Last updated: December 2024*

---

# 📘 Purpose

This document defines:

- ✅ **The severity of visual regressions**
- ✅ **Impact assessment across the 6 WISSIL subsystems**
- ✅ **Risk scores for each UI surface**
- ✅ **Owner groups responsible for triaging**
- ✅ **Expected timelines for fixes**

This is the master reference for all Chromatic visual diff reviews.

---

# 🚦 Severity Levels

| Level     | Name     | Meaning                                     | Must Fix Before Merge? |
| --------- | -------- | ------------------------------------------- | ---------------------- |
| 🟥 **S0** | Critical | IDE or major editor surface breaks          | YES                    |
| 🟧 **S1** | Major    | User workflow broken / UI panels misaligned | YES                    |
| 🟨 **S2** | Minor    | Small UI drift (≤2px)                       | Recommended            |
| 🟦 **S3** | Neutral  | Expected / intentional change               | Acceptable             |
| 🟩 **S4** | Cosmetic | Non-impactful visual differences            | Acceptable             |

---

# 📊 Risk Scoring System

Risk = **Impact × Surface Complexity × Frequency of Use**

Each component receives a **0–30 score**:

| Score Range | Risk Category    |
| ----------- | ---------------- |
| **24–30**   | 🔥 Extreme Risk  |
| **16–23**   | 🛑 High Risk     |
| **10–15**   | ⚠️ Moderate Risk |
| **4–9**     | 🟢 Low Risk      |
| **0–3**     | 🟩 Minimal Risk  |

---

# 🧩 WISSIL Subsystem Visual Regression Matrix

---

# ⭐ 1. IGNIS — Blueprint Node Editor (Highest Risk)

| Component        | S0 | Risk Score | Impact                   | Owner       |
| ---------------- | -- | ---------- | ------------------------ | ----------- |
| NodeRenderer     | 🟥 | **30/30**  | All nodes visually break | Ignis Core  |
| WireRenderer     | 🟥 | **29/30**  | Graphs unreadable        | Ignis Core  |
| BPGraphCanvas    | 🟥 | **28/30**  | Editor unusable          | Ignis Core  |
| NodePalette      | 🟧 | **22/30**  | Users cannot add nodes   | Ignis UX    |
| InspectorPanel   | 🟧 | **20/30**  | Cannot modify node props | Ignis UX    |
| DebuggerView     | 🟧 | **18/30**  | Breakpoints hidden       | Ignis Debug |
| MultiUserOverlay | 🟧 | **17/30**  | Collaboration confusing  | Collab Team |

👉 **Ignis is the #1 regression risk zone.**

👉 Any regression in NodeRenderer/WireRenderer/Cavas **blocks merge**.

---

# ⭐ 2. SLATE — Design System (Shared Across IDE)

| Component             | S0 | Risk Score | Impact                         | Owner    |
| --------------------- | -- | ---------- | ------------------------------ | -------- |
| Color Tokens          | 🟥 | **28/30**  | Affects EVERY subsystem        | Slate DS |
| Typography            | 🟥 | **27/30**  | Affects readability everywhere | Slate DS |
| Shadows & Elevation   | 🟥 | **26/30**  | Panels overlap unpredictably   | Slate DS |
| Panels / Card / Frame | 🟧 | **21/30**  | Multi-pane layout breaks       | Slate DS |
| SplitView             | 🟧 | **20/30**  | Editor layout collapse         | Slate DS |
| Buttons / Inputs      | 🟧 | **19/30**  | Widespread UI breakage         | Slate DS |

👉 If Slate breaks, **entire WISSIL breaks**.

---

# ⭐ 3. SPARK — Game Template System (Graph-Based)

| Component             | S0 | Risk Score | Impact                      | Owner      |
| --------------------- | -- | ---------- | --------------------------- | ---------- |
| Template Graph Layout | 🟧 | **23/30**  | Starter projects incorrect  | Spark Team |
| Template Browser      | 🟧 | **19/30**  | Devs can't choose templates | Spark UX   |
| Metadata Panel        | 🟨 | **14/30**  | Confusion, lower severity   | Spark UX   |
| Template Previews     | 🟨 | **10/30**  | Mostly cosmetic             | Spark UX   |

👉 Spark must be stable for good onboarding.

👉 Graph layout regressions = **major**.

---

# ⭐ 4. IGNITION — Runtime Build UI

| Component           | S0 | Risk Score | Impact                   | Owner         |
| ------------------- | -- | ---------- | ------------------------ | ------------- |
| Build Dashboard     | 🟧 | **22/30**  | Users cannot build       | Ignition Core |
| WebGL Preview Frame | 🟧 | **21/30**  | Cannot see runtime state | Ignition Core |
| Logs Console        | 🟨 | **13/30**  | Debugging harder         | Ignition Core |
| Deploy Panel        | 🟨 | **12/30**  | Lower severity           | Ignition UX   |

👉 Runtime issues are **workflow blockers**.

---

# ⭐ 5. UNITY-INSPIRED TOOLS (Scene, Prefab, UI Canvas, Shader, Timeline)

| Component              | S0 | Risk Score | Impact                  | Owner       |
| ---------------------- | -- | ---------- | ----------------------- | ----------- |
| SceneGraph Panel       | 🟧 | **23/30**  | Object tree unreadable  | Unity Tools |
| Prefab Inspector       | 🟧 | **22/30**  | Major workflow break    | Unity Tools |
| Prefab Variant Editor  | 🟧 | **21/30**  | Overrides unclear       | Unity Tools |
| UI Canvas Editor       | 🟧 | **19/30**  | Canvas design difficult | Unity Tools |
| Shader Editor          | 🟧 | **19/30**  | Shader nodes unreadable | Unity Tools |
| Audio Mixer            | 🟨 | **13/30**  | Lower severity          | Unity Tools |
| Material Editor        | 🟨 | **12/30**  | Minor drift             | Unity Tools |
| Lighting Editor        | 🟨 | **12/30**  | Minor drift             | Unity Tools |
| Animation Timeline     | 🟧 | **18/30**  | Core timeline usability | Unity Tools |

👉 These tools mimic Unity/Unreal editors and must remain stable.

---

# ⭐ 6. WAYPOINT — Assistant / Guidance UI

| Component             | S0 | Risk Score | Impact             | Owner         |
| --------------------- | -- | ---------- | ------------------ | ------------- |
| Guidance Panel        | 🟨 | **14/30**  | UX degradation     | Waypoint Team |
| Suggestions Overlay   | 🟨 | **12/30**  | Lower severity     | Waypoint Team |
| Multi-step onboarding | 🟧 | **16/30**  | Onboarding blocked | Waypoint Team |

---

# ⭐ 7. SYSTEM PAGES (6 Subsystems)

| Page        | S0 | Risk Score | Impact                  |
| ----------- | -- | ---------- | ----------------------- |
| `/landing`  | 🟨 | **10/30**  | Marketing / entry point |
| `/slate`    | 🟧 | **19/30**  | Core DS demo            |
| `/ignition` | 🟧 | **21/30**  | Runtime workflow        |
| `/spark`    | 🟧 | **20/30**  | Template creation       |
| `/ignis`    | 🟥 | **30/30**  | Primary IDE interface   |
| `/waypoint` | 🟨 | **12/30**  | Optional help           |

👉 `/ignis` is the most critical page in the system.

---

# 🧪 Risk Summary (By Category)

| Category               | Risk           | Why                          |
| ---------------------- | -------------- | ---------------------------- |
| Ignis Blueprint Editor | 🔥 Extreme     | Core of the IDE              |
| Slate Design System    | 🔥 Extreme     | Shared across all subsystems |
| Unity Tools            | 🛑 High        | Key dev workflows            |
| Spark Templates        | 🛑 High        | Project creation pipeline    |
| Ignition Runtime       | ⚠️ Medium-High | Build/preview workflows      |
| Waypoint Assistant     | 🟡 Medium      | Guidance only                |
| Landing Page           | 🟢 Low         | Cosmetic                     |

---

# 🚨 Must Fix Before Merge (S0/S1 Only)

These cause **PR blocks**:

- ✅ NodeRenderer
- ✅ WireRenderer
- ✅ GraphCanvas
- ✅ Slate Tokens / Globals
- ✅ Build Dashboard
- ✅ SceneGraph Panel
- ✅ Prefab Inspector
- ✅ `/ignis` page snapshots

If any of these regress → **stop the merge**.

---

# ⏱️ Recommended Time to Resolution

| Severity | SLA                        |
| -------- | -------------------------- |
| 🟥 S0    | Immediate (within same PR) |
| 🟧 S1    | Within 24 hours            |
| 🟨 S2    | Within 3 days              |
| 🟦 S3    | Acceptable immediately     |
| 🟩 S4    | Acceptable immediately     |

---

# 🧭 Owner Assignment Matrix

| Subsystem   | Owners             |
| ----------- | ------------------ |
| Slate       | Design System Team |
| Ignis       | Editor Team        |
| Spark       | Template Team      |
| Unity Tools | Tooling Team       |
| Ignition    | Runtime Team       |
| Waypoint    | Assistant/AI Team  |

When a regression occurs, assign it according to this matrix.

---

# 🍱 Appendix A — Most Common Regression Sources

- ✅ Slate token changes
- ✅ NodeRenderer padding alterations
- ✅ WireRenderer bezier misalignment
- ✅ Canvas zoom drift
- ✅ Flexbox layout shifts
- ✅ CSS inheritance from Slate components
- ✅ Storybook story missing deterministic props
- ✅ React transitions affecting snapshots
- ✅ Zustand store initializing differently
- ✅ Missing mock providers

---

# 🍱 Appendix B — Zero-Tolerance Zones

These components **must NEVER regress**:

- ✅ NodeRenderer
- ✅ WireRenderer
- ✅ GraphCanvas
- ✅ Inspector
- ✅ Debugger
- ✅ MultiUser Overlay
- ✅ Slate Tokens
- ✅ SceneGraph Panel
- ✅ Prefab Inspector
- ✅ Shader Editor
- ✅ UI Canvas Editor
- ✅ Animation Timeline

These are "critical path UX surfaces."

---

# 🍱 Appendix C — First Five Questions to Ask When Diagnosing

1. Did Slate tokens change?
2. Did any shared panel components update?
3. Did NodeRenderer/WireRenderer props change?
4. Did Storybook fail to disable animations?
5. Did any Position/Rect calculation functions change?

---

# 🎯 Final Note

This matrix is part of the WISSIL **Quality Layer**, ensuring:

- ✅ IDE stability
- ✅ Design consistency
- ✅ Blueprint graph usability
- ✅ Unity-like Editor reliability
- ✅ Spark template correctness
- ✅ Smooth onboarding via Waypoint
- ✅ Smooth builds via Ignition

This guide must be reviewed **every major subsystem release**.

---

**Status: Production Ready** ✅

*Last Updated: December 2024*

