/**
 * CardFront Game Loop Simulation Stories
 */

import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const CardFrontSimulation = () => {
  const [gameState, setGameState] = useState({
    turn: 1,
    playerScore: 0,
    opponentScore: 0,
    cardsPlayed: 0,
    phase: 'draw'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.phase === 'draw') {
          return { ...prev, phase: 'play', cardsPlayed: prev.cardsPlayed + 1 };
        } else if (prev.phase === 'play') {
          return { ...prev, phase: 'capture', playerScore: prev.playerScore + 1 };
        } else {
          return { ...prev, phase: 'draw', turn: prev.turn + 1 };
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      padding: 24,
      background: 'var(--slate-panel, #16181d)',
      border: '1px solid var(--slate-border, #26292f)',
      borderRadius: 8,
      fontFamily: 'system-ui'
    }}>
      <div style={{
        color: 'var(--slate-accent, #3f8cff)',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 16
      }}>
        🎮 CardFront Game Loop Simulation
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 16
      }}>
        <div>
          <div style={{ color: 'var(--slate-text-muted, #9ba1aa)', fontSize: 12, marginBottom: 4 }}>
            Turn
          </div>
          <div style={{ color: 'var(--slate-text, #e4e7eb)', fontSize: 24, fontWeight: 'bold' }}>
            {gameState.turn}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--slate-text-muted, #9ba1aa)', fontSize: 12, marginBottom: 4 }}>
            Phase
          </div>
          <div style={{ color: 'var(--slate-text, #e4e7eb)', fontSize: 18 }}>
            {gameState.phase}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--slate-text-muted, #9ba1aa)', fontSize: 12, marginBottom: 4 }}>
            Player Score
          </div>
          <div style={{ color: 'var(--slate-text, #e4e7eb)', fontSize: 24, fontWeight: 'bold' }}>
            {gameState.playerScore}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--slate-text-muted, #9ba1aa)', fontSize: 12, marginBottom: 4 }}>
            Cards Played
          </div>
          <div style={{ color: 'var(--slate-text, #e4e7eb)', fontSize: 24, fontWeight: 'bold' }}>
            {gameState.cardsPlayed}
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Simulation/CardFrontLoop',
  component: CardFrontSimulation,
  parameters: {
    layout: 'padded',
    chromatic: { disable: true }, // Disable for animated simulation
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardFrontSimulation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simulate: Story = {};

