"use client";

/**
 * Undo/Rollback Panel for Patch Management
 *
 * Visual interface for undoing Unity MCP operations
 */

import { useEffect, useState, useCallback } from "react";
import { Undo, RotateCcw, Trash2 } from "lucide-react";
import { getPatchStack } from "@/lib/spark/undo/patchStack";

interface PatchOperation {
  id: string;
  timestamp: number;
  type: string;
  path: string;
  before?: string;
  after?: string;
  patch?: string;
}

interface UndoRollbackPanelProps {
  sessionId: string;
  onUndo?: (operation: PatchOperation) => Promise<void>;
  onRollbackTo?: (operation: PatchOperation) => Promise<void>;
}

export default function UndoRollbackPanel({
  sessionId,
  onUndo,
  onRollbackTo,
}: UndoRollbackPanelProps) {
  const [operations, setOperations] = useState<PatchOperation[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const refreshOperations = useCallback(() => {
    const stack = getPatchStack(sessionId);
    setOperations(stack.getAll());
  }, [sessionId]);

  useEffect(() => {
    refreshOperations();
    const interval = setInterval(refreshOperations, 1000);
    return () => clearInterval(interval);
  }, [refreshOperations]);

  const handleUndo = async () => {
    if (loading) return;
    const stack = getPatchStack(sessionId);
    const op = stack.pop();
    if (!op) return;

    setLoading(op.id);
    try {
      await onUndo?.(op);
      refreshOperations();
    } catch (error) {
      console.error("Undo failed:", error);
      stack.push(op);
    } finally {
      setLoading(null);
    }
  };

  const handleRollbackTo = async (op: PatchOperation) => {
    if (loading) return;
    setLoading(op.id);
    try {
      await onRollbackTo?.(op);
      const stack = getPatchStack(sessionId);
      stack.rollbackTo(op.id);
      refreshOperations();
    } catch (error) {
      console.error("Rollback failed:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleClear = () => {
    if (loading) return;
    if (!confirm("Clear entire undo history? This cannot be undone.")) return;
    const stack = getPatchStack(sessionId);
    stack.clear();
    refreshOperations();
  };

  if (operations.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-500 text-sm">
        No operations to undo
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200">Undo History</h3>
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={loading !== null}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded flex items-center gap-2 transition-colors"
          >
            <Undo className="w-3 h-3" />
            Undo Last
          </button>
          <button
            onClick={handleClear}
            disabled={loading !== null}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs rounded flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {operations
          .slice()
          .reverse()
          .map((op, idx) => (
            <div
              key={op.id}
              className={`p-3 bg-gray-900 rounded border ${
                loading === op.id
                  ? "border-blue-500"
                  : idx === 0
                  ? "border-blue-500/30"
                  : "border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 font-medium">
                    {op.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {op.path}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(op.timestamp).toLocaleString()}
                  </p>
                </div>

                {idx !== 0 && (
                  <button
                    onClick={() => handleRollbackTo(op)}
                    disabled={loading !== null}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-xs rounded flex items-center gap-1 transition-colors flex-shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Rollback
                  </button>
                )}
              </div>

              {loading === op.id && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
                  <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500 text-center">
        {operations.length} operation{operations.length !== 1 ? "s" : ""} in
        history
      </div>
    </div>
  );
}
