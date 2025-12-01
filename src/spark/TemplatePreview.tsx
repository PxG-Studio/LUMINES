/**
 * Template Preview Component
 * 
 * Shows template information and preview
 */

import React from 'react';

export interface Template {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
  nodeCount?: number;
  connectionCount?: number;
}

export interface TemplatePreviewProps {
  template?: Template;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template = {
    id: 'card_turn_core',
    name: 'Card Turn Core',
    description: 'Complete turn-based card game template',
    category: 'Game Templates',
    difficulty: 'intermediate',
    tags: ['card-game', 'turn-based'],
    nodeCount: 24,
    connectionCount: 18
  }
}) => (
  <div style={{
    padding: 16,
    background: 'var(--slate-panel, #16181d)',
    borderRadius: 8
  }}>
    <div style={{
      color: 'var(--slate-accent, #3f8cff)',
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8
    }}>
      {template.name}
    </div>
    {template.description && (
      <div style={{
        color: 'var(--slate-text-muted, #9ba1aa)',
        marginBottom: 16,
        fontSize: 14
      }}>
        {template.description}
      </div>
    )}
    {template.tags && template.tags.length > 0 && (
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        {template.tags.map(tag => (
          <span key={tag} style={{
            padding: '4px 8px',
            background: 'var(--slate-bg, #0f1115)',
            borderRadius: 4,
            fontSize: 11,
            color: 'var(--slate-text, #e4e7eb)'
          }}>
            {tag}
          </span>
        ))}
      </div>
    )}
    {(template.nodeCount !== undefined || template.connectionCount !== undefined) && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        fontSize: 12,
        color: 'var(--slate-text-muted, #9ba1aa)'
      }}>
        {template.nodeCount !== undefined && <div>Nodes: {template.nodeCount}</div>}
        {template.connectionCount !== undefined && <div>Connections: {template.connectionCount}</div>}
        {template.category && <div>Category: {template.category}</div>}
        {template.difficulty && <div>Difficulty: {template.difficulty}</div>}
      </div>
    )}
  </div>
);

export default TemplatePreview;

