#!/usr/bin/env tsx

/**
 * Storybook API Helper
 * 
 * Utility script to interact with Storybook's API and provide
 * MCP-like functionality for Cursor when using Storybook 7.6
 * 
 * Usage:
 *   tsx scripts/storybook-api-helper.ts list-stories
 *   tsx scripts/storybook-api-helper.ts get-story "Button"
 *   tsx scripts/storybook-api-helper.ts get-component "Button"
 */

import * as fs from 'fs';
import * as path from 'path';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';
const STORYBOOK_API = `${STORYBOOK_URL}/index.json`;

interface StorybookStory {
  id: string;
  name: string;
  title: string;
  importPath: string;
}

interface StorybookIndex {
  v: number;
  entries: Record<string, StorybookStory>;
}

/**
 * Fetch Storybook index.json
 */
async function fetchStorybookIndex(): Promise<StorybookIndex | null> {
  try {
    const response = await fetch(STORYBOOK_API);
    if (!response.ok) {
      console.error(`Failed to fetch Storybook API: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Storybook API: ${error}`);
    return null;
  }
}

/**
 * List all stories
 */
async function listStories() {
  const index = await fetchStorybookIndex();
  if (!index) {
    console.error('Could not fetch Storybook index. Is Storybook running?');
    process.exit(1);
  }

  console.log('\n📚 Storybook Stories:\n');
  const stories = Object.values(index.entries);
  
  // Group by title (category)
  const grouped: Record<string, StorybookStory[]> = {};
  stories.forEach(story => {
    const category = story.title.split('/')[0] || 'Other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(story);
  });

  Object.entries(grouped).forEach(([category, categoryStories]) => {
    console.log(`\n${category}:`);
    categoryStories.forEach(story => {
      console.log(`  - ${story.name} (${story.id})`);
    });
  });
}

/**
 * Get story details by ID or name
 */
async function getStory(query: string) {
  const index = await fetchStorybookIndex();
  if (!index) {
    console.error('Could not fetch Storybook index. Is Storybook running?');
    process.exit(1);
  }

  const story = Object.values(index.entries).find(
    s => s.id === query || s.name === query || s.title.includes(query)
  );

  if (!story) {
    console.error(`Story not found: ${query}`);
    process.exit(1);
  }

  console.log('\n📖 Story Details:\n');
  console.log(`Title: ${story.title}`);
  console.log(`Name: ${story.name}`);
  console.log(`ID: ${story.id}`);
  console.log(`Import Path: ${story.importPath}`);

  // Try to read the actual story file
  const storyPath = path.resolve(process.cwd(), story.importPath.replace(/^\.\.\/src\//, 'src/'));
  if (fs.existsSync(storyPath)) {
    console.log(`\n📄 Story File: ${storyPath}`);
    const content = fs.readFileSync(storyPath, 'utf-8');
    console.log(`\n${content.substring(0, 500)}...`);
  }
}

/**
 * Get component by name
 */
async function getComponent(componentName: string) {
  // Search for component files
  const componentPaths = [
    `src/components/${componentName}.tsx`,
    `src/components/${componentName}/${componentName}.tsx`,
    `src/design-system/primitives/${componentName}.tsx`,
    `src/design-system/components/${componentName}.tsx`,
  ];

  for (const componentPath of componentPaths) {
    const fullPath = path.resolve(process.cwd(), componentPath);
    if (fs.existsSync(fullPath)) {
      console.log(`\n⚛️  Component Found: ${fullPath}\n`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      console.log(content);
      return;
    }
  }

  console.error(`Component not found: ${componentName}`);
  process.exit(1);
}

// CLI
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'list-stories':
    listStories();
    break;
  case 'get-story':
    if (!arg) {
      console.error('Usage: tsx scripts/storybook-api-helper.ts get-story <story-id|name>');
      process.exit(1);
    }
    getStory(arg);
    break;
  case 'get-component':
    if (!arg) {
      console.error('Usage: tsx scripts/storybook-api-helper.ts get-component <component-name>');
      process.exit(1);
    }
    getComponent(arg);
    break;
  default:
    console.log(`
Storybook API Helper

Usage:
  tsx scripts/storybook-api-helper.ts list-stories
  tsx scripts/storybook-api-helper.ts get-story <story-id|name>
  tsx scripts/storybook-api-helper.ts get-component <component-name>

Examples:
  tsx scripts/storybook-api-helper.ts list-stories
  tsx scripts/storybook-api-helper.ts get-story "Button"
  tsx scripts/storybook-api-helper.ts get-component "Button"
    `);
    process.exit(1);
}

