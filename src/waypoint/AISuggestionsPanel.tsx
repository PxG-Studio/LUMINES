/**
 * AI Suggestions Panel Component
 * 
 * Shows AI-generated suggestions for blueprint improvements
 */

import React from 'react';

export interface AISuggestionsPanelProps {
  suggestions?: string[];
  loading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  suggestions = [],
  loading = false,
  onSuggestionClick,
}) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'var(--slate-panel, #16181d)',
    padding: 16,
    overflow: 'auto'
  }}>
    <div style={{
      color: 'var(--slate-accent, #3f8cff)',
      fontWeight: 'bold',
      marginBottom: 12,
      fontSize: 14
    }}>
      🤖 LUNA Suggestions
    </div>
    {loading ? (
      <div style={{ color: 'var(--slate-text-muted, #9ba1aa)' }}>
        Generating suggestions...
      </div>
    ) : suggestions.length === 0 ? (
      <div style={{ color: 'var(--slate-text-muted, #9ba1aa)' }}>
        No suggestions available
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            onClick={() => onSuggestionClick?.(suggestion)}
            style={{
              padding: 12,
              background: 'var(--slate-bg, #0f1115)',
              borderRadius: 4,
              border: '1px solid var(--slate-border, #26292f)',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AISuggestionsPanel;

