#!/usr/bin/env tsx
/**
 * Storybook Build Validation Script
 * 
 * Validates that all Storybook stories can be built successfully.
 * Checks for common issues:
 * - Missing imports
 * - Invalid Meta titles
 * - Broken MDX files
 * - Import path errors
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { glob } from 'glob';

interface ValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
}

const results: ValidationResult[] = [];
let totalFiles = 0;
let totalErrors = 0;
let totalWarnings = 0;

// Storybook directory
const STORYBOOK_DIR = join(process.cwd(), '.storybook');
const STORIES_DIR = join(process.cwd(), 'src', 'stories');
const APP_STORIES_DIR = join(process.cwd(), 'src', 'app');

// Canonical title pattern
const CANONICAL_TITLE_PATTERN = /^Lumenforge\.io Design System\//;

function validateStoryFile(filePath: string): ValidationResult {
  const result: ValidationResult = {
    file: relative(process.cwd(), filePath),
    errors: [],
    warnings: [],
  };

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check for CSF3 format
    if (filePath.endsWith('.stories.tsx') || filePath.endsWith('.stories.ts')) {
      // Check for Meta export
      if (!content.includes('export default') && !content.includes('const meta')) {
        result.warnings.push('Missing Meta export - should use CSF3 format');
      }

      // Check for title field
      if (content.includes('title:')) {
        const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
        if (titleMatch) {
          const title = titleMatch[1];
          if (!CANONICAL_TITLE_PATTERN.test(title)) {
            result.errors.push(
              `Invalid title format: "${title}" - should start with "Lumenforge.io Design System/"`
            );
          }
        }
      } else {
        result.warnings.push('Missing title field in Meta');
      }

      // Check for deprecated storiesOf
      if (content.includes('storiesOf')) {
        result.errors.push('Uses deprecated storiesOf API - should use CSF3 format');
      }
    }

    // Check for relative imports (warn)
    const relativeImportPattern = /from\s+['"]\.\.\//g;
    const relativeImports = content.match(relativeImportPattern);
    if (relativeImports && relativeImports.length > 0) {
      result.warnings.push(
        `Found ${relativeImports.length} relative import(s) - consider using absolute imports with @/ alias`
      );
    }

    // Check for broken imports (common patterns)
    const brokenImportPatterns = [
      /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/\.\./g, // Too many ../../
      /from\s+['"]\.\/\.\/\./g, // Invalid ././.
    ];

    brokenImportPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        result.errors.push('Found broken import path pattern');
      }
    });
  } catch (error) {
    result.errors.push(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

function validateMDXFile(filePath: string): ValidationResult {
  const result: ValidationResult = {
    file: relative(process.cwd(), filePath),
    errors: [],
    warnings: [],
  };

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check for Meta component
    if (!content.includes('<Meta') && !content.includes('Meta title')) {
      result.warnings.push('Missing Meta component - MDX should include <Meta title="..." />');
    } else {
      // Check Meta title format
      const metaMatch = content.match(/<Meta\s+title=['"]([^'"]+)['"]/);
      if (metaMatch) {
        const title = metaMatch[1];
        if (!CANONICAL_TITLE_PATTERN.test(title)) {
          result.errors.push(
            `Invalid Meta title: "${title}" - should start with "Lumenforge.io Design System/"`
          );
        }
      }
    }

    // Check for H1 heading
    if (!content.match(/^#\s+.+$/m)) {
      result.warnings.push('Missing H1 heading - MDX should start with # Heading');
    }
  } catch (error) {
    result.errors.push(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

async function validateStorybook() {
  console.log('🔍 Validating Storybook build...\n');

  // Find all story files
  const storyFiles = await glob('**/*.stories.{ts,tsx}', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/storybook-static/**'],
  });

  // Find all MDX files
  const mdxFiles = await glob('**/*.mdx', {
    cwd: process.cwd(),
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/storybook-static/**'],
  });

  totalFiles = storyFiles.length + mdxFiles.length;

  console.log(`📁 Found ${storyFiles.length} story files`);
  console.log(`📄 Found ${mdxFiles.length} MDX files\n`);

  // Validate story files
  for (const file of storyFiles) {
    const filePath = join(process.cwd(), file);
    const result = validateStoryFile(filePath);
    if (result.errors.length > 0 || result.warnings.length > 0) {
      results.push(result);
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
  }

  // Validate MDX files
  for (const file of mdxFiles) {
    // Only validate MDX files in stories directories
    if (file.includes('src/stories') || file.includes('src/app')) {
      const filePath = join(process.cwd(), file);
      const result = validateMDXFile(filePath);
      if (result.errors.length > 0 || result.warnings.length > 0) {
        results.push(result);
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
      }
    }
  }

  // Print results
  console.log('📊 Validation Results:\n');

  if (results.length === 0) {
    console.log('✅ All files validated successfully!');
    console.log(`   ${totalFiles} files checked\n`);
    return 0;
  }

  // Group by severity
  const errorResults = results.filter((r) => r.errors.length > 0);
  const warningResults = results.filter((r) => r.warnings.length > 0 && r.errors.length === 0);

  if (errorResults.length > 0) {
    console.log(`❌ Errors found in ${errorResults.length} file(s):\n`);
    errorResults.forEach((result) => {
      console.log(`   ${result.file}:`);
      result.errors.forEach((error) => {
        console.log(`     ❌ ${error}`);
      });
      if (result.warnings.length > 0) {
        result.warnings.forEach((warning) => {
          console.log(`     ⚠️  ${warning}`);
        });
      }
      console.log('');
    });
  }

  if (warningResults.length > 0) {
    console.log(`⚠️  Warnings found in ${warningResults.length} file(s):\n`);
    warningResults.forEach((result) => {
      console.log(`   ${result.file}:`);
      result.warnings.forEach((warning) => {
        console.log(`     ⚠️  ${warning}`);
      });
      console.log('');
    });
  }

  console.log(`\n📈 Summary:`);
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   Files with issues: ${results.length}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log(`   Total warnings: ${totalWarnings}\n`);

  return totalErrors > 0 ? 1 : 0;
}

// Run validation
validateStorybook()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });

