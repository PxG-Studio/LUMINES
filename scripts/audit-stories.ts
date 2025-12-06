#!/usr/bin/env tsx

/**
 * Story Audit Script
 * 
 * Scans src/ directory for components without Storybook stories
 * Prioritizes critical components for story generation
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ComponentInfo {
  path: string;
  name: string;
  hasStory: boolean;
  storyPath?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Critical paths that must have stories
const CRITICAL_PATHS = [
  'src/editor/shell',
  'src/editor/filesystem',
  'src/ignis',
  'src/design-system/primitives',
  'src/design-system/layouts',
];

// High priority paths
const HIGH_PRIORITY_PATHS = [
  'src/wissil',
  'src/components',
];

function getPriority(filePath: string): ComponentInfo['priority'] {
  if (CRITICAL_PATHS.some(p => filePath.includes(p))) {
    return 'critical';
  }
  if (HIGH_PRIORITY_PATHS.some(p => filePath.includes(p))) {
    return 'high';
  }
  if (filePath.includes('src/design-system')) {
    return 'medium';
  }
  return 'low';
}

function findComponentFiles(): string[] {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
  ];
  
  const files: string[] = [];
  
  for (const pattern of patterns) {
    const matches = glob.sync(pattern, {
      cwd: PROJECT_ROOT,
      ignore: [
        '**/*.stories.tsx',
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/node_modules/**',
        '**/.next/**',
        '**/dist/**',
      ],
    });
    files.push(...matches);
  }
  
  return [...new Set(files)];
}

function findStoryFiles(): string[] {
  return glob.sync('src/**/*.stories.tsx', {
    cwd: PROJECT_ROOT,
  });
}

function getComponentName(filePath: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename;
}

function findStoryForComponent(componentPath: string, storyFiles: string[]): string | undefined {
  const componentName = getComponentName(componentPath);
  const dir = path.dirname(componentPath);
  
  // Look for story in same directory
  const sameDirStory = storyFiles.find(story => {
    const storyDir = path.dirname(story);
    return storyDir === dir && story.includes(componentName);
  });
  
  if (sameDirStory) return sameDirStory;
  
  // Look for story in stories directory
  const storiesDirStory = storyFiles.find(story => {
    return story.includes(componentName);
  });
  
  return storiesDirStory;
}

function auditComponents(): ComponentInfo[] {
  const componentFiles = findComponentFiles();
  const storyFiles = findStoryFiles();
  
  const components: ComponentInfo[] = [];
  
  for (const componentFile of componentFiles) {
    // Skip if it's a story file, test file, or index file
    if (
      componentFile.includes('.stories.') ||
      componentFile.includes('.test.') ||
      path.basename(componentFile) === 'index.ts' ||
      path.basename(componentFile) === 'index.tsx'
    ) {
      continue;
    }
    
    // Only check .tsx files (React components)
    if (!componentFile.endsWith('.tsx')) {
      continue;
    }
    
    const storyPath = findStoryForComponent(componentFile, storyFiles);
    const hasStory = !!storyPath;
    
    components.push({
      path: componentFile,
      name: getComponentName(componentFile),
      hasStory,
      storyPath,
      priority: getPriority(componentFile),
    });
  }
  
  return components;
}

function generateReport(components: ComponentInfo[]): void {
  const missing = components.filter(c => !c.hasStory);
  const critical = missing.filter(c => c.priority === 'critical');
  const high = missing.filter(c => c.priority === 'high');
  const medium = missing.filter(c => c.priority === 'medium');
  const low = missing.filter(c => c.priority === 'low');
  
  console.log('\n📊 Story Coverage Audit Report\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`Total Components: ${components.length}`);
  console.log(`With Stories: ${components.length - missing.length}`);
  console.log(`Missing Stories: ${missing.length}\n`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (critical.length > 0) {
    console.log(`🔴 CRITICAL (${critical.length} missing):\n`);
    critical.forEach(c => {
      console.log(`  ❌ ${c.path}`);
    });
    console.log('');
  }
  
  if (high.length > 0) {
    console.log(`🟠 HIGH PRIORITY (${high.length} missing):\n`);
    high.forEach(c => {
      console.log(`  ⚠️  ${c.path}`);
    });
    console.log('');
  }
  
  if (medium.length > 0) {
    console.log(`🟡 MEDIUM PRIORITY (${medium.length} missing):\n`);
    medium.slice(0, 10).forEach(c => {
      console.log(`  📝 ${c.path}`);
    });
    if (medium.length > 10) {
      console.log(`  ... and ${medium.length - 10} more`);
    }
    console.log('');
  }
  
  if (low.length > 0) {
    console.log(`🟢 LOW PRIORITY (${low.length} missing):\n`);
    console.log(`  (Skipped for brevity - run with --verbose to see all)`);
    console.log('');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (missing.length > 0) {
    console.log('💡 Next Steps:\n');
    console.log('  1. Generate stories for CRITICAL components first');
    console.log('  2. Use scripts/generate-story-template.ts for boilerplate');
    console.log('  3. Follow existing patterns in src/stories/\n');
  } else {
    console.log('✅ All components have stories!\n');
  }
}

// Main execution
function main() {
  console.log('🔍 Auditing Storybook story coverage...\n');
  
  const components = auditComponents();
  generateReport(components);
  
  // Exit with error code if critical components are missing stories
  const criticalMissing = components.filter(
    c => !c.hasStory && c.priority === 'critical'
  );
  
  if (criticalMissing.length > 0) {
    process.exit(1);
  }
}

main();

