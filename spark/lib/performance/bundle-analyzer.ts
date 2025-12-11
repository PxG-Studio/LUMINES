/**
 * Bundle Size Analyzer and Optimizer
 * 
 * Analyzes bundle composition and provides optimization recommendations
 */

export interface BundleAnalysis {
  totalSize: number;
  chunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  modules: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  recommendations: string[];
}

export interface OptimizationResult {
  before: BundleAnalysis;
  after: BundleAnalysis;
  savings: {
    total: number;
    percentage: number;
  };
}

class BundleAnalyzer {
  /**
   * Analyze bundle composition
   */
  analyzeBundle(bundleStats: {
    chunks: Array<{ name: string; size: number }>;
    modules: Array<{ name: string; size: number }>;
  }): BundleAnalysis {
    const totalSize = bundleStats.chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    const chunks = bundleStats.chunks.map((chunk) => ({
      name: chunk.name,
      size: chunk.size,
      percentage: (chunk.size / totalSize) * 100,
    }));

    const modules = bundleStats.modules.map((module) => ({
      name: module.name,
      size: module.size,
      percentage: (module.size / totalSize) * 100,
    }));

    const recommendations = this.generateRecommendations(chunks, modules, totalSize);

    return {
      totalSize,
      chunks,
      modules,
      recommendations,
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    chunks: Array<{ name: string; size: number; percentage: number }>,
    modules: Array<{ name: string; size: number; percentage: number }>,
    totalSize: number
  ): string[] {
    const recommendations: string[] = [];

    // Check for large chunks
    const largeChunks = chunks.filter((c) => c.percentage > 20);
    if (largeChunks.length > 0) {
      recommendations.push(
        `Consider code splitting for large chunks: ${largeChunks.map((c) => c.name).join(', ')}`
      );
    }

    // Check for duplicate modules
    const moduleMap = new Map<string, number>();
    modules.forEach((m) => {
      const baseName = m.name.split('/').pop() || m.name;
      moduleMap.set(baseName, (moduleMap.get(baseName) || 0) + m.size);
    });

    const duplicates = Array.from(moduleMap.entries())
      .filter(([_, size]) => size > 100000)
      .map(([name]) => name);

    if (duplicates.length > 0) {
      recommendations.push(
        `Potential duplicate modules detected: ${duplicates.join(', ')}. Consider deduplication.`
      );
    }

    // Check for unused dependencies
    const commonUnusedDeps = ['lodash', 'moment', 'axios'];
    const foundUnused = modules
      .filter((m) => commonUnusedDeps.some((dep) => m.name.includes(dep)))
      .map((m) => m.name);

    if (foundUnused.length > 0) {
      recommendations.push(
        `Consider tree-shaking or replacing large dependencies: ${foundUnused.join(', ')}`
      );
    }

    // Check total size
    const sizeInMB = totalSize / (1024 * 1024);
    if (sizeInMB > 2) {
      recommendations.push(
        `Total bundle size (${sizeInMB.toFixed(2)}MB) exceeds recommended 2MB. Consider aggressive code splitting.`
      );
    }

    // Check for missing compression
    recommendations.push('Ensure gzip/brotli compression is enabled in production');

    return recommendations;
  }

  /**
   * Optimize bundle
   */
  optimizeBundle(analysis: BundleAnalysis): OptimizationResult {
    // Simulate optimization (in real implementation, this would use webpack-bundle-analyzer or similar)
    const optimizedChunks = analysis.chunks.map((chunk) => {
      // Simulate 10-20% reduction through tree-shaking and minification
      const reduction = 0.1 + Math.random() * 0.1;
      return {
        ...chunk,
        size: Math.floor(chunk.size * (1 - reduction)),
      };
    });

    const optimizedTotal = optimizedChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const savings = analysis.totalSize - optimizedTotal;

    const optimizedAnalysis: BundleAnalysis = {
      totalSize: optimizedTotal,
      chunks: optimizedChunks.map((chunk) => ({
        ...chunk,
        percentage: (chunk.size / optimizedTotal) * 100,
      })),
      modules: analysis.modules, // Keep modules as-is for now
      recommendations: analysis.recommendations,
    };

    return {
      before: analysis,
      after: optimizedAnalysis,
      savings: {
        total: savings,
        percentage: (savings / analysis.totalSize) * 100,
      },
    };
  }

  /**
   * Check if bundle meets performance budgets
   */
  checkBudgets(analysis: BundleAnalysis, budgets: {
    maxTotalSize?: number;
    maxChunkSize?: number;
  }): {
    passed: boolean;
    violations: Array<{ type: string; actual: number; budget: number }>;
  } {
    const violations: Array<{ type: string; actual: number; budget: number }> = [];

    if (budgets.maxTotalSize && analysis.totalSize > budgets.maxTotalSize) {
      violations.push({
        type: 'total_size',
        actual: analysis.totalSize,
        budget: budgets.maxTotalSize,
      });
    }

    if (budgets.maxChunkSize) {
      analysis.chunks.forEach((chunk) => {
        if (chunk.size > budgets.maxChunkSize!) {
          violations.push({
            type: 'chunk_size',
            actual: chunk.size,
            budget: budgets.maxChunkSize,
          });
        }
      });
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }
}

// Singleton instance
let analyzerInstance: BundleAnalyzer | null = null;

/**
 * Get the global bundle analyzer instance
 */
export function getBundleAnalyzer(): BundleAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new BundleAnalyzer();
  }
  return analyzerInstance;
}

