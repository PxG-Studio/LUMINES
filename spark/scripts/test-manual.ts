#!/usr/bin/env tsx
/**
 * SPARK MVP 1 Manual Test Script
 * 
 * Interactive script to guide manual testing of SPARK MVP 1.
 * Run this script and follow the prompts to test each feature.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function testStep(name: string, instructions: string): Promise<boolean> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n🧪 Test: ${name}`);
  console.log(`\n📋 Instructions:`);
  console.log(instructions);
  console.log(`\n❓ Did this test pass? (y/n):`);
  
  const answer = await question('> ');
  const passed = answer.toLowerCase().startsWith('y');
  
  if (passed) {
    console.log('✅ Test passed!');
  } else {
    console.log('❌ Test failed. Please note the issue and continue.');
    const notes = await question('📝 Notes (optional): ');
    if (notes) {
      console.log(`   Notes: ${notes}`);
    }
  }
  
  return passed;
}

async function main() {
  console.log('🚀 SPARK MVP 1 Manual Test Script');
  console.log('='.repeat(60));
  console.log('\nThis script will guide you through manual testing of SPARK MVP 1.');
  console.log('Please follow the instructions for each test step.\n');

  const results: { name: string; passed: boolean }[] = [];

  // Test 1: Environment Setup
  results.push({
    name: 'Environment Setup',
    passed: await testStep(
      'Environment Setup',
      `1. Check that .env.local exists
2. Verify ANTHROPIC_API_KEY is set (or OPENAI_API_KEY)
3. Verify NEXT_PUBLIC_APP_URL is set
4. Start the development server: npm run dev
5. Verify the server starts without errors`
    ),
  });

  // Test 2: Page Load
  results.push({
    name: 'Page Load',
    passed: await testStep(
      'SPARK Page Load',
      `1. Navigate to http://localhost:3000/spark
2. Verify the page loads without errors
3. Verify you see:
   - Header with "SPARK" title
   - Two-panel layout (Chat on left, Preview on right)
   - Chat interface is visible
   - Preview panel shows "No code generated yet" message`
    ),
  });

  // Test 3: Chat Interface
  results.push({
    name: 'Chat Interface',
    passed: await testStep(
      'Chat Interface Functionality',
      `1. Type a message in the chat input (e.g., "Create a player controller script")
2. Click Send or press Enter
3. Verify:
   - Message appears in chat
   - Loading indicator appears
   - Progress tasks are shown (if implemented)
   - AI response appears after generation`
    ),
  });

  // Test 4: Code Generation (Claude)
  results.push({
    name: 'Code Generation (Claude)',
    passed: await testStep(
      'Code Generation with Claude',
      `1. Ensure Claude is selected as provider (if selector exists)
2. Send prompt: "Create a simple MonoBehaviour script called PlayerController that moves a GameObject"
3. Wait for generation to complete
4. Verify:
   - Success message appears
   - Code is displayed in preview panel
   - Script name is extracted correctly
   - Code has proper C# syntax (using statements, class definition)`
    ),
  });

  // Test 5: Code Generation (OpenAI)
  results.push({
    name: 'Code Generation (OpenAI)',
    passed: await testStep(
      'Code Generation with OpenAI',
      `1. Switch to OpenAI provider (if selector exists)
2. Send prompt: "Create a MonoBehaviour script called HealthSystem that manages player health"
3. Wait for generation to complete
4. Verify:
   - Success message appears
   - Code is displayed in preview panel
   - Script name is extracted correctly
   - Code has proper C# syntax`
    ),
  });

  // Test 6: Preview Panel
  results.push({
    name: 'Preview Panel',
    passed: await testStep(
      'Preview Panel Display',
      `1. After generating code, check the preview panel
2. Verify:
   - Monaco Editor displays the code
   - Syntax highlighting works (C#)
   - Code is readable
   - Line numbers are visible
   - Code is read-only (cannot edit)
   - Export button is visible below the editor`
    ),
  });

  // Test 7: Export Functionality
  results.push({
    name: 'Export Functionality',
    passed: await testStep(
      'Export to ZIP',
      `1. Click the "Export as ZIP" button
2. Verify:
   - Button shows loading state ("Exporting...")
   - Download starts automatically
   - ZIP file is saved with correct name (scriptName.zip)
   - No errors appear in console`
    ),
  });

  // Test 8: ZIP File Structure
  results.push({
    name: 'ZIP File Structure',
    passed: await testStep(
      'ZIP File Contents',
      `1. Extract the downloaded ZIP file
2. Verify the structure:
   - Assets/ folder exists
   - Assets/Scripts/ folder exists
   - ScriptName.cs file exists in Scripts/
   - ScriptName.cs.meta file exists
   - Assets.meta file exists
   - Scripts.meta file exists
3. Verify .meta files have correct Unity format`
    ),
  });

  // Test 9: Unity Import
  results.push({
    name: 'Unity Import',
    passed: await testStep(
      'Unity Editor Import',
      `1. Open Unity Editor
2. Create a new project or use existing project
3. Copy the extracted Assets folder into the Unity project
4. Verify:
   - Unity recognizes the files
   - Script appears in Project window
   - Script compiles without errors
   - Script can be attached to GameObject
   - No console errors in Unity`
    ),
  });

  // Test 10: Error Handling
  results.push({
    name: 'Error Handling',
    passed: await testStep(
      'Error Handling',
      `1. Test with invalid API key (temporarily set wrong key)
2. Send a generation request
3. Verify:
   - Error message is displayed clearly
   - Error appears in chat interface
   - No crash occurs
   - User can retry after fixing the issue
4. Test with empty prompt
5. Verify appropriate error handling`
    ),
  });

  // Test 11: Validation
  results.push({
    name: 'Code Validation',
    passed: await testStep(
      'Code Validation',
      `1. Generate a script that should pass validation
2. Verify validation passes
3. (Optional) Test with invalid code if possible
4. Verify validation errors are shown to user`
    ),
  });

  // Test 12: Rate Limiting
  results.push({
    name: 'Rate Limiting',
    passed: await testStep(
      'Rate Limiting',
      `1. Make multiple rapid export requests
2. Verify:
   - Rate limiting prevents abuse
   - Appropriate error message is shown
   - System remains stable
   - Normal usage is not affected`
    ),
  });

  // Test 13: Health Check
  results.push({
    name: 'Health Check',
    passed: await testStep(
      'Health Check Endpoint',
      `1. Navigate to http://localhost:3000/api/spark/health
2. Verify:
   - Endpoint returns 200 status
   - Response includes status information
   - Database connection is checked
   - Memory usage is reported`
    ),
  });

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('\n📊 Test Results Summary\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.name}`);
  });

  console.log(`\n✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! SPARK MVP 1 is ready for deployment.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
  }

  rl.close();
}

main().catch(console.error);

