"use client";

import { useState, FormEvent } from "react";
import { generateUnityScript, ClaudeModel, OpenAIModel } from "../actions/generate";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

interface MCPChatProps {
  onCodeGenerated: (code: string, scriptName: string) => void;
}

export type AIProvider = "claude" | "openai";

const CLAUDE_MODELS: { value: ClaudeModel; label: string }[] = [
  { value: "claude-sonnet-3-5-20241022", label: "Claude 3.5 Sonnet (Latest)" },
  { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet (June)" },
  { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku (Fast)" },
];

const OPENAI_MODELS: { value: OpenAIModel; label: string }[] = [
  { value: "gpt-4", label: "GPT-4 (Best)" },
  { value: "gpt-4-turbo-preview", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (Fast)" },
];

export default function MCPChat({ onCodeGenerated }: MCPChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm SPARK, your Unity C# script generator. Describe what Unity script you'd like to create, and I'll generate it for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("claude");
  const [claudeModel, setClaudeModel] = useState<ClaudeModel>("claude-sonnet-3-5-20241022");
  const [openaiModel, setOpenaiModel] = useState<OpenAIModel>("gpt-4");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const result = await generateUnityScript(userMessage, {
        provider,
        claudeModel,
        openaiModel,
      });

      if (result.success && result.code && result.scriptName) {
        // Add success message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Generated ${result.scriptName}! Check the preview panel on the right.`,
          },
        ]);

        // Send code to preview
        onCodeGenerated(result.code, result.scriptName);
      } else {
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            content: result.error || "Failed to generate script. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "An unexpected error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="provider-selector">
        <div className="provider-config">
          <label htmlFor="ai-provider" className="provider-label">
            Provider:
          </label>
          <select
            id="ai-provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            disabled={isLoading}
            className="provider-select"
          >
            <option value="claude">Claude (Anthropic)</option>
            <option value="openai">OpenAI</option>
          </select>
        </div>

        <div className="provider-config">
          <label htmlFor="ai-model" className="provider-label">
            Model:
          </label>
          {provider === "claude" ? (
            <select
              id="ai-model"
              value={claudeModel}
              onChange={(e) => setClaudeModel(e.target.value as ClaudeModel)}
              disabled={isLoading}
              className="provider-select"
            >
              {CLAUDE_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              id="ai-model"
              value={openaiModel}
              onChange={(e) => setOpenaiModel(e.target.value as OpenAIModel)}
              disabled={isLoading}
              className="provider-select"
            >
              {OPENAI_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="flex items-center gap-2">
              <div className="spinner"></div>
              <span>Generating Unity script...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your Unity script..."
          className="chat-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn btn-primary"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}
