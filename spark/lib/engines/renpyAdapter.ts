/**
 * Ren'Py Engine Adapter
 * 
 * Generates Python/Ren'Py script code for Ren'Py visual novel engine
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const RENPY_SYSTEM_PROMPT = `You are a Ren'Py visual novel script generator. Generate complete, working Ren'Py script code based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid Ren'Py script code - no explanations, no markdown, no comments outside the code
2. Use Ren'Py script syntax (label, scene, show, hide, menu, etc.)
3. Follow Ren'Py naming conventions (snake_case for labels and variables)
4. Use proper Ren'Py script structure
5. Include proper character definitions if needed
6. Use Ren'Py built-in functions and statements
7. Follow Python syntax for Python blocks
8. Include proper dialogue formatting
9. Make the code immediately usable in Ren'Py
10. Use proper Ren'Py API (renpy.show, renpy.hide, renpy.call, etc.)

Format: Return ONLY the Ren'Py script code, starting with label definitions or character definitions.`;

const RENPY_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working Ren'Py script based on this request: "${userRequest}"`;

export class RenPyAdapter extends BaseEngineAdapter {
  readonly engineId = 'renpy';
  readonly displayName = "Ren'Py";
  readonly supportedExtensions = ['rpy', 'rpyc'];

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
        /label\s+(\w+)/,
        /define\s+(\w+)/,
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
      const fullPrompt = `${RENPY_SYSTEM_PROMPT}\n\n${RENPY_USER_PROMPT_TEMPLATE(prompt)}`;
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
            /label\s+(\w+)/,
            /define\s+(\w+)/,
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
    return this.basicValidation(
      code,
      [
        /label\s+\w+/,
      ],
      [
        'No label definitions found',
      ]
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    return scripts.map((s) => s.code).join('\n\n');
  }

  getSystemPrompt(): string {
    return RENPY_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return RENPY_USER_PROMPT_TEMPLATE;
  }
}

