/**
 * File Transform Pipeline
 * Transform individual files using esbuild in-memory
 */

import * as esbuild from "esbuild-wasm";
import { useWissilFS } from "../fs/wissilFs";

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize esbuild-wasm
 * Must be called before any transforms
 */
export async function initEsbuild(): Promise<void> {
  if (initialized) return;
  
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await esbuild.initialize({
        wasmURL: "https://unpkg.com/esbuild-wasm@0.19.12/esbuild.wasm"
      });
      initialized = true;
    } catch (err) {
      console.error("Failed to initialize esbuild:", err);
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Get loader based on file extension
 */
function getLoader(path: string): esbuild.Loader {
  if (path.endsWith(".tsx")) return "tsx";
  if (path.endsWith(".ts")) return "ts";
  if (path.endsWith(".jsx")) return "jsx";
  if (path.endsWith(".js")) return "js";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  
  // Default to TypeScript
  return "ts";
}

/**
 * Transform a single file
 */
export async function transformFile(path: string): Promise<{ code: string; map?: string }> {
  const fs = useWissilFS.getState();
  const code = fs.readFile(path);

  if (!code) {
    return { code: "" };
  }

  const loader = getLoader(path);

  try {
    const result = await esbuild.transform(code, {
      loader,
      format: "esm",
      target: "es2020",
      sourcemap: false,
      jsx: loader === "tsx" || loader === "jsx" ? "automatic" : undefined
    });

    return {
      code: result.code,
      map: result.map
    };
  } catch (err) {
    // Re-throw with file context
    const error = err as any;
    error.file = path;
    throw error;
  }
}

/**
 * Transform multiple files in parallel
 */
export async function transformFiles(paths: string[]): Promise<Record<string, string>> {
  await initEsbuild();
  
  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const { code } = await transformFile(path);
        return { path, code };
      } catch (err) {
        throw err;
      }
    })
  );

  const transformed: Record<string, string> = {};
  results.forEach(({ path, code }) => {
    transformed[path] = code;
  });

  return transformed;
}

