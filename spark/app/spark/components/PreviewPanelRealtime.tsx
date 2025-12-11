"use client";

/**
 * Real-time Preview Panel with NATS Subscriptions
 *
 * Subscribes to Unity preview events and displays frames
 */

import { useEffect, useState } from "react";

interface PreviewState {
  status: "idle" | "loading" | "ready" | "error";
  frameRef?: string;
  format?: "data-url" | "url";
  error?: string;
}

interface PreviewPanelRealtimeProps {
  sessionId: string;
  onFrameUpdate?: (frameRef: string) => void;
}

export default function PreviewPanelRealtime({ sessionId, onFrameUpdate }: PreviewPanelRealtimeProps) {
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" });

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_NATS_WS_URL || "ws://192.168.86.27:4222"
    );

    ws.onopen = () => {
      // Subscribe to preview events for this session
      ws.send(
        JSON.stringify({
          op: "SUB",
          subject: `spark.preview.unity.*.${sessionId}`,
          sid: `preview-${sessionId}`,
        })
      );
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (!msg.subject || !msg.data) return;

        const payload = JSON.parse(atob(msg.data));

        if (msg.subject.includes("preview.unity.started")) {
          setPreview({ status: "loading" });
        } else if (msg.subject.includes("preview.unity.frame")) {
          setPreview({
            status: "ready",
            frameRef: payload.frameRef,
            format: payload.format || "url",
          });
          onFrameUpdate?.(payload.frameRef);
        } else if (msg.subject.includes("preview.unity.failed")) {
          setPreview({ status: "error", error: payload.error });
        }
      } catch (error) {
        console.error("Preview event parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("NATS WebSocket error:", error);
      setPreview({ status: "error", error: "Connection failed" });
    };

    ws.onclose = () => {
      console.log("NATS WebSocket closed");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            op: "UNSUB",
            sid: `preview-${sessionId}`,
          })
        );
        ws.close();
      }
    };
  }, [sessionId, onFrameUpdate]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
      {preview.status === "idle" && (
        <div className="text-gray-400 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.5 4.5L15 19M9 19l-4.5-4.5L9 10"
            />
          </svg>
          <p className="text-sm">No preview available</p>
        </div>
      )}

      {preview.status === "loading" && (
        <div className="text-gray-400 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm">Rendering preview...</p>
        </div>
      )}

      {preview.status === "ready" && preview.frameRef && (
        <img
          src={preview.frameRef}
          alt="Unity Preview"
          className="max-w-full max-h-full object-contain"
        />
      )}

      {preview.status === "error" && (
        <div className="text-red-400 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm">Preview failed</p>
          {preview.error && (
            <p className="text-xs text-gray-500 mt-2">{preview.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
