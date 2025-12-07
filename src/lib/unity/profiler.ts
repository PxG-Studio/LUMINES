import { subscribe } from '../messaging/client';
import type { UnityProfilerFrame, UnityProfilerCPU, UnityProfilerGPU, UnityProfilerMemory } from './types';

export interface ProfilerRecording {
  id: string;
  projectId: string;
  startTime: number;
  endTime?: number;
  frames: UnityProfilerFrame[];
  metadata: Record<string, any>;
}

export async function startProfilerRecording(projectId: string): Promise<string> {
  const recordingId = crypto.randomUUID();

  return recordingId;
}

export async function stopProfilerRecording(recordingId: string): Promise<void> {
}

export async function subscribeToProfilerData(
  projectId: string,
  callback: (frame: UnityProfilerFrame) => void
): Promise<() => void> {
  const unsubscribe = await subscribe(
    `slate.unity.profiler.${projectId}`,
    (msg: any) => {
      if (msg.data && msg.data.frame) {
        callback(msg.data.frame);
      }
    }
  );

  return unsubscribe;
}

export function calculateAverageFrameTime(frames: UnityProfilerFrame[]): number {
  if (frames.length === 0) return 0;

  const totalTime = frames.reduce((sum, frame) => sum + frame.cpu.totalTime, 0);
  return totalTime / frames.length;
}

export function calculateAverageFPS(frames: UnityProfilerFrame[]): number {
  const avgFrameTime = calculateAverageFrameTime(frames);
  return avgFrameTime > 0 ? 1000 / avgFrameTime : 0;
}

export function findBottlenecks(frames: UnityProfilerFrame[]): Array<{
  category: string;
  averageTime: number;
  percentage: number;
}> {
  if (frames.length === 0) return [];

  const categories = {
    rendering: frames.reduce((sum, f) => sum + f.cpu.renderTime, 0) / frames.length,
    scripts: frames.reduce((sum, f) => sum + f.cpu.scriptsTime, 0) / frames.length,
    physics: frames.reduce((sum, f) => sum + f.cpu.physicsTime, 0) / frames.length,
    animation: frames.reduce((sum, f) => sum + f.cpu.animationTime, 0) / frames.length,
    garbageCollection: frames.reduce((sum, f) => sum + f.cpu.garbageCollectionTime, 0) / frames.length,
  };

  const totalTime = Object.values(categories).reduce((sum, time) => sum + time, 0);

  return Object.entries(categories)
    .map(([category, averageTime]) => ({
      category,
      averageTime,
      percentage: totalTime > 0 ? (averageTime / totalTime) * 100 : 0,
    }))
    .sort((a, b) => b.averageTime - a.averageTime);
}

export function analyzeCPUUsage(frames: UnityProfilerFrame[]): {
  mainThread: number;
  renderThread: number;
  ratio: number;
} {
  if (frames.length === 0) {
    return { mainThread: 0, renderThread: 0, ratio: 0 };
  }

  const mainThread = frames.reduce((sum, f) => sum + f.cpu.mainThreadTime, 0) / frames.length;
  const renderThread = frames.reduce((sum, f) => sum + f.cpu.renderThreadTime, 0) / frames.length;

  return {
    mainThread,
    renderThread,
    ratio: renderThread > 0 ? mainThread / renderThread : 0,
  };
}

export function analyzeGPUUsage(frames: UnityProfilerFrame[]): {
  averageTime: number;
  averageDrawCalls: number;
  averageTriangles: number;
  averageBatches: number;
} {
  if (frames.length === 0) {
    return {
      averageTime: 0,
      averageDrawCalls: 0,
      averageTriangles: 0,
      averageBatches: 0,
    };
  }

  return {
    averageTime: frames.reduce((sum, f) => sum + f.gpu.totalTime, 0) / frames.length,
    averageDrawCalls: frames.reduce((sum, f) => sum + f.gpu.drawCalls, 0) / frames.length,
    averageTriangles: frames.reduce((sum, f) => sum + f.gpu.triangles, 0) / frames.length,
    averageBatches: frames.reduce((sum, f) => sum + f.gpu.batchesRendered, 0) / frames.length,
  };
}

export function analyzeMemoryUsage(frames: UnityProfilerFrame[]): {
  averageTotal: number;
  averageGC: number;
  averageTexture: number;
  averageMesh: number;
  peakTotal: number;
} {
  if (frames.length === 0) {
    return {
      averageTotal: 0,
      averageGC: 0,
      averageTexture: 0,
      averageMesh: 0,
      peakTotal: 0,
    };
  }

  return {
    averageTotal: frames.reduce((sum, f) => sum + f.memory.totalAllocated, 0) / frames.length,
    averageGC: frames.reduce((sum, f) => sum + f.memory.gcAllocated, 0) / frames.length,
    averageTexture: frames.reduce((sum, f) => sum + f.memory.textureMemory, 0) / frames.length,
    averageMesh: frames.reduce((sum, f) => sum + f.memory.meshMemory, 0) / frames.length,
    peakTotal: Math.max(...frames.map((f) => f.memory.totalAllocated)),
  };
}

