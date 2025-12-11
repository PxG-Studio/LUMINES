/**
 * Dependency Graph Builder
 * Scans files for imports/exports to build dependency graph
 */

import { useWissilFS } from "../fs/wissilFs";
import { normalizePath, joinPath } from "../fs/pathUtils";

const importRegex = /import\s+(?:[^"']+from\s+)?["']([^"']+)["']/g;
const requireRegex = /require\s*\(\s*["']([^"']+)["']\s*\)/g;

export interface DependencyGraph {
  [file: string]: string[];
}

/**
 * Build dependency graph starting from entry file
 */
export function buildDependencyGraph(entryFile: string): DependencyGraph {
  const fs = useWissilFS.getState();
  const visited = new Set<string>();
  const graph: DependencyGraph = {};

  function dfs(file: string) {
    const normalizedFile = normalizePath(file);
    
    if (visited.has(normalizedFile)) return;
    visited.add(normalizedFile);

    const code = fs.readFile(normalizedFile);
    if (!code) {
      graph[normalizedFile] = [];
      return;
    }

    const deps: string[] = [];
    
    // Match ES6 imports
    let match;
    importRegex.lastIndex = 0;
    while ((match = importRegex.exec(code)) !== null) {
      const importPath = match[1];
      const resolved = resolveRelative(normalizedFile, importPath);
      if (resolved) {
        deps.push(resolved);
      }
    }

    // Match CommonJS requires
    requireRegex.lastIndex = 0;
    while ((match = requireRegex.exec(code)) !== null) {
      const importPath = match[1];
      const resolved = resolveRelative(normalizedFile, importPath);
      if (resolved) {
        deps.push(resolved);
      }
    }

    graph[normalizedFile] = deps;

    // Recursively process dependencies
    deps.forEach((d) => {
      if (fs.exists(d)) {
        dfs(d);
      }
    });
  }

  // Normalize entry file
  const normalizedEntry = normalizePath(entryFile);
  if (fs.exists(normalizedEntry)) {
    dfs(normalizedEntry);
  }

  return graph;
}

/**
 * Resolve relative import paths
 */
function resolveRelative(from: string, importPath: string): string | null {
  // Skip external packages (for now)
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    return null; // External dependency - skip for now
  }

  // Resolve relative paths
  if (importPath.startsWith(".")) {
    const base = from.split("/").slice(0, -1).join("/");
    let resolved = joinPath(base, importPath);
    
    // Remove .js/.ts extensions if present (we'll try multiple)
    resolved = resolved.replace(/\.(js|ts|tsx|jsx)$/, "");
    
    // Try common extensions
    const fs = useWissilFS.getState();
    const extensions = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.js"];
    
    for (const ext of extensions) {
      const candidate = resolved + ext;
      if (fs.exists(candidate)) {
        return normalizePath(candidate);
      }
    }
    
    return normalizePath(resolved);
  }

  // Absolute paths (from root)
  if (importPath.startsWith("/")) {
    return normalizePath(importPath.slice(1));
  }

  return null;
}

/**
 * Get all files in dependency order (topological sort)
 */
export function getDependencyOrder(graph: DependencyGraph): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function visit(file: string) {
    if (visited.has(file)) return;
    visited.add(file);

    const deps = graph[file] || [];
    deps.forEach((dep) => {
      if (graph[dep]) {
        visit(dep);
      }
    });

    result.push(file);
  }

  Object.keys(graph).forEach((file) => visit(file));
  return result;
}

