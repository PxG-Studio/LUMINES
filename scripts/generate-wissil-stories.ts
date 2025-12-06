#!/usr/bin/env tsx

/**
 * WIS2L Story Auto-Generator
 *
 * Scans all WIS2L subsystem folders and generates/updates Storybook stories
 * in the CANONICAL location: src/stories/WIS2L Framework/{System}/Pages/
 *
 * This script maintains the single source of truth for WIS2L page stories.
 * Stories are written to the canonical tree, not to src/app (which is excluded
 * from Storybook's main.ts configuration).
 *
 * Usage:
 *   npm run storybook:sync-wis2l
 *   tsx scripts/generate-wis2l-stories.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface WIS2LSystem {
  name: string;
  appPagePath: string; // Path to src/app/{system}/page.tsx
  canonicalStoryPath: string; // Path to src/stories/WIS2L Framework/{System}/Pages/
  displayName: string;
  description: string;
  color: string;
  hasPage: boolean;
  hasStory: boolean;
  hasMDX: boolean;
}

const WIS2L_SYSTEMS = [
  'landing',
  'waypoint',
  'spark',
  'slate',
  'ignis',
  'ignition',
];

const SYSTEM_METADATA: Record<string, { displayName: string; description: string; color: string }> = {
  landing: {
    displayName: 'Production Landing Page',
    description: 'The main marketing landing page for LumenForge.io ecosystem',
    color: 'landing',
  },
  waypoint: {
    displayName: 'Unity Visual Scripting',
    description: 'Visual node-based programming interface for Unity WebGL',
    color: 'waypoint',
  },
  spark: {
    displayName: 'IDE Experience',
    description: 'Full-featured integrated development environment with Monaco editor',
    color: 'spark',
  },
  slate: {
    displayName: 'Workspace & Identity',
    description: 'Workspace selector, identity management, and user settings',
    color: 'slate',
  },
  ignis: {
    displayName: 'API Backend',
    description: 'Runtime engine with WebContainer support, API documentation, and code execution',
    color: 'ignis',
  },
  ignition: {
    displayName: 'Project Bootstrap',
    description: 'Project creation wizard, template gallery, and project initialization',
    color: 'ignition',
  },
};

function getProjectRoot(): string {
  return path.resolve(__dirname, '..');
}

function getAppDir(): string {
  return path.join(getProjectRoot(), 'src', 'app');
}

function getCanonicalStoriesDir(): string {
  return path.join(getProjectRoot(), 'src', 'stories', 'WIS2L Framework');
}

function scanWIS2LSystems(): WIS2LSystem[] {
  const appDir = getAppDir();
  const canonicalDir = getCanonicalStoriesDir();
  const systems: WISSILSystem[] = [];

  for (const systemName of WIS2L_SYSTEMS) {
    const appSystemPath = path.join(appDir, systemName);
    const canonicalSystemPath = path.join(canonicalDir, systemName.charAt(0).toUpperCase() + systemName.slice(1), 'Pages');
    const metadata = SYSTEM_METADATA[systemName];

    if (!fs.existsSync(appSystemPath)) {
      console.warn(`⚠️  System folder not found: ${systemName}`);
      continue;
    }

    const pagePath = path.join(appSystemPath, 'page.tsx');
    const storyPath = path.join(canonicalSystemPath, `${systemName.charAt(0).toUpperCase() + systemName.slice(1)}Experience.stories.tsx`);
    const mdxPath = path.join(canonicalSystemPath, '..', 'Documentation', `${systemName.charAt(0).toUpperCase() + systemName.slice(1)}.mdx`);

    // Ensure canonical directory exists
    if (!fs.existsSync(canonicalSystemPath)) {
      fs.mkdirSync(canonicalSystemPath, { recursive: true });
    }

    systems.push({
      name: systemName,
      appPagePath: appSystemPath,
      canonicalStoryPath: canonicalSystemPath,
      displayName: metadata.displayName,
      description: metadata.description,
      color: metadata.color,
      hasPage: fs.existsSync(pagePath),
      hasStory: fs.existsSync(storyPath),
      hasMDX: fs.existsSync(mdxPath),
    });
  }

  return systems;
}

function generateStoryTemplate(system: WIS2LSystem): string {
  const componentName = system.name.charAt(0).toUpperCase() + system.name.slice(1);
  const pageImportPath = `@/app/${system.name}/page`;

  return `import type { Meta, StoryObj } from '@storybook/nextjs';
import ${componentName}Page from '${pageImportPath}';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/${componentName}/Pages/${componentName} Experience',
  id: 'wis2l-${system.name}-${system.name.toLowerCase().replace(/\\s+/g, '-')}-stories',
  component: ${componentName}Page,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        component: \`
# ${system.name.toUpperCase()} - ${system.displayName}

${system.description}

## Network Information
- **Location**: Helios Control/Compute
- **Purpose**: ${system.displayName}

## Design Tokens
Uses the \\\`${system.color}\\\` color system from SLATE.
        \`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}Page>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the ${componentName} page
 */
export const Default: Story = {
  render: () => <${componentName}Page />,
};

/**
 * ${componentName} page wrapped in WISSILLayout
 */
export const WithLayout: Story = {
  render: () => (
    <WISSILLayout
      system="${system.color}"
      title="${system.name.toUpperCase()}"
      description="${system.displayName}"
      showHeader
    >
      <${componentName}Page />
    </WISSILLayout>
  ),
};

/**
 * Mobile viewport
 */
