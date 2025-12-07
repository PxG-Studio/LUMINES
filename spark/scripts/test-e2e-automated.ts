#!/usr/bin/env tsx
/**
 * SPARK MVP 1 Automated E2E Test Script
 * 
 * Automated tests for SPARK MVP 1 functionality
 * Can be run in CI/CD or locally
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];

function addTest(name: string, testFn: () => Promise<void> | void): void {
  const startTime = Date.now();
  try {
    const result = testFn();
    if (result instanceof Promise) {
      result
        .then(() => {
          const duration = Date.now() - startTime;
          results.push({ name, passed: true, duration });
        })
        .catch((error) => {
          const duration = Date.now() - startTime;
          results.push({ name, passed: false, error: error.message, duration });
        });
    } else {
      const duration = Date.now() - startTime;
      results.push({ name, passed: true, duration });
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    results.push({ name, passed: false, error: error.message, duration });
  }
}

async function testFileExists(path: string, description: string): Promise<void> {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
}

async function testFileContent(path: string, requiredContent: string[]): Promise<void> {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
  const content = readFileSync(path, 'utf-8');
  const missing: string[] = [];
  for (const required of requiredContent) {
    if (!content.includes(required)) {
      missing.push(required);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required content: ${missing.join(', ')}`);
  }
}

async function main() {
  console.log('🧪 SPARK MVP 1 Automated E2E Tests\n');
  console.log('='.repeat(60));

  const rootDir = process.cwd();
  const srcDir = join(rootDir, 'src');

  // Test 1: Core Components Exist
  addTest('Core Components Exist', async () => {
    await testFileExists(join(srcDir, 'app/spark/page.tsx'), 'Main page');
    await testFileExists(join(srcDir, 'app/spark/components/MCPChat.tsx'), 'MCPChat');
    await testFileExists(join(srcDir, 'app/spark/components/PreviewPanel.tsx'), 'PreviewPanel');
    await testFileExists(join(srcDir, 'app/spark/components/ExportButton.tsx'), 'ExportButton');
    await testFileExists(join(srcDir, 'app/spark/components/ErrorBoundary.tsx'), 'ErrorBoundary');
  });

  // Test 2: API Routes Exist
  addTest('API Routes Exist', async () => {
    await testFileExists(join(srcDir, 'app/api/export/route.ts'), 'Export API');
    await testFileExists(join(srcDir, 'app/api/spark/health/route.ts'), 'Health API');
  });

  // Test 3: Library Files Exist
  addTest('Library Files Exist', async () => {
    await testFileExists(join(srcDir, 'lib/spark/ai/claude-client.ts'), 'Claude client');
    await testFileExists(join(srcDir, 'lib/spark/ai/openai-client.ts'), 'OpenAI client');
    await testFileExists(join(srcDir, 'lib/spark/unity/validator.ts'), 'Validator');
    await testFileExists(join(srcDir, 'lib/spark/export/zip-generator.ts'), 'ZIP generator');
  });

  // Test 4: Component Integration
  addTest('Component Integration', async () => {
    await testFileContent(
      join(srcDir, 'app/spark/page.tsx'),
      ['MCPChat', 'PreviewPanel', 'onCodeGenerated', 'handleCodeGenerated']
    );
  });

  // Test 5: Error Handling
  addTest('Error Handling', async () => {
    await testFileContent(
      join(srcDir, 'app/spark/components/ErrorBoundary.tsx'),
      ['ErrorBoundary', 'componentDidCatch']
    );
    await testFileContent(
      join(srcDir, 'app/api/export/route.ts'),
      ['logError', 'try', 'catch']
    );
  });

  // Test 6: Monitoring
  addTest('Monitoring Setup', async () => {
    await testFileExists(join(srcDir, 'lib/spark/monitoring/request-logger.ts'), 'Request logger');
    await testFileExists(join(srcDir, 'lib/spark/monitoring/sentry.ts'), 'Sentry integration');
  });

  // Test 7: Validation
  addTest('Validation Logic', async () => {
    await testFileContent(
      join(srcDir, 'lib/spark/unity/validator.ts'),
      ['validateCSharp', 'extractScriptName']
    );
  });

  // Test 8: Export System
  addTest('Export System', async () => {
    await testFileContent(
      join(srcDir, 'lib/spark/export/zip-generator.ts'),
      ['generateUnityZip', 'Assets', 'Scripts', '.meta']
    );
  });

  // Wait for async tests
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${icon} ${result.name}${duration}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 All automated tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

main().catch(console.error);

