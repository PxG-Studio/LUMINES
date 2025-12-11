'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Code,
  GitBranch,
  Play,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Navigation } from '@/components/wissil/Navigation';

type GenerationStatus =
  | 'idle'
  | 'analyzing'
  | 'routing'
  | 'generating'
  | 'complete';

type ExpertKey = 'design' | 'logic' | 'performance';

interface ExpertState {
  status: GenerationStatus;
  progress: number;
}

const UNITY_PRESETS: { id: string; label: string; prompt: string }[] = [
  {
    id: 'player-controller-3d',
    label: '3D Player Controller',
    prompt:
      'A Unity C# PlayerController script for a 3D game using Rigidbody. Supports WASD movement, adjustable speed in the Inspector, and smooth physics-friendly movement.',
  },
  {
    id: 'topdown-2d',
    label: 'Top-down 2D Controller',
    prompt:
      'A Unity C# script for a top-down 2D character controller using Rigidbody2D. Uses WASD input, exposes moveSpeed, and works with the new Input System or legacy Input.',
  },
  {
    id: 'enemy-spawner',
    label: 'Wave Enemy Spawner',
    prompt:
      'A Unity C# WaveSpawner script that spawns enemy prefabs in waves with configurable count, delay between enemies, and time between waves, using coroutines.',
  },
  {
    id: 'scriptable-stats',
    label: 'ScriptableObject Stats',
    prompt:
      'A Unity C# ScriptableObject called CharacterStats with health, damage, movementSpeed, and a custom editor that shows the fields nicely grouped.',
  },
];

function getUnityExampleCode(prompt: string): string {
  // Simple mapping so the page feels concrete without requiring a backend.
  if (prompt.toLowerCase().includes('scriptableobject') || prompt.toLowerCase().includes('stats')) {
    return `using UnityEngine;

[CreateAssetMenu(fileName = "NewCharacterStats", menuName = "Game/Character Stats")]
public class CharacterStats : ScriptableObject
{
    [Header("Core Stats")]
    [Range(1, 500)]
    public int maxHealth = 100;

    [Range(1, 100)]
    public int baseDamage = 10;

    [Header("Movement")]
    [Range(0.5f, 20f)]
    public float moveSpeed = 5f;

    [Header("Meta")]
    public string displayName;
    [TextArea]
    public string description;
}`;
  }

  if (prompt.toLowerCase().includes('spawner') || prompt.toLowerCase().includes('wave')) {
    return `using System.Collections;
using UnityEngine;

public class WaveSpawner : MonoBehaviour
{
    [Header("Spawning")]
    public GameObject enemyPrefab;
    public Transform[] spawnPoints;

    [Header("Waves")]
    public int enemiesPerWave = 5;
    public float timeBetweenEnemies = 0.5f;
    public float timeBetweenWaves = 5f;

    private int _currentWave;
    private bool _isSpawning;

    private void Start()
    {
        StartCoroutine(SpawnLoop());
    }

    private IEnumerator SpawnLoop()
    {
        yield return new WaitForSeconds(1f);

        while (true)
        {
            _currentWave++;
            _isSpawning = true;

            for (int i = 0; i < enemiesPerWave; i++)
            {
                SpawnEnemy();
                yield return new WaitForSeconds(timeBetweenEnemies);
            }

            _isSpawning = false;
            yield return new WaitForSeconds(timeBetweenWaves);
        }
    }

    private void SpawnEnemy()
    {
        if (enemyPrefab == null || spawnPoints.Length == 0)
            return;

        var point = spawnPoints[Random.Range(0, spawnPoints.Length)];
        Instantiate(enemyPrefab, point.position, point.rotation);
    }
}`;
  }

  if (prompt.toLowerCase().includes('2d')) {
    return `using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class TopDownController2D : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5f;

    private Rigidbody2D _rb;
    private Vector2 _input;

    private void Awake()
    {
        _rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        _input.x = Input.GetAxisRaw("Horizontal");
        _input.y = Input.GetAxisRaw("Vertical");
        _input = _input.normalized;
    }

    private void FixedUpdate()
    {
        _rb.velocity = _input * moveSpeed;
    }
}`;
  }

  // Default example – 3D controller
  return `using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5f;

    private Rigidbody _rb;
    private Vector3 _input;

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();
    }

    private void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        _input = new Vector3(horizontal, 0f, vertical).normalized;
    }

    private void FixedUpdate()
    {
        Vector3 velocity = _input * moveSpeed;
        _rb.velocity = new Vector3(velocity.x, _rb.velocity.y, velocity.z);
    }
}`;
}

