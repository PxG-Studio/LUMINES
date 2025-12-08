/**
 * MSW Handlers for Storybook Integration Coverage
 * METRIC 8: Integration Coverage - FS mock layer
 */

import { http, HttpResponse } from 'msw';

// Mock FileSystem operations
export const fsHandlers = [
  // Read file
  http.get('/api/files/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      path: 'Assets/Test.cs',
      content: 'using UnityEngine;\npublic class Test : MonoBehaviour { }',
      type: 'typescript',
    });
  }),
  
  // Write file
  http.post('/api/files', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'new-file-id',
      ...body,
    });
  }),
  
  // List files
  http.get('/api/files', () => {
    return HttpResponse.json([
      { id: '1', path: 'Assets/Test.cs', type: 'typescript' },
      { id: '2', path: 'Assets/Script.cs', type: 'typescript' },
    ]);
  }),
];

// Mock Compiler operations
export const compilerHandlers = [
  // Compile code
  http.post('/api/compile', async ({ request }) => {
    const body = await request.json() as { code: string };
    const hasErrors = body.code.includes('invalid');
    return HttpResponse.json({
      success: !hasErrors,
      errors: hasErrors ? [{ message: 'Syntax error', line: 1 }] : [],
      classes: !hasErrors ? [{ name: 'Test', methods: [] }] : [],
    });
  }),
];

// Mock Runtime operations
export const runtimeHandlers = [
  // Start runtime
  http.post('/api/runtime/start', () => {
    return HttpResponse.json({
      sessionId: 'session-123',
      status: 'running',
    });
  }),
  
  // Get runtime output
  http.get('/api/runtime/:sessionId/output', () => {
    return HttpResponse.json({
      logs: ['Console output...'],
      errors: [],
    });
  }),
];

export const handlers = [
  ...fsHandlers,
  ...compilerHandlers,
  ...runtimeHandlers,
];

