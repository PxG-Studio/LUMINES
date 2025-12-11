"use client";

/**
 * Unity Operation Progress Tracker
 *
 * Real-time progress indicators for Unity MCP operations
 */

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Operation {
  id: string;
  type: string;
  status: "started" | "completed" | "failed";
  name?: string;
  error?: string;
  timestamp: number;
}

interface UnityProgressTrackerProps {
  sessionId: string;
  maxOperations?: number;
}

export default function UnityProgressTracker({
  sessionId,
  maxOperations = 10,
}: UnityProgressTrackerProps) {
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    // Only connect if NATS URL is explicitly configured
    const natsUrl = process.env.NEXT_PUBLIC_NATS_WS_URL;
    if (!natsUrl) {
      // NATS not configured - this is OK for MVP 1
      return;
    }

    let ws: WebSocket | null = null;
    let isMounted = true;

    try {
      ws = new WebSocket(natsUrl);

      ws.onopen = () => {
        if (!isMounted) return;
        ws?.send(
          JSON.stringify({
            op: "SUB",
            subject: `spark.runtime.unity.*.${sessionId}`,
            sid: `unity-progress-${sessionId}`,
          })
        );
        ws?.send(
          JSON.stringify({
            op: "SUB",
            subject: `spark.build.unity.*.${sessionId}`,
            sid: `build-progress-${sessionId}`,
          })
        );
      };

      ws.onmessage = (evt) => {
        if (!isMounted) return;
        try {
          const msg = JSON.parse(evt.data);
          if (!msg.subject || !msg.data) return;

          const payload = JSON.parse(atob(msg.data));
          const type = payload.type;

          setOperations((prev) => {
            const newOps = [...prev];

            if (type?.includes(".started")) {
              newOps.push({
                id: `${type}-${Date.now()}`,
                type: type.replace(".started", ""),
                status: "started",
                name: payload.name || payload.target,
                timestamp: payload.timestamp,
              });
            } else if (type?.includes(".completed")) {
              const idx = newOps.findIndex(
                (op) =>
                  op.type === type.replace(".completed", "") && op.status === "started"
              );
              if (idx >= 0) {
                newOps[idx] = { ...newOps[idx], status: "completed" };
              }
            } else if (type?.includes(".failed")) {
              const idx = newOps.findIndex(
                (op) =>
                  op.type === type.replace(".failed", "") && op.status === "started"
              );
              if (idx >= 0) {
                newOps[idx] = { ...newOps[idx], status: "failed", error: payload.error };
              }
            }

            return newOps.slice(-maxOperations);
          });
        } catch (error) {
          // Silently handle parse errors - NATS is optional
        }
      };

      ws.onerror = () => {
        // Silently handle errors - NATS is optional for MVP 1
      };

      ws.onclose = () => {
        // Don't log - NATS is optional
      };
    } catch (error) {
      // Silently handle connection errors
    }

    return () => {
      isMounted = false;
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(
            JSON.stringify({
              op: "UNSUB",
              sid: `unity-progress-${sessionId}`,
            })
          );
          ws.send(
            JSON.stringify({
              op: "UNSUB",
              sid: `build-progress-${sessionId}`,
            })
          );
          ws.close();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [sessionId, maxOperations]);

  if (operations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-200 mb-3">Unity Operations</h3>
      {operations.map((op) => (
        <div
          key={op.id}
          className="flex items-center gap-3 text-sm py-2 px-3 bg-gray-900 rounded"
        >
          {op.status === "started" && (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
          )}
          {op.status === "completed" && (
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
          )}
          {op.status === "failed" && (
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-gray-300 truncate">
              {op.type.replace(/_/g, " ")}
              {op.name && (
                <span className="text-gray-500 ml-2">({op.name})</span>
              )}
            </p>
            {op.error && (
              <p className="text-xs text-red-400 mt-1 truncate">{op.error}</p>
            )}
          </div>

          <span className="text-xs text-gray-500 flex-shrink-0">
            {new Date(op.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}
