"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import ExportButton from "./ExportButton";

interface PreviewPanelProps {
  code: string;
  scriptName: string;
}

export default function PreviewPanel({ code, scriptName }: PreviewPanelProps) {
  if (!code) {
    return (
      <div className="preview-container">
        <div className="preview-empty">
          Generate a Unity script to see the preview here
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="preview-code">
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
      <div className="preview-actions">
        <ExportButton code={code} scriptName={scriptName} />
      </div>
    </div>
  );
}
