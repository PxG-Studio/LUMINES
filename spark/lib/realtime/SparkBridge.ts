/**
 * SPARK Bridge - Function Registry
 *
 * Routes OpenAI Real-Time function calls to engine handlers
 */

export type FunctionHandler = (args: any) => Promise<any>;

export class SparkBridge {
  private registry: Map<string, FunctionHandler> = new Map();

  /**
   * Register a function handler
   */
  register(name: string, handler: FunctionHandler): void {
    this.registry.set(name, handler);
  }

  /**
   * Execute a function call
   */
  async execute(name: string, args: any): Promise<any> {
    const handler = this.registry.get(name);
    if (!handler) {
      throw new Error(`Unknown function: ${name}`);
    }
    return handler(args);
  }

  /**
   * Check if function exists
   */
  has(name: string): boolean {
    return this.registry.has(name);
  }

  /**
   * Get all registered functions
   */
  getFunctions(): string[] {
    return Array.from(this.registry.keys());
  }
}
