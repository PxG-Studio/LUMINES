/**
 * Vite Transform Pipeline
 * Handles code transformation for the Ignition runtime
 */

export interface TransformOptions {
  filename: string;
  code: string;
  target?: 'esnext' | 'es2015' | 'es2017' | 'es2020';
  minify?: boolean;
  sourcemap?: boolean;
}

export interface TransformResult {
  code: string;
  map?: string;
  errors?: string[];
}

export class ViteTransform {
  private transforms: Map<string, (code: string) => Promise<string>> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    // TypeScript transform
    this.transforms.set('.ts', async (code: string) => {
      // In production, this would use esbuild or SWC
      // For now, we'll return as-is (assuming browser can handle TS)
      return code;
    });

    // JSX transform
    this.transforms.set('.tsx', async (code: string) => {
      // JSX transformation would happen here
      return code;
    });
  }

  async transform(options: TransformOptions): Promise<TransformResult> {
    const { filename, code } = options;
    const ext = filename.substring(filename.lastIndexOf('.'));

    try {
      const transformFn = this.transforms.get(ext);
      
      if (transformFn) {
        const transformedCode = await transformFn(code);
        return {
          code: transformedCode,
        };
      }

      // No transform needed
      return {
        code,
      };
    } catch (error) {
      return {
        code,
        errors: [error instanceof Error ? error.message : 'Unknown transform error'],
      };
    }
  }

  registerTransform(extension: string, transform: (code: string) => Promise<string>): void {
    this.transforms.set(extension, transform);
  }
}

