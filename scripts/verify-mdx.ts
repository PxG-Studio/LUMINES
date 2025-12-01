#!/usr/bin/env tsx
/**
 * MDX File Verification
 * 
 * Verifies that all MDX files are valid and properly formatted.
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

interface MDXFile {
  path: string;
  isValid: boolean;
  errors: string[];
}

async function verifyMDXFile(filePath: string): Promise<MDXFile> {
  const errors: string[] = [];
  
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Check for required Storybook imports
    if (!content.includes('@storybook/addon-docs')) {
      errors.push('Missing @storybook/addon-docs import');
    }
    
    // Check for Meta component
    if (!content.includes('<Meta')) {
      errors.push('Missing <Meta> component');
    }
    
    // Check for title in Meta
    if (!content.includes('title=')) {
      errors.push('Missing title in <Meta>');
    }
    
    // Check for basic structure
    if (!content.includes('# ')) {
      errors.push('Missing H1 heading');
    }
    
    // Check for component reference if it's a component doc
    if (content.includes('ArgsTable') && !content.includes('component=')) {
      errors.push('ArgsTable requires component prop in Meta');
    }
    
    return {
      path: filePath,
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      path: filePath,
      isValid: false,
      errors: [`Failed to read file: ${error}`],
    };
  }
}

async function main() {
  const rootDir = process.cwd();
  const mdxFiles = await glob('**/*.mdx', {
    cwd: rootDir,
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/storybook-static/**',
    ],
  });
  
  console.log(`🔍 Verifying ${mdxFiles.length} MDX files...\n`);
  
  const results: MDXFile[] = [];
  
  for (const file of mdxFiles) {
    const fullPath = join(rootDir, file);
    const result = await verifyMDXFile(fullPath);
    results.push(result);
  }
  
  const invalidFiles = results.filter(r => !r.isValid);
  
  if (invalidFiles.length > 0) {
    console.log('❌ Invalid MDX files found:\n');
    invalidFiles.forEach(file => {
      console.log(`   ${file.path}:`);
      file.errors.forEach(error => {
        console.log(`     - ${error}`);
      });
      console.log();
    });
    process.exit(1);
  }
  
  console.log('✅ All MDX files are valid!');
  process.exit(0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

