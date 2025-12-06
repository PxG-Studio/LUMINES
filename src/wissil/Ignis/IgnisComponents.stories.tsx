import type { Meta, StoryObj } from "@storybook/nextjs";
import { IgnisContainer } from "./IgnisContainer";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta<typeof IgnisContainer> = {
  title: "Lumenforge.io Design System/WIS2L Framework/Ignis/Shared Framework Components/IgnisComponents",
  component: IgnisContainer,
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

export const Default: StoryObj<typeof IgnisContainer> = {};

export const DesktopView: StoryObj<typeof IgnisContainer> = {
  render: () => (
    <div style={{ width: "100vw", height: "100vh" }}>
      <IgnisContainer />
    </div>
  ),
};

