/**
 * Unity Engine Adapter
 * 
 * Generates C# code for Unity game engine
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';
import { UNITY_SYSTEM_PROMPT, UNITY_USER_PROMPT_TEMPLATE } from '../ai/prompts';

export class UnityAdapter extends BaseEngineAdapter {
  readonly engineId = 'unity';
  readonly displayName = 'Unity';
  readonly supportedExtensions = ['cs', 'csharp'];

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
        /class\s+(\w+)/,
        /namespace\s+(\w+)/,
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
      let result: GenerateResult;

      if (provider === 'openai') {
        const openaiResult = await generateWithOpenAI(
          `${UNITY_SYSTEM_PROMPT}\n\n${UNITY_USER_PROMPT_TEMPLATE(prompt)}`,
          (options?.openaiModel as OpenAIModel) || 'gpt-4'
        );
        result = openaiResult;
      } else {
        const claudeResult = await generateWithClaude(
          `${UNITY_SYSTEM_PROMPT}\n\n${UNITY_USER_PROMPT_TEMPLATE(prompt)}`,
          (options?.claudeModel as ClaudeModel) || 'claude-sonnet-3-5-20241022'
        );
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
            /class\s+(\w+)/,
            /namespace\s+(\w+)/,
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
        /using\s+UnityEngine/,
        /class\s+\w+/,
      ],
      [
        'Missing UnityEngine using statement',
        'No class definition found',
      ]
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    // Unity project structure
    const projectStructure = {
      'Assets/Scripts': scripts.map((s) => ({
        name: `${s.name}.cs`,
        content: s.code,
      })),
      'Assets/Scripts/.meta': scripts.map((s) => ({
        name: `${s.name}.cs.meta`,
        content: this.generateMetaFile(s.name),
      })),
    };

    return JSON.stringify(projectStructure, null, 2);
  }

  private generateMetaFile(scriptName: string): string {
    const guid = this.generateGUID();
    return `fileFormatVersion: 2
guid: ${guid}
MonoImporter:
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData: 
  assetBundleName: 
  assetBundleVariant: 
`;
  }

  private generateGUID(): string {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
      ((Math.random() * 16) | 0).toString(16)
    );
  }

  getSystemPrompt(): string {
    return UNITY_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return UNITY_USER_PROMPT_TEMPLATE;
  }
}

