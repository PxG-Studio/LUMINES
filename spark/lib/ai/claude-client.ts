import Anthropic from "@anthropic-ai/sdk";
import { retryWithBackoff, parseAnthropicError } from "./error-handler";
import { UNITY_SYSTEM_PROMPT, UNITY_USER_PROMPT_TEMPLATE } from "./prompts";
import { withConnectionPool } from "./connection-pool";

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export type ClaudeModel =
  | "claude-sonnet-3-5-20241022"
  | "claude-3-5-sonnet-20240620"
  | "claude-3-haiku-20240307";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateWithClaude(
  prompt: string,
  model: ClaudeModel = "claude-sonnet-3-5-20241022"
): Promise<GenerateResult> {
  const startTime = Date.now();

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        success: false,
        error: "Claude API key not configured. Please add ANTHROPIC_API_KEY to .env.local",
      };
    }

    // Wrap API call with connection pooling and retry logic
    const message = await withConnectionPool('claude', async () =>
      await retryWithBackoff(
        async () =>
          await anthropic.messages.create({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `${UNITY_SYSTEM_PROMPT}\n\n${UNITY_USER_PROMPT_TEMPLATE(prompt)}`,
          },
        ],
      }),
        { maxRetries: 3, initialDelayMs: 1000 }
      )
    );

    const generatedText = message.content[0].type === "text" ? message.content[0].text : "";
    const generationTime = Date.now() - startTime;

    const inputTokens = message.usage?.input_tokens || 0;
    const outputTokens = message.usage?.output_tokens || 0;
    const tokensUsed = inputTokens + outputTokens;

    if (!generatedText) {
      return {
        success: false,
        error: "No code generated. Please try again.",
        tokensUsed,
        inputTokens,
        outputTokens,
      };
    }

    const classMatch = generatedText.match(/class\s+(\w+)/);
    const scriptName = classMatch ? classMatch[1] : "GeneratedScript";

    return {
      success: true,
      code: generatedText,
      scriptName,
      tokensUsed,
      inputTokens,
      outputTokens,
    };
  } catch (error) {
    const aiError = parseAnthropicError(error);
    console.error("Claude generation error:", aiError);
    return {
      success: false,
      error: aiError.message,
    };
  }
}
