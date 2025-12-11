/**
 * LUNA Autopilot Panel & Control UI
 * Controls and monitors autonomous AI agent
 */

'use client';

import React, { useState, useEffect } from "react";
import { useLunaMemory } from "./LunaMemoryGraph";
import { LunaMacroActions } from "./LunaMacroActions";
import {
  initializeLunaPlanner,
  isLunaPlannerActive,
  setLunaPlannerEnabled
} from "./LunaPlanner";
import { Button } from "@/design-system/primitives/Button";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { useEditorState } from "@/state/editorState";

export interface LunaAutopilotPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LunaAutopilotPanel({
  className,
  style
}: LunaAutopilotPanelProps) {
  const theme = useTheme();
  const pushMessage = useEditorState.getState().pushMessage;
  const memory = useLunaMemory();
  const [isActive, setIsActive] = useState(isLunaPlannerActive());
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Initialize planner
  useEffect(() => {
    const cleanup = initializeLunaPlanner();
    return cleanup;
  }, []);

  // Monitor memory for recent actions
  useEffect(() => {
    const interval = setInterval(() => {
      const history = memory.history;
      if (history.length > 0) {
        const latest = history.slice(-5).map((e) => e.type || e.action || "unknown");
        setRecentActions(latest);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [memory.history]);

  const handleToggle = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    setLunaPlannerEnabled(newActive);
  };

  const handleMacroAction = async (macro: keyof typeof LunaMacroActions) => {
    try {
      const result = (LunaMacroActions[macro] as any)();
      if (result.success) {
        pushMessage(`[LUNA Autopilot] ✅ ${macro} completed`);
      } else {
        pushMessage(`[LUNA Autopilot] ❌ ${macro} failed: ${result.errors?.join(", ")}`);
      }
    } catch (err: any) {
      pushMessage(`[LUNA Autopilot] ❌ Error: ${err.message}`);
    }
  };

  const handleTriggerPattern = (pattern: string, value: any) => {
    memory.updatePattern(pattern, value, 0.8);
    pushMessage(`[LUNA Autopilot] 🔄 Triggered pattern: ${pattern}`);
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.sm
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: theme.typography.size.xl,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            LUNA Autopilot
          </h2>
          <div style={{ display: "flex", gap: theme.spacing.xs, alignItems: "center" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isActive
                  ? theme.colors.success || "#4ade80"
                  : theme.colors.text2 || "#6b7280"
              }}
            />
            <Button
              variant={isActive ? "accent" : "ghost"}
              onClick={handleToggle}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                fontSize: theme.typography.size.sm
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </Button>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.8
          }}
        >
          Autonomous AI agent that monitors gameplay, evaluates trends, and modifies rules,
          components, and scenes automatically.
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.lg
        }}
      >
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.text0 }}>
            {memory.history.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Actions</div>
        </div>
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.text0 }}>
            {Object.keys(memory.patterns).length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Patterns</div>
        </div>
        <div
          style={{
            padding: theme.spacing.sm,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`,
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.semibold, color: theme.colors.text0 }}>
            {memory.hypotheses.length}
          </div>
          <div style={{ fontSize: theme.typography.size.xs, color: theme.colors.text2 }}>Hypotheses</div>
        </div>
      </div>

      {/* Macro Actions */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Macro Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: theme.spacing.xs
          }}
        >
          <Button
            variant="ghost"
            onClick={() => handleMacroAction("autofixHUD")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Auto-Fix HUD
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleMacroAction("rebalanceRules")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Rebalance Rules
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleMacroAction("fixScene")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Fix Scene
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleMacroAction("recenterCamera")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Recenter Camera
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleMacroAction("fullAutoRepair")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Full Auto-Repair
          </Button>
        </div>
      </div>

      {/* Pattern Triggers */}
      <div
        style={{
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Pattern Triggers (Testing)
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing.xs
          }}
        >
          <Button
            variant="ghost"
            onClick={() => handleTriggerPattern("tooManyTies", true)}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Trigger: Too Many Ties
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleTriggerPattern("cardOverpower", true)}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              fontSize: theme.typography.size.sm
            }}
          >
            Trigger: Card Overpower
          </Button>
        </div>
      </div>

      {/* Recent Actions */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Recent Actions
        </h3>
        {recentActions.length > 0 ? (
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text2
            }}
          >
            {recentActions.map((action, i) => (
              <div key={i} style={{ marginBottom: theme.spacing.xs }}>
                • {action}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: theme.typography.size.sm,
              color: theme.colors.text2,
              opacity: 0.6,
              fontStyle: "italic"
            }}
          >
            No recent actions
          </div>
        )}
      </div>
    </div>
  );
}