export const Mobile: Story = {
  render: () => <${componentName}Page />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  render: () => <${componentName}Page />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Wide screen viewport
 */
export const WideScreen: Story = {
  render: () => <${componentName}Page />,
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
  },
};
`;
}

function generateMDXTemplate(system: WIS2LSystem): string {
  const componentName = system.name.charAt(0).toUpperCase() + system.name.slice(1);
  return `import { Meta } from '@storybook/blocks';

<Meta title="Lumenforge.io Design System/WIS2L Framework/${componentName}/Documentation" />

# ${system.name.toUpperCase()} - ${system.displayName}

${system.description}

## Purpose

[Add detailed purpose description]

## Features

- Feature 1
- Feature 2
- Feature 3

## Architecture

[Add architecture details]

## Integration Points

[Add integration details]

## Best Practices

1. Practice 1
2. Practice 2
3. Practice 3

## Future Enhancements

- [ ] Enhancement 1
- [ ] Enhancement 2
- [ ] Enhancement 3
`;
}

function ensureStoryExists(system: WIS2LSystem): void {
  if (!system.hasPage) {
    console.log(`⏭️  Skipping ${system.name}: No page.tsx found`);
    return;
  }

  const storyPath = path.join(system.canonicalStoryPath, `${system.name.charAt(0).toUpperCase() + system.name.slice(1)}Experience.stories.tsx`);

  if (system.hasStory) {
    console.log(`✓ Story exists: ${path.relative(getProjectRoot(), storyPath)}`);
    return;
  }

  console.log(`📝 Generating story: ${path.relative(getProjectRoot(), storyPath)}`);
  const storyContent = generateStoryTemplate(system);
  fs.writeFileSync(storyPath, storyContent, 'utf-8');
  console.log(`✅ Created: ${path.relative(getProjectRoot(), storyPath)}`);
}

function ensureMDXExists(system: WIS2LSystem): void {
  if (!system.hasPage) {
    return;
  }

  const mdxDir = path.join(system.canonicalStoryPath, '..', 'Documentation');
  if (!fs.existsSync(mdxDir)) {
    fs.mkdirSync(mdxDir, { recursive: true });
  }

  const mdxPath = path.join(mdxDir, `${system.name.charAt(0).toUpperCase() + system.name.slice(1)}.mdx`);

  if (system.hasMDX) {
    console.log(`✓ MDX exists: ${path.relative(getProjectRoot(), mdxPath)}`);
    return;
  }

  console.log(`📝 Generating MDX: ${path.relative(getProjectRoot(), mdxPath)}`);
  const mdxContent = generateMDXTemplate(system);
  fs.writeFileSync(mdxPath, mdxContent, 'utf-8');
  console.log(`✅ Created: ${path.relative(getProjectRoot(), mdxPath)}`);
}

function validateStoryNaming(system: WIS2LSystem): void {
  if (!system.hasStory) return;

  const storyPath = path.join(system.canonicalStoryPath, `${system.name.charAt(0).toUpperCase() + system.name.slice(1)}Experience.stories.tsx`);
  const content = fs.readFileSync(storyPath, 'utf-8');

  const expectedTitle = `Lumenforge.io Design System/WIS2L Framework/${system.name.charAt(0).toUpperCase() + system.name.slice(1)}/Pages/${system.name.charAt(0).toUpperCase() + system.name.slice(1)} Experience`;

  if (!content.includes(expectedTitle)) {
    console.warn(`⚠️  Story title may need updating in ${path.relative(getProjectRoot(), storyPath)}`);
    console.warn(`   Expected: ${expectedTitle}`);
  } else {
    console.log(`✓ Story naming validated: ${system.name}`);
  }
}

function generateSummaryReport(systems: WIS2LSystem[]): void {
  console.log('\n' + '='.repeat(60));
  console.log('WIS2L Story Generation Summary');
  console.log('='.repeat(60));

  const stats = {
    total: systems.length,
    withPage: systems.filter(s => s.hasPage).length,
    withStory: systems.filter(s => s.hasStory).length,
    withMDX: systems.filter(s => s.hasMDX).length,
  };

  console.log(`\nTotal Systems: ${stats.total}`);
  console.log(`Pages Found: ${stats.withPage}`);
  console.log(`Stories Generated: ${stats.withStory}`);
  console.log(`MDX Documentation: ${stats.withMDX}`);

  console.log('\nSystem Status:');
  systems.forEach(system => {
    const status = system.hasPage && system.hasStory && system.hasMDX ? '✅' : '⚠️';
    console.log(`  ${status} ${system.name.toUpperCase()}: Page=${system.hasPage ? '✓' : '✗'} Story=${system.hasStory ? '✓' : '✗'} MDX=${system.hasMDX ? '✓' : '✗'}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('📁 Canonical Story Location: src/stories/WIS2L Framework/{System}/Pages/');
  console.log('📁 Canonical MDX Location: src/stories/WIS2L Framework/{System}/Documentation/');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  console.log('🚀 WIS2L Story Auto-Generator (Canonical Tree)\n');
  console.log('Scanning WIS2L subsystems...\n');

  const systems = scanWIS2LSystems();

  if (systems.length === 0) {
    console.error('❌ No WIS2L systems found!');
    process.exit(1);
  }

  console.log(`Found ${systems.length} WISSIL systems\n`);

  // Generate missing stories
  console.log('📚 Ensuring all stories exist in canonical location...\n');
  systems.forEach(ensureStoryExists);

  console.log('\n📄 Ensuring all MDX documentation exists in canonical location...\n');
  systems.forEach(ensureMDXExists);

  console.log('\n🔍 Validating story naming conventions...\n');
  systems.forEach(validateStoryNaming);

  // Generate summary
  generateSummaryReport(systems);

  console.log('✨ Story generation complete!\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
