/**
 * MCP-SLATE Agent Interaction Tests
 * StackBlitz-parity test coverage for MCP agent interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MCPMockServer } from '../../utils/mcp-mock-server';

describe('MCP-SLATE Agent Interaction Tests', () => {
  let mcpServer: MCPMockServer;

  beforeEach(() => {
    mcpServer = new MCPMockServer();
  });

  describe('LUNA Code Generation Requests', () => {
    it('should handle LUNA code generation request', async () => {
      const response = await mcpServer.handleLUNA('Create a player controller', {});
      expect(response.success).toBe(true);
      expect(response.data?.code).toBeDefined();
    });

    it('should handle LUNA request timeout', async () => {
      mcpServer.setTimeoutMode(true, 30000);
      await expect(
        mcpServer.handleLUNA('test', {})
      ).rejects.toThrow('Request timeout');
    });

    it('should handle LUNA request failure', async () => {
      mcpServer.setFailureMode(true);
      const response = await mcpServer.handleLUNA('test', {});
      expect(response.success).toBe(false);
      expect(response.error).toBe('LUNA agent failure');
    });

    it('should handle LUNA with context', async () => {
      const context = { projectType: 'Unity', language: 'C#' };
      const response = await mcpServer.handleLUNA('Create script', context);
      expect(response.success).toBe(true);
    });
  });

  describe('NEC Scene Analysis Requests', () => {
    it('should handle NEC scene analysis request', async () => {
      const sceneData = { objects: [], relationships: [] };
      const response = await mcpServer.handleNEC(sceneData);
      expect(response.success).toBe(true);
      expect(response.data?.analysis).toBeDefined();
    });

    it('should handle NEC request timeout', async () => {
      mcpServer.setTimeoutMode(true, 30000);
      await expect(
        mcpServer.handleNEC({})
      ).rejects.toThrow('Request timeout');
    });

    it('should handle NEC request failure', async () => {
      mcpServer.setFailureMode(true);
      const response = await mcpServer.handleNEC({});
      expect(response.success).toBe(false);
      expect(response.error).toBe('NEC agent failure');
    });
  });

  describe('NERVA Auto-Layout Tooling', () => {
    it('should handle NERVA auto-layout request', async () => {
      const layoutRequest = { objects: [], constraints: [] };
      const response = await mcpServer.handleNERVA(layoutRequest);
      expect(response.success).toBe(true);
      expect(response.data?.layout).toBeDefined();
    });

    it('should handle NERVA request timeout', async () => {
      mcpServer.setTimeoutMode(true, 30000);
      await expect(
        mcpServer.handleNERVA({})
      ).rejects.toThrow('Request timeout');
    });

    it('should handle NERVA request failure', async () => {
      mcpServer.setFailureMode(true);
      const response = await mcpServer.handleNERVA({});
      expect(response.success).toBe(false);
      expect(response.error).toBe('NERVA agent failure');
    });
  });

  describe('Ageis Safety Enforcement Injection', () => {
    it('should handle Ageis safety check', async () => {
      const code = 'public class Test { }';
      const rules = [{ type: 'no_file_io', enabled: true }];
      const response = await mcpServer.handleAgeis(code, rules);
      expect(response.success).toBe(true);
      expect(response.data?.safe).toBe(true);
    });

    it('should detect safety violations', async () => {
      const code = 'System.IO.File.WriteAllText("test.txt", "data");';
      const rules = [{ type: 'no_file_io', enabled: true }];
      mcpServer.registerResponse('Ageis:' + code, {
        success: true,
        data: {
          safe: false,
          violations: [{ type: 'file_io', line: 1 }],
        },
      });
      
      const response = await mcpServer.handleAgeis(code, rules);
      expect(response.data?.safe).toBe(false);
      expect(response.data?.violations.length).toBeGreaterThan(0);
    });

    it('should handle Ageis request timeout', async () => {
      mcpServer.setTimeoutMode(true, 30000);
      await expect(
        mcpServer.handleAgeis('code', [])
      ).rejects.toThrow('Request timeout');
    });
  });

  describe('Agent Returns Invalid JSON', () => {
    it('should handle invalid JSON response', async () => {
      const invalidJson = await mcpServer.handleInvalidJSON();
      expect(() => JSON.parse(invalidJson)).toThrow();
    });

    it('should gracefully handle JSON parse errors', () => {
      const invalidJson = 'invalid json response';
      try {
        JSON.parse(invalidJson);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    });
  });

  describe('Agent Takes 30s to Respond', () => {
    it('should timeout after 30s', async () => {
      mcpServer.setTimeoutMode(true, 30000);
      mcpServer.setDefaultLatency(35000);
      
      await expect(
        mcpServer.handleLUNA('test', {})
      ).rejects.toThrow('Request timeout');
    });

    it('should handle slow but successful response', async () => {
      mcpServer.setDefaultLatency(5000);
      const start = Date.now();
      const response = await mcpServer.handleLUNA('test', {});
      const duration = Date.now() - start;
      
      expect(response.success).toBe(true);
      expect(duration).toBeGreaterThanOrEqual(5000);
    });
  });

  describe('Agent Retries Incorrectly', () => {
    it('should prevent infinite retry loops', async () => {
      let retryCount = 0;
      const maxRetries = 3;
      
      async function retryWithLimit() {
        retryCount++;
        if (retryCount < maxRetries) {
          mcpServer.setFailureMode(true);
          const response = await mcpServer.handleLUNA('test', {});
          if (!response.success) {
            return retryWithLimit();
          }
        }
        return { success: false };
      }
      
      await retryWithLimit();
      expect(retryCount).toBeLessThanOrEqual(maxRetries);
    });
  });

  describe('Agent Mis-Detects Scene State and Loops', () => {
    it('should detect agent state detection loop', () => {
      const states: string[] = [];
      let loopDetected = false;
      
      function detectState() {
        const state = 'analyzing';
        if (states.includes(state) && states.length > 5) {
          loopDetected = true;
          return;
        }
        states.push(state);
        // Simulate loop
        if (states.length < 10) {
          detectState();
        }
      }
      
      detectState();
      expect(loopDetected).toBe(true);
    });

    it('should break state detection loop', () => {
      const states: string[] = [];
      const maxIterations = 10;
      
      function detectState() {
        if (states.length >= maxIterations) {
          return 'final_state';
        }
        states.push('analyzing');
        return detectState();
      }
      
      const finalState = detectState();
      expect(states.length).toBeLessThanOrEqual(maxIterations);
      expect(finalState).toBe('final_state');
    });
  });
});

