import type { Meta, StoryObj } from "@storybook/react";
import { WaypointLayout } from "./WaypointLayout";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta<typeof WaypointLayout> = {
  title: "Lumenforge.io Design System/WIS2L Framework/Waypoint/Shared Framework Components/WaypointComponents",
  component: WaypointLayout,
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

export const Default: StoryObj<typeof WaypointLayout> = {};

