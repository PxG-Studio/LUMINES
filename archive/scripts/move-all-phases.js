/**
 * Move all Phase files to archive
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const archivePhases = path.join(rootDir, 'archive', 'phases');

// Ensure archive directory exists
if (!fs.existsSync(archivePhases)) {
  fs.mkdirSync(archivePhases, { recursive: true });
}

// Get all Phase files in root
const phaseFiles = fs.readdirSync(rootDir)
  .filter(f => f.startsWith('PHASE_') && f.endsWith('.md'))
  .filter(f => !f.includes('docs'));

console.log(`Found ${phaseFiles.length} Phase files to move\n`);

let moved = 0;
let errors = 0;

phaseFiles.forEach((file, index) => {
  const src = path.join(rootDir, file);
  const dest = path.join(archivePhases, file);
  
  try {
    // Read file
    const content = fs.readFileSync(src, 'utf8');
    // Write to archive
    fs.writeFileSync(dest, content, 'utf8');
    // Delete original
    fs.unlinkSync(src);
    moved++;
    console.log(`[${index + 1}/${phaseFiles.length}] ✓ Moved: ${file}`);
  } catch (err) {
    errors++;
    console.error(`[${index + 1}/${phaseFiles.length}] ✗ Error: ${file} - ${err.message}`);
  }
});

console.log(`\n✅ Complete! Moved ${moved} files, ${errors} errors`);

