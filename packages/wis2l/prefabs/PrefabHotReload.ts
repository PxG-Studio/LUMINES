/**
 * Prefab Hot Reload
 * Apply/Revert prefab changes to Unity runtime
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { PrefabDiff as PrefabDiffType } from "./PrefabTypes";
import { useEditorState } from "@/state/editorState";
import { usePrefabStore } from "./PrefabStore";

/**
 * Prefab Hot Reload
 * Handles applying and reverting prefab changes
 */
export class PrefabHotReload {
  /**
   * Apply prefab overrides to Unity
   */
  static apply(prefabId: string, diffs: PrefabDiffType[]): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[PrefabHotReload] Unity not connected");
      return;
    }

    UnityMessagingBus.send("prefab/apply", {
      id: prefabId,
      diffs
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Prefab] Applied ${diffs.length} changes to prefab: ${prefabId}`);
  }

  /**
   * Revert prefab to original state
   */
  static revert(prefabId: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[PrefabHotReload] Unity not connected");
      return;
    }

    UnityMessagingBus.send("prefab/revert", {
      id: prefabId
    });

    // Clear local overrides
    usePrefabStore.getState().clearOverrides(prefabId);

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Prefab] Reverted prefab to original: ${prefabId}`);
  }

  /**
   * Save prefab to file system
   */
  static save(prefabId: string, prefabData: any): void {
    const { PrefabSerializer } = require("./PrefabSerializer");
    const { useWissilFS } = require("../runtime/fs/wissilFs");

    const json = PrefabSerializer.toJSON(prefabData);
    const fs = useWissilFS.getState();

    const path = `Prefabs/${prefabId}.prefab.json`;
    fs.writeFile(path, json);

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Prefab] Saved prefab to: ${path}`);
  }
}

