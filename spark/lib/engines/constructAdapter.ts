/**
 * Construct 3 Engine Adapter
 * 
 * Generates JavaScript/Event Sheet code for Construct 3
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const CONSTRUCT_SYSTEM_PROMPT = `You are a Construct 3 JavaScript/Event Sheet generator. Generate complete, working JavaScript code or Event Sheet JSON for Construct 3 based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid JavaScript code or Event Sheet JSON - no explanations, no markdown
2. Use Construct 3 JavaScript API (runtime, object types, behaviors)
3. Follow Construct 3 naming conventions (PascalCase for object types, camelCase for variables)
4. Use proper Construct 3 event system structure
5. Include proper event conditions and actions
6. Use Construct 3 built-in functions and objects
7. Follow JavaScript ES6+ syntax
8. Include proper event sheet structure if generating events
9. Make the code immediately usable in Construct 3
10. Use proper Construct 3 API (runtime.objects, runtime.globalVars, etc.)

Format: Return ONLY the JavaScript code or Event Sheet JSON, starting with function definitions or event structure.`;

const CONSTRUCT_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working Construct 3 script or event sheet based on this request: "${userRequest}"`;

export class ConstructAdapter extends BaseEngineAdapter {
  readonly engineId = 'construct';
  readonly displayName = 'Construct 3';
  readonly supportedExtensions = ['js', 'c3event'];

  async generate(
    prompt: string,
    options?: {
      provider?: 'claude' | 'openai';
      claudeModel?: string;
      openaiModel?: string;
    }
  ): Promise<GenerateResult> {
    const provider = options?.provider || 'claude';
    const startTime = Date.now();
    const cache = getAICache();

    const cached = cache.get<string>(prompt, provider, options?.claudeModel || options?.openaiModel || 'default');
    if (cached) {
      const scriptName = this.extractScriptName(cached, [
        /function\s+(\w+)/,
        /"name":\s*"(\w+)"/,
      ]);
      return {
        success: true,
        code: cached,
        scriptName,
        tokensUsed: 0,
        inputTokens: 0,
        outputTokens: 0,
      };
    }

    try {
      const fullPrompt = `${CONSTRUCT_SYSTEM_PROMPT}\n\n${CONSTRUCT_USER_PROMPT_TEMPLATE(prompt)}`;
      let result: GenerateResult;

      if (provider === 'openai') {
        const openaiResult = await generateWithOpenAI(fullPrompt, (options?.openaiModel as OpenAIModel) || 'gpt-4');
        result = openaiResult;
      } else {
        const claudeResult = await generateWithClaude(fullPrompt, (options?.claudeModel as ClaudeModel) || 'claude-sonnet-3-5-20241022');
        result = claudeResult;
      }

      if (result.success && result.code) {
        cache.set(prompt, provider, options?.claudeModel || options?.openaiModel || 'default', result.code);
        const generationTime = Date.now() - startTime;
        recordGenerationTime(generationTime);

        return {
          ...result,
          scriptName: result.scriptName || this.extractScriptName(result.code, [
            /function\s+(\w+)/,
            /"name":\s*"(\w+)"/,
          ]),
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  validate(code: string): ValidationResult {
    // Check if it's JSON (event sheet) or JavaScript
    const isJSON = code.trim().startsWith('{');
    
    if (isJSON) {
      try {
        JSON.parse(code);
        return { valid: true, errors: [], warnings: [] };
      } catch {
        return {
          valid: false,
          errors: [{ line: 1, column: 1, message: 'Invalid JSON format' }],
          warnings: [],
        };
      }
    }

    return this.basicValidation(
      code,
      [
        /function\s+\w+/,
      ],
      [
        'No function definitions found',
      ]
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    return JSON.stringify({
      eventSheets: scripts.map((s) => ({
        name: s.name,
        events: [],
      })),
    }, null, 2);
  }

  getSystemPrompt(): string {
    return CONSTRUCT_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return CONSTRUCT_USER_PROMPT_TEMPLATE;
  }
}

