"use client";

/**
 * SPARK MVP 1 - Simple Code Preview Panel
 * 
 * Displays generated C# code with Monaco Editor
 * Includes export button
 */

import Editor from "@monaco-editor/react";
import ExportButton from "./ExportButton";

interface PreviewPanelProps {
  code: string;
  scriptName: string;
  engine?: string;
}

export default function PreviewPanel({ code, scriptName }: PreviewPanelProps) {
  if (!code) {
    return (
      <div className="preview-container h-full flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <p className="text-lg mb-2">No code generated yet</p>
          <p className="text-sm">Type a prompt in the chat to generate Unity C# code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container h-full flex flex-col">
      {/* Code Preview */}
      <div className="flex-1 overflow-hidden border border-gray-700 rounded-lg">
        <Editor
          height="100%"
          defaultLanguage="csharp"
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

      {/* Export Button */}
      <div className="mt-4">
        <ExportButton code={code} scriptName={scriptName} />
      </div>
    </div>
  );
}
