#!/usr/bin/env tsx
/**
 * Documentation Coverage Checker
 * 
 * Verifies that all components have corresponding MDX documentation
 * and that all exported components appear in Storybook.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { glob } from 'glob';

interface ComponentInfo {
  path: string;
  name: string;
  hasStory: boolean;
  hasMDX: boolean;
  hasDocComment: boolean;
  subsystem?: string;
}

const SUBSYSTEMS = ['slate', 'ignis', 'ignition', 'spark', 'waypoint', 'unity-tools'];
const COMPONENT_EXTENSIONS = ['.tsx', '.ts'];
const STORY_EXTENSIONS = ['.stories.tsx', '.stories.ts', '.stories.mdx'];
const MDX_EXTENSIONS = ['.mdx'];

async function findComponents(dir: string): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];
  
  // Find all component files
  const componentFiles = await glob('**/*.{tsx,ts}', {
    cwd: dir,
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/stories/**',
      '**/.storybook/**',
    ],
  });

  for (const file of componentFiles) {
    const fullPath = join(dir, file);
    const content = await readFile(fullPath, 'utf-8');
    
    // Check if it's a React component
    const isComponent = /export\s+(default\s+)?(function|const|class)\s+\w+/.test(content);
    
    if (isComponent) {
      const name = basename(file, extname(file));
      const subsystem = detectSubsystem(file);
      
      // Check for story file
      const storyPath = file.replace(extname(file), '.stories');
      const hasStory = await checkFileExists(join(dir, storyPath + '.tsx')) ||
                      await checkFileExists(join(dir, storyPath + '.ts')) ||
                      await checkFileExists(join(dir, storyPath + '.mdx'));
      
      // Check for MDX doc
      const mdxPath = file.replace(extname(file), '.mdx');
      const hasMDX = await checkFileExists(join(dir, mdxPath));
      
      // Check for doc comment
      const hasDocComment = /\/\*\*[\s\S]*?@component/.test(content) ||
                           /\/\*\*[\s\S]*?@docs/.test(content);
      
      components.push({
        path: file,
        name,
        hasStory,
        hasMDX,
        hasDocComment,
        subsystem,
      });
    }
  }
  
  return components;
}

function detectSubsystem(filePath: string): string | undefined {
  for (const subsystem of SUBSYSTEMS) {
    if (filePath.includes(`/${subsystem}/`) || filePath.includes(`\\${subsystem}\\`)) {
      return subsystem;
    }
  }
  return undefined;
}

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const rootDir = process.cwd();
  const srcDir = join(rootDir, 'src');
  const packagesDir = join(rootDir, 'packages');
  
  console.log('🔍 Checking documentation coverage...\n');
  
  const components: ComponentInfo[] = [];
  
  // Check src directory
  if (await checkFileExists(srcDir)) {
    components.push(...await findComponents(srcDir));
  }
  
  // Check packages directory
  if (await checkFileExists(packagesDir)) {
    const packages = await readdir(packagesDir);
    for (const pkg of packages) {
      const pkgDir = join(packagesDir, pkg, 'src');
      if (await checkFileExists(pkgDir)) {
        components.push(...await findComponents(pkgDir));
      }
    }
  }
  
  // Analyze coverage
  const missingStories = components.filter(c => !c.hasStory);
  const missingMDX = components.filter(c => !c.hasMDX);
  const missingDocComments = components.filter(c => !c.hasDocComment);
  
  console.log(`📊 Found ${components.length} components\n`);
  
  // Report missing stories
  if (missingStories.length > 0) {
    console.log('❌ Missing Storybook stories:');
    missingStories.forEach(c => {
      console.log(`   - ${c.path} (${c.subsystem || 'unknown'})`);
    });
    console.log();
  }
  
  // Report missing MDX docs
  if (missingMDX.length > 0) {
    console.log('❌ Missing MDX documentation:');
    missingMDX.forEach(c => {
      console.log(`   - ${c.path} (${c.subsystem || 'unknown'})`);
    });
    console.log();
  }
  
  // Report missing doc comments
  if (missingDocComments.length > 0) {
    console.log('⚠️  Missing documentation comments:');
    missingDocComments.forEach(c => {
      console.log(`   - ${c.path} (${c.subsystem || 'unknown'})`);
    });
    console.log();
  }
  
  // Calculate coverage
  const storyCoverage = ((components.length - missingStories.length) / components.length * 100).toFixed(1);
  const mdxCoverage = ((components.length - missingMDX.length) / components.length * 100).toFixed(1);
  const docCommentCoverage = ((components.length - missingDocComments.length) / components.length * 100).toFixed(1);
  
  console.log('📈 Coverage Statistics:');
  console.log(`   Stories: ${storyCoverage}%`);
  console.log(`   MDX Docs: ${mdxCoverage}%`);
  console.log(`   Doc Comments: ${docCommentCoverage}%`);
  console.log();
  
  // Exit with error if critical coverage is missing
  if (missingStories.length > 0 || missingMDX.length > 0) {
    console.log('❌ Documentation coverage check failed!');
    process.exit(1);
  }
  
  console.log('✅ All components have documentation!');
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

