/**
 * Temporary deterministic compiler adapter until real SPARK compiler is wired.
 */
export class SparkCompilerAdapter {
  async compile(source: string, _options?: any): Promise<{
    ok: boolean;
    bytecode?: string;
    warnings: string[];
    errors: string[];
  }> {
    if (!source) {
      return { ok: false, warnings: [], errors: ['Missing source'] };
    }
    return {
      ok: true,
      bytecode: '<spark-bytecode>',
      warnings: [],
      errors: [],
    };
  }
}

export const sparkCompilerAdapter = new SparkCompilerAdapter();

