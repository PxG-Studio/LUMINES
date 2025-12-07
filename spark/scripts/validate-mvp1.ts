#!/usr/bin/env tsx
/**
 * SPARK MVP 1 Validation Script
 * 
 * Comprehensive validation of all SPARK MVP 1 components and functionality.
 * Run this script before deployment to ensure everything works correctly.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const results: ValidationResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string, details?: string) {
  results.push({ name, status, message, details });
}

function checkFileExists(path: string, description: string): boolean {
  const exists = existsSync(path);
  addResult(
    `File: ${description}`,
    exists ? 'pass' : 'fail',
    exists ? `Found: ${path}` : `Missing: ${path}`
  );
  return exists;
}

function checkFileContent(path: string, description: string, requiredContent: string[]): boolean {
  if (!existsSync(path)) {
    addResult(`Content: ${description}`, 'fail', `File not found: ${path}`);
    return false;
  }

  const content = readFileSync(path, 'utf-8');
  const missing: string[] = [];

  for (const required of requiredContent) {
    if (!content.includes(required)) {
      missing.push(required);
    }
  }

  if (missing.length === 0) {
    addResult(`Content: ${description}`, 'pass', 'All required content found');
    return true;
  } else {
    addResult(
      `Content: ${description}`,
      'fail',
      `Missing required content: ${missing.join(', ')}`
    );
    return false;
  }
}

console.log('🔍 SPARK MVP 1 Validation Script\n');
console.log('=' .repeat(60));

// 1. Check core component files
console.log('\n📁 Checking Core Component Files...');
const rootDir = join(process.cwd(), 'src');

checkFileExists(join(rootDir, 'app/spark/page.tsx'), 'SPARK main page');
checkFileExists(join(rootDir, 'app/spark/components/MCPChat.tsx'), 'MCPChat component');
checkFileExists(join(rootDir, 'app/spark/components/PreviewPanel.tsx'), 'PreviewPanel component');
checkFileExists(join(rootDir, 'app/spark/components/ExportButton.tsx'), 'ExportButton component');
checkFileExists(join(rootDir, 'app/spark/components/ErrorBoundary.tsx'), 'ErrorBoundary component');
checkFileExists(join(rootDir, 'app/spark/actions/generate.ts'), 'Generate server action');

// 2. Check API routes
console.log('\n🌐 Checking API Routes...');
checkFileExists(join(rootDir, 'app/api/export/route.ts'), 'Export API route');
checkFileExists(join(rootDir, 'app/api/spark/health/route.ts'), 'Health check API route');

// 3. Check library files
console.log('\n📚 Checking Library Files...');
checkFileExists(join(rootDir, 'lib/spark/ai/claude-client.ts'), 'Claude client');
checkFileExists(join(rootDir, 'lib/spark/ai/openai-client.ts'), 'OpenAI client');
checkFileExists(join(rootDir, 'lib/spark/ai/prompts.ts'), 'AI prompts');
checkFileExists(join(rootDir, 'lib/spark/ai/error-handler.ts'), 'Error handler');
checkFileExists(join(rootDir, 'lib/spark/unity/validator.ts'), 'Unity validator');
checkFileExists(join(rootDir, 'lib/spark/export/zip-generator.ts'), 'ZIP generator');
checkFileExists(join(rootDir, 'lib/spark/monitoring/request-logger.ts'), 'Request logger');

// 4. Check component integration
console.log('\n🔗 Checking Component Integration...');
const pageContent = existsSync(join(rootDir, 'app/spark/page.tsx'))
  ? readFileSync(join(rootDir, 'app/spark/page.tsx'), 'utf-8')
  : '';

checkFileContent(
  join(rootDir, 'app/spark/page.tsx'),
  'MCPChat integration',
  ['MCPChat', 'onCodeGenerated', 'handleCodeGenerated']
);

checkFileContent(
  join(rootDir, 'app/spark/page.tsx'),
  'PreviewPanel integration',
  ['PreviewPanel', 'generatedCode', 'scriptName']
);

checkFileContent(
  join(rootDir, 'app/spark/page.tsx'),
  'ErrorBoundary wrapping',
  ['ErrorBoundary']
);

// 5. Check MCPChat component
console.log('\n💬 Checking MCPChat Component...');
const mcpChatContent = existsSync(join(rootDir, 'app/spark/components/MCPChat.tsx'))
  ? readFileSync(join(rootDir, 'app/spark/components/MCPChat.tsx'), 'utf-8')
  : '';

checkFileContent(
  join(rootDir, 'app/spark/components/MCPChat.tsx'),
  'MCPChat onCodeGenerated callback',
  ['onCodeGenerated', 'generateUnityScript']
);

// 6. Check PreviewPanel component
console.log('\n👁️ Checking PreviewPanel Component...');
checkFileContent(
  join(rootDir, 'app/spark/components/PreviewPanel.tsx'),
  'PreviewPanel Monaco Editor',
  ['Editor', '@monaco-editor/react']
);

checkFileContent(
  join(rootDir, 'app/spark/components/PreviewPanel.tsx'),
  'PreviewPanel ExportButton',
  ['ExportButton']
);

// 7. Check ExportButton component
console.log('\n📦 Checking ExportButton Component...');
checkFileContent(
  join(rootDir, 'app/spark/components/ExportButton.tsx'),
  'ExportButton API call',
  ['/api/export', 'POST', 'code', 'scriptName']
);

// 8. Check API route
console.log('\n🚀 Checking Export API Route...');
checkFileContent(
  join(rootDir, 'app/api/export/route.ts'),
  'Export API rate limiting',
  ['rateLimiters', 'rateLimit']
);

checkFileContent(
  join(rootDir, 'app/api/export/route.ts'),
  'Export API logging',
  ['logRequest', 'logError']
);

checkFileContent(
  join(rootDir, 'app/api/export/route.ts'),
  'Export API ZIP generation',
  ['generateUnityZip']
);

// 9. Check generate action
console.log('\n⚙️ Checking Generate Action...');
checkFileContent(
  join(rootDir, 'app/spark/actions/generate.ts'),
  'Generate action validation',
  ['validateCSharp']
);

checkFileContent(
  join(rootDir, 'app/spark/actions/generate.ts'),
  'Generate action AI providers',
  ['generateWithClaude', 'generateWithOpenAI']
);

// 10. Check validator
console.log('\n✅ Checking Validator...');
checkFileContent(
  join(rootDir, 'lib/spark/unity/validator.ts'),
  'Validator functions',
  ['validateCSharp', 'extractScriptName']
);

// 11. Check ZIP generator
console.log('\n📦 Checking ZIP Generator...');
checkFileContent(
  join(rootDir, 'lib/spark/export/zip-generator.ts'),
  'ZIP generator Unity structure',
  ['Assets', 'Scripts', '.meta', 'generateUnityZip']
);

// 12. Check environment variables
console.log('\n🔐 Checking Environment Configuration...');
const envExampleExists = existsSync(join(process.cwd(), '.env.example'));
addResult(
  'Environment: .env.example',
  envExampleExists ? 'pass' : 'warning',
  envExampleExists ? 'Found .env.example' : 'Missing .env.example (create for documentation)'
);

// 13. Check documentation
console.log('\n📖 Checking Documentation...');
checkFileExists(join(process.cwd(), 'spark/USER_GUIDE_MVP1.md'), 'User guide');
checkFileExists(join(process.cwd(), 'spark/ENV_SETUP.md'), 'Environment setup guide');
checkFileExists(join(process.cwd(), 'spark/TROUBLESHOOTING.md'), 'Troubleshooting guide');
checkFileExists(join(process.cwd(), 'spark/API_DOCUMENTATION.md'), 'API documentation');

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Validation Summary\n');

const passed = results.filter(r => r.status === 'pass').length;
const failed = results.filter(r => r.status === 'fail').length;
const warnings = results.filter(r => r.status === 'warning').length;

console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`📋 Total: ${results.length}\n`);

if (failed > 0) {
  console.log('❌ FAILED CHECKS:\n');
  results
    .filter(r => r.status === 'fail')
    .forEach(r => {
      console.log(`  ❌ ${r.name}`);
      console.log(`     ${r.message}`);
      if (r.details) console.log(`     ${r.details}`);
      console.log();
    });
}

if (warnings > 0) {
  console.log('⚠️  WARNINGS:\n');
  results
    .filter(r => r.status === 'warning')
    .forEach(r => {
      console.log(`  ⚠️  ${r.name}`);
      console.log(`     ${r.message}`);
      if (r.details) console.log(`     ${r.details}`);
      console.log();
    });
}

if (failed === 0) {
  console.log('✅ All critical validations passed!');
  console.log('🎉 SPARK MVP 1 is ready for testing.\n');
  process.exit(0);
} else {
  console.log('❌ Some validations failed. Please fix the issues above before deployment.\n');
  process.exit(1);
}

