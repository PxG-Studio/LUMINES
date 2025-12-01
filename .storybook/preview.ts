import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

// Import LumenForge Landing App styles (now local in LUMINES)
import '../src/apps/lumenforge-landing/index.css';

// Import MDX components for use in documentation
import { GraphDemo } from './docs-components/InteractiveGraph';
import { UnityRuntimePreview } from './docs-components/UnityRuntimePreview';
import { LinkCard } from './docs-components/LinkCard';
import { LunaGeneratedExample } from './docs-components/LunaGeneratedExample';

// Make components available globally in MDX
if (typeof window !== 'undefined') {
  (window as any).GraphDemo = GraphDemo;
  (window as any).UnityRuntimePreview = UnityRuntimePreview;
  (window as any).LinkCard = LinkCard;
  (window as any).LunaGeneratedExample = LunaGeneratedExample;
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      toc: true,
      canvas: {
        sourceState: 'shown',
      },
    },
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0A0E27',
        },
        {
          name: 'midnight',
          value: '#1A1F3A',
        },
        {
          name: 'light',
          value: '#F9FAFB',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile (iPhone)',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet (iPad)',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        wideScreen: {
          name: 'Wide Screen',
          styles: {
            width: '2560px',
            height: '1440px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
    // Chromatic visual regression testing configuration
    chromatic: {
      diffThreshold: 0.01, // Tight threshold for IDE precision (catches 1px shifts)
      delay: 300, // Wait for animations/transitions
      pauseAnimationAtEnd: true, // Capture final animation state
      viewports: [375, 768, 1280, 1920], // Test all viewports
    },
    // Story ordering following Lumenforge.io Design System hierarchy
    // Exact structure: Foundations → Components → WIS2L Framework → Application Pages → Integrations → System
    options: {
      storySort: {
        order: [
          'Lumenforge.io Design System',
          [
            'Foundations',
            [
              'Colors (Slate Tokens)',
              'Typography',
              'Spacing',
              'Elevation',
              'Motion',
              'Grid & Layout',
              'Themes',
              'Accessibility',
            ],
            'Components',
            [
              'Atoms',
              'Molecules',
              'Organisms',
              'Layouts',
              'Utilities',
            ],
            'WIS2L Framework',
            [
              'Landing',
              [
                'Pages',
                [
                  'Main Gateway',
                ],
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Shared Framework Components',
              ],
              'Slate',
              [
                'Pages',
                [
                  'Workspace & Identity',
                ],
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Shared Framework Components',
              ],
              'Ignition',
              [
                'Pages',
                [
                  'Project Bootstrap',
                ],
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Runtime',
                'Shared Framework Components',
              ],
              'Spark',
              [
                'Pages',
                [
                  'IDE Experience',
                ],
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Templates',
                'Shared Framework Components',
              ],
              'Ignis',
              [
                'Pages',
                [
                  'API Backend',
                ],
                'Blueprint Editor',
                [
                  'Canvas',
                  'Nodes',
                  'Scenes',
                  'Wires',
                  'Complete',
                ],
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Shared Framework Components',
              ],
              'Waypoint',
              [
                'Pages',
                [
                  'Unity Visual Scripting',
                ],
                'AI Explain',
                'AI Suggestions',
                'Organisms',
                'Molecules',
                'Atoms',
                'Documentation',
                'Shared Framework Components',
              ],
              'Simulation',
              'Unity Bridge',
              'Shared Framework Components',
            ],
            'Application Pages',
            [
              'Editor',
              [
                'Shell',
                [
                  'AppShell',
                  'TopBar',
                  'Sidebar',
                  'Tabs',
                  'CommandPalette',
                  'SplitPane',
                ],
                'Filesystem',
                [
                  'FileTree',
                  'FileTabs',
                  'FilePreview',
                ],
                'GameDev',
                [
                  'SceneGraph',
                  'AssetManager',
                  'UnityIntegration',
                ],
                'MonacoEditor',
                'SearchReplace',
                'Complete',
                'IDE',
                [
                  'Simulation',
                ],
                'Plugins',
              ],
              'Filesystem Pages',
              'GameDev Pages',
              'Dashboard Pages',
            ],
            'Integrations',
            [
              'Plugins',
              'MCP Tools',
              'WebContainer Tools',
              'GitHub Actions UI Components',
              'Cloudflare / Zero Trust UI',
            ],
            'System',
            [
              'IDE Runtime',
              'Simulator Runtime',
              'API Schemas',
              'Network Visualizer',
              'Logs / Audit Visual Components',
              'Internal Dev Tools',
            ],
          ],
          // Legacy WISSIL path (backward compatibility)
          'WISSIL',
          [
            'Landing',
            [
              'Pages',
              [
                'Main Gateway',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
            ],
            'Slate',
            [
              'Pages',
              [
                'Workspace & Identity',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
            ],
            'Ignition',
            [
              'Pages',
              [
                'Project Bootstrap',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
              'Runtime',
            ],
            'Spark',
            [
              'Pages',
              [
                'IDE Experience',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
              'Templates',
            ],
            'Ignis',
            [
              'Pages',
              [
                'API Backend',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
              'Blueprint',
              [
                'Canvas',
                'Nodes',
                'Palette',
                'Wires',
                'Complete',
              ],
            ],
            'Waypoint',
            [
              'Pages',
              [
                'Unity Visual Scripting',
              ],
              'Organisms',
              'Molecules',
              'Atoms',
              'Documentation',
              'AI',
            ],
            'Shared',
            [
              'Layouts',
              'Atoms',
              'Molecules',
            ],
            'Unity',
            'Simulation',
          ],
          'Editor',
          [
            'Shell',
            [
              'AppShell',
              'TopBar',
              'Sidebar',
              'Tabs',
              'CommandPalette',
              'SplitPane',
            ],
            'Filesystem',
            [
              'FileTree',
              'FileTabs',
              'FilePreview',
            ],
            'MonacoEditor',
            'SearchReplace',
            'GameDev',
            [
              'SceneGraph',
              'AssetManager',
              'UnityIntegration',
            ],
            'Complete',
            'IDE',
            [
              'Simulation',
            ],
            'Plugins',
          ],
          'DesignSystem',
          [
            'Themes',
            [
              'Dark',
              'Light',
            ],
            'Primitives',
          ],
        ],
        method: 'alphabetical',
      },
    },
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['dark', 'light'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
