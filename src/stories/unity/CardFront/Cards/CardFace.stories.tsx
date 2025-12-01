/**
 * CardFront Card Face Stories
 * Preview of card face textures and designs
 */

import React from "react";
import { TextureInspector } from "@/wissil/UnityBrowser/inspectors/TextureInspector";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Lumenforge.io Design System/WIS2L Framework/Unity Bridge/CardFront/Cards/CardFace",
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj;

export const DefaultCardFace: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Default Card Face</h3>
      <p style={{ margin: 0, marginBottom: 16, opacity: 0.8 }}>
        Default card face texture. This can be customized for different card types.
      </p>
      <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <TextureInspector filePath="Assets/CardFaces/Default.png" />
      </div>
    </div>
  )
};

export const CardBack: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Card Back</h3>
      <p style={{ margin: 0, marginBottom: 16, opacity: 0.8 }}>
        Card back texture. Used when cards are face-down.
      </p>
      <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <TextureInspector filePath="Assets/CardFaces/CardBack.png" />
      </div>
    </div>
  )
};

export const CardBorder: Story = {
  render: () => (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Card Border</h3>
      <p style={{ margin: 0, marginBottom: 16, opacity: 0.8 }}>
        Decorative border texture for cards.
      </p>
      <div style={{ border: "1px solid #333", borderRadius: 8, overflow: "hidden" }}>
        <TextureInspector filePath="Assets/CardFaces/Border.png" />
      </div>
    </div>
  )
};

