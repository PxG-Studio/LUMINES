/**
 * State Documentation Utilities
 * EC-LAND-781 to EC-LAND-790: State documentation
 */

/**
 * State Documentation Manager
 * EC-LAND-781 to EC-LAND-790
 */
export class StateDocumentation {
  private static documentation = new Map<string, StateDoc>();

  /**
   * Document state structure
   * EC-LAND-782
   */
  static documentStructure(
    key: string,
    structure: {
      name: string;
      type: string;
      description: string;
      properties?: Array<{ name: string; type: string; description: string }>;
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.structure = structure;
    this.documentation.set(key, doc);
  }

  /**
   * Document state transitions
   * EC-LAND-783
   */
  static documentTransitions(
    key: string,
    transitions: Array<{
      from: string;
      to: string;
      trigger: string;
      description: string;
    }>
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.transitions = transitions;
    this.documentation.set(key, doc);
  }

  /**
   * Document state validation
   * EC-LAND-784
   */
  static documentValidation(
    key: string,
    validation: {
      rules: Array<{ rule: string; description: string }>;
      errorMessages: Record<string, string>;
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.validation = validation;
    this.documentation.set(key, doc);
  }

  /**
   * Document state persistence
   * EC-LAND-785
   */
  static documentPersistence(
    key: string,
    persistence: {
      storage: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'server';
      strategy: 'merge' | 'replace' | 'timestamp';
      ttl?: number;
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.persistence = persistence;
    this.documentation.set(key, doc);
  }

  /**
   * Document state synchronization
   * EC-LAND-786
   */
  static documentSynchronization(
    key: string,
    synchronization: {
      method: 'polling' | 'websocket' | 'server-sent-events' | 'broadcast-channel';
      frequency?: number;
      conflictResolution: 'local' | 'remote' | 'merge' | 'timestamp';
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.synchronization = synchronization;
    this.documentation.set(key, doc);
  }

  /**
   * Document state cleanup
   * EC-LAND-787
   */
  static documentCleanup(
    key: string,
    cleanup: {
      onUnmount: boolean;
      onError: boolean;
      strategy: 'immediate' | 'delayed' | 'on-demand';
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.cleanup = cleanup;
    this.documentation.set(key, doc);
  }

  /**
   * Document state performance
   * EC-LAND-788
   */
  static documentPerformance(
    key: string,
    performance: {
      memoization: boolean;
      caching: boolean;
      optimization: Array<string>;
    }
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.performance = performance;
    this.documentation.set(key, doc);
  }

  /**
   * Document state edge cases
   * EC-LAND-789
   */
  static documentEdgeCases(
    key: string,
    edgeCases: Array<{
      case: string;
      description: string;
      solution: string;
    }>
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.edgeCases = edgeCases;
    this.documentation.set(key, doc);
  }

  /**
   * Document state workflows
   * EC-LAND-790
   */
  static documentWorkflows(
    key: string,
    workflows: Array<{
      name: string;
      steps: Array<{ step: string; description: string }>;
    }>
  ): void {
    const doc = this.documentation.get(key) || { key };
    doc.workflows = workflows;
    this.documentation.set(key, doc);
  }

  /**
   * Get documentation
   * EC-LAND-781
   */
  static getDocumentation(key: string): StateDoc | undefined {
    return this.documentation.get(key);
  }

  /**
   * Generate documentation markdown
   * EC-LAND-781
   */
  static generateMarkdown(key: string): string {
    const doc = this.documentation.get(key);
    if (!doc) return '';

    const lines: string[] = [`# State Documentation: ${key}`, ''];

    if (doc.structure) {
      lines.push('## Structure', '');
      lines.push(`- **Name:** ${doc.structure.name}`);
      lines.push(`- **Type:** ${doc.structure.type}`);
      lines.push(`- **Description:** ${doc.structure.description}`);
      if (doc.structure.properties) {
        lines.push('### Properties', '');
        doc.structure.properties.forEach(prop => {
          lines.push(`- **${prop.name}** (${prop.type}): ${prop.description}`);
        });
      }
      lines.push('');
    }

    if (doc.transitions) {
      lines.push('## Transitions', '');
      doc.transitions.forEach(trans => {
        lines.push(`- **${trans.from}** → **${trans.to}** (${trans.trigger}): ${trans.description}`);
      });
      lines.push('');
    }

    if (doc.validation) {
      lines.push('## Validation', '');
      doc.validation.rules.forEach(rule => {
        lines.push(`- **${rule.rule}:** ${rule.description}`);
      });
      lines.push('');
    }

    if (doc.persistence) {
      lines.push('## Persistence', '');
      lines.push(`- **Storage:** ${doc.persistence.storage}`);
      lines.push(`- **Strategy:** ${doc.persistence.strategy}`);
      if (doc.persistence.ttl) {
        lines.push(`- **TTL:** ${doc.persistence.ttl}ms`);
      }
      lines.push('');
    }

    if (doc.synchronization) {
      lines.push('## Synchronization', '');
      lines.push(`- **Method:** ${doc.synchronization.method}`);
      if (doc.synchronization.frequency) {
        lines.push(`- **Frequency:** ${doc.synchronization.frequency}ms`);
      }
      lines.push(`- **Conflict Resolution:** ${doc.synchronization.conflictResolution}`);
      lines.push('');
    }

    if (doc.cleanup) {
      lines.push('## Cleanup', '');
      lines.push(`- **On Unmount:** ${doc.cleanup.onUnmount}`);
      lines.push(`- **On Error:** ${doc.cleanup.onError}`);
      lines.push(`- **Strategy:** ${doc.cleanup.strategy}`);
      lines.push('');
    }

    if (doc.performance) {
      lines.push('## Performance', '');
      lines.push(`- **Memoization:** ${doc.performance.memoization}`);
      lines.push(`- **Caching:** ${doc.performance.caching}`);
      if (doc.performance.optimization.length > 0) {
        lines.push('### Optimizations', '');
        doc.performance.optimization.forEach(opt => {
          lines.push(`- ${opt}`);
        });
      }
      lines.push('');
    }

    if (doc.edgeCases) {
      lines.push('## Edge Cases', '');
      doc.edgeCases.forEach(edgeCase => {
        lines.push(`### ${edgeCase.case}`, '');
        lines.push(`- **Description:** ${edgeCase.description}`);
        lines.push(`- **Solution:** ${edgeCase.solution}`);
        lines.push('');
      });
    }

    if (doc.workflows) {
      lines.push('## Workflows', '');
      doc.workflows.forEach(workflow => {
        lines.push(`### ${workflow.name}`, '');
        workflow.steps.forEach(step => {
          lines.push(`- **${step.step}:** ${step.description}`);
        });
        lines.push('');
      });
    }

    return lines.join('\n');
  }
}

interface StateDoc {
  key: string;
  structure?: {
    name: string;
    type: string;
    description: string;
    properties?: Array<{ name: string; type: string; description: string }>;
  };
  transitions?: Array<{
    from: string;
    to: string;
    trigger: string;
    description: string;
  }>;
  validation?: {
    rules: Array<{ rule: string; description: string }>;
    errorMessages: Record<string, string>;
  };
  persistence?: {
    storage: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'server';
    strategy: 'merge' | 'replace' | 'timestamp';
    ttl?: number;
  };
  synchronization?: {
    method: 'polling' | 'websocket' | 'server-sent-events' | 'broadcast-channel';
    frequency?: number;
    conflictResolution: 'local' | 'remote' | 'merge' | 'timestamp';
  };
  cleanup?: {
    onUnmount: boolean;
    onError: boolean;
    strategy: 'immediate' | 'delayed' | 'on-demand';
  };
  performance?: {
    memoization: boolean;
    caching: boolean;
    optimization: Array<string>;
  };
  edgeCases?: Array<{
    case: string;
    description: string;
    solution: string;
  }>;
  workflows?: Array<{
    name: string;
    steps: Array<{ step: string; description: string }>;
  }>;
}

