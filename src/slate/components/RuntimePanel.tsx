import React from 'react';
import { Play, RotateCcw, Square, Activity } from 'lucide-react';
import { Panel } from '../../design-system/components/Panel';
import { lumenForgeColors, transitions } from '../../design-system/tokens';

interface RuntimePanelProps {
  status?: string;
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

export const RuntimePanel: React.FC<RuntimePanelProps> = ({
  status = 'Ignition: idle',
  onRun,
  onRestart,
  onStop,
}) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
        padding: '1rem',
        gap: '1rem',
      }}
    >
      <div>
        <h3
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Runtime
        </h3>

        <Panel variant="glass" padding="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <Activity
              size={20}
              style={{
                color: status.includes('running')
                  ? lumenForgeColors.status.success
                  : lumenForgeColors.text.tertiary,
              }}
            />
            <div>
              <p
                style={{
                  color: lumenForgeColors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                Status
              </p>
              <p
                style={{
                  color: lumenForgeColors.text.secondary,
                  fontSize: '0.75rem',
                }}
              >
                {status}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <ControlButton
              icon={<Play size={16} />}
              label="Run"
              onClick={onRun}
              variant="primary"
            />
            <ControlButton
              icon={<RotateCcw size={16} />}
              label="Restart"
              onClick={onRestart}
            />
            <ControlButton
              icon={<Square size={16} />}
              label="Stop"
              onClick={onStop}
            />
          </div>
        </Panel>
      </div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          Preview
        </h4>
        <Panel
          variant="secondary"
          padding="none"
          style={{
            height: 'calc(100% - 2rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: lumenForgeColors.text.tertiary,
            }}
          >
            <Activity size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem' }}>Runtime output will appear here</p>
          </div>
        </Panel>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}> = ({ icon, label, onClick, variant = 'secondary' }) => (
  <button
    onClick={onClick}
    aria-label={label}
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      background:
        variant === 'primary'
          ? `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`
          : lumenForgeColors.background.tertiary,
      color: lumenForgeColors.text.primary,
      border:
        variant === 'primary'
          ? `1px solid ${lumenForgeColors.accent.primary}`
          : `1px solid ${lumenForgeColors.border.subtle}`,
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: 600,
      transition: transitions.normal,
    }}
    onMouseEnter={(e) => {
      if (variant === 'secondary') {
        e.currentTarget.style.borderColor = lumenForgeColors.accent.primary;
      }
    }}
    onMouseLeave={(e) => {
      if (variant === 'secondary') {
        e.currentTarget.style.borderColor = lumenForgeColors.border.subtle;
      }
    }}
  >
    {icon}
    {label}
  </button>
);
