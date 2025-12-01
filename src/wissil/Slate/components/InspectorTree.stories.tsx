import type { Meta, StoryObj } from "@storybook/react";
import { InspectorPanel } from "./InspectorPanel";
import { FileTree } from "./FileTree";
import { SplitView } from "@/design-system/primitives/SplitView";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Slate/Shared Framework Components/InspectorTree",
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div style={{ width: "100vw", height: "100vh", background: "var(--nv-bg-0)" }}>
      <SplitView direction="horizontal" initial={240} min={150} max={400}>
        <InspectorPanel />
        <FileTree />
      </SplitView>
    </div>
  ),
};

