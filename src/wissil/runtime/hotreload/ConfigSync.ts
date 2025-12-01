/**
 * JSON-Backed Script Config (Live Reloadable)
 * Synchronizes JSON config files from WISSIL FS to Unity at runtime
 * Enables hot reload of gameplay rules, card rules, scoring, etc.
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { useWissilFS } from "../fs/wissilFs";
import { setupUnityEventListeners } from "../unityBridge/RuntimeEvents";

type ConfigFile = {
  path: string;
  content: string | null;
  lastModified: number;
};

let watchedConfigs: Record<string, ConfigFile> = {};
let isInitialized = false;

/**
 * Initialize config sync system
 * Watches config files in WISSIL FS and syncs changes to Unity
 */
export function initConfigSync(configPaths: string[] = []): () => void {
  if (isInitialized) {
    console.warn("[ConfigSync] Already initialized");
    return () => {};
  }

  isInitialized = true;

  const fs = useWissilFS.getState();

  // Default config paths if none provided
  const defaultPaths = [
    "GameConfig/card_rules.json",
    "GameConfig/gameplay_rules.json",
    "GameConfig/scoring.json",
    "GameConfig/capture_rules.json"
  ];

  const pathsToWatch = configPaths.length > 0 ? configPaths : defaultPaths;

  // Load initial configs
  for (const path of pathsToWatch) {
    const content = fs.readFile(path);
    if (content !== null) {
      watchedConfigs[path] = {
        path,
        content,
        lastModified: Date.now()
      };

      // Send to Unity
      sendConfigToUnity(path, content);
    }
  }

  // Subscribe to FS changes
  const unsubscribe = useWissilFS.subscribe((state) => {
    // Check for changes in watched config files
    for (const path in watchedConfigs) {
      const currentContent = fs.readFile(path);
      const watched = watchedConfigs[path];

      if (currentContent !== watched.content) {
        // Config changed
        watchedConfigs[path] = {
          path,
          content: currentContent,
          lastModified: Date.now()
        };

        // Send update to Unity
        if (currentContent !== null) {
          sendConfigToUnity(path, currentContent);
        }
      }
    }

    // Check for new config files
    for (const path of pathsToWatch) {
      if (!watchedConfigs[path]) {
        const content = fs.readFile(path);
        if (content !== null) {
          watchedConfigs[path] = {
            path,
            content,
            lastModified: Date.now()
          };
          sendConfigToUnity(path, content);
        }
      }
    }
  });

  return () => {
    unsubscribe();
    watchedConfigs = {};
    isInitialized = false;
  };
}

/**
 * Send config to Unity
 */
function sendConfigToUnity(path: string, content: string): void {
  if (!UnityMessagingBus.isConnected()) {
    console.warn(`[ConfigSync] Unity not connected, cannot sync config: ${path}`);
    return;
  }

  try {
    // Parse JSON to validate
    const parsed = JSON.parse(content);

    UnityMessagingBus.send("configUpdate", {
      path,
      content,
      config: parsed,
      timestamp: Date.now()
    });

    console.log(`[ConfigSync] Synced config: ${path}`);
  } catch (err: any) {
    console.error(`[ConfigSync] Invalid JSON in config ${path}:`, err);
    UnityMessagingBus.send("configUpdate", {
      path,
      content,
      error: `Invalid JSON: ${err?.message || String(err)}`,
      timestamp: Date.now()
    });
  }
}

/**
 * Manually sync a config file
 */
export function syncConfig(path: string): void {
  const fs = useWissilFS.getState();
  const content = fs.readFile(path);

  if (content === null) {
    console.warn(`[ConfigSync] Config file not found: ${path}`);
    return;
  }

  watchedConfigs[path] = {
    path,
    content,
    lastModified: Date.now()
  };

  sendConfigToUnity(path, content);
}

/**
 * Add a new config file to watch
 */
export function watchConfig(path: string): void {
  if (!watchedConfigs[path]) {
    const fs = useWissilFS.getState();
    const content = fs.readFile(path);

    if (content !== null) {
      watchedConfigs[path] = {
        path,
        content,
        lastModified: Date.now()
      };
      sendConfigToUnity(path, content);
    }
  }
}

/**
 * Get watched config paths
 */
export function getWatchedConfigs(): string[] {
  return Object.keys(watchedConfigs);
}

