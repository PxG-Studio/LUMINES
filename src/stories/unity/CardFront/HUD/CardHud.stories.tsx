/**
 * CardFront HUD Stories
 * Preview of CardFront UI elements
 */

import React from "react";
import { TextureInspector } from "@/wissil/UnityBrowser/inspectors/TextureInspector";
import type { Meta, StoryObj } from "@storybook/nextjs";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/HUD/CardHud",
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj;

export const TurnIndicator: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Turn Indicator</h3>
      <p style={{ margin: 0, marginBottom: 16, opacity: 0.8 }}>
        Preview of the turn indicator UI element. This texture can be used in the CardFront HUD.
      </p>
      <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <TextureInspector filePath="Assets/UI/TurnIndicator.png" />
      </div>
    </div>
  )
};

export const CardFrontHUD: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>CardFront HUD</h3>
      <p style={{ margin: 0, marginBottom: 16, opacity: 0.8 }}>
        Complete HUD overlay for CardFront games. Includes health bars, turn indicators, and card zones.
      </p>
      <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <TextureInspector filePath="Assets/UI/CardFrontHUD.png" />
      </div>
    </div>
  )
};

