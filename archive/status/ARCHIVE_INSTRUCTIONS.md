# Archive Files - Instructions

## Quick Method: Run Batch File

Simply double-click or run:
```batch
archive-files.bat
```

This will automatically:
1. Create all archive directories
2. Move all Phase files (PHASE_*.md)
3. Move all Status files
4. Move Chromatic files
5. Move Setup files
6. Move superseded documentation
7. Show a summary

---

## Manual Method: Git Commands (Preserves History)

If you want to preserve Git history, use these commands:

```bash
# Create directories
mkdir -p archive/phases archive/status archive/chromatic archive/setup archive/docs

# Move Phase files (preserves Git history)
git mv PHASE_*.md archive/phases/

# Move Status files
git mv AUTOMATED_QA_SUITE_COMPLETE.md archive/status/
git mv CHROMATIC_DELIVERY_COMPLETE.md archive/status/
git mv CHROMATIC_INTEGRATION_COMPLETE.md archive/status/
git mv COMPREHENSIVE_UPDATE_SUMMARY.md archive/status/
git mv IGNIS_BLUEPRINT_STATUS.md archive/status/
git mv IGNIS_EXPANSION_COMPLETE.md archive/status/
git mv STORYBOOK_STATUS.md archive/status/

# Move Chromatic files
git mv CHROMATIC_SETUP.md archive/chromatic/
git mv CURSOR_CHROMATIC_SETUP_PROMPT.md archive/chromatic/

# Move Setup files
git mv SETUP_STORYBOOK.md archive/setup/

# Move superseded docs
git mv ARCHITECTURE.md archive/docs/
git mv WISSIL_ARCHITECTURE_SCAFFOLD.md archive/docs/
```

---

## Alternative: PowerShell (Run in PowerShell terminal)

```powershell
# Create directories
New-Item -ItemType Directory -Force -Path archive/phases, archive/status, archive/chromatic, archive/setup, archive/docs

# Move Phase files
Get-ChildItem PHASE_*.md | Move-Item -Destination archive/phases/

# Move Status files
@('AUTOMATED_QA_SUITE_COMPLETE.md','CHROMATIC_DELIVERY_COMPLETE.md','CHROMATIC_INTEGRATION_COMPLETE.md','COMPREHENSIVE_UPDATE_SUMMARY.md','IGNIS_BLUEPRINT_STATUS.md','IGNIS_EXPANSION_COMPLETE.md','STORYBOOK_STATUS.md') | ForEach-Object { if (Test-Path $_) { Move-Item $_ archive/status/ } }

# Move Chromatic files
@('CHROMATIC_SETUP.md','CURSOR_CHROMATIC_SETUP_PROMPT.md') | ForEach-Object { if (Test-Path $_) { Move-Item $_ archive/chromatic/ } }

# Move Setup files
if (Test-Path SETUP_STORYBOOK.md) { Move-Item SETUP_STORYBOOK.md archive/setup/ }

# Move superseded docs
@('ARCHITECTURE.md','WISSIL_ARCHITECTURE_SCAFFOLD.md') | ForEach-Object { if (Test-Path $_) { Move-Item $_ archive/docs/ } }
```

---

## Files to Move

### Phase Files (56 files)
All files matching `PHASE_*.md` in root

### Status Files (7 files)
- AUTOMATED_QA_SUITE_COMPLETE.md
- CHROMATIC_DELIVERY_COMPLETE.md
- CHROMATIC_INTEGRATION_COMPLETE.md
- COMPREHENSIVE_UPDATE_SUMMARY.md
- IGNIS_BLUEPRINT_STATUS.md
- IGNIS_EXPANSION_COMPLETE.md
- STORYBOOK_STATUS.md

### Chromatic Files (2 files)
- CHROMATIC_SETUP.md
- CURSOR_CHROMATIC_SETUP_PROMPT.md

### Setup Files (1 file)
- SETUP_STORYBOOK.md

### Superseded Docs (2 files)
- ARCHITECTURE.md
- WISSIL_ARCHITECTURE_SCAFFOLD.md

---

**Total: ~68 files to archive**


