/**
 * Container Pool Manager
 * 
 * Manages Docker container pooling for previews
 * Provides container reuse, lifecycle management, and health monitoring
 */

export interface ContainerConfig {
  image: string;
  ports: number[];
  environment?: Record<string, string>;
  volumes?: Array<{ host: string; container: string }>;
  command?: string[];
}

export interface ContainerInstance {
  id: string;
  config: ContainerConfig;
  status: 'idle' | 'running' | 'stopped' | 'error';
  createdAt: number;
  lastUsed: number;
  health: 'healthy' | 'unhealthy' | 'unknown';
  port?: number;
}

export interface PoolStats {
  total: number;
  idle: number;
  running: number;
  stopped: number;
  error: number;
}

class ContainerPool {
  private containers: Map<string, ContainerInstance> = new Map();
  private maxPoolSize: number;
  private idleTimeout: number; // ms
  private healthCheckInterval: number; // ms
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor(options?: {
    maxPoolSize?: number;
    idleTimeout?: number;
    healthCheckInterval?: number;
  }) {
    this.maxPoolSize = options?.maxPoolSize || 10;
    this.idleTimeout = options?.idleTimeout || 300000; // 5 minutes
    this.healthCheckInterval = options?.healthCheckInterval || 30000; // 30 seconds

    this.startHealthCheck();
  }

  /**
   * Acquire a container from the pool
   */
  async acquire(config: ContainerConfig): Promise<ContainerInstance> {
    // Try to find an idle container matching the config
    const idleContainer = Array.from(this.containers.values()).find(
      (c) =>
        c.status === 'idle' &&
        c.health === 'healthy' &&
        this.configMatches(c.config, config)
    );

    if (idleContainer) {
      idleContainer.status = 'running';
      idleContainer.lastUsed = Date.now();
      return idleContainer;
    }

    // Create new container if pool not full
    if (this.containers.size < this.maxPoolSize) {
      return await this.createContainer(config);
    }

    // Wait for container to become available
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const available = Array.from(this.containers.values()).find(
          (c) => c.status === 'idle' && c.health === 'healthy'
        );
        if (available) {
          clearInterval(checkInterval);
          available.status = 'running';
          available.lastUsed = Date.now();
          resolve(available);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout waiting for container'));
      }, 30000);
    });
  }

  /**
   * Release a container back to the pool
   */
  async release(containerId: string): Promise<void> {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }

    // Stop the container but keep it in pool for reuse
    await this.stopContainer(containerId);
    container.status = 'idle';
    container.lastUsed = Date.now();
  }

  /**
   * Create a new container
   */
  private async createContainer(config: ContainerConfig): Promise<ContainerInstance> {
    const containerId = `container-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // In a real implementation, this would use Docker API
    // For now, we'll simulate container creation
    const container: ContainerInstance = {
      id: containerId,
      config,
      status: 'idle',
      createdAt: Date.now(),
      lastUsed: Date.now(),
      health: 'unknown',
    };

    // Simulate container startup
    try {
      // await docker.createContainer(config);
      container.status = 'idle';
      container.health = 'healthy';
      container.port = config.ports[0] || 8080;
    } catch (error) {
      container.status = 'error';
      container.health = 'unhealthy';
      throw error;
    }

    this.containers.set(containerId, container);
    return container;
  }

  /**
   * Stop a container
   */
  private async stopContainer(containerId: string): Promise<void> {
    const container = this.containers.get(containerId);
    if (!container) return;

    // In a real implementation, this would use Docker API
    // await docker.stopContainer(containerId);
    container.status = 'stopped';
  }

  /**
   * Remove a container from the pool
   */
  async remove(containerId: string): Promise<void> {
    const container = this.containers.get(containerId);
    if (!container) return;

    // Stop and remove container
    await this.stopContainer(containerId);
    // await docker.removeContainer(containerId);
    this.containers.delete(containerId);
  }

  /**
   * Check if two configs match (for reuse)
   */
  private configMatches(config1: ContainerConfig, config2: ContainerConfig): boolean {
    return (
      config1.image === config2.image &&
      JSON.stringify(config1.environment) === JSON.stringify(config2.environment) &&
      JSON.stringify(config1.volumes) === JSON.stringify(config2.volumes)
    );
  }

  /**
   * Health check for containers
   */
  private async performHealthCheck(container: ContainerInstance): Promise<void> {
    try {
      // In a real implementation, this would check container health
      // For now, we'll check if container is still responsive
      // const health = await docker.inspectContainer(container.id);
      
      // Simulate health check
      const isHealthy = container.status !== 'error';
      container.health = isHealthy ? 'healthy' : 'unhealthy';
    } catch (error) {
      container.health = 'unhealthy';
      container.status = 'error';
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(() => {
      this.containers.forEach((container) => {
        this.performHealthCheck(container);
      });
    }, this.healthCheckInterval);
  }

  /**
   * Cleanup idle containers
   */
  async cleanupIdleContainers(): Promise<void> {
    const now = Date.now();
    const toRemove: string[] = [];

    this.containers.forEach((container, id) => {
      if (
        container.status === 'idle' &&
        now - container.lastUsed > this.idleTimeout
      ) {
        toRemove.push(id);
      }
    });

    for (const id of toRemove) {
      await this.remove(id);
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    const stats: PoolStats = {
      total: this.containers.size,
      idle: 0,
      running: 0,
      stopped: 0,
      error: 0,
    };

    this.containers.forEach((container) => {
      switch (container.status) {
        case 'idle':
          stats.idle++;
          break;
        case 'running':
          stats.running++;
          break;
        case 'stopped':
          stats.stopped++;
          break;
        case 'error':
          stats.error++;
          break;
      }
    });

    return stats;
  }

  /**
   * Get container by ID
   */
  getContainer(containerId: string): ContainerInstance | null {
    return this.containers.get(containerId) || null;
  }

  /**
   * List all containers
   */
  listContainers(): ContainerInstance[] {
    return Array.from(this.containers.values());
  }

  /**
   * Shutdown pool
   */
  async shutdown(): Promise<void> {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    // Stop and remove all containers
    const containerIds = Array.from(this.containers.keys());
    for (const id of containerIds) {
      await this.remove(id);
    }
  }
}

// Singleton instance
let poolInstance: ContainerPool | null = null;

/**
 * Get the global container pool
 */
export function getContainerPool(): ContainerPool {
  if (!poolInstance) {
    poolInstance = new ContainerPool({
      maxPoolSize: parseInt(process.env.CONTAINER_POOL_SIZE || '10', 10),
      idleTimeout: parseInt(process.env.CONTAINER_IDLE_TIMEOUT || '300000', 10),
      healthCheckInterval: parseInt(process.env.CONTAINER_HEALTH_CHECK_INTERVAL || '30000', 10),
    });
  }
  return poolInstance;
}

