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
        throw new Error("Export failed");
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
      setError("Failed to export. Please try again.");
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
        {isExporting ? "Exporting..." : "Export as ZIP"}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
