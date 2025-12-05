"use server";

import { validateCSharp } from "@/lib/unity/validator";
import { generateWithClaude } from "@/lib/ai/claude-client";
import { generateWithOpenAI } from "@/lib/ai/openai-client";

export type AIProvider = "claude" | "openai";

interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
}

export async function generateUnityScript(
  prompt: string,
  provider: AIProvider = "claude"
): Promise<GenerateResult> {
  try {
    // Generate code using the selected provider
    let result: GenerateResult;

    if (provider === "openai") {
      result = await generateWithOpenAI(prompt);
    } else {
      result = await generateWithClaude(prompt);
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
