import OpenAI from "openai";
import { retryWithBackoff, parseOpenAIError } from "./error-handler";

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
}

export type OpenAIModel = "gpt-4" | "gpt-4-turbo-preview" | "gpt-3.5-turbo";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateWithOpenAI(
  prompt: string,
  model: OpenAIModel = "gpt-4"
): Promise<GenerateResult> {
  const startTime = Date.now();

  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local",
      };
    }

    // Wrap API call in retry logic
    const completion = await retryWithBackoff(
      async () =>
        await openai.chat.completions.create({
      model,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: "You are a Unity C# script generator. Generate complete, working Unity C# scripts based on user requests.",
        },
        {
          role: "user",
          content: `Generate a Unity C# script based on this request: "${prompt}"

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

    const generatedText = completion.choices[0]?.message?.content || "";
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
    const aiError = parseOpenAIError(error);
    console.error("OpenAI generation error:", aiError);
    return {
      success: false,
      error: aiError.message,
    };
  }
}
