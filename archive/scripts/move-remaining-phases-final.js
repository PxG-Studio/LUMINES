const fs = require('fs').promises;
const path = require('path');

const archiveDir = 'archive/phases';
const rootDir = process.cwd();

const phaseFiles = [
  'PHASE_N_STATUS.md',
  'PHASE_O_STATUS.md',
  'PHASE_P_STATUS.md',
  'PHASE_Q_STATUS.md',
  'PHASE_R_STATUS.md',
  'PHASE_U_STATUS.md',
  'PHASE_V_STATUS.md',
  'PHASE_W_STATUS.md',
  'PHASE_X_STATUS.md',
  'PHASE_Y_STATUS.md',
  'PHASE_Z_STATUS.md',
  'PHASE_AE_EXPANSION_STATUS.md',
];

async function movePhaseFile(file) {
  const sourcePath = path.join(rootDir, file);
  const destinationPath = path.join(rootDir, archiveDir, file);

  try {
    await fs.access(sourcePath);
    const content = await fs.readFile(sourcePath, 'utf8');
    await fs.writeFile(destinationPath, content, 'utf8');
    await fs.unlink(sourcePath);
    console.log(`✓ Moved '${file}'`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`- Skipped '${file}' (not found)`);
      return false;
    } else {
      console.error(`✗ Failed to move '${file}': ${error.message}`);
      return false;
    }
  }
}

async function main() {
  console.log('Moving remaining Phase files to archive/phases/...\n');

  let moved = 0;
  let skipped = 0;

  for (const file of phaseFiles) {
    const result = await movePhaseFile(file);
    if (result) moved++;
    else skipped++;
  }

  console.log(`\nFinished! Moved: ${moved}, Skipped: ${skipped}`);
}

main().catch(console.error);

