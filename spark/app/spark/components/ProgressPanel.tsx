"use client";

import { TaskStatus, FileChange, TokenUsage } from "@/lib/types/progress";
import { useState } from "react";

interface ProgressPanelProps {
  currentTask: TaskStatus | null;
  tasks: TaskStatus[];
  fileChanges: FileChange[];
  tokenUsage: TokenUsage;
  isVisible: boolean;
}

export default function ProgressPanel({
  currentTask,
  tasks,
  fileChanges,
  tokenUsage,
  isVisible,
}: ProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTaskIcon = (status: TaskStatus['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="task-icon completed" title="Completed">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        );
      case 'in-progress':
        return (
          <span className="task-icon in-progress" title="In Progress">
            <div className="spinner-small"></div>
          </span>
        );
      case 'failed':
        return (
          <span className="task-icon failed" title="Failed">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
        );
      default:
        return (
          <span className="task-icon pending" title="Pending">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </span>
        );
    }
  };

  const getFileChangeIcon = (type: FileChange['type']) => {
    switch (type) {
      case 'created':
        return <span className="file-icon created">+</span>;
      case 'modified':
        return <span className="file-icon modified">~</span>;
      case 'deleted':
        return <span className="file-icon deleted">-</span>;
    }
  };

  const formatTokenCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!isVisible && tasks.length === 0) {
    return null;
  }

  return (
    <div className={`progress-panel ${isVisible ? 'visible' : 'hidden'}`}>
      {tokenUsage && tokenUsage.limit > 0 && (
        <div className="token-banner">
          <div className="token-content">
            <span className="token-text">
              {formatTokenCount(tokenUsage.remaining)} monthly tokens remaining
            </span>
            {tokenUsage.remaining < tokenUsage.limit * 0.1 && (
              <button className="token-upgrade">
                Switch to Pro 200 for 2x more usage
              </button>
            )}
          </div>
          <button
            className="token-close"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle progress panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="progress-content">
          {currentTask && (
            <div className="current-task">
              <div className="current-task-header">
                {getTaskIcon(currentTask.status)}
                <span className="current-task-title">{currentTask.label}</span>
                {currentTask.duration && (
                  <span className="task-duration">
                    {currentTask.duration < 1000
                      ? `${currentTask.duration}ms`
                      : `${(currentTask.duration / 1000).toFixed(1)}s`
                    }
                  </span>
                )}
              </div>
              {currentTask.subTasks && currentTask.subTasks.length > 0 && (
                <div className="subtasks">
                  {currentTask.subTasks.map((subTask) => (
                    <div key={subTask.id} className="subtask">
                      {getTaskIcon(subTask.status)}
                      <span>{subTask.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="task-list">
              <div className="task-list-header">Plan</div>
              {tasks.map((task) => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  {getTaskIcon(task.status)}
                  <span className={task.status === 'completed' ? 'task-completed' : ''}>
                    {task.label}
                  </span>
                  {task.duration && task.status === 'completed' && (
                    <span className="task-duration-small">
                      {task.duration < 1000
                        ? `${task.duration}ms`
                        : `${(task.duration / 1000).toFixed(1)}s`
                      }
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {fileChanges.length > 0 && (
            <div className="file-changes">
              <div className="file-changes-summary">
                <div className="file-summary-item">
                  Files created: <strong>{fileChanges.filter(f => f.type === 'created').length}</strong> new files
                </div>
                <div className="file-summary-item">
                  Files modified: <strong>{fileChanges.filter(f => f.type === 'modified').length}</strong> file
                </div>
                <div className="file-summary-item">
                  Dependencies added: <strong>{fileChanges.filter(f => f.path.includes('package.json') || f.path.includes('node_modules')).length}</strong>
                </div>
              </div>
              <div className="file-list">
                {fileChanges.map((change, index) => (
                  <div key={index} className="file-item">
                    {getFileChangeIcon(change.type)}
                    <span className="file-path">{change.path}</span>
                    {change.description && (
                      <span className="file-description">{change.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length > 0 && tasks.every(t => t.status === 'completed' || t.status === 'failed') && (
            <div className="completion-message">
              {tasks.some(t => t.status === 'failed')
                ? "Some tasks failed. Check the error messages above."
                : "Generation complete. Your Unity script is ready to use."
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
