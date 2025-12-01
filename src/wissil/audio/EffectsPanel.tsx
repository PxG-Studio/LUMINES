/**
 * Effects System Panel
 * Reverb, LowPass, HighPass, Echo, Distortion
 */

'use client';

import React, { useState } from "react";
import { useAudioMixerStore } from "./AudioMixerStore";
import { AudioPatcher } from "./AudioPatcher";
import { AudioEffect } from "./AudioTypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";

export interface EffectsPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function EffectsPanel({ className, style }: EffectsPanelProps) {
  const theme = useTheme();
  const selected = useAudioMixerStore((state) => state.selected);
  const group = useAudioMixerStore((state) => (selected ? state.getGroup(selected) : undefined));
  const updateGroup = useAudioMixerStore((state) => state.updateGroup);

  const handleAddEffect = (type: AudioEffect["type"]) => {
    if (!group) return;

    const newEffect: AudioEffect = {
      type,
      enabled: true,
      parameters: {}
    };

    const effects = [...(group.effects || []), newEffect];
    updateGroup(group.id, { effects });
    AudioPatcher.addEffect(group.id, group.name, type);
  };

  const handleToggleEffect = (index: number, enabled: boolean) => {
    if (!group || !group.effects) return;

    const effects = [...group.effects];
    effects[index].enabled = enabled;
    updateGroup(group.id, { effects });
    AudioPatcher.toggleEffect(group.id, group.name, index, enabled);
  };

  const handleRemoveEffect = (index: number) => {
    if (!group || !group.effects) return;

    const effects = group.effects.filter((_, i) => i !== index);
    updateGroup(group.id, { effects });
    AudioPatcher.removeEffect(group.id, group.name, index);
  };

  const handleUpdateEffectParam = (index: number, param: string, value: number) => {
    if (!group || !group.effects) return;

    const effects = [...group.effects];
    effects[index].parameters = {
      ...effects[index].parameters,
      [param]: value
    };
    updateGroup(group.id, { effects });
    AudioPatcher.updateEffectParam(group.id, group.name, index, param, value);
  };

  if (!group) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          textAlign: "center",
          ...style
        }}
      >
        Select an audio group to add effects
      </div>
    );
  }

  const availableEffects: AudioEffect["type"][] = [
    "Reverb",
    "LowPass",
    "HighPass",
    "Echo",
    "Distortion",
    "Chorus",
    "Compressor"
  ];

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        padding: theme.spacing.md,
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Add Effects */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.sm
          }}
        >
          Add Effect
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing.xs
          }}
        >
          {availableEffects.map((effectType) => (
            <Button
              key={effectType}
              variant="ghost"
              onClick={() => handleAddEffect(effectType)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                fontSize: theme.typography.size.xs
              }}
            >
              + {effectType}
            </Button>
          ))}
        </div>
      </Card>

      {/* Current Effects */}
      {group.effects && group.effects.length > 0 && (
        <Card style={{ padding: theme.spacing.md }}>
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.sm
            }}
          >
            Effects ({group.effects.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
            {group.effects.map((effect, index) => (
              <Card
                key={index}
                style={{
                  padding: theme.spacing.md,
                  background: theme.colors.bg2,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: theme.spacing.sm
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.size.sm,
                      fontWeight: theme.typography.weight.medium,
                      color: theme.colors.text0
                    }}
                  >
                    {effect.type}
                  </div>
                  <div style={{ display: "flex", gap: theme.spacing.xs }}>
                    <input
                      type="checkbox"
                      checked={effect.enabled}
                      onChange={(e) => handleToggleEffect(index, e.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        cursor: "pointer"
                      }}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveEffect(index)}
                      style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Effect-specific parameters */}
                {renderEffectParameters(effect, index, handleUpdateEffectParam, theme)}
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function renderEffectParameters(
  effect: AudioEffect,
  index: number,
  onUpdate: (index: number, param: string, value: number) => void,
  theme: any
) {
  switch (effect.type) {
    case "Reverb":
      return (
        <div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <label
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1
              }}
            >
              Reverb Level
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={effect.parameters?.reverbLevel || 0}
              onChange={(e) => onUpdate(index, "reverbLevel", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                height: 4,
                marginTop: theme.spacing.xs
              }}
            />
          </div>
        </div>
      );

    case "LowPass":
      return (
        <div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <label
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1
              }}
            >
              Cutoff Frequency (Hz)
            </label>
            <input
              type="range"
              min={20}
              max={20000}
              step={10}
              value={effect.parameters?.cutoff || 20000}
              onChange={(e) => onUpdate(index, "cutoff", parseFloat(e.target.value) || 20000)}
              style={{
                width: "100%",
                height: 4,
                marginTop: theme.spacing.xs
              }}
            />
          </div>
        </div>
      );

    case "HighPass":
      return (
        <div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <label
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1
              }}
            >
              Cutoff Frequency (Hz)
            </label>
            <input
              type="range"
              min={20}
              max={20000}
              step={10}
              value={effect.parameters?.cutoff || 20}
              onChange={(e) => onUpdate(index, "cutoff", parseFloat(e.target.value) || 20)}
              style={{
                width: "100%",
                height: 4,
                marginTop: theme.spacing.xs
              }}
            />
          </div>
        </div>
      );

    case "Echo":
      return (
        <div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <label
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1
              }}
            >
              Delay (ms)
            </label>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={effect.parameters?.delay || 0}
              onChange={(e) => onUpdate(index, "delay", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                height: 4,
                marginTop: theme.spacing.xs
              }}
            />
          </div>
        </div>
      );

    case "Distortion":
      return (
        <div>
          <div style={{ marginBottom: theme.spacing.xs }}>
            <label
              style={{
                fontSize: theme.typography.size.xs,
                color: theme.colors.text1
              }}
            >
              Distortion Level
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={effect.parameters?.level || 0}
              onChange={(e) => onUpdate(index, "level", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                height: 4,
                marginTop: theme.spacing.xs
              }}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

