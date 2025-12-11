/**
 * Feature flags for swapping SLATE mocks to SPARK services.
 * Defaults keep existing deterministic mocks.
 */
export const integrationFlags = {
  useSparkFS: true,
  useSparkCompiler: true,
  useSparkBuildDb: false,
  useSparkRuntime: false,
};

// Temporary adapters: in-memory until real SPARK endpoints are wired.
import { sparkFsAdapter } from '../adapters/spark-fs';
import { sparkCompilerAdapter } from '../adapters/spark-compiler';
import { sparkBuildDbAdapter } from '../adapters/spark-builddb';

export const sparkAdapters = {
  fs: {
    read: (path: string) => sparkFsAdapter.read(path),
    write: (path: string, content: any) => sparkFsAdapter.write(path, content),
    exists: (path: string) => sparkFsAdapter.exists(path),
    list: (dir: string) => sparkFsAdapter.list(dir),
  },
  compiler: {
    compile: (source: string, options?: any) => sparkCompilerAdapter.compile(source, options),
  },
  buildDb: {
    get: (id: string | number) => sparkBuildDbAdapter.get(id),
    set: (id: string | number, value: any) => sparkBuildDbAdapter.set(id, value),
    list: (projectId: string) => sparkBuildDbAdapter.list(projectId),
  },
  runtime: {
    execute: async (_bytecode: string) => ({
      ok: true,
      result: 'spark-runtime-not-wired',
      logs: [],
      metrics: { cpu: 0.01, mem: 1 },
    }),
  },
};

