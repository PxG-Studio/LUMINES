import { subscribe, publish } from '../lib/messaging/client';
import { NatsSubjects } from '../lib/messaging/subjects';
import { updateBuildJob, getBuildJob } from '../lib/database/operations/builds';
import { updateBuildProgress, completeBuild, failBuild } from '../lib/runtime/build';

export class BuildWorker {
  private subscriptions: Map<string, () => void> = new Map();
  private activeBuilds: Map<string, AbortController> = new Map();

  async start(): Promise<void> {
    console.log('Build Worker starting...');

    await this.subscribeToBuildJobs();

    console.log('Build Worker started successfully');
  }

  async stop(): Promise<void> {
    console.log('Build Worker stopping...');

    for (const [jobId, controller] of this.activeBuilds) {
      controller.abort();
    }

    for (const [subject, unsubscribe] of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions.clear();
    this.activeBuilds.clear();

    console.log('Build Worker stopped');
  }

  private async subscribeToBuildJobs(): Promise<void> {
    const unsubscribe = await subscribe('slate.build.started.*', async (msg: any) => {
      const { projectId, data } = msg;
      await this.handleBuildJob(projectId, data.job, data.options);
    });

    this.subscriptions.set('build.started', unsubscribe);
  }

  private async handleBuildJob(
    projectId: string,
    job: any,
    options: any
  ): Promise<void> {
    const jobId = job.id;
    const controller = new AbortController();
    this.activeBuilds.set(jobId, controller);

    try {
      await updateBuildJob(jobId, {
        status: 'building',
        started_at: new Date().toISOString(),
      });

      await this.executeBuild(projectId, jobId, job, options, controller.signal);

      const outputPath = `/builds/${projectId}/${jobId}/${job.target_platform}`;

      await completeBuild(projectId, jobId, outputPath, [
        { name: 'game.exe', path: `${outputPath}/game.exe`, size: 52428800 },
        { name: 'data.pak', path: `${outputPath}/data.pak`, size: 104857600 },
      ]);

      await updateBuildJob(jobId, {
        status: 'completed',
        progress: 100,
        output_path: outputPath,
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await failBuild(projectId, jobId, errorMessage, [
        'Build process encountered an error',
        errorMessage,
      ]);

      await updateBuildJob(jobId, {
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      });
    } finally {
      this.activeBuilds.delete(jobId);
    }
  }

  private async executeBuild(
    projectId: string,
    jobId: string,
    job: any,
    options: any,
    signal: AbortSignal
  ): Promise<void> {
    const stages = [
      { name: 'Preparing build environment', duration: 2000, progress: 10 },
      { name: 'Compiling scripts', duration: 5000, progress: 30 },
      { name: 'Building asset bundles', duration: 4000, progress: 50 },
      { name: 'Packaging resources', duration: 3000, progress: 70 },
      { name: 'Optimizing build', duration: 3000, progress: 85 },
      { name: 'Creating executable', duration: 2000, progress: 95 },
      { name: 'Finalizing', duration: 1000, progress: 100 },
    ];

    for (const stage of stages) {
      if (signal.aborted) {
        throw new Error('Build cancelled');
      }

      await updateBuildProgress(projectId, jobId, stage.progress, stage.name);

      await new Promise((resolve) => setTimeout(resolve, stage.duration));
    }
  }
}

export const buildWorker = new BuildWorker();
