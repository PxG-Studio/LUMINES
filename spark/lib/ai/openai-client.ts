import OpenAI from "openai";

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateWithOpenAI(prompt: string): Promise<GenerateResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local",
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    });

    const generatedText = completion.choices[0]?.message?.content || "";

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
    console.error("OpenAI generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
