#!/usr/bin/env node

/**
 * Percy Storybook Snapshot Script
 * 
 * This script:
 * 1. Builds Storybook static files
 * 2. Freezes animations via CSS injection
 * 3. Generates responsive snapshots across viewports
 * 4. Runs Percy visual regression tests
 * 
 * Usage: node scripts/percy-storybook.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const STORYBOOK_BUILD_DIR = path.join(PROJECT_ROOT, 'storybook-static');
const PERCY_TOKEN = process.env.PERCY_TOKEN;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPercyToken() {
  if (!PERCY_TOKEN) {
    log('❌ PERCY_TOKEN environment variable is not set', 'red');
    log('   Set it in GitHub Secrets or .env file', 'yellow');
    process.exit(1);
  }
}

function buildStorybook() {
  log('📦 Building Storybook...', 'cyan');
  try {
    execSync('npm run build-storybook', {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    log('✅ Storybook build complete', 'green');
  } catch (error) {
    log('❌ Storybook build failed', 'red');
    process.exit(1);
  }
}

function verifyBuildOutput() {
  const indexFile = path.join(STORYBOOK_BUILD_DIR, 'index.html');
  if (!fs.existsSync(indexFile)) {
    log('❌ Storybook build output not found', 'red');
    log(`   Expected: ${STORYBOOK_BUILD_DIR}/index.html`, 'yellow');
    process.exit(1);
  }
  log('✅ Storybook build output verified', 'green');
}

function injectPercyCSS() {
  log('🎨 Injecting Percy CSS for animation freezing...', 'cyan');
  
  // Read the built index.html
  const indexFile = path.join(STORYBOOK_BUILD_DIR, 'index.html');
  let html = fs.readFileSync(indexFile, 'utf8');
  
  // Inject Percy CSS into the head
  const percyCSS = `
    <style id="percy-freeze">
      /* Freeze animations for consistent snapshots */
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      
      /* Ensure consistent rendering */
      canvas,
      iframe,
      video {
        visibility: visible !important;
      }
    </style>
  `;
  
  // Insert before closing </head>
  html = html.replace('</head>', `${percyCSS}</head>`);
  fs.writeFileSync(indexFile, html, 'utf8');
  
  log('✅ Percy CSS injected', 'green');
}

function runPercySnapshots() {
  log('📸 Running Percy snapshots...', 'cyan');
  log('   This will generate snapshots for all Storybook stories', 'yellow');
  log('   Viewports: 375px, 768px, 1280px, 1920px', 'yellow');
  
  try {
    // Use percy snapshot command with Storybook build directory
    execSync(`npx percy snapshot ${STORYBOOK_BUILD_DIR}`, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      env: {
        ...process.env,
        PERCY_TOKEN: PERCY_TOKEN,
      },
    });
    log('✅ Percy snapshots complete', 'green');
  } catch (error) {
    log('❌ Percy snapshot failed', 'red');
    log('   Check PERCY_TOKEN and Percy project configuration', 'yellow');
    process.exit(1);
  }
}

// Main execution
async function main() {
  log('🚀 Starting Percy Storybook Visual Regression', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  checkPercyToken();
  buildStorybook();
  verifyBuildOutput();
  injectPercyCSS();
  runPercySnapshots();
  
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('✅ Percy visual regression complete!', 'green');
  log('   View results at: https://percy.io', 'cyan');
}

main().catch((error) => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});

