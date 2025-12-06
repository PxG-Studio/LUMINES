/**
 * Link Card Component for Cross-Subsystem Navigation
 * 
 * Creates clickable cards that link to other Storybook documentation pages
 */

import React from 'react';

interface LinkCardProps {
  title: string;
  href: string;
  description: string;
  icon?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({ 
  title, 
  href, 
  description, 
  icon 
}) => {
  return (
    <a 
      href={href}
      style={{
        display: 'block',
        padding: '16px',
        border: '1px solid var(--slate-border)',
        borderRadius: 8,
        textDecoration: 'none',
        color: 'var(--slate-text)',
        marginBottom: 12,
        transition: 'all 0.2s',
        background: 'var(--slate-panel)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--slate-accent)';
        e.currentTarget.style.background = 'var(--slate-bg)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--slate-border)';
        e.currentTarget.style.background = 'var(--slate-panel)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <h3 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h3>
      <p style={{ 
        margin: 0, 
        color: 'var(--slate-text-muted)', 
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </a>
  );
};

