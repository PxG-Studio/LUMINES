/**
 * Godot Engine Adapter
 * 
 * Generates GDScript code for Godot game engine
 */

import { BaseEngineAdapter, type GenerateResult, type ValidationResult } from './base';
import { generateWithClaude, type ClaudeModel } from '../ai/claude-client';
import { generateWithOpenAI, type OpenAIModel } from '../ai/openai-client';
import { getAICache } from '../ai/cache';
import { recordGenerationTime } from '../performance/budgets';

const GODOT_SYSTEM_PROMPT = `You are a Godot GDScript generator. Generate complete, working GDScript code based on user requests.

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid GDScript code - no explanations, no markdown, no comments outside the code
2. Use proper GDScript syntax (extends Node, extends Node2D, extends Control, etc.)
3. Follow Godot naming conventions (snake_case for variables and functions, PascalCase for classes)
4. Use @export for Inspector-visible properties
5. Include proper type hints where appropriate
6. Use signals for event communication
7. Make the script immediately usable in Godot
8. Include necessary lifecycle methods (_ready, _process, _physics_process, etc.) only if needed
9. Use proper Godot API (get_node, $, etc.)

Format: Return ONLY the GDScript code, starting with 'extends' or 'class_name'.`;

const GODOT_USER_PROMPT_TEMPLATE = (userRequest: string) =>
  `Generate a complete, working GDScript script for Godot based on this request: "${userRequest}"`;

export class GodotAdapter extends BaseEngineAdapter {
  readonly engineId = 'godot';
  readonly displayName = 'Godot';
  readonly supportedExtensions = ['gd', 'gdscript'];

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
        /class_name\s+(\w+)/,
        /extends\s+(\w+)/,
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
      const fullPrompt = `${GODOT_SYSTEM_PROMPT}\n\n${GODOT_USER_PROMPT_TEMPLATE(prompt)}`;
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
            /class_name\s+(\w+)/,
            /extends\s+(\w+)/,
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
        /(extends|class_name)\s+\w+/,
      ],
      [
        'GDScript must start with "extends" or "class_name"',
      ]
    );
  }

  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string {
    const projectTemplate = `[application]

config/name="Generated Project"
config/description="AI-generated Godot project"
run/main_scene="res://main.tscn"
config/features=PackedStringArray("4.2", "Forward Plus")
config/icon="res://icon.svg"

[rendering]

renderer/rendering_method="forward_plus"
`;

    return projectTemplate;
  }

  getSystemPrompt(): string {
    return GODOT_SYSTEM_PROMPT;
  }

  getUserPromptTemplate(): (userRequest: string) => string {
    return GODOT_USER_PROMPT_TEMPLATE;
  }
}

// Legacy exports for backward compatibility
export async function generateGodotScript(
  prompt: string,
  options: {
    provider?: 'claude' | 'openai';
    claudeModel?: ClaudeModel;
    openaiModel?: OpenAIModel;
  } = {}
): Promise<GenerateResult> {
  const adapter = new GodotAdapter();
  return adapter.generate(prompt, options);
}

export function validateGDScript(code: string): ValidationResult {
  const adapter = new GodotAdapter();
  return adapter.validate(code);
}

export function generateGodotExportTemplate(scripts: Array<{ name: string; code: string }>): string {
  const adapter = new GodotAdapter();
  return adapter.generateExportTemplate(scripts);
}

