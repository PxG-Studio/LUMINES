import type { Meta, StoryObj } from "@storybook/react";
import { SparkLayout } from "./SparkLayout";
import { ThemeProvider } from "@/design-system/themes/ThemeProvider";

const meta: Meta<typeof SparkLayout> = {
  title: "Lumenforge.io Design System/WIS2L Framework/Spark/Shared Framework Components/SparkComponents",
  component: SparkLayout,
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

export const Default: StoryObj<typeof SparkLayout> = {};

export const WithCallback: StoryObj<typeof SparkLayout> = {
  args: {
    onTemplateSelect: (id, template) => {
      console.log("Template selected:", id, template);
    },
  },
};

