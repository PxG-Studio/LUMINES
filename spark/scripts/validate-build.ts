#!/usr/bin/env tsx
/**
 * SPARK MVP 1 Build Validation Script
 * 
 * Validates that the build process works correctly.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface BuildCheck {
  name: string;
  command: string;
  description: string;
  required: boolean;
}

const checks: BuildCheck[] = [
  {
    name: 'TypeScript Compilation',
    command: 'npm run typecheck',
    description: 'Check TypeScript compilation',
    required: true,
  },
  {
    name: 'Linter',
    command: 'npm run lint',
    description: 'Run ESLint',
    required: false, // Warnings are OK, but should be reviewed
  },
  {
    name: 'Production Build',
    command: 'npm run build',
    description: 'Build production bundle',
    required: true,
  },
];

const results: { name: string; passed: boolean; output?: string; error?: string }[] = [];

console.log('🔨 SPARK MVP 1 Build Validation\n');
console.log('='.repeat(60));

for (const check of checks) {
  console.log(`\n📋 ${check.name}...`);
  console.log(`   ${check.description}`);
  
  try {
    const output = execSync(check.command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    
    results.push({
      name: check.name,
      passed: true,
      output: output.substring(0, 200), // First 200 chars
    });
    
    console.log('   ✅ Passed');
  } catch (error: any) {
    const errorOutput = error.stdout?.toString() || error.stderr?.toString() || error.message;
    
    results.push({
      name: check.name,
      passed: false,
      error: errorOutput.substring(0, 500), // First 500 chars
    });
    
    console.log('   ❌ Failed');
    
    if (check.required) {
      console.log(`\n   ⚠️  This is a required check. Build validation failed.`);
    } else {
      console.log(`\n   ⚠️  This is an optional check. Review the output.`);
    }
  }
}

// Check build output
console.log('\n📦 Checking Build Output...');

const buildDir = join(process.cwd(), '.next');
if (existsSync(buildDir)) {
  console.log('   ✅ Build directory exists');
  results.push({ name: 'Build Output', passed: true });
} else {
  console.log('   ❌ Build directory not found');
  results.push({ name: 'Build Output', passed: false, error: '.next directory not found' });
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log('\n📊 Build Validation Summary\n');

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

results.forEach((result) => {
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${result.name}`);
  if (!result.passed && result.error) {
    console.log(`   Error: ${result.error.substring(0, 100)}...`);
  }
});

console.log(`\n✅ Passed: ${passed}/${results.length}`);
console.log(`❌ Failed: ${failed}/${results.length}`);

const requiredFailed = results.filter(r => !r.passed && checks.find(c => c.name === r.name && c.required)).length;

if (requiredFailed === 0) {
  console.log('\n🎉 All required build checks passed!');
  console.log('✅ SPARK MVP 1 build is valid.\n');
  process.exit(0);
} else {
  console.log('\n❌ Some required build checks failed.');
  console.log('⚠️  Please fix the issues above before deployment.\n');
  process.exit(1);
}

