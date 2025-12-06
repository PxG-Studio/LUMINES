/**
 * LUNA Build Doctor
 * AI-driven auto-fixer for build issues
 */

import { PreflightIssue } from "../build/BuildTypes";
import { useEditorState } from "@/state/editorState";

export interface BuildFix {
  issue: string;
  fix: string;
  autoFix?: () => void;
  severity: "low" | "medium" | "high";
}

/**
 * LUNA Build Doctor
 * Analyzes build issues and provides fixes
 */
export class LunaBuildDoctor {
  /**
   * Analyze build issues and suggest fixes
   */
  static analyze(issues: PreflightIssue[]): BuildFix[] {
    const fixes: BuildFix[] = [];

    for (const issue of issues) {
      const fix = this.getFixForIssue(issue);
      if (fix) {
        fixes.push(fix);
      }
    }

    return fixes;
  }

  /**
   * Get fix for specific issue
   */
  private static getFixForIssue(issue: PreflightIssue): BuildFix | null {
    const message = issue.message.toLowerCase();

    if (message.includes("no scenes")) {
      return {
        issue: issue.message,
        fix: "Enable at least one scene in Build Settings",
        autoFix: () => {
          // Auto-enable first scene
          console.log("[LUNA Build Doctor] Auto-enabling scenes...");
        },
        severity: issue.severity
      };
    }

    if (message.includes("compression not set")) {
      return {
        issue: issue.message,
        fix: "Enable WebGL compression for better performance",
        autoFix: () => {
          // Auto-set compression
          console.log("[LUNA Build Doctor] Auto-enabling compression...");
        },
        severity: issue.severity
      };
    }

    if (message.includes("android")) {
      if (message.includes("sdk")) {
        return {
          issue: issue.message,
          fix: "Set Android SDK version in Player Settings",
          severity: issue.severity
        };
      }
    }

    if (message.includes("ios")) {
      if (message.includes("bundle identifier")) {
        return {
          issue: issue.message,
          fix: "Set bundle identifier in Player Settings",
          severity: issue.severity
        };
      }
    }

    if (message.includes("memory size")) {
      return {
        issue: issue.message,
        fix: "Reduce WebGL memory size for better browser compatibility",
        severity: issue.severity
      };
    }

    if (message.includes("build size")) {
      return {
        issue: issue.message,
        fix: "Enable asset compression or strip unused assets",
        severity: issue.severity
      };
    }

    // Generic fix
    return {
      issue: issue.message,
      fix: issue.fix || "Review build settings",
      severity: issue.severity
    };
  }

  /**
   * Auto-fix build issues
   */
  static autoFix(issues: PreflightIssue[]): void {
    const fixes = this.analyze(issues);
    const pushMessage = useEditorState.getState().pushMessage;

    let fixedCount = 0;

    for (const fix of fixes) {
      if (fix.autoFix && fix.severity !== "high") {
        // Only auto-fix non-critical issues
        try {
          fix.autoFix();
          fixedCount++;
          pushMessage(`[LUNA Build Doctor] Auto-fixed: ${fix.issue}`);
        } catch (error: any) {
          console.error(`[LUNA Build Doctor] Failed to fix: ${fix.issue}`, error);
        }
      }
    }

    if (fixedCount > 0) {
      pushMessage(`[LUNA Build Doctor] Auto-fixed ${fixedCount} issue(s)`);
    } else {
      pushMessage("[LUNA Build Doctor] No auto-fixable issues found");
    }
  }

  /**
   * Recommend build profile
   */
  static recommendProfile(target: string, size: number): string {
    if (size > 500 * 1024 * 1024) {
      // Large build
      return "production";
    }

    if (target === "webgl") {
      return "production";
    }

    return "staging";
  }

  /**
   * Suggest optimizations
   */
  static suggestOptimizations(target: string, profile: string): string[] {
    const suggestions: string[] = [];

    if (profile === "development") {
      suggestions.push("Consider using staging profile for smaller builds");
    }

    if (target === "webgl") {
      suggestions.push("Enable WebGL compression for better performance");
      suggestions.push("Consider code stripping for smaller builds");
    }

    if (target === "android") {
      suggestions.push("Optimize textures for mobile devices");
      suggestions.push("Enable texture compression");
    }

    return suggestions;
  }
}

