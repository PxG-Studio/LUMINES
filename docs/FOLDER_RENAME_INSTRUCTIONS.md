# Folder Rename Instructions: WISSIL Framework → WIS2L Framework

The folder `src/stories/WISSIL Framework/` needs to be renamed to `src/stories/WIS2L Framework/` to match the canonical hierarchy.

## Automated Script

**Run the PowerShell script:**
```powershell
powershell -ExecutionPolicy Bypass -File "scripts/rename-wissil-to-wis2l-folder.ps1"
```

**Important:** Make sure Storybook is NOT running and no files are open before running this script.

## Manual Method (If Script Fails)

### Steps:

1. **Close Storybook**
   - Stop the Storybook development server completely
   - Close any browser windows with Storybook open

2. **Close All Editors**
   - Close VS Code / Cursor / your IDE
   - Make sure no files from the `WISSIL Framework` folder are open

3. **Rename in File Explorer**
   - Navigate to: `E:\Projects\LUMINES\src\stories\`
   - Find the folder: `WISSIL Framework`
   - Right-click → **Rename**
   - Change to: `WIS2L Framework`
   - Press Enter

4. **Verify**
   - Check that the folder is now named `WIS2L Framework`
   - Check that all 10 files are still inside:
     - Landing.mdx
     - MainGateway.stories.tsx
     - InteractiveLanding.stories.tsx
     - LandingComponents.stories.tsx
     - Ignis.mdx
     - BlueprintEditor.mdx
     - Ignition.mdx
     - Spark.mdx
     - Slate.mdx
     - Waypoint.mdx

5. **Restart Storybook**
   - Run `npm run storybook`
   - Hard-refresh browser (Ctrl+Shift+R)
   - Verify "WIS2L Framework" appears in sidebar

## Why This Is Needed

Even though all story titles use "WIS2L Framework", Storybook may display the folder name "WISSIL Framework" in:
- The sidebar navigation
- Story URLs
- Generated story IDs

Renaming the folder ensures consistency throughout Storybook.

## Files Already Updated

✅ All story titles updated to use `WIS2L Framework`  
✅ All MDX Meta titles updated  
✅ Storybook config files updated  
✅ Navigation helper files updated  

Only the physical folder name needs to be changed.

---

**After renaming, restart Storybook to see the changes!**

