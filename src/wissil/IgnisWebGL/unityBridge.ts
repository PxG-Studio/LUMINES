/**
 * Unity Bridge
 * Creates, loads, and destroys Unity WebGL instances
 */

import { loadUnityLoader } from "./unityLoaderShim";

export interface UnityConfig {
  dataUrl?: string;
  frameworkUrl?: string;
  codeUrl?: string;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
}

export class UnityBridge {
  private static instance: any = null;
  private static canvas: HTMLCanvasElement | null = null;
  private static buildUrl: string | null = null;

  /**
   * Load Unity WebGL instance into container
   */
  static async loadInto(
    container: HTMLElement,
    buildUrl: string,
    config?: Partial<UnityConfig>
  ): Promise<any> {
    // Destroy old instance first
    if (this.instance) {
      try {
        if (typeof this.instance.Quit === "function") {
          this.instance.Quit();
        }
      } catch (err) {
        console.warn("Error quitting Unity instance:", err);
      }
      this.instance = null;
    }

    // Remove old canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }

    // Clear container
    container.innerHTML = "";

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "unity-canvas";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    container.appendChild(this.canvas);

    // Store build URL
    this.buildUrl = buildUrl;

    // Load Unity loader script
    await loadUnityLoader(buildUrl);

    // Check if Unity loader is available
    const createUnityInstance = (window as any).createUnityInstance;
    if (!createUnityInstance) {
      throw new Error("Unity loader did not register createUnityInstance. Make sure the loader script loaded correctly.");
    }

    // Default config
    const defaultConfig: UnityConfig = {
      dataUrl: `${buildUrl}/Build/build.data`,
      frameworkUrl: `${buildUrl}/Build/build.framework.js`,
      codeUrl: `${buildUrl}/Build/build.wasm`,
      streamingAssetsUrl: `${buildUrl}/StreamingAssets`,
      companyName: "WISSIL",
      productName: "Unity WebGL Build",
      productVersion: "1.0.0"
    };

    const finalConfig = { ...defaultConfig, ...config };

    // Create Unity instance
    try {
      this.instance = await createUnityInstance(this.canvas, finalConfig);
      
      // Set up bidirectional messaging bus (using dynamic import to avoid circular deps)
      // The messaging bus will be initialized when UnityBridge is loaded
      if (typeof window !== "undefined") {
        // Use setTimeout to ensure module is loaded
        setTimeout(async () => {
          try {
            const { UnityMessagingBus } = await import("@/wissil/runtime/unityBridge/UnityMessagingBus");
            UnityMessagingBus.setUnityInstance(this.instance);
            
            const { setupUnityEventListeners } = await import("@/wissil/runtime/unityBridge/RuntimeEvents");
            setupUnityEventListeners();
          } catch (err) {
            console.warn("[UnityBridge] Failed to set up messaging bus:", err);
          }
        }, 0);
      }
      
      return this.instance;
    } catch (err) {
      this.instance = null;
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
      }
      throw err;
    }
  }

  /**
   * Send message to Unity (if Unity has a receiver GameObject)
   */
  static postMessageToUnity(gameObject: string, method: string, message: any): void {
    if (!this.instance) {
      console.warn("Unity instance not loaded. Cannot send message.");
      return;
    }

    try {
      const messageStr = typeof message === "string" ? message : JSON.stringify(message);
      if (typeof this.instance.SendMessage === "function") {
        this.instance.SendMessage(gameObject, method, messageStr);
      } else {
        console.warn("Unity instance does not support SendMessage");
      }
    } catch (err) {
      console.error("Error sending message to Unity:", err);
    }
  }

  /**
   * Get Unity instance (for direct access)
   */
  static getInstance(): any {
    return this.instance;
  }

  /**
   * Check if Unity is loaded
   */
  static isLoaded(): boolean {
    return this.instance !== null;
  }

  /**
   * Destroy Unity instance
   */
  static destroy(): void {
    // Clean up messaging bus (using dynamic import to avoid circular deps)
    if (typeof window !== "undefined") {
      Promise.all([
        import("@/wissil/runtime/unityBridge/UnityMessagingBus").then(({ UnityMessagingBus }) => {
          UnityMessagingBus.reset();
        }).catch(() => {}),
        import("@/wissil/runtime/unityBridge/RuntimeEvents").then(({ cleanupUnityEventListeners }) => {
          cleanupUnityEventListeners();
        }).catch(() => {})
      ]).catch(() => {});
    }

    if (this.instance) {
      try {
        if (typeof this.instance.Quit === "function") {
          this.instance.Quit();
        }
      } catch (err) {
        console.warn("Error quitting Unity instance:", err);
      }
      this.instance = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }

    this.buildUrl = null;
  }

  /**
   * Get current build URL
   */
  static getBuildUrl(): string | null {
    return this.buildUrl;
  }
}

