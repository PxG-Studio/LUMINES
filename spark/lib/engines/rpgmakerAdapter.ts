/**
 * RPG Maker Engine Adapter
 * 
 * Generates JavaScript code for RPG Maker MV/MZ
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const RPGMAKER_SYSTEM_PROMPT = `You are an RPG Maker MV/MZ JavaScript plugin generator. Generate complete, working JavaScript code for RPG Maker plugins based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid JavaScript code - no explanations, no markdown, no comments outside the code
2. Use RPG Maker MV/MZ plugin format (/*:plugin_name*/)
3. Follow RPG Maker API conventions (Game_Actors, Game_Map, Scene_Map, etc.)
4. Use proper RPG Maker plugin structure with parameters
5. Include proper plugin header with name, version, author
6. Use RPG Maker built-in classes and methods
7. Follow JavaScript ES5+ syntax
8. Include proper JSDoc comments for RPG Maker compatibility
9. Make the code immediately usable in RPG Maker
10. Use proper RPG Maker API (BattleManager, DataManager, etc.)

Format: Return ONLY the JavaScript plugin code, starting with plugin header.`;

const RPGMAKER_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working RPG Maker JavaScript plugin based on this request: "${userRequest}"`;

export class RPGMakerAdapter extends BaseEngineAdapter {
  readonly engineId = 'rpgmaker';
  readonly displayName = 'RPG Maker';
  readonly supportedExtensions = ['js', 'mzplugin', 'mvplugin'];

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
        /\/\*:\s*(\w+)/,
        /var\s+(\w+)\s*=/,
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
      const fullPrompt = `${RPGMAKER_SYSTEM_PROMPT}\n\n${RPGMAKER_USER_PROMPT_TEMPLATE(prompt)}`;
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
            /\/\*:\s*(\w+)/,
            /var\s+(\w+)\s*=/,
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
        /\/\*:/,
        /var\s+\w+/,
      ],
      [
        'Missing plugin header',
        'No variable declarations found',
      ]
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    return JSON.stringify({
      plugins: scripts.map((s) => ({
        name: s.name,
        status: true,
        description: 'AI-generated plugin',
        parameters: {},
      })),
    }, null, 2);
  }

  getSystemPrompt(): string {
    return RPGMAKER_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return RPGMAKER_USER_PROMPT_TEMPLATE;
  }
}

