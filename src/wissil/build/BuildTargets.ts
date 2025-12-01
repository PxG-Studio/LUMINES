/**
 * Build Targets Schema
 * Supported Unity build targets
 */

export interface BuildTarget {
  id: string;
  label: string;
  unityTarget: string;
  icon?: string;
  description?: string;
  enabled?: boolean;
}

export const BUILD_TARGETS: Record<string, BuildTarget> = {
  webgl: {
    id: "webgl",
    label: "WebGL (Browser)",
    unityTarget: "WebGL",
    description: "Build for web browsers",
    enabled: true
  },
  desktopWin: {
    id: "win",
    label: "Windows Desktop",
    unityTarget: "StandaloneWindows64",
    description: "Windows 64-bit executable",
    enabled: true
  },
  desktopMac: {
    id: "mac",
    label: "macOS Universal",
    unityTarget: "StandaloneOSX",
    description: "macOS universal binary",
    enabled: true
  },
  desktopLinux: {
    id: "linux",
    label: "Linux Desktop",
    unityTarget: "StandaloneLinux64",
    description: "Linux 64-bit executable",
    enabled: true
  },
  android: {
    id: "android",
    label: "Android APK/AAB",
    unityTarget: "Android",
    description: "Android app bundle or APK",
    enabled: true
  },
  ios: {
    id: "ios",
    label: "iOS Xcode Project",
    unityTarget: "iOS",
    description: "iOS Xcode project (requires Mac)",
    enabled: false // Requires Mac build machine
  }
};

export function getBuildTarget(id: string): BuildTarget | undefined {
  return BUILD_TARGETS[id];
}

export function getAllBuildTargets(): BuildTarget[] {
  return Object.values(BUILD_TARGETS).filter((t) => t.enabled !== false);
}

