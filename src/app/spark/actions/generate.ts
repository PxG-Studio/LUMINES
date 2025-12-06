"use server";

import { validateCSharp } from "@/lib/unity/validator";
import { generateWithClaude, ClaudeModel } from "@/lib/ai/claude-client";
import { generateWithOpenAI, OpenAIModel } from "@/lib/ai/openai-client";
import { getUserPreferences, logGeneration, updateUserPreferences } from "@/lib/database/operations/spark";
import { getCurrentUserId } from "@/lib/auth/user-context";

export type AIProvider = "claude" | "openai";
export type { ClaudeModel, OpenAIModel };

interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface GenerateOptions {
  provider?: AIProvider;
  claudeModel?: ClaudeModel;
  openaiModel?: OpenAIModel;
  userId?: string;
}

export async function generateUnityScript(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const startTime = Date.now();
  const userId = options.userId || getCurrentUserId();
  let provider: AIProvider = options.provider || "claude";
  let model: string = "";
  let tokensUsed: number = 0;

  try {
    let userPrefs = null;
    try {
      userPrefs = await getUserPreferences(userId);

      if (!options.provider && userPrefs) {
        provider = userPrefs.ai_provider;
      }

      if (provider === "claude" && !options.claudeModel && userPrefs) {
        model = userPrefs.claude_model;
      } else if (provider === "openai" && !options.openaiModel && userPrefs) {
        model = userPrefs.openai_model;
      }
    } catch (dbError) {
      console.warn("Failed to load user preferences, using defaults:", dbError);
    }

    if (provider === "claude" && !model) {
      model = options.claudeModel || "claude-sonnet-3-5-20241022";
    } else if (provider === "openai" && !model) {
      model = options.openaiModel || "gpt-4";
    }

    let result: GenerateResult;

    if (provider === "openai") {
      result = await generateWithOpenAI(prompt, model as OpenAIModel);
    } else {
      result = await generateWithClaude(prompt, model as ClaudeModel);
    }

    const generationTimeMs = Date.now() - startTime;
    const success = result.success && !!result.code;
    tokensUsed = result.tokensUsed || 0;

    try {
      await logGeneration({
        userId,
        provider,
        model,
        prompt,
        generatedCode: result.code,
        scriptName: result.scriptName,
        success,
        errorMessage: result.error,
        tokensUsed,
        generationTimeMs,
      });
    } catch (logError) {
      console.error("Failed to log generation (non-fatal):", logError);
    }

    if (!success || !result.code) {
      return {
        success: false,
        error: result.error || "Generation failed",
      };
    }

    const validation = validateCSharp(result.code);
    if (!validation.isValid) {
      try {
        await logGeneration({
          userId,
          provider,
          model,
          prompt,
          generatedCode: result.code,
          scriptName: result.scriptName,
          success: false,
          errorMessage: `Validation failed: ${validation.errors.join(", ")}`,
          tokensUsed,
          generationTimeMs,
        });
      } catch (logError) {
        console.error("Failed to log validation error (non-fatal):", logError);
      }

      return {
        success: false,
        error: `Generated code has errors: ${validation.errors.join(", ")}`,
      };
    }

    return result;
  } catch (error) {
    const generationTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    try {
      await logGeneration({
        userId,
        provider,
        model,
        prompt,
        success: false,
        errorMessage,
        tokensUsed,
        generationTimeMs,
      });
    } catch (logError) {
      console.error("Failed to log error (non-fatal):", logError);
    }

    console.error("Generation error:", error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updateUserPrefs(
  preferences: {
    provider?: AIProvider;
    claudeModel?: ClaudeModel;
    openaiModel?: OpenAIModel;
  },
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const uid = userId || getCurrentUserId();

    const prefs: any = {};
    if (preferences.provider) {
      prefs.ai_provider = preferences.provider;
    }
    if (preferences.claudeModel) {
      prefs.claude_model = preferences.claudeModel;
    }
    if (preferences.openaiModel) {
      prefs.openai_model = preferences.openaiModel;
    }

    await updateUserPreferences(uid, prefs);
    return { success: true };
  } catch (error) {
    console.error("Error updating preferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update preferences",
    };
  }
}
