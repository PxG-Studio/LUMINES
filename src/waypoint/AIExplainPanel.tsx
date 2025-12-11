/**
 * AI Explain Panel Component
 * 
 * Shows AI explanations for code/nodes
 */

import React from 'react';

export interface AIExplainPanelProps {
  explanation?: string;
  code?: string;
}

export const AIExplainPanel: React.FC<AIExplainPanelProps> = ({
  explanation = 'No explanation available',
  code,
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
      🤖 LUNA Explanation
    </div>
    {code && (
      <pre style={{
        background: 'var(--slate-bg, #0f1115)',
        padding: 12,
        borderRadius: 4,
        marginBottom: 12,
        fontSize: 11,
        color: 'var(--slate-text, #e4e7eb)',
        overflow: 'auto'
      }}>
        {code}
      </pre>
    )}
    <div style={{
      color: 'var(--slate-text, #e4e7eb)',
      fontSize: 13,
      lineHeight: 1.6
    }}>
      {explanation}
    </div>
  </div>
);

export default AIExplainPanel;

