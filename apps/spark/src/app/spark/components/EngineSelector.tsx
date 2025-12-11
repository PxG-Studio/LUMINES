/**
 * Engine Selector Component
 * 
 * Multi-engine UI component for selecting game engine
 */

'use client';

import { useState, useEffect } from 'react';
import { getEngineRegistry } from '@/lib/engines/registry';

interface Engine {
  id: string;
  name: string;
  extensions: string[];
}

export function EngineSelector({
  selectedEngine,
  onEngineChange,
}: {
  selectedEngine?: string;
  onEngineChange: (engineId: string) => void;
}) {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registry = getEngineRegistry();
    const supportedEngines = registry.getSupportedEngines();
    setEngines(supportedEngines);
    setLoading(false);

    // Set default engine if none selected
    if (!selectedEngine && supportedEngines.length > 0) {
      onEngineChange(supportedEngines[0].id);
    }
  }, [selectedEngine, onEngineChange]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading engines...</div>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Game Engine
      </label>
      <select
        value={selectedEngine || ''}
        onChange={(e) => onEngineChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {engines.map((engine) => (
          <option key={engine.id} value={engine.id}>
            {engine.name} ({engine.extensions.join(', ')})
          </option>
        ))}
      </select>
      {selectedEngine && (
        <p className="text-xs text-gray-500">
          Selected: {engines.find((e) => e.id === selectedEngine)?.name}
        </p>
      )}
    </div>
  );
}

