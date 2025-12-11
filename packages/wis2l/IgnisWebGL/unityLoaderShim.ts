/**
 * Unity Loader Shim
 * Loads Unity WebGL loader script dynamically
 */

let loaderLoaded = false;
let loaderPromise: Promise<void> | null = null;

/**
 * Load Unity loader script from build folder
 */
export function loadUnityLoader(buildUrl: string): Promise<void> {
  // Return existing promise if already loading
  if (loaderPromise) {
    return loaderPromise;
  }

  // Return resolved promise if already loaded
  if (loaderLoaded && (window as any).createUnityInstance) {
    return Promise.resolve();
  }

  loaderPromise = new Promise((resolve, reject) => {
    // Try common Unity loader naming patterns
    const loaderPaths = [
      `${buildUrl}/Build/build.loader.js`,
      `${buildUrl}/Build/Build.loader.js`,
      `${buildUrl}/Build/UnityLoader.js`,
      `${buildUrl}/Build/[ProjectName].loader.js`
    ];

    let attempts = 0;
    const maxAttempts = loaderPaths.length;

    const tryLoad = (index: number) => {
      if (index >= maxAttempts) {
        reject(new Error(`Failed to load Unity loader. Tried ${maxAttempts} paths.`));
        loaderPromise = null;
        return;
      }

      const script = document.createElement("script");
      script.src = loaderPaths[index];

      script.onload = () => {
        loaderLoaded = true;
        loaderPromise = null;
        
        // Verify Unity loader is available
        if ((window as any).createUnityInstance) {
          resolve();
        } else {
          // Try next path
          tryLoad(index + 1);
        }
      };

      script.onerror = () => {
        // Try next path
        tryLoad(index + 1);
      };

      document.head.appendChild(script);
    };

    tryLoad(0);
  });

  return loaderPromise;
}

/**
 * Check if Unity loader is available
 */
export function isUnityLoaderReady(): boolean {
  return loaderLoaded && typeof (window as any).createUnityInstance === "function";
}

/**
 * Reset loader state (for testing/reloading)
 */
export function resetLoaderState(): void {
  loaderLoaded = false;
  loaderPromise = null;
}

