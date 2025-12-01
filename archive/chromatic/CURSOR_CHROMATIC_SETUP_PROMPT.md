# ⭐ CURSOR PROMPT — "Set Up Chromatic for WISSIL"

*(Copy & paste directly into Cursor)*

---

You are to fully integrate CHROMATIC (Chroma's visual regression engine for Storybook) into the WISSIL/LUMINES repository as described in the documentation files:

- REPOSITORY_ARCHITECTURE.md
- REPOSITORY_COMPLETE_OVERVIEW.md
- REPOSITORY_DIAGRAMS.md
- REPOSITORY_MINDMAP.md
- REPOSITORY_QUICK_REFERENCE.md

Your goals:

1. Install Chromatic into the repo

2. Configure Storybook for subsystem grouping

3. Add Chromatic GitHub Actions workflow

4. Annotate all critical stories with Chromatic visual parameters

5. Create Storybook test hierarchy matching the 6-WISSIL subsystem architecture:
   - Landing
   - Slate
   - Ignition
   - Spark
   - Ignis
   - Waypoint

6. Add visual snapshot protection for the following WISSIL subsystems:
   - Slate tokens, typography, colors, shadows
   - All Slate primitives (Buttons, Panels, Inputs, SplitView, Cards)
   - Ignis Node Editor (NodeRenderer, WireRenderer, BPGraphCanvas, NodePalette)
   - Ignis Inspector, Debugger, CSharp generator views
   - Ignis multi-user editor (cursor overlay + selection)
   - SceneGraph, Prefab Inspector, Prefab Variant Editor, UI Canvas Editor
   - Shader Editor, Audio Mixer, Animation Timeline, Lighting Editor
   - Spark Template Browser & Template Graph Renderer
   - Full BlueprintEditor composite view
   - All page-level subsystems under /app (Landing/Slate/Ignition/Spark/Ignis/Waypoint)

7. Ensure snapshot stability for all stories by adding:
   ```typescript
   parameters: {
     layout: "fullscreen",
     chromatic: { diffThreshold: 0.01 }
   }
   ```

8. Add a COMPLETE GitHub Action workflow:
   - Triggers on PRs and pushes to main/develop
   - Uses chromaui/action@v1
   - autoAcceptChanges: false
   - onlyChanged: true
   - exitZeroOnChanges: false
   - turboSnap enabled for large repo test acceleration
   - Requires CHROMATIC_PROJECT_TOKEN

9. Modify package.json to include:
   - build-storybook
   - chromatic script
   - Ensure Storybook build is optimized for Chromatic

10. Modify Storybook config (.storybook/preview.js or preview.ts):
    - Add grouping via storySort matching the 6-subsystem design
    - Add global Chromatic settings
    - Add dark/light theme toggles if needed

11. Create a standalone "CHROMA_STATUS.md" inside /docs summarizing:
    - What is snapshotted
    - How to approve or reject changes
    - Required stories
    - Visual test policies

12. Ensure Chroma tests only run on relevant files by using chromatic's TurboSnap:
    - Detects changed files
    - Only runs snapshots on affected stories

13. Validate that the entire repository is visually safe:
    - Slate UI design system remains pixel-consistent
    - Ignis Node Editor UI remains stable
    - Ignition workspace panels remain aligned
    - Spark templates render consistently
    - Waypoint and Landing layouts remain visually correct

Deliverables you must generate:

✔ chromatic.yml workflow under .github/workflows/  
✔ Storybook preview configuration for subsystem grouping  
✔ Updated package.json scripts  
✔ Annotated stories across the repository  
✔ CHROMA_STATUS.md  
✔ Optional: recommendations for caching & test acceleration

Begin now.

---

*Note: This prompt is designed to automate the complete Chromatic setup for the WISSIL/LUMINES repository. Copy and paste it directly into Cursor to execute.*

