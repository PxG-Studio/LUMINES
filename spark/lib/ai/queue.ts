/**
 * AI Request Queue System
 * 
 * Manages queuing, batching, and priority handling for AI generation requests
 */

interface QueuedRequest {
  id: string;
  prompt: string;
  provider: 'claude' | 'openai';
  model: string;
  priority: number;
  createdAt: number;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}

interface BatchOperation {
  requests: QueuedRequest[];
  execute: () => Promise<void>;
}

export class AIRequestQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private batchSize: number;
  private batchDelay: number;
  private maxConcurrent: number;
  private activeCount = 0;

  constructor(options: {
    batchSize?: number;
    batchDelay?: number;
    maxConcurrent?: number;
  } = {}) {
    this.batchSize = options.batchSize || 5;
    this.batchDelay = options.batchDelay || 1000; // 1 second
    this.maxConcurrent = options.maxConcurrent || 3;
  }

  /**
   * Add a request to the queue
   */
  async enqueue(
    prompt: string,
    provider: 'claude' | 'openai',
    model: string,
    priority: number = 0,
    executeFn: (prompt: string, provider: string, model: string) => Promise<any>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        prompt,
        provider,
        model,
        priority,
        createdAt: Date.now(),
        resolve,
        reject,
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex((r) => r.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(request);
      } else {
        this.queue.splice(insertIndex, 0, request);
      }

      // Store execute function for batch processing
      (request as any).executeFn = executeFn;

      // Start processing if not already
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 || this.activeCount > 0) {
      // Wait for available slot
      while (this.activeCount >= this.maxConcurrent && this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (this.queue.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, this.batchDelay));
        continue;
      }

      // Get batch of requests
      const batch: QueuedRequest[] = [];
      while (batch.length < this.batchSize && this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
        const request = this.queue.shift();
        if (request) {
          batch.push(request);
          this.activeCount++;
        }
      }

      // Process batch
      if (batch.length > 0) {
        this.processBatch(batch).catch((error) => {
          console.error('Batch processing error:', error);
        });
      }
    }

    this.processing = false;
  }

  /**
   * Process a batch of requests
   */
  private async processBatch(batch: QueuedRequest[]): Promise<void> {
    const promises = batch.map(async (request) => {
      try {
        const executeFn = (request as any).executeFn;
        if (!executeFn) {
          throw new Error('Execute function not found');
        }

        const result = await executeFn(request.prompt, request.provider, request.model);
        request.resolve(result);
      } catch (error) {
        request.reject(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        this.activeCount--;
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Get queue status
   */
  getStatus(): {
    queueLength: number;
    activeCount: number;
    processing: boolean;
  } {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeCount,
      processing: this.processing,
    };
  }

  /**
   * Clear the queue
   */
  clear(): void {
    this.queue.forEach((request) => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}

// Singleton instance
let queueInstance: AIRequestQueue | null = null;

/**
 * Get the global AI request queue instance
 */
export function getAIQueue(): AIRequestQueue {
  if (!queueInstance) {
    queueInstance = new AIRequestQueue({
      batchSize: parseInt(process.env.AI_BATCH_SIZE || '5'),
      batchDelay: parseInt(process.env.AI_BATCH_DELAY || '1000'),
      maxConcurrent: parseInt(process.env.AI_MAX_CONCURRENT || '3'),
    });
  }
  return queueInstance;
}

/**
 * Priority levels
 */
export const QueuePriority = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  URGENT: 3,
} as const;

