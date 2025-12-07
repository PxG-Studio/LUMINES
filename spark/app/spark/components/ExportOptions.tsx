"use client";

import { useState } from "react";

interface ExportOptionsProps {
  code: string;
  scriptName: string;
}

type ExportTemplate = "default" | "package" | "organized";

export default function ExportOptions({ code, scriptName }: ExportOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<ExportTemplate>("default");
  const [packageName, setPackageName] = useState("SparkGenerated");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/export-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scripts: [{ code, scriptName }],
          template,
          packageName,
        }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${packageName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsOpen(false);
    } catch (err) {
      setError("Failed to export. Please try again.");
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={!code}
        className="btn btn-primary"
      >
        Export Options
      </button>

      {isOpen && (
        <div className="export-modal">
          <div className="export-backdrop" onClick={() => setIsOpen(false)} />
          <div className="export-panel">
            <div className="export-header">
              <h2 className="export-title">Export Options</h2>
              <button onClick={() => setIsOpen(false)} className="export-close">
                ×
              </button>
            </div>

            <div className="export-content">
              <div className="export-group">
                <label className="export-label">Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as ExportTemplate)}
                  className="export-select"
                >
                  <option value="default">Standard - Basic Unity structure</option>
                  <option value="organized">Organized - Categorized folders</option>
                  <option value="package">Unity Package - Full package with manifest</option>
                </select>
                <div className="export-hint">
                  {template === "default" && "Creates Assets/Scripts structure"}
                  {template === "organized" && "Creates organized folder structure with README"}
                  {template === "package" && "Creates a complete Unity package with manifest and assembly definition"}
                </div>
              </div>

              {template === "package" && (
                <div className="export-group">
                  <label className="export-label">Package Name</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="export-input"
                    placeholder="SparkGenerated"
                  />
                </div>
              )}

              {error && <div className="export-error">{error}</div>}

              <div className="export-actions">
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary"
                  disabled={isExporting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-primary"
                  disabled={isExporting}
                >
                  {isExporting ? "Exporting..." : "Export"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
