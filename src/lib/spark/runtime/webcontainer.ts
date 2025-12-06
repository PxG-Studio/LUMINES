/**
 * WebContainer Runtime
 * 
 * Provides code execution environment using WebContainer API
 */

import type { WebContainer } from '@webcontainer/api';

export interface WebContainerConfig {
  files: Record<string, { file: { contents: string } }>;
  packageJson?: {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode?: number;
}

class WebContainerRuntime {
  private container: WebContainer | null = null;
  private initialized = false;

  /**
   * Initialize WebContainer
   */
  async init(): Promise<void> {
    if (this.initialized && this.container) {
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { WebContainer } = await import('@webcontainer/api');
      this.container = await WebContainer.boot();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      throw new Error('WebContainer initialization failed. Make sure @webcontainer/api is installed.');
    }
  }

  /**
   * Mount files to WebContainer
   */
  async mountFiles(files: Record<string, { file: { contents: string } }>): Promise<void> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    await this.container.mount(files);
  }

  /**
   * Install dependencies
   */
  async installDependencies(): Promise<ExecutionResult> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      const installProcess = await this.container.spawn('npm', ['install']);
      const exitCode = await installProcess.exit;

      const output = await this.collectOutput(installProcess);

      return {
        success: exitCode === 0,
        output,
        exitCode,
        error: exitCode !== 0 ? 'Dependency installation failed' : undefined,
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a command
   */
  async executeCommand(command: string, args: string[] = []): Promise<ExecutionResult> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    try {
      const process = await this.container.spawn(command, args);
      const exitCode = await process.exit;
      const output = await this.collectOutput(process);

      return {
        success: exitCode === 0,
        output,
        exitCode,
        error: exitCode !== 0 ? `Command failed with exit code ${exitCode}` : undefined,
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Run a script from package.json
   */
  async runScript(scriptName: string): Promise<ExecutionResult> {
    return this.executeCommand('npm', ['run', scriptName]);
  }

  /**
   * Start a dev server
   */
  async startDevServer(port: number = 3000): Promise<{
    url: string;
    process: any;
  }> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    const process = await this.container.spawn('npm', ['run', 'dev', '--', '--port', port.toString()]);
    
    // Wait for server to be ready
    this.container.on('server-ready', (port, url) => {
      return { url, process };
    });

    // Fallback: return URL after short delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      url: `http://localhost:${port}`,
      process,
    };
  }

  /**
   * Read a file from the container
   */
  async readFile(path: string): Promise<string> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    const file = await this.container.fs.readFile(path, 'utf-8');
    return file;
  }

  /**
   * Write a file to the container
   */
  async writeFile(path: string, content: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    await this.container.fs.writeFile(path, content);
  }

  /**
   * List directory contents
   */
  async listDirectory(path: string): Promise<string[]> {
    await this.ensureInitialized();
    if (!this.container) throw new Error('WebContainer not initialized');

    const entries = await this.container.fs.readdir(path, { withFileTypes: true });
    return entries.map((entry) => entry.name);
  }

  /**
   * Collect output from a process
   */
  private async collectOutput(process: any): Promise<string> {
    const chunks: string[] = [];

    process.output.pipeTo(
      new WritableStream({
        write(chunk) {
          chunks.push(chunk);
        },
      })
    );

    await process.exit;
    return chunks.join('');
  }

  /**
   * Ensure WebContainer is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * Teardown WebContainer
   */
  async teardown(): Promise<void> {
    if (this.container) {
      // WebContainer doesn't have explicit teardown, but we can clear references
      this.container = null;
      this.initialized = false;
    }
  }

  /**
   * Get container status
   */
  getStatus(): { initialized: boolean; ready: boolean } {
    return {
      initialized: this.initialized,
      ready: this.container !== null,
    };
  }
}

// Singleton instance
let runtimeInstance: WebContainerRuntime | null = null;

/**
 * Get the global WebContainer runtime instance
 */
export function getWebContainerRuntime(): WebContainerRuntime {
  if (!runtimeInstance) {
    runtimeInstance = new WebContainerRuntime();
  }
  return runtimeInstance;
}

