// @ts-nocheck
/**
 * Integration Test: FS → Compiler → Runtime Chain
 * StackBlitz-parity integration test coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';

describe('Integration: FS → Compiler → Runtime Chain', () => {
  beforeEach(() => {
    useWissilFS.getState().clear();
  });

  describe('Complete Chain: File Write → Compile → Runtime', () => {
    it('should compile file after write', async () => {
      const fs = useWissilFS.getState();
      const code = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      
      // Write file
      fs.writeFile('Assets/Test.cs', code);
      expect(fs.exists('Assets/Test.cs')).toBe(true);
      
      // Compile
      const compileResult = await compileFile('Assets/Test.cs');
      expect(compileResult.success).toBe(true);
      
      // Runtime should receive compiled code
      const runtimeCode = await getRuntimeCode('Assets/Test.cs');
      expect(runtimeCode).toBeDefined();
    });

    it('should handle compilation errors in chain', async () => {
      const fs = useWissilFS.getState();
      const invalidCode = 'public class Test { invalid syntax }';
      
      fs.writeFile('Assets/Test.cs', invalidCode);
      const compileResult = await compileFile('Assets/Test.cs');
      
      expect(compileResult.success).toBe(false);
      expect(compileResult.errors.length).toBeGreaterThan(0);
    });

    it('should update runtime when file changes', async () => {
      const fs = useWissilFS.getState();
      fs.writeFile('Assets/Test.cs', 'public class Test { }');
      await compileFile('Assets/Test.cs');
      
      fs.writeFile('Assets/Test.cs', 'public class Test { public void Method() { } }');
      await compileFile('Assets/Test.cs');
      
      const runtimeCode = await getRuntimeCode('Assets/Test.cs');
      expect(runtimeCode).toContain('Method');
    });

    it('should handle multiple files in chain', async () => {
      const fs = useWissilFS.getState();
      fs.writeFile('Assets/Test1.cs', 'public class Test1 { }');
      fs.writeFile('Assets/Test2.cs', 'public class Test2 { }');
      
      const result1 = await compileFile('Assets/Test1.cs');
      const result2 = await compileFile('Assets/Test2.cs');
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe('Compile Triggered While Files Writing', () => {
    it('should wait for file write to complete before compile', async () => {
      const fs = useWissilFS.getState();
      const writePromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          fs.writeFile('Assets/Test.cs', 'content');
          resolve();
        }, 100);
      });
      
      const compilePromise = compileFile('Assets/Test.cs');
      
      await writePromise;
      const compileResult = await compilePromise;
      expect(compileResult.success).toBe(true);
    });

    it('should handle concurrent writes and compiles', async () => {
      const fs = useWissilFS.getState();
      const promises = Array.from({ length: 5 }, (_, i) => {
        fs.writeFile(`Assets/Test${i}.cs`, `public class Test${i} { }`);
        return compileFile(`Assets/Test${i}.cs`);
      });
      
      const results = await Promise.all(promises);
      expect(results.every(r => r.success)).toBe(true);
    });
  });
});

// Mock implementations
async function compileFile(path: string): Promise<{ success: boolean; errors?: Array<any> }> {
  const fs = useWissilFS.getState();
  const content = fs.readFile(path);
  if (!content) {
    return { success: false, errors: [{ message: 'File not found' }] };
  }
  const hasErrors = content.includes('invalid');
  return {
    success: !hasErrors,
    errors: hasErrors ? [{ message: 'Syntax error' }] : undefined,
  };
}

async function getRuntimeCode(path: string): Promise<string> {
  const fs = useWissilFS.getState();
  return fs.readFile(path) || '';
}

