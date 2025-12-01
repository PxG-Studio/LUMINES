/**
 * Gizmo Renderer
 * Renders Move/Rotate/Scale gizmos as 2D overlay on Unity canvas
 */

'use client';

import React, { useEffect, useRef, useState } from "react";
import { useTransformStore } from "../scene/TransformStore";
import { GizmoManipulation } from "./GizmoManipulation";
import { GIZMO_SIZE, GIZMO_HANDLE_SIZE, GIZMO_LINE_WIDTH, GIZMO_COLORS } from "./constants";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

export function GizmoRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selected = useTransformStore((state) => state.selected);
  const transform = useTransformStore((state) => (selected ? state.getTransform(selected) : undefined));
  const gizmoMode = useTransformStore((state) => state.gizmoMode);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);

  // Project 3D position to screen
  useEffect(() => {
    if (!selected || !transform) {
      setScreenPos(null);
      return;
    }

    // Request screen projection from Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("scene/projectToScreen", {
        id: selected,
        position: transform.pos
      });
    }

    // Listen for projection result
    const handler = (payload: any) => {
      if (payload.id === selected) {
        setScreenPos({ x: payload.x || 0, y: payload.y || 0 });
      }
    };

    UnityMessagingBus.on("scene/projectResult", handler);

    return () => {
      // Note: UnityMessagingBus.off might not exist, this is a cleanup placeholder
    };
  }, [selected, transform]);

  // Render gizmos
  useEffect(() => {
    if (!canvasRef.current || !screenPos || !transform) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!screenPos || !transform) return;

      const { x, y } = screenPos;

      switch (gizmoMode) {
        case "move":
          drawMoveGizmo(ctx, x, y);
          break;
        case "rotate":
          drawRotateGizmo(ctx, x, y);
          break;
        case "scale":
          drawScaleGizmo(ctx, x, y);
          break;
      }
    };

    draw();
  }, [screenPos, transform, gizmoMode]);

  const handleGizmoClick = (axis: "x" | "y" | "z" | "center", e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    GizmoManipulation.startDrag(axis, e.clientX, e.clientY);
  };

  if (!selected || !transform || !screenPos) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000
      }}
      onMouseDown={(e) => {
        // Handle gizmo handle clicks
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const handleSize = GIZMO_HANDLE_SIZE * 2;

        // Check which handle was clicked
        if (gizmoMode === "move") {
          if (Math.abs(x - screenPos.x - GIZMO_SIZE) < handleSize && Math.abs(y - screenPos.y) < handleSize) {
            handleGizmoClick("x", e);
          } else if (Math.abs(x - screenPos.x) < handleSize && Math.abs(y - screenPos.y + GIZMO_SIZE) < handleSize) {
            handleGizmoClick("y", e);
          } else if (Math.abs(x - screenPos.x) < handleSize && Math.abs(y - screenPos.y) < handleSize) {
            handleGizmoClick("center", e);
          }
        }
      }}
    />
  );
}

function drawMoveGizmo(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.lineWidth = GIZMO_LINE_WIDTH;

  // X axis (red)
  ctx.strokeStyle = GIZMO_COLORS.x;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + GIZMO_SIZE, y);
  ctx.stroke();

  // Y axis (green)
  ctx.strokeStyle = GIZMO_COLORS.y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - GIZMO_SIZE);
  ctx.stroke();

  // Z axis (blue) - diagonal
  ctx.strokeStyle = GIZMO_COLORS.z;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + GIZMO_SIZE * 0.7, y - GIZMO_SIZE * 0.7);
  ctx.stroke();

  // Center handle
  ctx.fillStyle = GIZMO_COLORS.center;
  ctx.beginPath();
  ctx.arc(x, y, GIZMO_HANDLE_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawRotateGizmo(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const radius = GIZMO_SIZE;
  ctx.lineWidth = GIZMO_LINE_WIDTH;

  // X rotation ring (red)
  ctx.strokeStyle = GIZMO_COLORS.x;
  ctx.beginPath();
  ctx.arc(x + radius, y, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  // Y rotation ring (green)
  ctx.strokeStyle = GIZMO_COLORS.y;
  ctx.beginPath();
  ctx.arc(x, y - radius, radius * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  // Z rotation ring (blue)
  ctx.strokeStyle = GIZMO_COLORS.z;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Center
  ctx.fillStyle = GIZMO_COLORS.center;
  ctx.beginPath();
  ctx.arc(x, y, GIZMO_HANDLE_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawScaleGizmo(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.lineWidth = GIZMO_LINE_WIDTH;

  // X axis (red)
  ctx.strokeStyle = GIZMO_COLORS.x;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + GIZMO_SIZE, y);
  ctx.stroke();

  // Y axis (green)
  ctx.strokeStyle = GIZMO_COLORS.y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - GIZMO_SIZE);
  ctx.stroke();

  // Z axis (blue)
  ctx.strokeStyle = GIZMO_COLORS.z;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + GIZMO_SIZE * 0.7, y - GIZMO_SIZE * 0.7);
  ctx.stroke();

  // Handles at ends
  const handleSize = GIZMO_HANDLE_SIZE;
  
  ctx.fillStyle = GIZMO_COLORS.x;
  ctx.fillRect(x + GIZMO_SIZE - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
  
  ctx.fillStyle = GIZMO_COLORS.y;
  ctx.fillRect(x - handleSize / 2, y - GIZMO_SIZE - handleSize / 2, handleSize, handleSize);
  
  ctx.fillStyle = GIZMO_COLORS.z;
  ctx.fillRect(x + GIZMO_SIZE * 0.7 - handleSize / 2, y - GIZMO_SIZE * 0.7 - handleSize / 2, handleSize, handleSize);

  // Center handle
  ctx.fillStyle = GIZMO_COLORS.center;
  ctx.beginPath();
  ctx.arc(x, y, handleSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

