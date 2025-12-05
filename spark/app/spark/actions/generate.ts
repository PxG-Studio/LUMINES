"use server";

import { validateCSharp } from "@/lib/unity/validator";
import { generateWithClaude, ClaudeModel } from "@/lib/ai/claude-client";
import { generateWithOpenAI, OpenAIModel } from "@/lib/ai/openai-client";

export type AIProvider = "claude" | "openai";
export type { ClaudeModel, OpenAIModel };

interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
}

export interface GenerateOptions {
  provider: AIProvider;
  claudeModel?: ClaudeModel;
  openaiModel?: OpenAIModel;
}

export async function generateUnityScript(
  prompt: string,
  options: GenerateOptions = { provider: "claude" }
): Promise<GenerateResult> {
  try {
    // Generate code using the selected provider
    let result: GenerateResult;

    if (options.provider === "openai") {
      result = await generateWithOpenAI(prompt, options.openaiModel);
    } else {
      result = await generateWithClaude(prompt, options.claudeModel);
    }

    // If generation failed, return the error
    if (!result.success || !result.code) {
      return result;
    }

    // Validate the generated C#
    const validation = validateCSharp(result.code);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Generated code has errors: ${validation.errors.join(", ")}`,
      };
    }

    return result;
  } catch (error) {
    console.error("Generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
