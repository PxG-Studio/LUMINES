/**
 * Minimal Unity Template Story
 * Preview of the minimal Unity WebGL template
 */

import React from "react";
import { UnityPreviewDecorator } from "storybook-decorator";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Unity Bridge/MinimalUnity",
  component: () => null,
  decorators: [
    (Story, context) => (
      <UnityPreviewDecorator buildUrl="/UnityBuild" enabled={true}>
        <Story {...context} />
      </UnityPreviewDecorator>
    )
  ],
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Minimal Unity WebGL Template</h3>
      <p style={{ margin: 0, opacity: 0.8 }}>
        This shows the default scene inside Storybook. The Unity WebGL build loads in the preview above.
      </p>
    </div>
  )
};

export const WithCustomBuild: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Custom Unity Build</h3>
      <p style={{ margin: 0, opacity: 0.8 }}>
        You can specify a custom build URL using the buildUrl prop.
      </p>
    </div>
  ),
  args: {
    buildUrl: "/UnityBuild",
    unityEnabled: true
  }
};

