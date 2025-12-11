import type { Meta, StoryObj } from "@storybook/nextjs";
import { SlateLayout } from "./SlateLayout";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta<typeof SlateLayout> = {
  title: "Lumenforge.io Design System/WIS2L Framework/Slate/Shared Framework Components/SlateComponents",
  component: SlateLayout,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
          <Story />
        </div>
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

export const Default: StoryObj<typeof SlateLayout> = {
  args: {
    status: "Ignition: idle",
  },
};

export const WithFileSelection: StoryObj<typeof SlateLayout> = {
  args: {
    status: "Ignition: ready",
    onFileSelect: (path) => console.log("File selected:", path),
    onTabSelect: (tab) => console.log("Tab selected:", tab),
    onRun: () => console.log("Run clicked"),
    onRestart: () => console.log("Restart clicked"),
    onStop: () => console.log("Stop clicked"),
  },
};

