/*
 * Full deterministic integration pipeline mock for SLATE tests.
 * Covers FS → Compiler → Runtime flow used in integration suites.
 */

import { editorHost } from '../runtime/editorHost';
import { integrationFlags, sparkAdapters } from '../config/integration';

// ---------------------------
// FS MOCK
// ---------------------------
class FSMock {
  private files = new Map<string, string>();
  private listeners = new Map<string, Set<(payload?: any) => void>>();

  on(event: string, handler: (payload?: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  emit(event: string, payload?: any) {
    const handlers = this.listeners.get(event);
    if (handlers) handlers.forEach((h) => h(payload));
  }

  write(path: string, content: string) {
    this.files.set(path, content);
    this.emit('fs:written', { path, content });
    return { ok: true };
  }

  read(path: string) {
    return this.files.get(path) ?? '';
  }
}

// ---------------------------
// COMPILER MOCK
// ---------------------------
class CompilerMock {
  compile(source: string) {
    if (!source) {
      return {
        ok: false,
        errors: ['No source provided'],
      };
    }
    return {
      ok: true,
      bytecode: '<mock-bytecode>',
      warnings: [],
      errors: [],
    };
  }
}

// ---------------------------
// RUNTIME MOCK
// ---------------------------
class RuntimeMock {
  execute(bytecode: string) {
    return {
      ok: true,
      result: 'ok',
      logs: [],
      metrics: {
        cpu: 0.1,
        mem: 32,
      },
    };
  }
}

// ---------------------------
// INTEGRATION PIPELINE
// ---------------------------
export class IntegrationMock {
  fs = new FSMock();
  compiler = new CompilerMock();
  runtime = new RuntimeMock();

  async process(path: string, source: string) {
    // write (SPARK FS if enabled)
    if (integrationFlags.useSparkFS) {
      await sparkAdapters.fs.write(path, source);
    } else {
      this.fs.write(path, source);
    }

    // compile (SPARK compiler if enabled)
    const compiled = integrationFlags.useSparkCompiler
      ? await sparkAdapters.compiler.compile(source)
      : this.compiler.compile(source);

    if (!compiled.ok) {
      return { ok: false, stage: 'compile', errors: compiled.errors };
    }

    // runtime (SPARK runtime if enabled)
    const executed = integrationFlags.useSparkRuntime
      ? await sparkAdapters.runtime.execute(compiled.bytecode)
      : this.runtime.execute(compiled.bytecode);

    // trigger editorHost loop for tests expecting runtime updates
    editorHost.startLoop();

    return {
      ok: true,
      build: compiled,
      runtime: executed,
    };
  }
}

export const integrationMock = new IntegrationMock();

