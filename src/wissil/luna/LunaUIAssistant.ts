/**
 * LUNA UI Assistant
 * AI fixes layout issues automatically
 */

import { RectSnapshot } from "../ui/UITypes";
import { CanvasPatcher } from "../ui/CanvasPatcher";
import { useCanvasStore } from "../ui/CanvasStore";
import { useEditorState } from "@/state/editorState";

export interface UIIssue {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  suggestion: string;
  fix?: () => void;
}

/**
 * LUNA UI Assistant
 * Analyzes UI layout and provides suggestions
 */
export class LunaUIAssistant {
  /**
   * Analyze UI canvas setup
   */
  static analyze(rects: Record<string, RectSnapshot>): UIIssue[] {
    const issues: UIIssue[] = [];
    const rectList = Object.values(rects);

    // Check for zero-size elements
    const zeroSize = rectList.filter((r) => r.size.x <= 0 || r.size.y <= 0);
    if (zeroSize.length > 0) {
      issues.push({
        type: "zero_size",
        severity: "high",
        description: `${zeroSize.length} element(s) have zero size`,
        suggestion: "Set proper size values for all UI elements",
        fix: () => {
          zeroSize.forEach((rect) => {
            CanvasPatcher.patch(rect.id, "size", {
              x: Math.max(100, rect.size.x || 100),
              y: Math.max(100, rect.size.y || 100)
            });
          });
        }
      });
    }

    // Check for elements outside common screen bounds
    const offScreen = rectList.filter((r) => {
      const pos = r.position;
      return pos.x < -2000 || pos.x > 4000 || pos.y < -2000 || pos.y > 4000;
    });
    if (offScreen.length > 0) {
      issues.push({
        type: "off_screen",
        severity: "medium",
        description: `${offScreen.length} element(s) appear to be off-screen`,
        suggestion: "Check element positions",
        fix: undefined
      });
    }

    // Check for unanchored mobile layouts
    const unanchored = rectList.filter(
      (r) => r.anchorMin.x === r.anchorMax.x && r.anchorMin.y === r.anchorMax.y
    );
    if (unanchored.length > 0) {
      issues.push({
        type: "unanchored",
        severity: "low",
        description: `${unanchored.length} element(s) use fixed anchors (may not be responsive)`,
        suggestion: "Consider using stretch anchors for responsive layouts",
        fix: undefined
      });
    }

    // Check for overlapping elements (simplified check)
    const overlapping: RectSnapshot[] = [];
    for (let i = 0; i < rectList.length; i++) {
      for (let j = i + 1; j < rectList.length; j++) {
        const r1 = rectList[i];
        const r2 = rectList[j];
        if (
          r1.position.x < r2.position.x + r2.size.x &&
          r1.position.x + r1.size.x > r2.position.x &&
          r1.position.y < r2.position.y + r2.size.y &&
          r1.position.y + r1.size.y > r2.position.y
        ) {
          if (!overlapping.includes(r1)) overlapping.push(r1);
          if (!overlapping.includes(r2)) overlapping.push(r2);
        }
      }
    }
    if (overlapping.length > 0) {
      issues.push({
        type: "overlapping",
        severity: "medium",
        description: `${overlapping.length} element(s) appear to overlap`,
        suggestion: "Check element positions and sizes",
        fix: undefined
      });
    }

    // Check for very large elements (might be accidental)
    const veryLarge = rectList.filter((r) => r.size.x > 5000 || r.size.y > 5000);
    if (veryLarge.length > 0) {
      issues.push({
        type: "very_large",
        severity: "low",
        description: `${veryLarge.length} element(s) are very large (might be accidental)`,
        suggestion: "Verify element sizes are correct",
        fix: undefined
      });
    }

    // Check for elements with same position (stacked)
    const stacked: string[] = [];
    const positionMap = new Map<string, RectSnapshot[]>();
    rectList.forEach((r) => {
      const key = `${r.position.x},${r.position.y}`;
      if (!positionMap.has(key)) positionMap.set(key, []);
      positionMap.get(key)!.push(r);
    });
    positionMap.forEach((rectsAtPos) => {
      if (rectsAtPos.length > 1) {
        stacked.push(...rectsAtPos.map((r) => r.name));
      }
    });
    if (stacked.length > 0) {
      issues.push({
        type: "stacked",
        severity: "low",
        description: `${stacked.length / 2} pair(s) of elements are stacked at the same position`,
        suggestion: "Adjust positions to avoid overlap",
        fix: undefined
      });
    }

    return issues;
  }

  /**
   * Auto-fix UI issues
   */
  static autoFix(): void {
    const rects = useCanvasStore.getState().rects;
    const issues = this.analyze(rects);
    const pushMessage = useEditorState.getState().pushMessage;

    // Auto-fix high priority issues
    for (const issue of issues) {
      if (issue.severity === "high" && issue.fix) {
        issue.fix();
        pushMessage(`[LUNA UI] Auto-fixed: ${issue.description}`);
      }
    }
  }

  /**
   * Suggest responsive layout improvements
   */
  static suggestResponsive(): void {
    const rects = useCanvasStore.getState().rects;
    const rectList = Object.values(rects);
    const pushMessage = useEditorState.getState().pushMessage;

    const fixedAnchors = rectList.filter(
      (r) => r.anchorMin.x === r.anchorMax.x && r.anchorMin.y === r.anchorMax.y
    );

    if (fixedAnchors.length > 0) {
      pushMessage(
        `[LUNA UI] ${fixedAnchors.length} element(s) could benefit from responsive anchors`
      );
    } else {
      pushMessage("[LUNA UI] All elements appear to have responsive layouts");
    }
  }
}

