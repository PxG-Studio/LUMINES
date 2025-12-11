/**
 * Unity Import Helpers
 * Utility functions for Unity ZIP import operations
 */

import JSZip from "jszip";
import { unzipToObject } from "@/wis2l/ProjectIO/zipUtils";

/**
 * Create a ZIP blob from a subset of files
 */
export async function createZipFromSubset(
  allFiles: Record<string, string>,
  filePaths: string[]
): Promise<Blob> {
  const zip = new JSZip();

  for (const path of filePaths) {
    if (allFiles[path]) {
      zip.file(path, allFiles[path]);
    }
  }

  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE"
  });
}

/**
 * Extract binary files from ZIP (for Unity .wasm, .data files)
 */
export async function unzipBinaryFiles(
  blob: Blob
): Promise<Record<string, Blob>> {
  const zip = new JSZip();
  const data = await zip.loadAsync(blob);
  const out: Record<string, Blob> = {};

  for (const filename of Object.keys(data.files)) {
    const file = data.files[filename];
    if (file.dir) continue;

    // Check if it's a binary file
    const isBinary = filename.endsWith(".wasm") ||
                     filename.endsWith(".data") ||
                     filename.endsWith(".png") ||
                     filename.endsWith(".jpg") ||
                     filename.endsWith(".jpeg") ||
                     filename.endsWith(".ttf") ||
                     filename.endsWith(".otf");

    if (isBinary) {
      try {
        const binaryBlob = await file.async("blob");
        out[filename] = binaryBlob;
      } catch (err) {
        console.warn(`Failed to extract binary file ${filename}:`, err);
      }
    }
  }

  return out;
}

/**
 * Extract both text and binary files from ZIP
 */
export async function unzipAllFiles(
  blob: Blob
): Promise<{
  textFiles: Record<string, string>;
  binaryFiles: Record<string, Blob>;
}> {
  const zip = new JSZip();
  const data = await zip.loadAsync(blob);
  
  const textFiles: Record<string, string> = {};
  const binaryFiles: Record<string, Blob> = {};

  for (const filename of Object.keys(data.files)) {
    const file = data.files[filename];
    if (file.dir) continue;

    // Determine if file is binary
    const isBinary = filename.endsWith(".wasm") ||
                     filename.endsWith(".data") ||
                     filename.endsWith(".png") ||
                     filename.endsWith(".jpg") ||
                     filename.endsWith(".jpeg") ||
                     filename.endsWith(".ttf") ||
                     filename.endsWith(".otf");

    try {
      if (isBinary) {
        const binaryBlob = await file.async("blob");
        binaryFiles[filename] = binaryBlob;
      } else {
        const text = await file.async("string");
        textFiles[filename] = text;
      }
    } catch (err) {
      console.warn(`Failed to extract file ${filename}:`, err);
    }
  }

  return { textFiles, binaryFiles };
}

