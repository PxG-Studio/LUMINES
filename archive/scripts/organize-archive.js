/**
 * Archive Organization Script
 * Moves files to appropriate archive directories
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const archiveBase = path.join(rootDir, 'archive');

// Create archive directories
const dirs = ['phases', 'status', 'chromatic', 'setup', 'docs'];
dirs.forEach(dir => {
  const dirPath = path.join(archiveBase, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created: ${dirPath}`);
  }
});

let movedCount = 0;

// Move Phase files
console.log('\n📁 Moving Phase files...');
const phaseFiles = fs.readdirSync(rootDir)
  .filter(f => f.startsWith('PHASE_') && f.endsWith('.md'))
  .filter(f => !f.includes('docs'));

phaseFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(archiveBase, 'phases', file);
  try {
    fs.renameSync(src, dest);
    movedCount++;
    console.log(`  ✓ ${file}`);
  } catch (err) {
    console.error(`  ✗ Failed: ${file} - ${err.message}`);
  }
});

// Move Status files
console.log('\n📁 Moving Status files...');
const statusFiles = [
  'AUTOMATED_QA_SUITE_COMPLETE.md',
  'CHROMATIC_DELIVERY_COMPLETE.md',
  'CHROMATIC_INTEGRATION_COMPLETE.md',
  'COMPREHENSIVE_UPDATE_SUMMARY.md',
  'IGNIS_BLUEPRINT_STATUS.md',
  'IGNIS_EXPANSION_COMPLETE.md',
  'STORYBOOK_STATUS.md'
];

statusFiles.forEach(file => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    const dest = path.join(archiveBase, 'status', file);
    try {
      fs.renameSync(src, dest);
      movedCount++;
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${file} - ${err.message}`);
    }
  }
});

// Move Chromatic files
console.log('\n📁 Moving Chromatic files...');
const chromaticFiles = [
  'CHROMATIC_SETUP.md',
  'CURSOR_CHROMATIC_SETUP_PROMPT.md'
];

chromaticFiles.forEach(file => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    const dest = path.join(archiveBase, 'chromatic', file);
    try {
      fs.renameSync(src, dest);
      movedCount++;
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${file} - ${err.message}`);
    }
  }
});

// Move Setup files
console.log('\n📁 Moving Setup files...');
const setupFile = 'SETUP_STORYBOOK.md';
const setupSrc = path.join(rootDir, setupFile);
if (fs.existsSync(setupSrc)) {
  const setupDest = path.join(archiveBase, 'setup', setupFile);
  try {
    fs.renameSync(setupSrc, setupDest);
    movedCount++;
    console.log(`  ✓ ${setupFile}`);
  } catch (err) {
    console.error(`  ✗ Failed: ${setupFile} - ${err.message}`);
  }
}

// Move superseded docs
console.log('\n📁 Moving superseded documentation...');
const docFiles = [
  'ARCHITECTURE.md',
  'WISSIL_ARCHITECTURE_SCAFFOLD.md'
];

docFiles.forEach(file => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    const dest = path.join(archiveBase, 'docs', file);
    try {
      fs.renameSync(src, dest);
      movedCount++;
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${file} - ${err.message}`);
    }
  }
});

// Summary
console.log('\n✅ Archive Complete!');
console.log(`\n📦 Total files moved: ${movedCount}`);

// Count files in each directory
console.log('\n📊 Summary:');
dirs.forEach(dir => {
  const dirPath = path.join(archiveBase, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    console.log(`  ${dir}: ${files.length} files`);
  }
});

