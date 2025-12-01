# Remove "WISSIL Framework" Folder - Instructions

## Current Situation

The folder `src/stories/WISSIL Framework/` still exists and may appear in Storybook navigation. It needs to be renamed to `WIS2L Framework` to match all the title updates we've made.

## Why You're Seeing "WISSIL Framework"

Even though all story titles now use `WIS2L Framework`, Storybook may still show "WISSIL Framework" because:
1. The physical folder is still named "WISSIL Framework"
2. Storybook may cache folder names
3. The folder is currently locked by Storybook or your editor

## Solution: Manual Folder Rename

Since the folder is locked, you need to:

### Step 1: Close Everything
1. **Stop Storybook completely**
   - Press `Ctrl+C` in the terminal running Storybook
   - Or close the terminal window

2. **Close all editors/IDEs**
   - Close VS Code / Cursor
   - Make sure no files from `WISSIL Framework` folder are open

### Step 2: Rename the Folder

**Option A: Using File Explorer (Easiest)**
1. Open Windows File Explorer
2. Navigate to: `E:\Projects\LUMINES\src\stories\`
3. Find the folder named: **`WISSIL Framework`**
4. Right-click it → **Rename**
5. Change to: **`WIS2L Framework`**
6. Press Enter

**Option B: Using Command Line**
```powershell
# Make sure Storybook and editors are closed first!
cd E:\Projects\LUMINES\src\stories
Rename-Item "WISSIL Framework" "WIS2L Framework"
```

### Step 3: Clear Storybook Cache

After renaming, clear Storybook's cache:
```powershell
# Delete Storybook cache
Remove-Item -Recurse -Force node_modules\.cache\.storybook -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .storybook-storybook-static -ErrorAction SilentlyContinue
```

### Step 4: Restart Storybook

```powershell
npm run storybook
```

Then hard-refresh your browser: **Ctrl+Shift+R**

## Verify It Worked

After restarting Storybook, you should see:
- ✅ "WIS2L Framework" in the sidebar (not "WISSIL Framework")
- ✅ All stories organized under "WIS2L Framework"
- ✅ All Landing stories still work perfectly

## What's Already Done

✅ All story titles updated to use `WIS2L Framework`  
✅ All MDX Meta titles updated  
✅ All config files updated  
✅ All navigation helpers updated  

**Only the folder name needs to be changed now.**

---

## Quick Summary

1. **Close Storybook** ⚠️
2. **Close editors** ⚠️
3. **Rename folder** in File Explorer: `WISSIL Framework` → `WIS2L Framework`
4. **Clear cache**: Delete `node_modules/.cache/.storybook` if it exists
5. **Restart Storybook**
6. **Hard-refresh browser** (Ctrl+Shift+R)

That's it! 🎉

