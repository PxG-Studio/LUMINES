const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const archiveDir = path.join(rootDir, 'archive', 'phases');

// Ensure archive directory exists
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

// Get all Phase files in root
const files = fs.readdirSync(rootDir)
  .filter(file => file.startsWith('PHASE_') && file.endsWith('.md'))
  .map(file => ({
    name: file,
    source: path.join(rootDir, file),
    dest: path.join(archiveDir, file)
  }));

console.log(`Found ${files.length} Phase files to move\n`);

let moved = 0;
let errors = 0;

files.forEach(({ name, source, dest }) => {
  try {
    // Read content
    const content = fs.readFileSync(source, 'utf8');
    
    // Write to archive
    fs.writeFileSync(dest, content, 'utf8');
    
    // Delete original
    fs.unlinkSync(source);
    
    moved++;
    console.log(`✓ Moved: ${name}`);
  } catch (error) {
    errors++;
    console.error(`✗ Failed: ${name} - ${error.message}`);
  }
});

console.log(`\n✅ Completed: ${moved} files moved, ${errors} errors`);

