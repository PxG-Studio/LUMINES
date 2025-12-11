/**
 * Build Error Formatting
 * Centralized error formatting for Ignition overlay
 */

export interface BuildError {
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

/**
 * Format build errors for display in IgnitionErrorOverlay
 */
export function formatBuildError(err: any): string {
  if (!err) return "Unknown build error";

  // esbuild error format
  if (err.errors && Array.isArray(err.errors)) {
    return err.errors
      .map((e: any) => {
        const location = e.location;
        if (location) {
          return `${e.text}\n  at ${location.file}:${location.line}:${location.column}`;
        }
        return e.text;
      })
      .join("\n\n");
  }

  // Standard error with message
  if (err.message) {
    return err.message;
  }

  // Fallback to string conversion
  return String(err);
}

/**
 * Parse error into structured format
 */
export function parseBuildError(err: any): BuildError {
  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    const firstError = err.errors[0];
    return {
      message: firstError.text || String(err),
      file: firstError.location?.file,
      line: firstError.location?.line,
      column: firstError.location?.column
    };
  }

  return {
    message: err.message || String(err),
    file: err.file,
    line: err.line,
    column: err.column
  };
}

