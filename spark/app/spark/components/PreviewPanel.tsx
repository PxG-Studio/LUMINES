"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import ExportButton from "./ExportButton";
import { getWASMRenderer, createWASMRenderer } from "@/lib/preview/wasmRenderer";
import { getEngineRegistry } from "@/lib/engines/registry";

type PreviewMode = 'code' | 'wasm' | 'webcontainer';

interface PreviewPanelProps {
  code: string;
  scriptName: string;
  engine?: string;
}

export default function PreviewPanel({ code, scriptName, engine }: PreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('code');
  const [wasmReady, setWasmReady] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Determine language based on engine
  const getLanguage = () => {
    if (!engine) return 'csharp';
    const registry = getEngineRegistry();
    const adapter = registry.get(engine);
    if (!adapter) return 'csharp';

    const langMap: Record<string, string> = {
      unity: 'csharp',
      godot: 'gdscript',
      pico8: 'lua',
      gamemaker: 'gml',
      rpgmaker: 'javascript',
      construct: 'javascript',
      renpy: 'python',
    };

    return langMap[engine] || 'csharp';
  };

  // Initialize WASM renderer
  useEffect(() => {
    if (previewMode === 'wasm' && engine && code) {
      const initWASM = async () => {
        try {
          setIsRendering(true);
          const renderer = createWASMRenderer();
          
          // Determine WASM URL based on engine
          const wasmUrl = `/wasm/${engine}.wasm`;
          
          await renderer.init({
            engine: engine as 'unity' | 'godot' | 'pico8',
            wasmUrl,
            width: 800,
            height: 600,
          });

          rendererRef.current = renderer;
          setWasmReady(true);

          // Start render loop
          const renderLoop = () => {
            if (rendererRef.current) {
              rendererRef.current.render();
              animationFrameRef.current = requestAnimationFrame(renderLoop);
            }
          };
          renderLoop();
        } catch (error) {
          console.error('WASM initialization failed:', error);
          setPreviewMode('code'); // Fallback to code view
        } finally {
          setIsRendering(false);
        }
      };

      initWASM();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (rendererRef.current) {
          rendererRef.current.cleanup();
        }
      };
    }
  }, [previewMode, engine, code]);

  // Handle keyboard input for WASM preview
  useEffect(() => {
    if (previewMode === 'wasm' && rendererRef.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        rendererRef.current?.handleInput(e.key, true);
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        rendererRef.current?.handleInput(e.key, false);
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [previewMode]);

  if (!code) {
    return (
      <div className="preview-container">
        <div className="preview-empty">
          Generate code to see the preview here
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      {/* Preview Mode Selector */}
      <div className="preview-controls border-b border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setPreviewMode('code')}
          className={`px-3 py-1 rounded text-sm ${
            previewMode === 'code'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Code
        </button>
        {engine && ['unity', 'godot', 'pico8'].includes(engine) && (
          <button
            onClick={() => setPreviewMode('wasm')}
            className={`px-3 py-1 rounded text-sm ${
              previewMode === 'wasm'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isRendering}
          >
            {isRendering ? 'Loading...' : 'Preview'}
          </button>
        )}
      </div>

      {/* Preview Content */}
      {previewMode === 'code' && (
        <div className="preview-code h-full">
          <Editor
            height="100%"
            defaultLanguage={getLanguage()}
            value={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      )}

      {previewMode === 'wasm' && (
        <div className="preview-wasm h-full flex items-center justify-center bg-black">
          {wasmReady && rendererRef.current ? (
            <div className="preview-canvas-container">
              {(() => {
                const canvas = rendererRef.current?.getCanvas();
                if (canvas && canvasRef.current && canvasRef.current.parentNode) {
                  // Canvas already rendered by WASM renderer
                  return (
                    <>
                      <div ref={(node) => {
                        if (node && canvas && !node.contains(canvas)) {
                          node.appendChild(canvas);
                        }
                      }} />
                      <div className="preview-info text-white text-xs mt-2 text-center">
                        Use arrow keys to control
                      </div>
                    </>
                  );
                }
                return <div className="text-white">Loading canvas...</div>;
              })()}
            </div>
          ) : (
            <div className="text-white">Initializing preview...</div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="preview-actions border-t border-gray-200 p-2">
        <ExportButton code={code} scriptName={scriptName} />
      </div>
    </div>
  );
}
