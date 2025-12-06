import type { Meta, StoryObj } from '@storybook/react';
import { SlateLayout } from './components/SlateLayout';
import { within, userEvent, expect, fn } from '@storybook/test';

const meta: Meta<typeof SlateLayout> = {
  title: 'LumenForge/WIS2L Framework/SLATE/Full IDE',
  component: SlateLayout,
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
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
        component: `
# SLATE - Full IDE with Unity Asset Pipeline

Complete IDE experience for the SLATE subsystem, including:

- **Explorer**: File tree + Unity asset manager integration
- **Editor**: Code editor with tab management
- **Runtime**: Ignition controls + live preview
- **Unity Assets**: Upload, preview, deconstruct, reconstruct, and download Unity assets
- **Bottom Panel**: Console, Logs, and Errors

## Features

### IDE View
- File explorer with search
- Multi-tab code editor
- Runtime controls (Run, Restart, Stop)
- Resizable bottom panel
- Collapsible sidebar

### Unity Assets View
- Drag & drop asset upload
- Asset tree navigation
- Preview panel with type-specific rendering
- Deconstruct assets into components
- Reconstruct and export modified assets
- Support for .unitypackage, .prefab, .mat, .cs, .fbx, .png, .shader files

Use the stories below to validate layout, viewports, and interactions.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const runBasicAssertions: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole('navigation', { name: /primary navigation/i })
  ).toBeInTheDocument();

  await expect(canvas.getByText(/Inspector/i)).toBeInTheDocument();

  await expect(canvas.getByRole('button', { name: /Run/i })).toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
  await expect(canvas.getByRole('button', { name: /Stop/i })).toBeInTheDocument();

  await expect(canvas.getByRole('tab', { name: /Console/i })).toBeInTheDocument();
  await expect(canvas.getByRole('tab', { name: /Logs/i })).toBeInTheDocument();
  await expect(canvas.getByRole('tab', { name: /Errors/i })).toBeInTheDocument();
};

export const Default: Story = {
  args: {
    status: 'Ignition: idle',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: runBasicAssertions,
};

export const WithInteractions: Story = {
  args: {
    status: 'Ignition: ready',
    onFileSelect: fn<(path: string) => void>(),
    onTabSelect: fn<(tab: string) => void>(),
    onTabClose: fn<(tab: string) => void>(),
    onRun: fn<() => void>(),
    onRestart: fn<() => void>(),
    onStop: fn<() => void>(),
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);

    await runBasicAssertions(context);

    const runButton = canvas.getByRole('button', { name: /Run/i });
    await userEvent.click(runButton);

    const logsTab = canvas.getByRole('tab', { name: /Logs/i });
    await userEvent.click(logsTab);

    const errorsTab = canvas.getByRole('tab', { name: /Errors/i });
    await userEvent.click(errorsTab);

    const consoleTab = canvas.getByRole('tab', { name: /Console/i });
    await userEvent.click(consoleTab);
  },
};

export const FileNavigation: Story = {
  args: {
    status: 'Ignition: idle',
    onFileSelect: fn<(path: string) => void>(),
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await runBasicAssertions({ canvasElement } as any);

    const explorerRegion = canvas.getByRole('region', { name: /file explorer/i });
    await expect(explorerRegion).toBeInTheDocument();

    const searchInput = canvas.getByPlaceholderText(/Search files/i);
    await userEvent.type(searchInput, 'Main');

    await userEvent.clear(searchInput);

    const srcFolder = canvas.getByText('src');
    await userEvent.click(srcFolder);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const mainFile = canvas.queryByText('Main.cs');
    if (mainFile) {
      await userEvent.click(mainFile);
      expect(args.onFileSelect).toHaveBeenCalled();
    }
  },
};

export const KeyboardNavigation: Story = {
  args: {
    status: 'Ignition: idle',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await runBasicAssertions({ canvasElement } as any);

    const explorerRegion = canvas.getByRole('region', { name: /file explorer/i });
    explorerRegion.focus();

    const tablist = canvas.getByRole('tablist', { name: /output panel tabs/i });
    tablist.focus();

    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowLeft}');
  },
};

export const BottomPanelKeyboard: Story = {
  args: {
    status: 'Ignition: idle',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);

    await runBasicAssertions(context);

    const tablist = canvas.getByRole('tablist', { name: /output panel tabs/i });
    tablist.focus();

    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowLeft}');
  },
};

export const UnityAssetsView: Story = {
  args: {
    status: 'Ignition: idle',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await runBasicAssertions({ canvasElement } as any);

    const unityAssetsButton = canvas.getByRole('button', { name: /Unity Assets/i });
    await userEvent.click(unityAssetsButton);

    await expect(canvas.getByText(/Drag & drop Unity assets/i)).toBeInTheDocument();

    const uploadMode = canvas.getByRole('button', { name: /upload/i });
    await expect(uploadMode).toBeInTheDocument();

    const previewMode = canvas.getByRole('button', { name: /preview/i });
    await expect(previewMode).toBeInTheDocument();

    const deconstructMode = canvas.getByRole('button', { name: /deconstruct/i });
    await expect(deconstructMode).toBeInTheDocument();

    const reconstructMode = canvas.getByRole('button', { name: /reconstruct/i });
    await expect(reconstructMode).toBeInTheDocument();
  },
};

export const Mobile: Story = {
  args: {
    status: 'Ignition: idle',
    onRun: fn<() => void>(),
    onRestart: fn<() => void>(),
    onStop: fn<() => void>(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);

    await runBasicAssertions(context);

    const runButton = canvas.getByRole('button', { name: /Run/i });
    await userEvent.click(runButton);
  },
};

export const Tablet: Story = {
  args: {
    status: 'Ignition: idle',
    onRun: fn<() => void>(),
    onRestart: fn<() => void>(),
    onStop: fn<() => void>(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async (context) => {
    await runBasicAssertions(context);
  },
};

export const WideScreen: Story = {
  args: {
    status: 'Ignition: idle',
    onRun: fn<() => void>(),
    onRestart: fn<() => void>(),
    onStop: fn<() => void>(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async (context) => {
    await runBasicAssertions(context);
  },
};

export const CollapsedSidebar: Story = {
  args: {
    status: 'Ignition: running',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await runBasicAssertions({ canvasElement } as any);

    const toggleButton = canvas.getByRole('button', { name: /Toggle sidebar/i });
    await userEvent.click(toggleButton);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchInput = canvas.queryByPlaceholderText(/Search files/i);
    expect(searchInput).not.toBeInTheDocument();
  },
};