export function detectMemoryLeaks(frames: UnityProfilerFrame[]): boolean {
  if (frames.length < 100) return false;

  const windowSize = 50;
  const windows = Math.floor(frames.length / windowSize);

  const averages: number[] = [];
  for (let i = 0; i < windows; i++) {
    const start = i * windowSize;
    const end = start + windowSize;
    const windowFrames = frames.slice(start, end);
    const avg = windowFrames.reduce((sum, f) => sum + f.memory.totalAllocated, 0) / windowSize;
    averages.push(avg);
  }

  let increasing = 0;
  for (let i = 1; i < averages.length; i++) {
    if (averages[i] > averages[i - 1] * 1.05) {
      increasing++;
    }
  }

  return increasing / (averages.length - 1) > 0.8;
}

export function analyzeRenderingPerformance(frames: UnityProfilerFrame[]): {
  batchingEfficiency: number;
  overdrawScore: number;
  cullingEfficiency: number;
} {
  if (frames.length === 0) {
    return {
      batchingEfficiency: 0,
      overdrawScore: 0,
      cullingEfficiency: 0,
    };
  }

  const avgBatches = frames.reduce((sum, f) => sum + f.rendering.batches, 0) / frames.length;
  const avgDrawCalls = frames.reduce((sum, f) => sum + f.rendering.drawCalls, 0) / frames.length;
  const batchingEfficiency = avgDrawCalls > 0 ? (1 - avgBatches / avgDrawCalls) * 100 : 0;

  const avgVisible = frames.reduce((sum, f) => sum + f.rendering.visibleRenderers, 0) / frames.length;
  const avgCulled = avgVisible * 0.3;
  const cullingEfficiency = avgVisible > 0 ? (avgCulled / (avgVisible + avgCulled)) * 100 : 0;

  const avgSetPass = frames.reduce((sum, f) => sum + f.gpu.setPassCalls, 0) / frames.length;
  const overdrawScore = Math.max(0, 100 - avgSetPass);

  return {
    batchingEfficiency: Math.min(100, batchingEfficiency),
    overdrawScore: Math.min(100, overdrawScore),
    cullingEfficiency: Math.min(100, cullingEfficiency),
  };
}

export function generatePerformanceReport(frames: UnityProfilerFrame[]): {
  summary: string;
  fps: number;
  bottlenecks: Array<{ category: string; percentage: number }>;
  recommendations: string[];
} {
  const fps = calculateAverageFPS(frames);
  const bottlenecks = findBottlenecks(frames);
  const recommendations: string[] = [];

  if (fps < 30) {
    recommendations.push('Frame rate is below 30 FPS. Consider optimizing performance.');
  }

  const topBottleneck = bottlenecks[0];
  if (topBottleneck) {
    if (topBottleneck.category === 'rendering' && topBottleneck.percentage > 40) {
      recommendations.push('Rendering is the main bottleneck. Optimize draw calls and batching.');
    }
    if (topBottleneck.category === 'scripts' && topBottleneck.percentage > 40) {
      recommendations.push('Script execution is the main bottleneck. Profile and optimize hot paths.');
    }
    if (topBottleneck.category === 'physics' && topBottleneck.percentage > 30) {
      recommendations.push('Physics simulation is heavy. Reduce active rigidbodies or optimize collision detection.');
    }
    if (topBottleneck.category === 'garbageCollection' && topBottleneck.percentage > 10) {
      recommendations.push('Excessive garbage collection detected. Reduce memory allocations in hot paths.');
    }
  }

  const memoryAnalysis = analyzeMemoryUsage(frames);
  if (memoryAnalysis.peakTotal > 2048 * 1024 * 1024) {
    recommendations.push('Memory usage is high. Consider reducing texture sizes or mesh complexity.');
  }

  if (detectMemoryLeaks(frames)) {
    recommendations.push('Potential memory leak detected. Review object lifecycles and disposal.');
  }

  const renderingAnalysis = analyzeRenderingPerformance(frames);
  if (renderingAnalysis.batchingEfficiency < 50) {
    recommendations.push('Low batching efficiency. Enable static/dynamic batching or GPU instancing.');
  }

  return {
    summary: `Average FPS: ${fps.toFixed(1)} | Frame Time: ${(1000 / fps).toFixed(2)}ms`,
    fps,
    bottlenecks: bottlenecks.map((b) => ({
      category: b.category,
      percentage: b.percentage,
    })),
    recommendations,
  };
}

export function exportProfilerData(recording: ProfilerRecording): string {
  return JSON.stringify(recording, null, 2);
}

export function importProfilerData(json: string): ProfilerRecording | null {
  try {
    return JSON.parse(json) as ProfilerRecording;
  } catch (error) {
    console.error('Failed to import profiler data:', error);
    return null;
  }
}
