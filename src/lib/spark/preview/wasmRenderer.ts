/**
 * WASM Preview Renderer
 * 
 * Renders Unity/Godot previews using WebAssembly
 */

export interface WASMRendererConfig {
  engine: 'unity' | 'godot' | 'pico8';
  wasmUrl: string;
  dataUrl?: string;
  width?: number;
  height?: number;
}

export interface RenderResult {
  success: boolean;
  canvas?: HTMLCanvasElement;
  error?: string;
}

class WASMRenderer {
  private wasmModule: WebAssembly.Module | null = null;
  private wasmInstance: WebAssembly.Instance | null = null;
  private memory: WebAssembly.Memory | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  /**
   * Initialize WASM module
   */
  async init(config: WASMRendererConfig): Promise<void> {
    try {
      // Load WASM module
      const wasmResponse = await fetch(config.wasmUrl);
      const wasmBytes = await wasmResponse.arrayBuffer();
      
      // Create WebAssembly memory
      this.memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 512,
      });

      // Compile and instantiate WASM module
      this.wasmModule = await WebAssembly.compile(wasmBytes);
      
      const imports = {
        env: {
          memory: this.memory,
          abort: () => {},
        },
        // Add engine-specific imports
        ...this.getEngineImports(config.engine),
      };

      this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, imports);

      // Create canvas
      this.canvas = document.createElement('canvas');
      this.canvas.width = config.width || 800;
      this.canvas.height = config.height || 600;
      this.context = this.canvas.getContext('2d');

      if (!this.context) {
        throw new Error('Failed to get canvas context');
      }
    } catch (error) {
      throw new Error(`WASM initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get engine-specific WASM imports
   */
  private getEngineImports(engine: string): Record<string, any> {
    const imports: Record<string, any> = {};

    switch (engine) {
      case 'unity':
        imports['unity'] = {
          log: (ptr: number, len: number) => {
            const message = this.readString(ptr, len);
            console.log('[Unity]', message);
          },
          error: (ptr: number, len: number) => {
            const message = this.readString(ptr, len);
            console.error('[Unity]', message);
          },
        };
        break;

      case 'godot':
        imports['godot'] = {
          print: (ptr: number, len: number) => {
            const message = this.readString(ptr, len);
            console.log('[Godot]', message);
          },
        };
        break;

      case 'pico8':
        imports['pico8'] = {
          cls: () => {
            if (this.context) {
              this.context.fillStyle = '#000000';
              this.context.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
            }
          },
        };
        break;
    }

    return imports;
  }

  /**
   * Render frame
   */
  async render(): Promise<RenderResult> {
    if (!this.wasmInstance || !this.canvas || !this.context) {
      return {
        success: false,
        error: 'WASM not initialized',
      };
    }

    try {
      // Call render function in WASM
      const renderFunc = (this.wasmInstance.exports as any).render;
      if (renderFunc) {
        renderFunc();
      }

      return {
        success: true,
        canvas: this.canvas,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Render failed',
      };
    }
  }

  /**
   * Update game state
   */
  async update(deltaTime: number): Promise<void> {
    if (!this.wasmInstance) return;

    const updateFunc = (this.wasmInstance.exports as any).update;
    if (updateFunc) {
      updateFunc(deltaTime);
    }
  }

  /**
   * Handle input
   */
  async handleInput(key: string, pressed: boolean): Promise<void> {
    if (!this.wasmInstance) return;

    const inputFunc = (this.wasmInstance.exports as any).handleInput;
    if (inputFunc) {
      const keyCode = this.getKeyCode(key);
      inputFunc(keyCode, pressed ? 1 : 0);
    }
  }

  /**
   * Read string from WASM memory
   */
  private readString(ptr: number, len: number): string {
    if (!this.memory) return '';

    const bytes = new Uint8Array(this.memory.buffer, ptr, len);
    return new TextDecoder().decode(bytes);
  }

  /**
   * Get key code for input
   */
  private getKeyCode(key: string): number {
    const keyMap: Record<string, number> = {
      'ArrowUp': 38,
      'ArrowDown': 40,
      'ArrowLeft': 37,
      'ArrowRight': 39,
      'Space': 32,
      'Enter': 13,
      'Escape': 27,
    };

    return keyMap[key] || key.charCodeAt(0);
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.wasmModule = null;
    this.wasmInstance = null;
    this.memory = null;
    this.canvas = null;
    this.context = null;
  }
}

// Singleton instance
let rendererInstance: WASMRenderer | null = null;

/**
 * Get the global WASM renderer instance
 */
export function getWASMRenderer(): WASMRenderer {
  if (!rendererInstance) {
    rendererInstance = new WASMRenderer();
  }
  return rendererInstance;
}

/**
 * Create a new WASM renderer instance
 */
export function createWASMRenderer(): WASMRenderer {
  return new WASMRenderer();
}

