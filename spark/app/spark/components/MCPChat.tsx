"use client";

import { useState, FormEvent, useEffect } from "react";
import { generateUnityScript, ClaudeModel, OpenAIModel } from "../actions/generate";
import { useProgress } from "@/lib/hooks/useProgress";
import ProgressPanel from "./ProgressPanel";
import { Message, TaskStatus, FileChange } from "@/lib/types/progress";

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
      id: "1",
      role: "assistant",
      timestamp: new Date(),
      content: "Hello! I'm SPARK, your Unity C# script generator. Describe what Unity script you'd like to create, and I'll generate it for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("claude");
  const [claudeModel, setClaudeModel] = useState<ClaudeModel>("claude-sonnet-3-5-20241022");
  const [openaiModel, setOpenaiModel] = useState<OpenAIModel>("gpt-4");

  const {
    currentTask,
    tasks,
    fileChanges,
    tokenUsage,
    metadata,
    addTask,
    completeTask,
    failTask,
    addFileChange,
    updateTokenUsage,
    reset,
  } = useProgress();

  useEffect(() => {
    if (metadata?.tokensUsed) {
      updateTokenUsage({
        used: tokenUsage.used + metadata.tokensUsed,
        remaining: Math.max(0, tokenUsage.remaining - metadata.tokensUsed),
        inputTokens: metadata.inputTokens,
        outputTokens: metadata.outputTokens,
        provider: metadata.provider,
      });
    }
  }, [metadata]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    reset();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        timestamp: new Date(),
        content: userMessage,
      },
    ]);

    const initialTasks: TaskStatus[] = [
      { id: "analyzing", label: "Analyzing request", status: "pending" },
      { id: "preferences", label: "Loading user preferences", status: "pending" },
      { id: "generating", label: `Generating code with ${provider === "claude" ? "Claude" : "OpenAI"}`, status: "pending" },
      { id: "validating", label: "Validating C# syntax", status: "pending" },
      { id: "logging", label: "Logging to database", status: "pending" },
    ];

    initialTasks.forEach(task => addTask(task));

    try {
      const simulateProgress = async () => {
        addTask({ ...initialTasks[0], status: "in-progress", startTime: new Date() });
        await new Promise(resolve => setTimeout(resolve, 300));
        completeTask(initialTasks[0].id);

        addTask({ ...initialTasks[1], status: "in-progress", startTime: new Date() });
        await new Promise(resolve => setTimeout(resolve, 200));
        completeTask(initialTasks[1].id);

        addTask({ ...initialTasks[2], status: "in-progress", startTime: new Date() });
      };

      simulateProgress();

      const result = await generateUnityScript(userMessage, {
        provider,
        claudeModel: provider === "claude" ? claudeModel : undefined,
        openaiModel: provider === "openai" ? openaiModel : undefined,
      });

      if (result.success) {
        completeTask(initialTasks[2].id);
        completeTask(initialTasks[3].id);
        completeTask(initialTasks[4].id);

        if (result.scriptName) {
          addFileChange({
            type: "created",
            path: `Assets/Scripts/${result.scriptName}.cs`,
            description: "Generated Unity C# script",
          });
          addFileChange({
            type: "created",
            path: `Assets/Scripts/${result.scriptName}.cs.meta`,
            description: "Unity meta file",
          });
        }
      } else {
        failTask(initialTasks[2].id, result.error);
      }

      if (result.success && result.code && result.scriptName) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            timestamp: new Date(),
            content: `✅ Generated ${result.scriptName}.cs successfully! Check the preview panel on the right.`,
          },
        ]);

        onCodeGenerated(result.code, result.scriptName);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "error",
            timestamp: new Date(),
            content: result.error || "Failed to generate script. Please try again.",
          },
        ]);
      }
    } catch (error) {
      failTask(initialTasks[2].id, error instanceof Error ? error.message : "Unknown error");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "error",
          timestamp: new Date(),
          content: "An unexpected error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasProgress = tasks.length > 0 || fileChanges.length > 0;

  return (
    <div className="chat-container">
      <ProgressPanel
        currentTask={currentTask}
        tasks={tasks}
        fileChanges={fileChanges}
        tokenUsage={tokenUsage}
        isVisible={hasProgress}
      />

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
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.role}`}>
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
          {isLoading ? (
            <span className="spinner-container">
              <span className="spinner"></span>
              <span>Generating...</span>
            </span>
          ) : (
            "Generate"
          )}
        </button>
      </form>
    </div>
  );
}
