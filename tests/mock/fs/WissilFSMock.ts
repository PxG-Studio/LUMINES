/**
 * Mock implementation of WISSIL File System for testing
 * Provides in-memory file system operations
 */

export interface WissilFSFile {
  path: string;
  content: string;
  type: "file" | "directory";
  lastModified: number;
}

export class WissilFSMock {
  private files: Map<string, WissilFSFile> = new Map();

  /**
   * Read file content
   */
  async readFile(path: string): Promise<string> {
    const file = this.files.get(path);
    if (!file) {
      throw new Error(`File not found: ${path}`);
    }
    if (file.type === "directory") {
      throw new Error(`Path is a directory: ${path}`);
    }
    return file.content;
  }

  /**
   * Write file content
   */
  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, {
      path,
      content,
      type: "file",
      lastModified: Date.now()
    });
  }

  /**
   * Read directory contents
   */
  async readDirectory(path: string): Promise<string[]> {
    const entries: string[] = [];
    
    for (const [filePath, file] of this.files.entries()) {
      if (filePath.startsWith(path + "/") && filePath !== path) {
        const relativePath = filePath.substring(path.length + 1);
        const firstSegment = relativePath.split("/")[0];
        if (!entries.includes(firstSegment)) {
          entries.push(firstSegment);
        }
      }
    }
    
    return entries;
  }

  /**
   * Check if path exists
   */
  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  /**
   * Delete file or directory
   */
  async delete(path: string): Promise<void> {
    // Delete file
    this.files.delete(path);
    
    // Delete all files under directory
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path + "/")) {
        this.files.delete(filePath);
      }
    }
  }

  /**
   * Create directory
   */
  async createDirectory(path: string): Promise<void> {
    this.files.set(path, {
      path,
      content: "",
      type: "directory",
      lastModified: Date.now()
    });
  }

  /**
   * Clear all files (for testing)
   */
  clear(): void {
    this.files.clear();
  }

  /**
   * Get all files (for testing)
   */
  getAllFiles(): WissilFSFile[] {
    return Array.from(this.files.values());
  }
}

export const wissilFSMock = new WissilFSMock();

// Export singleton instance
export default wissilFSMock;

