/**
 * CardFront Scene Story
 * Preview of the CardFront Unity scene
 */

import React from "react";
import { UnityPreviewDecorator } from "storybook-decorator";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/CardFrontScene",
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

export const CardFrontScene: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>CardFront Scene</h3>
      <p style={{ margin: 0, opacity: 0.8 }}>
        Preview of the CardFront Unity scene inside Storybook. This includes the board layout, camera, and UI elements.
      </p>
      <ul style={{ marginTop: 12, paddingLeft: 20, opacity: 0.8 }}>
        <li>Board plane</li>
        <li>Card zone transforms</li>
        <li>Camera rig</li>
        <li>UI canvas</li>
      </ul>
    </div>
  )
};

