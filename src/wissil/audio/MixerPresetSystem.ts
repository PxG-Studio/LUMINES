/**
 * Mixer Preset System
 * Save/Load mixer configurations
 */

import { useAudioMixerStore } from "./AudioMixerStore";
import { MixerPreset } from "./AudioTypes";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

/**
 * Mixer Preset System
 * Handles saving and loading mixer presets
 */
export class MixerPresetSystem {
  /**
   * Save current mixer state as preset
   */
  static savePreset(name: string): void {
    const groups = useAudioMixerStore.getState().groups;
    const spatial = useAudioMixerStore.getState().spatial;

    const preset: MixerPreset = {
      name,
      groups,
      effects: {},
      spatial,
      timestamp: Date.now()
    };

    // Extract effects into separate map
    Object.values(groups).forEach((group) => {
      if (group.effects && group.effects.length > 0) {
        preset.effects[group.id] = group.effects;
      }
    });

    // Save to store
    useAudioMixerStore.getState().savePreset(name, preset);

    // Save to file system
    const fs = useWissilFS.getState();
    const json = JSON.stringify(preset, null, 2);
    fs.writeFile(`Audio/Presets/${name}.json`, json);

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Audio] Saved preset: ${name}`);
  }

  /**
   * Load preset
   */
  static loadPreset(name: string): void {
    const fs = useWissilFS.getState();
    const presetContent = fs.readFile(`Audio/Presets/${name}.json`);

    if (!presetContent) {
      console.warn(`[MixerPresetSystem] Preset ${name} not found`);
      return;
    }

    try {
      const preset: MixerPreset = JSON.parse(presetContent);

      // Restore groups
      useAudioMixerStore.getState().registerGroups(Object.values(preset.groups));

      // Restore effects
      Object.entries(preset.effects).forEach(([groupId, effects]) => {
        const group = useAudioMixerStore.getState().getGroup(groupId);
        if (group) {
          useAudioMixerStore.getState().updateGroup(groupId, { effects });
        }
      });

      // Restore spatial settings
      if (preset.spatial) {
        useAudioMixerStore.getState().setSpatial(preset.spatial);
      }

      // Send to Unity
      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("audio/loadPreset", preset);
      }

      const pushMessage = useEditorState.getState().pushMessage;
      pushMessage(`[Audio] Loaded preset: ${name}`);
    } catch (error: any) {
      console.error(`[MixerPresetSystem] Error loading preset:`, error);
    }
  }

  /**
   * List available presets
   */
  static listPresets(): string[] {
    const presets = useAudioMixerStore.getState().presets;
    return Object.keys(presets);
  }

  /**
   * Delete preset
   */
  static deletePreset(name: string): void {
    // Remove from store
    const presets = useAudioMixerStore.getState().presets;
    const updatedPresets = { ...presets };
    delete updatedPresets[name];
    // Note: Would need a deletePreset action in store

    // Delete from file system
    const fs = useWissilFS.getState();
    fs.deleteFile(`Audio/Presets/${name}.json`);

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Audio] Deleted preset: ${name}`);
  }

  /**
   * Export preset
   */
  static exportPreset(name: string): void {
    const preset = useAudioMixerStore.getState().presets[name];
    if (!preset) {
      console.warn(`[MixerPresetSystem] Preset ${name} not found`);
      return;
    }

    const json = JSON.stringify(preset, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.audio-preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

