/**
 * IgnitionRuntimeBar Component
 * Runtime control bar (Run / Restart / Stop) with status indicator
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";
import { useEditorState } from "@/state/editorState";
import { IgnitionStatusIndicator } from "./IgnitionStatusIndicator";
import { IgnitionController } from "@/wissil/runtime/ignition/ignitionController";
import { LiveCommand } from "@/wissil/runtime/unityBridge/LiveCommand";
import { UnityMessagingBus } from "@/wissil/runtime/unityBridge/UnityMessagingBus";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnitionRuntimeBarProps {
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function IgnitionRuntimeBar({
  onRun,
  onRestart,
  onStop,
  className,
  style
}: IgnitionRuntimeBarProps) {
  const theme = useTheme();
  const setBuildStatus = useEditorState((s) => s.setBuildStatus);
  const setRuntimeError = useEditorState((s) => s.setRuntimeError);
  const pushMessage = useEditorState((s) => s.pushMessage);

  const handleRun = () => {
    // Try Unity LiveCommand first (if Unity is connected)
    if (UnityMessagingBus.isConnected()) {
      LiveCommand.run({
        onSuccess: () => pushMessage("[Unity] Runtime started via LiveCommand"),
        onError: (err) => {
          pushMessage(`❌ [Unity] Run failed: ${err}`);
          // Fallback to IgnitionController
          if (!onRun) {
            IgnitionController.run();
          } else {
            onRun();
          }
        }
      });
    } else {
      // Fallback to IgnitionController for non-Unity runtime
      if (onRun) {
        onRun();
      } else {
        IgnitionController.run();
      }
    }
  };

  const handleRestart = () => {
    // Try Unity LiveCommand first (if Unity is connected)
    if (UnityMessagingBus.isConnected()) {
      LiveCommand.reload({
        onSuccess: () => pushMessage("[Unity] Runtime restarted via LiveCommand"),
        onError: (err) => {
          pushMessage(`❌ [Unity] Restart failed: ${err}`);
          // Fallback to IgnitionController
          if (!onRestart) {
            IgnitionController.restart();
          } else {
            onRestart();
          }
        }
      });
    } else {
      // Fallback to IgnitionController for non-Unity runtime
      if (onRestart) {
        onRestart();
      } else {
        IgnitionController.restart();
      }
    }
  };

  const handleStop = () => {
    // Try Unity LiveCommand first (if Unity is connected)
    if (UnityMessagingBus.isConnected()) {
      LiveCommand.stop({
        onSuccess: () => pushMessage("[Unity] Runtime stopped via LiveCommand")
      });
    }
    
    // Also stop IgnitionController
    if (onStop) {
      onStop();
    } else {
      IgnitionController.stop();
    }
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: theme.spacing.sm,
        alignItems: "center",
        marginLeft: "auto",
        marginRight: theme.spacing.md,
        ...style
      }}
    >
      <IgnitionStatusIndicator />

      <Button
        variant="accent"
        onClick={handleRun}
        style={{ padding: "6px 12px", fontSize: theme.typography.size.sm }}
      >
        Run
      </Button>

      <Button
        variant="ghost"
        onClick={handleRestart}
        style={{ padding: "6px 12px", fontSize: theme.typography.size.sm }}
      >
        Restart
      </Button>

      <Button
        variant="ghost"
        onClick={handleStop}
        style={{ padding: "6px 12px", fontSize: theme.typography.size.sm }}
      >
        Stop
      </Button>
    </div>
  );
}

