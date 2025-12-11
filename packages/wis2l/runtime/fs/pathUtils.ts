/**
 * Path Utilities
 * Utility functions for path splitting and manipulation
 */

/**
 * Split a file path into an array of parts
 * Example: "src/main.ts" -> ["src", "main.ts"]
 */
export function splitPath(path: string): string[] {
  return path
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean);
}

/**
 * Get the directory path from a file path
 * Example: "src/main.ts" -> "src"
 */
export function getDir(path: string): string {
  const parts = splitPath(path);
  parts.pop();
  return parts.join("/");
}

/**
 * Get the file name from a path
 * Example: "src/main.ts" -> "main.ts"
 */
export function getFileName(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1] || "";
}

/**
 * Normalize a path by removing leading/trailing slashes and resolving ".." and "."
 */
export function normalizePath(path: string): string {
  const parts = splitPath(path);
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === ".") {
      continue;
    } else if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return resolved.join("/");
}

/**
 * Join path segments
 * Example: joinPath("src", "main.ts") -> "src/main.ts"
 */
export function joinPath(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/");
}

