"use client";

import { useState } from "react";
import MCPChat from "./components/MCPChat";
import PreviewPanel from "./components/PreviewPanel";

export default function SparkPage() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [scriptName, setScriptName] = useState<string>("");

  const handleCodeGenerated = (code: string, name: string) => {
    setGeneratedCode(code);
    setScriptName(name);
  };

  return (
    <div className="two-panel-layout">
      <div className="panel">
        <div className="panel-header">
          <h1 className="panel-title">SPARK - AI Assistant</h1>
        </div>
        <MCPChat onCodeGenerated={handleCodeGenerated} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h1 className="panel-title">Preview</h1>
        </div>
        <PreviewPanel code={generatedCode} scriptName={scriptName} />
      </div>
    </div>
  );
}
