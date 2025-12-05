import Anthropic from "@anthropic-ai/sdk";
import { retryWithBackoff, parseAnthropicError } from "./error-handler";

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
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

    // Wrap API call in retry logic
    const message = await retryWithBackoff(
      async () =>
        await anthropic.messages.create({
      model,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a Unity C# script generator. Generate a complete, working Unity C# script based on this request: "${prompt}"

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid C# code - no explanations, no markdown, no comments outside the code
2. Include proper using statements (UnityEngine, System.Collections, etc.)
3. Use MonoBehaviour as the base class for components
4. Follow Unity naming conventions (PascalCase for classes and methods)
5. Add XML documentation comments for the class
6. Make the script immediately usable in Unity
7. Include necessary Unity lifecycle methods (Awake, Start, Update, etc.) only if needed
8. Use proper C# syntax and Unity API

Format: Return ONLY the C# code, starting with 'using' statements.`,
        },
      ],
    }),
      { maxRetries: 3, initialDelayMs: 1000 }
    );

    const generatedText = message.content[0].type === "text" ? message.content[0].text : "";
    const generationTime = Date.now() - startTime;

    if (!generatedText) {
      return {
        success: false,
        error: "No code generated. Please try again.",
      };
    }

    // Extract script name from the class definition
    const classMatch = generatedText.match(/class\s+(\w+)/);
    const scriptName = classMatch ? classMatch[1] : "GeneratedScript";

    return {
      success: true,
      code: generatedText,
      scriptName,
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
