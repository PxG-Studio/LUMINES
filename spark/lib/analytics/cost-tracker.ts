/**
 * Cost Tracking and Optimization
 * 
 * Tracks AI API costs and provides optimization recommendations
 */

export interface CostMetrics {
  totalCost: number;
  costByProvider: Record<string, number>;
  costByEngine: Record<string, number>;
  averageCostPerGeneration: number;
  tokenUsage: {
    total: number;
    input: number;
    output: number;
  };
}

export interface CostOptimization {
  recommendations: string[];
  potentialSavings: number;
  estimatedMonthlyCost: number;
}

// Pricing per 1K tokens (as of 2024)
const PRICING = {
  claude: {
    'claude-sonnet-3-5-20241022': { input: 0.003, output: 0.015 },
    'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  },
  openai: {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  },
};

class CostTracker {
  private costs: Array<{
    provider: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    timestamp: number;
    engine?: string;
  }> = [];

  /**
   * Calculate cost for a generation
   */
  calculateCost(
    provider: 'claude' | 'openai',
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const providerPricing = PRICING[provider];
    const modelPricing = providerPricing[model as keyof typeof providerPricing];

    if (!modelPricing) {
      console.warn(`Unknown pricing for ${provider}/${model}, using defaults`);
      return 0;
    }

    const inputCost = (inputTokens / 1000) * modelPricing.input;
    const outputCost = (outputTokens / 1000) * modelPricing.output;

    return inputCost + outputCost;
  }

  /**
   * Record a generation cost
   */
  recordGeneration(
    provider: 'claude' | 'openai',
    model: string,
    inputTokens: number,
    outputTokens: number,
    engine?: string
  ): number {
    const cost = this.calculateCost(provider, model, inputTokens, outputTokens);

    this.costs.push({
      provider,
      model,
      inputTokens,
      outputTokens,
      cost,
      timestamp: Date.now(),
      engine,
    });

    // Keep only last 10000 records
    if (this.costs.length > 10000) {
      this.costs.shift();
    }

    return cost;
  }

  /**
   * Get cost metrics
   */
  getMetrics(timeRange?: { start: number; end: number }): CostMetrics {
    const relevantCosts = timeRange
      ? this.costs.filter((c) => c.timestamp >= timeRange.start && c.timestamp <= timeRange.end)
      : this.costs;

    const totalCost = relevantCosts.reduce((sum, c) => sum + c.cost, 0);
    const totalGenerations = relevantCosts.length;

    const costByProvider: Record<string, number> = {};
    const costByEngine: Record<string, number> = {};
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    relevantCosts.forEach((c) => {
      costByProvider[c.provider] = (costByProvider[c.provider] || 0) + c.cost;
      if (c.engine) {
        costByEngine[c.engine] = (costByEngine[c.engine] || 0) + c.cost;
      }
      totalInputTokens += c.inputTokens;
      totalOutputTokens += c.outputTokens;
    });

    return {
      totalCost,
      costByProvider,
      costByEngine,
      averageCostPerGeneration: totalGenerations > 0 ? totalCost / totalGenerations : 0,
      tokenUsage: {
        total: totalInputTokens + totalOutputTokens,
        input: totalInputTokens,
        output: totalOutputTokens,
      },
    };
  }

  /**
   * Get cost optimization recommendations
   */
  getOptimizationRecommendations(): CostOptimization {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];
    let potentialSavings = 0;

    // Check provider distribution
    const claudeCost = metrics.costByProvider.claude || 0;
    const openaiCost = metrics.costByProvider.openai || 0;

    if (claudeCost > openaiCost * 2) {
      recommendations.push(
        'Consider using OpenAI for non-critical generations to reduce costs'
      );
      potentialSavings += (claudeCost - openaiCost) * 0.3; // Estimate 30% savings
    }

    // Check for high-cost models
    const modelUsage = new Map<string, number>();
    this.costs.forEach((c) => {
      const key = `${c.provider}/${c.model}`;
      modelUsage.set(key, (modelUsage.get(key) || 0) + c.cost);
    });

    const expensiveModels = Array.from(modelUsage.entries())
      .filter(([_, cost]) => cost > metrics.totalCost * 0.2)
      .map(([model]) => model);

    if (expensiveModels.length > 0) {
      recommendations.push(
        `Consider using cheaper models for simple tasks: ${expensiveModels.join(', ')}`
      );
      potentialSavings += metrics.totalCost * 0.15; // Estimate 15% savings
    }

    // Check token usage
    const avgInputTokens = metrics.tokenUsage.input / (this.costs.length || 1);
    const avgOutputTokens = metrics.tokenUsage.output / (this.costs.length || 1);

    if (avgInputTokens > 2000) {
      recommendations.push(
        'Consider optimizing prompts to reduce input token usage'
      );
    }

    if (avgOutputTokens > 1000) {
      recommendations.push(
        'Consider using max_tokens limits to reduce output token usage'
      );
    }

    // Estimate monthly cost
    const dailyCost = metrics.totalCost;
    const estimatedMonthlyCost = dailyCost * 30;

    return {
      recommendations,
      potentialSavings,
      estimatedMonthlyCost,
    };
  }

  /**
   * Get cost breakdown by time period
   */
  getCostBreakdown(period: 'day' | 'week' | 'month'): Array<{ period: string; cost: number }> {
    const now = Date.now();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[period];

    const buckets: Map<string, number> = new Map();
    const bucketSize = periodMs / 24; // 24 buckets

    this.costs.forEach((c) => {
      const bucketIndex = Math.floor((now - c.timestamp) / bucketSize);
      const bucketKey = `${bucketIndex}`;
      buckets.set(bucketKey, (buckets.get(bucketKey) || 0) + c.cost);
    });

    return Array.from(buckets.entries())
      .map(([key, cost]) => ({
        period: key,
        cost,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }
}

// Singleton instance
let costTrackerInstance: CostTracker | null = null;

/**
 * Get the global cost tracker instance
 */
export function getCostTracker(): CostTracker {
  if (!costTrackerInstance) {
    costTrackerInstance = new CostTracker();
  }
  return costTrackerInstance;
}

