"use client";

/**
 * Preset Selector for Quick Project Setup
 *
 * One-click game archetype templates
 */

import { useState } from "react";
import { Gamepad2, Target, MessageSquare } from "lucide-react";
import { indieGamePresets, type GamePreset } from "../../../lib/presets/indieGamePresets";

interface PresetSelectorProps {
  sessionId: string;
  onApplyPreset?: (preset: GamePreset) => Promise<void>;
}

export function PresetSelector({ sessionId, onApplyPreset }: PresetSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<GamePreset | null>(null);
  const [applying, setApplying] = useState(false);

  const getIcon = (category: string) => {
    switch (category) {
      case "2d":
        return <Gamepad2 className="w-5 h-5" />;
      case "3d":
        return <Target className="w-5 h-5" />;
      case "ui":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const handleApply = async (preset: GamePreset) => {
    if (applying) return;
    if (!confirm(`Apply "${preset.name}" preset? This will add scripts and config to your project.`)) {
      return;
    }

    setApplying(true);
    try {
      await onApplyPreset?.(preset);
      setSelectedPreset(null);
    } catch (error) {
      console.error("Failed to apply preset:", error);
      alert("Failed to apply preset. Check console for details.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">
        Quick Start Presets
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {indieGamePresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPreset(preset)}
            className="p-4 bg-gray-900 hover:bg-gray-850 border border-gray-700 hover:border-blue-500 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-800 rounded">
                {getIcon(preset.category)}
              </div>
              <h4 className="text-sm font-semibold text-gray-200">
                {preset.name}
              </h4>
            </div>
            <p className="text-xs text-gray-500">{preset.description}</p>
            <div className="mt-3 flex gap-2 text-xs text-gray-600">
              <span>{preset.scripts.length} scripts</span>
              <span>•</span>
              <span>{preset.assets.length} assets</span>
              <span>•</span>
              <span>{preset.buildConfig.target}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedPreset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-100 mb-1">
                    {selectedPreset.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedPreset.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPreset(null)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Scripts ({selectedPreset.scripts.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedPreset.scripts.map((script) => (
                      <div
                        key={script.name}
                        className="p-3 bg-gray-900 rounded border border-gray-700"
                      >
                        <p className="text-sm text-gray-200 font-medium">
                          {script.name}.cs
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {script.path}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Assets ({selectedPreset.assets.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedPreset.assets.map((asset, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-900 rounded border border-gray-700"
                      >
                        <p className="text-sm text-gray-200 font-medium">
                          {asset.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Type: {asset.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Build Config
                  </h3>
                  <div className="p-3 bg-gray-900 rounded border border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Target:</span>
                        <span className="text-gray-300 ml-2">
                          {selectedPreset.buildConfig.target}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Development:</span>
                        <span className="text-gray-300 ml-2">
                          {selectedPreset.buildConfig.development ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Compression:</span>
                        <span className="text-gray-300 ml-2">
                          {selectedPreset.buildConfig.compressionFormat}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Texture:</span>
                        <span className="text-gray-300 ml-2">
                          {selectedPreset.buildConfig.maxTextureSize}px
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApply(selectedPreset)}
                  disabled={applying}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
                >
                  {applying ? "Applying..." : "Apply Preset"}
                </button>
                <button
                  onClick={() => setSelectedPreset(null)}
                  disabled={applying}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
