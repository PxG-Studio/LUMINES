"use client";

import { useState, useEffect } from "react";

interface HistoryItem {
  id: string;
  prompt: string;
  scriptName: string;
  provider: string;
  model: string;
  timestamp: string;
  success: boolean;
}

interface GenerationHistoryProps {
  onSelectHistory: (code: string, scriptName: string) => void;
}

export default function GenerationHistory({ onSelectHistory }: GenerationHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem('spark_generation_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('spark_generation_history');
      setHistory([]);
    }
  };

  if (isLoading) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h2 className="history-title">Generation History</h2>
        </div>
        <div className="history-loading">Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h2 className="history-title">Generation History</h2>
        </div>
        <div className="history-empty">
          No generation history yet. Generate your first script to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">Generation History</h2>
        <button onClick={clearHistory} className="btn btn-secondary btn-sm">
          Clear All
        </button>
      </div>
      <div className="history-list">
        {history.map((item) => (
          <div
            key={item.id}
            className={`history-item ${item.success ? 'success' : 'error'}`}
            onClick={() => item.success && onSelectHistory('', item.scriptName)}
          >
            <div className="history-item-header">
              <span className="history-script-name">{item.scriptName}</span>
              <span className="history-provider">{item.provider}</span>
            </div>
            <div className="history-prompt">{item.prompt}</div>
            <div className="history-meta">
              <span className="history-model">{item.model}</span>
              <span className="history-timestamp">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
