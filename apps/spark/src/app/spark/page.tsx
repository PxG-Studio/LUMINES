"use client";

/**
 * SPARK MVP 1 - Simple Unity C# Code Generator
 * 
 * Two-panel layout:
 * - Left: Chat input for prompts
 * - Right: Code preview with export button
 */

import { useState } from "react";
import MCPChat from "./components/MCPChat";
import PreviewPanel from "./components/PreviewPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function SparkPage() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [scriptName, setScriptName] = useState<string>("");

  const handleCodeGenerated = (code: string, name: string) => {
    setGeneratedCode(code);
    setScriptName(name);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-[1920px] mx-auto p-6">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              SPARK
            </h1>
            <p className="text-gray-400">
              AI-Powered Unity C# Script Generator
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel: Chat */}
            <ErrorBoundary>
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4">Chat</h2>
                <div className="flex-1 overflow-hidden">
                  <MCPChat onCodeGenerated={handleCodeGenerated} />
                </div>
              </div>
            </ErrorBoundary>

            {/* Right Panel: Preview */}
            <ErrorBoundary>
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                <div className="flex-1 overflow-hidden">
                  <PreviewPanel 
                    code={generatedCode} 
                    scriptName={scriptName}
                    engine="unity"
                  />
                </div>
              </div>
            </ErrorBoundary>
          </div>

          <footer className="mt-6 pt-6 border-t border-gray-700 text-center text-xs text-gray-600">
            <p>
              SPARK MVP 1 | Unity C# Generation | Powered by Claude & OpenAI
            </p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}
