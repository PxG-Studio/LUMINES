/**
 * ZIP Utilities
 * Helper functions for creating and reading ZIP files
 */

import JSZip from "jszip";

/**
 * Create a ZIP blob from an object of file paths → content
 */
export async function zipFromObject(obj: Record<string, string>): Promise<Blob> {
  const zip = new JSZip();

  for (const path in obj) {
    // Skip empty files
    if (obj[path] === undefined || obj[path] === null) continue;
    zip.file(path, obj[path]);
  }

  return await zip.generateAsync({ 
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6
    }
  });
}

/**
 * Extract a ZIP blob into an object of file paths → content
 */
export async function unzipToObject(blob: Blob): Promise<Record<string, string>> {
  const zip = new JSZip();
  const data = await zip.loadAsync(blob);

  const out: Record<string, string> = {};

  for (const filename of Object.keys(data.files)) {
    const file = data.files[filename];
    // Skip directories
    if (file.dir) continue;

    try {
      const content = await file.async("string");
      out[filename] = content;
    } catch (err) {
      console.warn(`Failed to extract file ${filename}:`, err);
    }
  }

  return out;
}

/**
 * Validate if a blob is a valid ZIP file
 */
export async function isValidZip(blob: Blob): Promise<boolean> {
  try {
    const zip = new JSZip();
    await zip.loadAsync(blob);
    return true;
  } catch {
    return false;
  }
}

