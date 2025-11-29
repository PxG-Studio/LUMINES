#!/usr/bin/env tsx

/**
 * WISSIL Story Auto-Generator
 *
 * Scans all WISSIL subsystem folders and generates/updates Storybook stories
 * to maintain naming consistency and ensure all pages have proper documentation.
 *
 * Usage:
 *   npm run storybook:sync-wissil
 *   tsx scripts/generate-wissil-stories.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface WISSILSystem {
  name: string;
  path: string;
  displayName: string;
  description: string;
  color: string;
  hasPage: boolean;
  hasStory: boolean;
  hasMDX: boolean;
}

const WISSIL_SYSTEMS = [
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

function scanWISSILSystems(): WISSILSystem[] {
  const appDir = getAppDir();
  const systems: WISSILSystem[] = [];

  for (const systemName of WISSIL_SYSTEMS) {
    const systemPath = path.join(appDir, systemName);
    const metadata = SYSTEM_METADATA[systemName];

    if (!fs.existsSync(systemPath)) {
      console.warn(`⚠️  System folder not found: ${systemName}`);
      continue;
    }

    const pagePath = path.join(systemPath, 'page.tsx');
    const storyPath = path.join(systemPath, `${systemName}.stories.tsx`);
    const mdxPath = path.join(systemPath, `${systemName}.mdx`);

    systems.push({
      name: systemName,
      path: systemPath,
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

function generateStoryTemplate(system: WISSILSystem): string {
  const componentName = system.name.charAt(0).toUpperCase() + system.name.slice(1);

  return `import type { Meta, StoryObj } from '@storybook/react';
import ${componentName}Page from './page';
import { WISSILLayout } from '@/components/wissil/WISSILLayout';

const meta = {
  title: 'WISSIL/${componentName}/${system.displayName}',
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
      defaultViewport: 'mobile',
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
`;
}

function generateMDXTemplate(system: WISSILSystem): string {
  return `import { Meta } from '@storybook/blocks';

<Meta title="WISSIL/${system.name.charAt(0).toUpperCase() + system.name.slice(1)}/Documentation" />

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

function ensureStoryExists(system: WISSILSystem): void {
  if (!system.hasPage) {
    console.log(`⏭️  Skipping ${system.name}: No page.tsx found`);
    return;
  }

  const storyPath = path.join(system.path, `${system.name}.stories.tsx`);

  if (system.hasStory) {
    console.log(`✓ Story exists: ${system.name}.stories.tsx`);
    return;
  }

  console.log(`📝 Generating story: ${system.name}.stories.tsx`);
  const storyContent = generateStoryTemplate(system);
  fs.writeFileSync(storyPath, storyContent, 'utf-8');
  console.log(`✅ Created: ${system.name}.stories.tsx`);
}

function ensureMDXExists(system: WISSILSystem): void {
  if (!system.hasPage) {
    return;
  }

  const mdxPath = path.join(system.path, `${system.name}.mdx`);

  if (system.hasMDX) {
    console.log(`✓ MDX exists: ${system.name}.mdx`);
    return;
  }

  console.log(`📝 Generating MDX: ${system.name}.mdx`);
  const mdxContent = generateMDXTemplate(system);
  fs.writeFileSync(mdxPath, mdxContent, 'utf-8');
  console.log(`✅ Created: ${system.name}.mdx`);
}

function validateStoryNaming(system: WISSILSystem): void {
  if (!system.hasStory) return;

  const storyPath = path.join(system.path, `${system.name}.stories.tsx`);
  const content = fs.readFileSync(storyPath, 'utf-8');

  const expectedTitle = `WISSIL/${system.name.charAt(0).toUpperCase() + system.name.slice(1)}/${system.displayName}`;

  if (!content.includes(expectedTitle)) {
    console.warn(`⚠️  Story title may need updating in ${system.name}.stories.tsx`);
    console.warn(`   Expected: ${expectedTitle}`);
  } else {
    console.log(`✓ Story naming validated: ${system.name}`);
  }
}

function generateSummaryReport(systems: WISSILSystem[]): void {
  console.log('\n' + '='.repeat(60));
  console.log('WISSIL Story Generation Summary');
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

  console.log('\n' + '='.repeat(60) + '\n');
}

async function main() {
  console.log('🚀 WISSIL Story Auto-Generator\n');
  console.log('Scanning WISSIL subsystems...\n');

  const systems = scanWISSILSystems();

  if (systems.length === 0) {
    console.error('❌ No WISSIL systems found!');
    process.exit(1);
  }

  console.log(`Found ${systems.length} WISSIL systems\n`);

  // Generate missing stories
  console.log('📚 Ensuring all stories exist...\n');
  systems.forEach(ensureStoryExists);

  console.log('\n📄 Ensuring all MDX documentation exists...\n');
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
