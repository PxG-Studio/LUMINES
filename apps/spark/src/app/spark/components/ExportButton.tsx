"use client";

import { useState } from "react";

interface ExportButtonProps {
  code: string;
  scriptName: string;
}

export default function ExportButton({ code, scriptName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, scriptName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Export failed" }));
        throw new Error(errorData.error || `Export failed with status ${response.status}`);
      }

      // Download the ZIP file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scriptName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export. Please try again.";
      setError(errorMessage);
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting || !code}
        className="btn btn-primary"
      >
        {isExporting ? (
          <span className="spinner-container">
            <span className="spinner"></span>
            <span>Exporting...</span>
          </span>
        ) : (
          "Export as ZIP"
        )}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
