"use client";

import { useState, useEffect } from "react";
import { AIProvider } from "../actions/generate";
import { ClaudeModel, OpenAIModel } from "../actions/generate";

interface UserPreferencesProps {
  onPreferencesChange: (preferences: PreferencesState) => void;
}

export interface PreferencesState {
  provider: AIProvider;
  claudeModel: ClaudeModel;
  openaiModel: OpenAIModel;
  autoSave: boolean;
  theme: "light" | "dark";
}

const DEFAULT_PREFERENCES: PreferencesState = {
  provider: "claude",
  claudeModel: "claude-sonnet-3-5-20241022",
  openaiModel: "gpt-4",
  autoSave: true,
  theme: "dark",
};

export default function UserPreferences({ onPreferencesChange }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<PreferencesState>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('spark_user_preferences');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        onPreferencesChange({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, [onPreferencesChange]);

  const savePreferences = (newPreferences: PreferencesState) => {
    setPreferences(newPreferences);
    localStorage.setItem('spark_user_preferences', JSON.stringify(newPreferences));
    onPreferencesChange(newPreferences);
  };

  const handleProviderChange = (provider: AIProvider) => {
    const newPreferences = { ...preferences, provider };
    savePreferences(newPreferences);
  };

  const handleClaudeModelChange = (claudeModel: ClaudeModel) => {
    const newPreferences = { ...preferences, claudeModel };
    savePreferences(newPreferences);
  };

  const handleOpenAIModelChange = (openaiModel: OpenAIModel) => {
    const newPreferences = { ...preferences, openaiModel };
    savePreferences(newPreferences);
  };

  const handleAutoSaveChange = (autoSave: boolean) => {
    const newPreferences = { ...preferences, autoSave };
    savePreferences(newPreferences);
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    const newPreferences = { ...preferences, theme };
    savePreferences(newPreferences);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="preferences-toggle"
        aria-label="Open preferences"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M17.5 10C17.5 10.75 17.45 11.48 17.36 12.18L15.18 13.05L14.05 15.18L12.18 17.36C11.48 17.45 10.75 17.5 10 17.5C9.25 17.5 8.52 17.45 7.82 17.36L5.95 15.18L4.82 13.05L2.64 12.18C2.55 11.48 2.5 10.75 2.5 10C2.5 9.25 2.55 8.52 2.64 7.82L4.82 6.95L5.95 4.82L7.82 2.64C8.52 2.55 9.25 2.5 10 2.5C10.75 2.5 11.48 2.55 12.18 2.64L14.05 4.82L15.18 6.95L17.36 7.82C17.45 8.52 17.5 9.25 17.5 10Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="preferences-modal">
          <div className="preferences-backdrop" onClick={() => setIsOpen(false)} />
          <div className="preferences-panel">
            <div className="preferences-header">
              <h2 className="preferences-title">User Preferences</h2>
              <button onClick={() => setIsOpen(false)} className="preferences-close">
                ×
              </button>
            </div>

            <div className="preferences-content">
              <div className="preference-group">
                <label className="preference-label">AI Provider</label>
                <select
                  value={preferences.provider}
                  onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                  className="preference-select"
                >
                  <option value="claude">Claude (Anthropic)</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>

              {preferences.provider === "claude" && (
                <div className="preference-group">
                  <label className="preference-label">Claude Model</label>
                  <select
                    value={preferences.claudeModel}
                    onChange={(e) => handleClaudeModelChange(e.target.value as ClaudeModel)}
                    className="preference-select"
                  >
                    <option value="claude-sonnet-3-5-20241022">Claude 3.5 Sonnet (Latest)</option>
                    <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (June)</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fast)</option>
                  </select>
                </div>
              )}

              {preferences.provider === "openai" && (
                <div className="preference-group">
                  <label className="preference-label">OpenAI Model</label>
                  <select
                    value={preferences.openaiModel}
                    onChange={(e) => handleOpenAIModelChange(e.target.value as OpenAIModel)}
                    className="preference-select"
                  >
                    <option value="gpt-4">GPT-4 (Best)</option>
                    <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
                  </select>
                </div>
              )}

              <div className="preference-group">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => handleAutoSaveChange(e.target.checked)}
                    className="preference-checkbox"
                  />
                  Auto-save generation history
                </label>
              </div>

              <div className="preference-group">
                <label className="preference-label">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handleThemeChange(e.target.value as "light" | "dark")}
                  className="preference-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
