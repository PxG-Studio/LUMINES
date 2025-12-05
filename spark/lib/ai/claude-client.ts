import Anthropic from "@anthropic-ai/sdk";

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateWithClaude(prompt: string): Promise<GenerateResult> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        success: false,
        error: "Claude API key not configured. Please add ANTHROPIC_API_KEY to .env.local",
      };
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-3-5-20241022",
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
    });

    const generatedText = message.content[0].type === "text" ? message.content[0].text : "";

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
    console.error("Claude generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
