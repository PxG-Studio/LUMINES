/**
 * PICO-8 Engine Adapter
 * 
 * Generates Lua code for PICO-8 game engine
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const PICO8_SYSTEM_PROMPT = `You are a PICO-8 Lua code generator. Generate complete, working PICO-8 Lua code based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid PICO-8 Lua code - no explanations, no markdown, no comments outside the code
2. Use PICO-8 API functions (cls, pset, pget, spr, map, sfx, music, etc.)
3. Follow PICO-8 naming conventions (snake_case)
4. Include _init() for initialization
5. Include _update() for game loop updates
6. Include _draw() for rendering
7. Use PICO-8 color palette (0-15)
8. Respect PICO-8 token limit (8192 tokens)
9. Use proper PICO-8 syntax and API
10. Make the code immediately runnable in PICO-8

Format: Return ONLY the PICO-8 Lua code, starting with function definitions or variable declarations.`;

const PICO8_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working PICO-8 Lua script based on this request: "${userRequest}"`;

export class PICO8Adapter extends BaseEngineAdapter {
  readonly engineId = 'pico8';
  readonly displayName = 'PICO-8';
  readonly supportedExtensions = ['lua', 'p8'];

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

    // Check cache
    const cached = cache.get<string>(prompt, provider, options?.claudeModel || options?.openaiModel || 'default');
    if (cached) {
      const scriptName = this.extractScriptName(cached, [
        /--\s*title:\s*(.+)/i,
        /function\s+(\w+)/,
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
      const fullPrompt = `${PICO8_SYSTEM_PROMPT}\n\n${PICO8_USER_PROMPT_TEMPLATE(prompt)}`;
      let result: GenerateResult;

      if (provider === 'openai') {
        const openaiResult = await generateWithOpenAI(fullPrompt, (options?.openaiModel as OpenAIModel) || 'gpt-4');
        result = openaiResult;
      } else {
        const claudeResult = await generateWithClaude(fullPrompt, (options?.claudeModel as ClaudeModel) || 'claude-sonnet-3-5-20241022');
        result = claudeResult;
      }

      if (result.success && result.code) {
        // Cache the result
        cache.set(prompt, provider, options?.claudeModel || options?.openaiModel || 'default', result.code);
        const generationTime = Date.now() - startTime;
        recordGenerationTime(generationTime);

        return {
          ...result,
          scriptName: result.scriptName || this.extractScriptName(result.code, [
            /--\s*title:\s*(.+)/i,
            /function\s+(\w+)/,
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
    const result = this.basicValidation(
      code,
      [],
      []
    );

    // Check token count (PICO-8 has 8192 token limit)
    const tokenCount = code.split(/\s+/).length;
    if (tokenCount > 8192) {
      result.warnings.push({
        line: 1,
        column: 1,
        message: `Code exceeds PICO-8 token limit (${tokenCount}/8192)`,
      });
    }

    return result;
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    // PICO-8 cart format
    const header = `pico-8 cartridge // http://www.pico-8.com
version 8
__lua__
`;

    const code = scripts.map((s) => s.code).join('\n\n');

    return `${header}${code}
__gfx__
__gff__
__map__
__sfx__
__music__
`;
  }

  getSystemPrompt(): string {
    return PICO8_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return PICO8_USER_PROMPT_TEMPLATE;
  }
}

// Legacy exports for backward compatibility
export async function generatePICO8Script(
  prompt: string,
  options: {
    provider?: 'claude' | 'openai';
    claudeModel?: ClaudeModel;
    openaiModel?: OpenAIModel;
  } = {}
): Promise<GenerateResult> {
  const adapter = new PICO8Adapter();
  return adapter.generate(prompt, options);
}

export function validatePICO8Lua(code: string): ValidationResult {
  const adapter = new PICO8Adapter();
  return adapter.validate(code);
}

export function generatePICO8CartTemplate(scripts: Array<{ name: string; code: string }>): string {
  const adapter = new PICO8Adapter();
  return adapter.generateExportTemplate(scripts);
}

