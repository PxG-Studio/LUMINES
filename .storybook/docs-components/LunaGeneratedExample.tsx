/**
 * LUNA AI-Generated Documentation Component
 * 
 * Integrates LUNA AI for auto-generating documentation content
 */

import React, { useState } from 'react';

interface LunaGeneratedExampleProps {
  prompt: string;
  initialContent?: string;
  apiEndpoint?: string;
}

export const LunaGeneratedExample: React.FC<LunaGeneratedExampleProps> = ({ 
  prompt, 
  initialContent = "<p>Click 'Generate with LUNA' to create an explanation.</p>",
  apiEndpoint = "/api/luna/generate-doc"
}) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      setContent(data.content || data.text || '<p>Content generated successfully.</p>');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setContent('<p>Error generating content. Please try again.</p>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: "1px solid var(--slate-border)", 
      borderRadius: 8,
      padding: "16px",
      background: "var(--slate-panel)",
      margin: "16px 0"
    }}>
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button 
          onClick={generate}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: loading ? "var(--slate-border)" : "var(--slate-accent)",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: 500
          }}
        >
          {loading ? "Generating..." : "🤖 Generate with LUNA"}
        </button>
        {error && (
          <span style={{ color: "var(--slate-text-muted)", fontSize: "12px" }}>
            {error}
          </span>
        )}
      </div>
      <div 
        style={{
          padding: "12px",
          background: "var(--slate-bg)",
          borderRadius: 4,
          border: "1px solid var(--slate-border)"
        }}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