export default function SparkGeneratorPage() {
  const [prompt, setPrompt] = useState(
    'A Unity C# PlayerController script for a 3D game using Rigidbody. Supports WASD movement and exposes speed in the Inspector.',
  );
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [experts, setExperts] = useState<Record<ExpertKey, ExpertState>>({
    design: { status: 'idle', progress: 0 },
    logic: { status: 'idle', progress: 0 },
    performance: { status: 'idle', progress: 0 },
  });
  const [code, setCode] = useState<string>(() => getUnityExampleCode('player controller'));
  const [isGenerating, setIsGenerating] = useState(false);

  const unityHowTo = useMemo(
    () => [
      'Create a new C# script in your Unity project (e.g. PlayerController.cs).',
      'Paste the generated code into that script.',
      'Attach the script to a GameObject in your scene (e.g. the Player).',
      'Set the public fields (like moveSpeed or enemyPrefab) in the Inspector.',
      'Press Play and iterate — tweak the prompt and regenerate as needed.',
    ],
    [],
  );

  function resetExperts() {
    setExperts({
      design: { status: 'analyzing', progress: 10 },
      logic: { status: 'routing', progress: 0 },
      performance: { status: 'idle', progress: 0 },
    });
  }

  function fakeGenerate() {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatus('analyzing');
    resetExperts();

    // Very lightweight fake progress sequence so the UI feels alive.
    setTimeout(() => {
      setStatus('routing');
      setExperts((prev) => ({
        ...prev,
        design: { status: 'routing', progress: 40 },
        logic: { status: 'generating', progress: 20 },
      }));
    }, 350);

    setTimeout(() => {
      setStatus('generating');
      setExperts((prev) => ({
        design: { status: 'generating', progress: 70 },
        logic: { status: 'generating', progress: 65 },
        performance: { status: 'generating', progress: 30 },
      }));
      setCode(getUnityExampleCode(prompt));
    }, 900);

    setTimeout(() => {
      setStatus('complete');
      setExperts({
        design: { status: 'complete', progress: 100 },
        logic: { status: 'complete', progress: 100 },
        performance: { status: 'complete', progress: 100 },
      });
      setIsGenerating(false);
    }, 1600);
  }

  function renderExpertCard(key: ExpertKey, title: string, description: string, icon: React.ReactNode) {
    const state = experts[key];

    const statusLabel =
      state.status === 'idle'
        ? 'Idle'
        : state.status === 'analyzing'
        ? 'Analyzing prompt'
        : state.status === 'routing'
        ? 'Routing experts'
        : state.status === 'generating'
        ? 'Generating'
        : 'Complete';

    return (
      <div className="spark-glass-card border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spark-primary to-spark-secondary flex items-center justify-center shadow-spark-glow">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="text-xs text-text-secondary">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              state.status === 'complete'
                ? 'bg-green-400'
                : state.status === 'idle'
                ? 'bg-white/20'
                : 'bg-spark-primary animate-pulse'
            }`}
          />
          <span className="text-text-tertiary">{statusLabel}</span>
          <span className="ml-auto text-text-secondary">{state.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-spark-primary to-spark-secondary transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background + Navigation shared with rest of WISSIL */}
      <Navigation />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-spark-primary rounded-full blur-3xl opacity-25" />
        <div className="absolute bottom-[-120px] left-[-40px] w-[420px] h-[420px] bg-spark-accent rounded-full blur-3xl opacity-20" />
      </div>

      <main className="relative z-10 pt-20 pb-24 container mx-auto px-4">
        {/* Hero strip */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-spark-primary/30 mb-4">
            <Sparkles className="w-4 h-4 text-spark-primary" />
            <span className="text-xs font-medium text-text-secondary">
              SPARK · Unity C# Asset Generator
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
            Generate Unity C# assets from plain English
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl">
            Describe the asset you want – movement controllers, ScriptableObjects, spawners,
            editor tools – and SPARK turns it into production-ready C# you can drop straight
            into your project.
          </p>
        </section>

        {/* Two-column generator layout */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 items-start">
          {/* Left: Prompt + presets */}
          <div className="glass-container rounded-2xl border border-white/10 p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-text-primary">
                  Describe your Unity asset
                </p>
                <span className="text-[11px] uppercase tracking-wide text-text-tertiary">
                  Natural language → C#
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full rounded-xl bg-background-secondary border border-border-primary text-sm sm:text-[15px] text-text-primary placeholder-text-tertiary px-3.5 py-3.5 resize-none focus:outline-none focus:border-spark-primary focus:ring-1 focus:ring-spark-primary/60"
                placeholder='e.g. "A 3D first-person controller with mouse look and sprint"'
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">
                Quick Unity presets
              </p>
              <div className="flex flex-wrap gap-2">
                {UNITY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="text-xs sm:text-[13px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border-primary mt-2">
              <button
                type="button"
                onClick={fakeGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-to-r from-spark-primary to-spark-secondary text-background-primary text-sm font-semibold shadow-spark-glow hover:shadow-spark-glow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-transform transition-shadow"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background-primary/40 border-t-background-primary rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Generate Unity Asset
                  </>
                )}
              </button>
              <span className="text-xs text-text-tertiary">
                No setup required — copy the script into your Unity project.
              </span>
            </div>
          </div>

          {/* Right: Experts + code output */}
          <div className="flex flex-col gap-4">
            {/* Experts row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {renderExpertCard(
                'design',
                'Design Expert',
                'Shapes API surface & Inspector experience.',
                <Brain className="w-5 h-5 text-background-primary" />,
              )}
              {renderExpertCard(
                'logic',
                'Logic Expert',
                'Implements behaviour and state safely.',
                <Code className="w-5 h-5 text-background-primary" />,
              )}
              {renderExpertCard(
                'performance',
                'Performance Expert',
                'Keeps allocations & updates efficient.',
                <Zap className="w-5 h-5 text-background-primary" />,
              )}
            </div>

            {/* Code output */}
            <div className="glass-container rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-background-secondary border-b border-border-primary">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-text-secondary">
                    PlayerController.cs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(code);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 text-[11px] text-text-secondary hover:bg-white/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Copy C#
                </button>
              </div>
              <div className="bg-background-primary p-4 max-h-[340px] overflow-auto">
                <pre className="text-[11px] sm:text-xs md:text-[13px] font-mono text-text-primary leading-relaxed">
                  {code}
                </pre>
              </div>
            </div>

            {/* Unity usage strip */}
            <div className="glass-container rounded-2xl border border-spark-primary/30 bg-gradient-to-br from-spark-primary/10 to-spark-secondary/10 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-spark-primary" />
                <p className="text-sm font-semibold text-text-primary">
                  How to use this in Unity
                </p>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-[13px] text-text-secondary">
                {unityHowTo.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
              <p className="mt-3 text-[11px] text-text-tertiary">
                Tip: keep this tab open next to the Unity Editor — iterate on the prompt, regenerate,
                and paste changes as you refine your gameplay.
              </p>
            </div>

            {/* Docs link */}
            <div className="flex items-center justify-between gap-3 text-xs text-text-tertiary mt-1">
              <span>
                Want to see how SPARK works under the hood? Check the Spark docs in Storybook.
              </span>
              <Link
                href="/spark#demo"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-text-secondary border border-white/10"
              >
                <GitBranch className="w-3.5 h-3.5" />
                View examples
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


