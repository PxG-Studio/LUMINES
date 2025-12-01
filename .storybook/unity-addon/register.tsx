/**
 * Unity Addon Registration
 * Registers the Unity Explorer panel with Storybook
 */

import { addons, types } from "@storybook/addons";
import { UnityPreviewPanel } from "./UnityPreviewPanel";

const ADDON_ID = "storybook/unity-addon";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Unity Explorer",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active, key }) => (
      <UnityPreviewPanel key={key} active={active} />
    )
  });
});

