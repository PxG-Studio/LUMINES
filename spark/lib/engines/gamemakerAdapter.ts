/**
 * GameMaker Studio Engine Adapter
 * 
 * Generates GML (GameMaker Language) code for GameMaker Studio
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const GAMEMAKER_SYSTEM_PROMPT = `You are a GameMaker Studio GML code generator. Generate complete, working GML (GameMaker Language) code based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid GML code - no explanations, no markdown, no comments outside the code
2. Use GameMaker Studio 2.3+ syntax (GML Visual or GML Code)
3. Follow GML naming conventions (camelCase for variables, PascalCase for functions)
4. Use built-in GameMaker functions (sprite_index, image_index, x, y, hspeed, vspeed, etc.)
5. Include proper event structure (Create, Step, Draw, etc.)
6. Use proper GML syntax (no semicolons required, but consistent style)
7. Include proper variable declarations
8. Use built-in GameMaker objects and functions
9. Make the code immediately usable in GameMaker Studio
10. Use proper GML API (room_goto, instance_create, etc.)

Format: Return ONLY the GML code, starting with variable declarations or event code.`;

const GAMEMAKER_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working GML script for GameMaker Studio based on this request: "${userRequest}"`;

export class GameMakerAdapter extends BaseEngineAdapter {
  readonly engineId = 'gamemaker';
  readonly displayName = 'GameMaker Studio';
  readonly supportedExtensions = ['gml', 'yy'];

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
        /#define\s+(\w+)/,
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
      const fullPrompt = `${GAMEMAKER_SYSTEM_PROMPT}\n\n${GAMEMAKER_USER_PROMPT_TEMPLATE(prompt)}`;
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
            /#define\s+(\w+)/,
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
      [],
      []
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    return JSON.stringify({
      resources: scripts.map((s) => ({
        name: s.name,
        path: `scripts/${s.name}/${s.name}.gml`,
        resourceType: 'GMScript',
        resourceVersion: '2.0',
      })),
    }, null, 2);
  }

  getSystemPrompt(): string {
    return GAMEMAKER_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return GAMEMAKER_USER_PROMPT_TEMPLATE;
  }
}

