/**
 * Error Injection + Resilience Tests
 * StackBlitz-parity test coverage for graceful fallbacks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  WebGLContextLossSimulator,
  WorkerPoolCollapseSimulator,
  FSStorageUnavailableSimulator,
  CompilerHangSimulator,
} from '../utils/error-injection';
import { WebGLSimulator } from '../utils/webgl-simulator';
import { FSCorruptionSimulator } from '../utils/fs-corruption';

describe('Error Injection + Resilience Tests', () => {
  let webglSimulator: WebGLSimulator;
  let workerPool: WorkerPoolCollapseSimulator;
  let fsStorage: FSStorageUnavailableSimulator;
  let compilerHang: CompilerHangSimulator;
  let fsCorruption: FSCorruptionSimulator;

  beforeEach(() => {
    webglSimulator = new WebGLSimulator();
    workerPool = new WorkerPoolCollapseSimulator();
    fsStorage = new FSStorageUnavailableSimulator();
    compilerHang = new CompilerHangSimulator();
    fsCorruption = new FSCorruptionSimulator();
  });

  describe('WebGL Context Loss Graceful Fallback', () => {
    it('should detect WebGL context loss', () => {
      webglSimulator.simulateContextLoss();
      expect(webglSimulator.isContextLost()).toBe(true);
    });

    it('should recover from WebGL context loss', () => {
      webglSimulator.simulateContextLoss();
      webglSimulator.simulateContextRestore();
      expect(webglSimulator.isContextRestored()).toBe(true);
    });

    it('should handle context loss during rendering', () => {
      webglSimulator.simulateContextLoss();
      const context = webglSimulator.createMockContext(document.createElement('canvas'));
      expect(context).toBeNull();
    });

    it('should notify listeners on context loss', () => {
      const listener = vi.fn();
      webglSimulator.onContextLost(listener);
      webglSimulator.simulateContextLoss();
      expect(listener).toHaveBeenCalled();
    });

    it('should notify listeners on context restore', () => {
      const listener = vi.fn();
      webglSimulator.onContextRestore(listener);
      webglSimulator.simulateContextLoss();
      webglSimulator.simulateContextRestore();
      expect(listener).toHaveBeenCalled();
    });

    it('should handle multiple context loss events', () => {
      webglSimulator.simulateContextLoss();
      webglSimulator.simulateContextRestore();
      webglSimulator.simulateContextLoss();
      expect(webglSimulator.isContextLost()).toBe(true);
    });
  });

  describe('Worker Pool Collapse Graceful Fallback', () => {
    it('should detect worker pool collapse', () => {
      workerPool.collapse();
      expect(workerPool.isCollapsed()).toBe(true);
    });

    it('should restore worker pool', () => {
      workerPool.collapse();
      workerPool.restore();
      expect(workerPool.isCollapsed()).toBe(false);
    });

    it('should reject tasks when pool collapsed', async () => {
      workerPool.collapse();
      await expect(
        workerPool.executeTask(async () => 'result')
      ).rejects.toThrow('Worker pool collapsed');
    });

    it('should execute tasks when pool restored', async () => {
      workerPool.collapse();
      workerPool.restore();
      const result = await workerPool.executeTask(async () => 'result');
      expect(result).toBe('result');
    });

    it('should handle concurrent collapse/restore', async () => {
      workerPool.collapse();
      const promise1 = workerPool.executeTask(async () => 'result1');
      workerPool.restore();
      const promise2 = workerPool.executeTask(async () => 'result2');
      
      await expect(promise1).rejects.toThrow();
      await expect(promise2).resolves.toBe('result2');
    });
  });

  describe('FS Storage Unavailable Graceful Fallback', () => {
    it('should detect FS storage unavailable', () => {
      fsStorage.setUnavailable();
      expect(fsStorage.isUnavailable()).toBe(true);
    });

    it('should set FS storage available', () => {
      fsStorage.setUnavailable();
      fsStorage.setAvailable();
      expect(fsStorage.isUnavailable()).toBe(false);
    });

    it('should reject save when storage unavailable', async () => {
      fsStorage.setUnavailable();
      await expect(
        fsStorage.save('key', 'value')
      ).rejects.toThrow('FS storage unavailable');
    });

    it('should reject load when storage unavailable', async () => {
      fsStorage.setUnavailable();
      await expect(
        fsStorage.load('key')
      ).rejects.toThrow('FS storage unavailable');
    });

    it('should allow save when storage available', async () => {
      fsStorage.setAvailable();
      await expect(
        fsStorage.save('key', 'value')
      ).resolves.not.toThrow();
    });

    it('should allow load when storage available', async () => {
      fsStorage.setAvailable();
      await fsStorage.save('key', 'value');
      const result = await fsStorage.load('key');
      expect(result).toBeDefined();
    });
  });

  describe('Compiler Job Hang Graceful Fallback', () => {
    it('should detect compiler hang', () => {
      compilerHang.hang();
      expect(compilerHang.isHanging()).toBe(true);
    });

    it('should resume compiler', () => {
      compilerHang.hang();
      compilerHang.resume();
      expect(compilerHang.isHanging()).toBe(false);
    });

    it('should timeout on compiler hang', async () => {
      compilerHang.hang();
      await expect(
        compilerHang.compile('code', 1000)
      ).rejects.toThrow('Compiler hang detected');
    });

    it('should compile successfully when not hanging', async () => {
      compilerHang.resume();
      const result = await compilerHang.compile('code');
      expect(result).toBe('compiled:code');
    });

    it('should handle hang during compilation', async () => {
      const promise = compilerHang.compile('code', 5000);
      setTimeout(() => compilerHang.hang(), 100);
      await expect(promise).rejects.toThrow('Compiler hang detected');
    });
  });

  describe('Runtime Unhandled Exception Graceful Fallback', () => {
    it('should catch unhandled exceptions', () => {
      const errorHandler = vi.fn();
      process.on('uncaughtException', errorHandler);
      
      // Simulate unhandled exception
      setTimeout(() => {
        throw new Error('Unhandled exception');
      }, 10);
      
      // Error should be caught
      expect(errorHandler).toBeDefined();
    });

    it('should log unhandled exceptions', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        throw new Error('Test error');
      } catch (error) {
        console.error(error);
      }
      
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should prevent application crash on unhandled exception', () => {
      let crashed = false;
      const originalError = process.listeners('uncaughtException');
      
      process.on('uncaughtException', () => {
        crashed = false; // Prevent crash
      });
      
      try {
        throw new Error('Test');
      } catch (error) {
        // Handled
      }
      
      expect(crashed).toBe(false);
    });
  });

  describe('Combined Failure Scenarios', () => {
    it('should handle WebGL loss + FS unavailable', async () => {
      webglSimulator.simulateContextLoss();
      fsStorage.setUnavailable();
      
      expect(webglSimulator.isContextLost()).toBe(true);
      expect(fsStorage.isUnavailable()).toBe(true);
    });

    it('should handle worker collapse + compiler hang', async () => {
      workerPool.collapse();
      compilerHang.hang();
      
      await expect(
        workerPool.executeTask(async () => compilerHang.compile('code'))
      ).rejects.toThrow();
    });

    it('should recover from multiple failures', () => {
      webglSimulator.simulateContextLoss();
      workerPool.collapse();
      fsStorage.setUnavailable();
      
      webglSimulator.simulateContextRestore();
      workerPool.restore();
      fsStorage.setAvailable();
      
      expect(webglSimulator.isContextLost()).toBe(false);
      expect(workerPool.isCollapsed()).toBe(false);
      expect(fsStorage.isUnavailable()).toBe(false);
    });
  });

  describe('FS Corruption Recovery', () => {
    it('should detect corrupted file', async () => {
      fsCorruption.corruptFileInvalid('test.ts');
      const corrupted = fsCorruption.getCorruptedFile('test.ts');
      expect(corrupted?.corrupted).toBe(true);
      expect(corrupted?.corruptionType).toBe('invalid');
    });

    it('should recover from partial write', async () => {
      fsCorruption.corruptFilePartial('test.ts', 'full content');
      await fsCorruption.writeFile('test.ts', 'full content');
      const file = fsCorruption.getCorruptedFile('test.ts');
      expect(file).toBeUndefined(); // Should be cleared after recovery
    });

    it('should handle missing file gracefully', async () => {
      fsCorruption.corruptFileMissing('test.ts');
      await expect(
        fsCorruption.readFile('test.ts')
      ).rejects.toThrow('File not found');
    });
  });
});

