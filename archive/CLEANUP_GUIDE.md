# Archive Cleanup Guide

This guide documents which files should be archived from the root directory.

## Files to Archive

### Phase Status Files (→ `archive/phases/`)
These document historical implementation progress:

- PHASE_1_IMPLEMENTATION.md
- PHASE_1_STATUS.md
- PHASE_2_STATUS.md
- PHASE_3_1_STATUS.md
- PHASE_3_2_PART_B_STATUS.md
- PHASE_3_2_PART_C_STATUS.md
- PHASE_3_2_PART_D_STATUS.md
- PHASE_3_2_PART_E_STATUS.md
- PHASE_3_3_STATUS.md
- PHASE_3_4_STATUS.md
- PHASE_3_5_STATUS.md
- PHASE_3_6_STATUS.md
- PHASE_4_1_STATUS.md
- PHASE_4_2_STATUS.md
- PHASE_4_3_STATUS.md
- PHASE_4_4_STATUS.md
- PHASE_4_5_STATUS.md
- PHASE_4_6_STATUS.md
- PHASE_4_7_STATUS.md
- PHASE_5_STATUS.md
- PHASE_6_1_STATUS.md
- PHASE_6_UNITY_STATUS.md
- PHASE_A_STATUS.md
- PHASE_AE_EXPANSION_STATUS.md
- PHASE_B_STATUS.md
- PHASE_C_STATUS.md
- PHASE_D_STATUS.md
- PHASE_E_STATUS.md
- PHASE_F_STATUS.md
- PHASE_G_STATUS.md
- PHASE_H_STATUS.md
- PHASE_I_STATUS.md
- PHASE_J_STATUS.md
- PHASE_K_STATUS.md
- PHASE_L_STATUS.md
- PHASE_M_STATUS.md
- PHASE_N_STATUS.md
- PHASE_O_STATUS.md
- PHASE_P_STATUS.md
- PHASE_Q_STATUS.md
- PHASE_R_STATUS.md
- PHASE_U_STATUS.md
- PHASE_V_STATUS.md
- PHASE_W_STATUS.md
- PHASE_X_STATUS.md
- PHASE_Y_STATUS.md
- PHASE_Z_STATUS.md

### Status Files (→ `archive/status/`)
- AUTOMATED_QA_SUITE_COMPLETE.md
- CHROMATIC_DELIVERY_COMPLETE.md
- CHROMATIC_INTEGRATION_COMPLETE.md
- COMPREHENSIVE_UPDATE_SUMMARY.md
- IGNIS_BLUEPRINT_STATUS.md
- IGNIS_EXPANSION_COMPLETE.md
- STORYBOOK_STATUS.md

### Chromatic Files (→ `archive/chromatic/`)
- CHROMATIC_SETUP.md
- CURSOR_CHROMATIC_SETUP_PROMPT.md

### Setup Files (→ `archive/setup/`)
- SETUP_STORYBOOK.md

### Superseded Documentation (→ `archive/docs/`)
- ARCHITECTURE.md (replaced by REPOSITORY_ARCHITECTURE.md)
- WISSIL_ARCHITECTURE_SCAFFOLD.md (superseded)

## Keep in Root

These files should remain in the root directory:

- README.md (main project README)
- REPOSITORY_ARCHITECTURE.md (current architecture docs)
- REPOSITORY_COMPLETE_OVERVIEW.md
- REPOSITORY_DIAGRAMS.md
- REPOSITORY_MINDMAP.md
- REPOSITORY_QUICK_REFERENCE.md
- package.json
- tsconfig.json
- All config files (*.config.js, *.config.ts)

## Manual Cleanup Steps

1. Create archive directories:
   ```powershell
   mkdir archive/phases, archive/status, archive/docs, archive/setup, archive/chromatic
   ```

2. Move files using PowerShell:
   ```powershell
   # Move Phase files
   Move-Item PHASE_*.md archive/phases/
   
   # Move status files
   Move-Item AUTOMATED_QA_SUITE_COMPLETE.md,CHROMATIC_DELIVERY_COMPLETE.md,CHROMATIC_INTEGRATION_COMPLETE.md,COMPREHENSIVE_UPDATE_SUMMARY.md,IGNIS_BLUEPRINT_STATUS.md,IGNIS_EXPANSION_COMPLETE.md,STORYBOOK_STATUS.md archive/status/
   
   # Move Chromatic files
   Move-Item CHROMATIC_SETUP.md,CURSOR_CHROMATIC_SETUP_PROMPT.md archive/chromatic/
   
   # Move setup files
   Move-Item SETUP_STORYBOOK.md archive/setup/
   
   # Move superseded docs
   Move-Item ARCHITECTURE.md,WISSIL_ARCHITECTURE_SCAFFOLD.md archive/docs/
   ```

3. Or use Git to move files (preserves history):
   ```bash
   git mv PHASE_*.md archive/phases/
   git mv AUTOMATED_QA_SUITE_COMPLETE.md archive/status/
   # etc...
   ```

## After Cleanup

The root directory should only contain:
- Essential configuration files
- Main documentation (REPOSITORY_*.md)
- README.md
- Active project files

All historical documentation will be in `archive/` for reference.

