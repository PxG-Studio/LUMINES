import { subscribe, publish } from '../lib/messaging/client';
import { NatsSubjects } from '../lib/messaging/subjects';
import { updateRuntimeSession, addRuntimeLog } from '../lib/database/operations/runtime';
import type { RuntimeCommand, RuntimeCommandResult, ContainerConfig } from '../lib/runtime/types';

export class ContainerOrchestrator {
  private subscriptions: Map<string, () => void> = new Map();
  private activeContainers: Map<string, any> = new Map();

  async start(): Promise<void> {
    console.log('Container Orchestrator starting...');

    await this.subscribeToContainerCommands();
    await this.subscribeToRuntimeEvents();

    console.log('Container Orchestrator started successfully');
  }

  async stop(): Promise<void> {
    console.log('Container Orchestrator stopping...');

    for (const [subject, unsubscribe] of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions.clear();
    this.activeContainers.clear();

    console.log('Container Orchestrator stopped');
  }

  private async subscribeToContainerCommands(): Promise<void> {
    const unsubscribe = await subscribe('slate.container.start.*', async (msg: any) => {
      const { sessionId } = this.extractSessionId(msg.subject);
      await this.handleStartCommand(sessionId, msg.data);
    });

    this.subscriptions.set('container.start', unsubscribe);

    const stopUnsub = await subscribe('slate.container.stop.*', async (msg: any) => {
      const { sessionId } = this.extractSessionId(msg.subject);
      await this.handleStopCommand(sessionId);
    });

    this.subscriptions.set('container.stop', stopUnsub);

    const restartUnsub = await subscribe('slate.container.restart.*', async (msg: any) => {
      const { sessionId } = this.extractSessionId(msg.subject);
      await this.handleRestartCommand(sessionId);
    });

    this.subscriptions.set('container.restart', restartUnsub);

    const execUnsub = await subscribe('slate.container.execute.*', async (msg: any) => {
      const { sessionId } = this.extractSessionId(msg.subject);
      await this.handleExecuteCommand(sessionId, msg.data);
    });

    this.subscriptions.set('container.execute', execUnsub);

    const statsUnsub = await subscribe('slate.container.stats.*', async (msg: any) => {
      const { sessionId } = this.extractSessionId(msg.subject);
      await this.handleStatsCommand(sessionId);
    });

    this.subscriptions.set('container.stats', statsUnsub);
  }

  private async subscribeToRuntimeEvents(): Promise<void> {
    const unsubscribe = await subscribe('slate.runtime.started.*', async (msg: any) => {
      console.log('Runtime started event received:', msg.data);
    });

    this.subscriptions.set('runtime.started', unsubscribe);
  }

  private async handleStartCommand(sessionId: string, data: any): Promise<void> {
    const { config } = data;

    try {
      await updateRuntimeSession(sessionId, {
        status: 'starting',
        started_at: new Date().toISOString(),
      });

      await addRuntimeLog(sessionId, 'info', `Starting container: ${config.name}`);

      const containerId = `container_${sessionId}_${Date.now()}`;

      await this.simulateContainerStart(config);

      this.activeContainers.set(sessionId, {
        id: containerId,
        config,
        startedAt: Date.now(),
      });

      await updateRuntimeSession(sessionId, {
        status: 'running',
        container_id: containerId,
      });

      await addRuntimeLog(sessionId, 'info', `Container started successfully: ${containerId}`);

      const result: RuntimeCommandResult = {
        success: true,
        output: `Container ${containerId} started`,
      };

      await publish(`slate.container.response.${sessionId}`, result);
    } catch (error) {
      await updateRuntimeSession(sessionId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      await addRuntimeLog(sessionId, 'error', `Failed to start container: ${error}`);

      const result: RuntimeCommandResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await publish(`slate.container.response.${sessionId}`, result);
    }
  }

  private async handleStopCommand(sessionId: string): Promise<void> {
    try {
      await updateRuntimeSession(sessionId, { status: 'stopping' });

      await addRuntimeLog(sessionId, 'info', 'Stopping container...');

      const container = this.activeContainers.get(sessionId);
      if (container) {
        await this.simulateContainerStop(container);
        this.activeContainers.delete(sessionId);
      }

      await updateRuntimeSession(sessionId, {
        status: 'stopped',
        stopped_at: new Date().toISOString(),
      });

      await addRuntimeLog(sessionId, 'info', 'Container stopped successfully');

      const result: RuntimeCommandResult = {
        success: true,
        output: 'Container stopped',
      };

      await publish(`slate.container.response.${sessionId}`, result);
    } catch (error) {
      await addRuntimeLog(sessionId, 'error', `Failed to stop container: ${error}`);

      const result: RuntimeCommandResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await publish(`slate.container.response.${sessionId}`, result);
    }
  }

  private async handleRestartCommand(sessionId: string): Promise<void> {
    await this.handleStopCommand(sessionId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.handleStartCommand(sessionId, {
      config: this.activeContainers.get(sessionId)?.config || {},
    });
  }

  private async handleExecuteCommand(sessionId: string, data: any): Promise<void> {
    const { command } = data;

    try {
      const result: RuntimeCommandResult = {
        success: true,
        output: `Executed: ${command.command}`,
        exit_code: 0,
      };

      await publish(`slate.container.response.${sessionId}`, result);
    } catch (error) {
      const result: RuntimeCommandResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        exit_code: 1,
      };

      await publish(`slate.container.response.${sessionId}`, result);
    }
  }

  private async handleStatsCommand(sessionId: string): Promise<void> {
    const stats = {
      cpu_percent: Math.random() * 100,
      memory_usage: Math.random() * 4096 * 1024 * 1024,
      memory_limit: 4096 * 1024 * 1024,
      network_rx_bytes: Math.random() * 1024 * 1024,
      network_tx_bytes: Math.random() * 1024 * 1024,
      timestamp: Date.now(),
    };

    const result: RuntimeCommandResult = {
      success: true,
      stats,
    };

    await publish(`slate.container.response.${sessionId}`, result);
  }

  private extractSessionId(subject: string): { sessionId: string } {
    const parts = subject.split('.');
    return { sessionId: parts[parts.length - 1] };
  }

  private async simulateContainerStart(config: ContainerConfig): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Docker: Started container ${config.name}`);
  }

  private async simulateContainerStop(container: any): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Docker: Stopped container ${container.id}`);
  }
}

export const containerOrchestrator = new ContainerOrchestrator();
