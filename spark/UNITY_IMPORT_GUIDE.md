# Unity Import Guide

Step-by-step instructions for importing SPARK-generated scripts into Unity Editor.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Detailed Import Process](#detailed-import-process)
3. [Verification Steps](#verification-steps)
4. [Unity Version Compatibility](#unity-version-compatibility)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Topics](#advanced-topics)

---

## Quick Start

### 5-Minute Import

1. **Generate and export** a script from SPARK
2. **Download the ZIP** file (e.g., `PlayerController.zip`)
3. **Extract the ZIP** to your desktop
4. **Open your Unity project**
5. **Drag the extracted Assets folder** into Unity's Project window
6. **Wait for Unity to import** (1-3 seconds)
7. **Done!** Your script is ready to use

---

## Detailed Import Process

### Method 1: Drag and Drop (Recommended)

**Step 1: Export from SPARK**
- Generate your script in SPARK
- Click "Export as ZIP"
- Save to a known location (e.g., Downloads folder)

**Step 2: Extract ZIP**
- Right-click the ZIP file
- Select "Extract All" (Windows) or double-click (Mac)
- Note the extracted folder location

**Step 3: Open Unity**
- Launch Unity Hub
- Open your target project
- Wait for Unity to fully load

**Step 4: Import Assets**
- In Unity's Project window, navigate to your Assets folder
- Drag the extracted `Assets` folder from File Explorer/Finder
- Drop it onto the Unity Project window
- Unity will automatically process the files

**Step 5: Verify Import**
- Look for the `Scripts` folder in your Project window
- Navigate to `Assets/Scripts/`
- Your generated script should be visible (e.g., `PlayerController.cs`)
- Check that the script icon appears (not a warning icon)

### Method 2: Manual Copy

**Step 1: Locate Your Unity Project**
```
Windows: C:/Users/YourName/Projects/MyUnityGame/
Mac: /Users/YourName/Projects/MyUnityGame/
```

**Step 2: Extract ZIP**
- Extract the SPARK ZIP file
- You should see an `Assets` folder with a `Scripts` subfolder

**Step 3: Copy Files**
```
From: ExtractedZIP/Assets/Scripts/
To:   YourUnityProject/Assets/Scripts/
```

**Step 4: Return to Unity**
- Unity will automatically detect the new files
- Wait for import to complete (progress bar at bottom)

### Method 3: Unity Package Import

If you exported using the "Unity Package" template:

1. In Unity, go to `Assets > Import Package > Custom Package`
2. Navigate to your exported ZIP
3. Select all items in the import dialog
4. Click "Import"
5. Files appear in your Project window

---

## Verification Steps

### Check 1: File Appears in Project
- **Location**: `Assets/Scripts/YourScript.cs`
- **Icon**: Should show C# script icon (not warning)
- **Status**: No errors in Console

### Check 2: Script Compiles
1. Check Unity Console (Ctrl+Shift+C / Cmd+Shift+C)
2. Should see "Compilation finished" with 0 errors
3. If errors appear, see [Troubleshooting](#troubleshooting)

### Check 3: Inspector Shows Script
1. Click the script in Project window
2. Inspector shows script contents
3. Can see public variables (if any)

### Check 4: Script is Attachable
1. Select any GameObject in your scene
2. Click "Add Component"
3. Search for your script name
4. Should appear in the search results
5. Click to attach to GameObject

### Check 5: Script Runs
1. Attach script to a GameObject
2. Enter Play mode
3. Check Console for any Start() messages
4. Verify expected behavior

---

## Unity Version Compatibility

### Supported Versions

SPARK-generated scripts are compatible with:

**✅ Unity 2020.3 LTS** (Minimum)
- All core Unity API
- Standard MonoBehaviour features
- Basic Unity namespaces

**✅ Unity 2021.3 LTS** (Recommended)
- Full API support
- New Input System
- Enhanced features

**✅ Unity 2022.3 LTS** (Latest LTS)
- All latest features
- Best performance
- Future-proofed

**✅ Unity 2023.x** (Current)
- Full compatibility
- Latest Unity features

### API Compatibility Notes

**If using Unity 2020.x or earlier:**
- Some newer Unity APIs may not be available
- SPARK generates code compatible with Unity 2020.3+
- Older versions may require manual adjustments

**If using Unity Input System (new):**
- Tell SPARK explicitly: "Use the new Input System"
- Default generations use legacy Input (Input.GetAxis)

**If using Unity UI Toolkit:**
- Specify in your prompt: "Use UI Toolkit instead of Unity UI"
- Default is Unity UI (Canvas/Image/Text)

---

## Troubleshooting

### Issue: "The type or namespace name 'UnityEngine' could not be found"

**Cause**: Unity didn't recognize the script
**Solutions**:
1. Ensure file is in an `Assets` subfolder
2. Check file extension is `.cs`
3. Verify Unity is not in "Safe Mode"
4. Restart Unity

### Issue: Red script icon with warning symbol

**Cause**: Compilation error in the script
**Solutions**:
1. Check Console for specific error message
2. Double-click script to open in code editor
3. Look for typos or syntax errors
4. Try regenerating in SPARK

### Issue: "The associated script cannot be loaded"

**Cause**: Script class name doesn't match filename
**Solutions**:
1. Check that filename matches class name
   - File: `PlayerController.cs`
   - Class: `public class PlayerController`
2. Ensure they match exactly (case-sensitive)
3. Rename file or class to match

### Issue: "CS1002: ; expected"

**Cause**: Syntax error in generated code
**Solutions**:
1. This shouldn't happen (SPARK validates)
2. Try regenerating with a clearer prompt
3. Manually add missing semicolon
4. Report as a bug

### Issue: Script attaches but doesn't work

**Cause**: Runtime logic error or missing dependencies
**Solutions**:
1. Check Console for runtime errors
2. Ensure GameObject has required components
   - Rigidbody for physics
   - Animator for animations
   - AudioSource for sound
3. Verify tags and layers are set correctly
4. Check script's public variable values in Inspector

### Issue: "Script uses multiple engines"

**Cause**: Namespace conflict
**Solutions**:
1. Remove conflicting using statements
2. Fully qualify ambiguous types
3. Regenerate with clearer requirements

### Issue: Meta files missing

**Cause**: Copied files manually without meta files
**Solutions**:
1. Let Unity regenerate meta files (automatic)
2. Or re-import using drag-and-drop method
3. Never manually create .meta files

---

## Advanced Topics

### Working with Multiple Scripts

**Scenario**: Generated several related scripts

1. **Export each script separately**
   - PlayerController.zip
   - PlayerHealth.zip
   - PlayerInventory.zip

2. **Extract all to same location**
   ```
   Assets/
   └── Scripts/
       ├── PlayerController.cs
       ├── PlayerHealth.cs
       └── PlayerInventory.cs
   ```

3. **Import together** by dragging Scripts folder into Unity

4. **Scripts can reference each other**
   ```csharp
   // PlayerController can use:
   PlayerHealth health = GetComponent<PlayerHealth>();
   ```

### Organizing Imported Scripts

**Create a folder structure:**
```
Assets/
└── Scripts/
    ├── SPARK_Generated/
    │   ├── Player/
    │   │   ├── PlayerController.cs
    │   │   └── PlayerHealth.cs
    │   ├── Enemies/
    │   │   └── EnemyAI.cs
    │   └── UI/
    │       └── HealthBar.cs
    └── Custom/
        └── MyCustom.cs
```

**Benefits:**
- Keep generated code separate
- Easy to regenerate and replace
- Clear organization
- Better version control

### Version Control (Git)

**Include:**
- `.cs` script files
- `.meta` files (important!)

**Exclude:**
- `.zip` files from SPARK
- Temporary exports

**Example .gitignore:**
```gitignore
# SPARK exports (optional)
*.spark.zip

# But always include:
!Assets/**/*.cs
!Assets/**/*.cs.meta
```

### Assembly Definitions

For large projects, consider Assembly Definitions:

1. **In Unity**: Right-click Scripts folder
2. **Select**: Create > Assembly Definition
3. **Name it**: `SPARK.Generated.asmdef`
4. **Benefits**:
   - Faster compilation
   - Better modularity
   - Cleaner dependencies

**Example asmdef:**
```json
{
  "name": "SPARK.Generated",
  "references": [],
  "includePlatforms": [],
  "excludePlatforms": []
}
```

### Custom Import Settings

**If using Unity Package export:**

SPARK can generate with custom settings:
- Assembly definitions
- Package manifest
- README files
- Organized folder structure

**Enable in SPARK:**
1. Click "Export Options" before exporting
2. Select "Unity Package" template
3. Export
4. Import using `Assets > Import Package > Custom Package`

---

## Import Workflow for Teams

### Single Developer
1. Generate script
2. Export and import
3. Test and commit to version control

### Team Workflow
1. **Developer A** generates script in SPARK
2. Exports as ZIP and shares via cloud/Slack
3. **Developer B** downloads and imports to Unity
4. Tests and provides feedback
5. If changes needed, **Developer A** regenerates
6. Final version committed to version control

### CI/CD Pipeline
SPARK exports can be automated:
1. Generate scripts via API (future feature)
2. Auto-import to Unity project
3. Run automated tests
4. Deploy if tests pass

---

## Quality Checklist

Before considering import complete:

- [ ] Script compiles without errors
- [ ] Script appears in Add Component menu
- [ ] Can attach to GameObject
- [ ] Public variables visible in Inspector
- [ ] Script runs in Play mode
- [ ] No Console errors at runtime
- [ ] Behavior matches expectations
- [ ] .meta files present (if using version control)

---

## Common Unity Patterns

### Pattern: Player Controller

**Import Steps:**
1. Import PlayerController script
2. Create empty GameObject in scene
3. Rename to "Player"
4. Add PlayerController component
5. Add required components (Rigidbody, Capsule Collider)
6. Test movement

### Pattern: Collectible Item

**Import Steps:**
1. Import Coin script
2. Create 3D object (Cylinder or Cube)
3. Add Coin script
4. Add Box Collider with Is Trigger = true
5. Test by running into it

### Pattern: Enemy AI

**Import Steps:**
1. Import EnemyAI script
2. Create empty GameObject
3. Add EnemyAI component
4. Add required components (NavMeshAgent)
5. Create and bake NavMesh
6. Test enemy behavior

---

## Next Steps

After successful import:

1. **Test the script** in Play mode
2. **Customize behavior** by adjusting Inspector values
3. **Combine scripts** to build complex systems
4. **Iterate** - regenerate and refine as needed
5. **Build** your game!

---

**Related Documentation:**
- User Guide: `USER_GUIDE.md`
- Testing Guide: `TESTING_GUIDE.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`

**Questions?**
Check the troubleshooting section or refer to Unity's documentation for engine-specific issues.

**Generated by SPARK - Making Unity Development Easier**
