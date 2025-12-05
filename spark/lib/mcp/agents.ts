/**
 * MCP Agent System
 * 
 * Implements agent routing, LUNA agent, NERVA agent, and engine-specific agents
 */

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface AgentResponse {
  content: string;
  actions?: AgentAction[];
  tokensUsed?: number;
}

export interface AgentAction {
  type: 'generate' | 'validate' | 'refactor' | 'explain' | 'test';
  target: string;
  parameters?: Record<string, any>;
}

export type AgentType = 'luna' | 'nerva' | 'unity' | 'godot' | 'pico8' | 'gamemaker' | 'rpgmaker' | 'construct' | 'renpy';

/**
 * Base Agent Interface
 */
export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  
  process(message: string, context?: Record<string, any>): Promise<AgentResponse>;
  canHandle(intent: string): boolean;
}

/**
 * LUNA Agent - General purpose code generation assistant
 */
export class LUNAAgent implements Agent {
  readonly id = 'luna';
  readonly name = 'LUNA';
  readonly description = 'General purpose AI assistant for code generation';

  async process(message: string, context?: Record<string, any>): Promise<AgentResponse> {
    // LUNA handles general code generation requests
    const intent = this.detectIntent(message);
    
    if (intent === 'generate') {
      return {
        content: 'I can help you generate code. Please specify which game engine you\'d like to use.',
        actions: [{
          type: 'generate',
          target: 'code',
          parameters: { prompt: message },
        }],
      };
    }

    return {
      content: 'I\'m LUNA, your AI coding assistant. How can I help you today?',
    };
  }

  canHandle(intent: string): boolean {
    return ['generate', 'explain', 'refactor'].includes(intent);
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('generate') || lower.includes('create') || lower.includes('make')) {
      return 'generate';
    }
    if (lower.includes('explain') || lower.includes('what') || lower.includes('how')) {
      return 'explain';
    }
    if (lower.includes('refactor') || lower.includes('improve') || lower.includes('optimize')) {
      return 'refactor';
    }
    return 'general';
  }
}

/**
 * NERVA Agent - Code analysis and optimization specialist
 */
export class NERVAAgent implements Agent {
  readonly id = 'nerva';
  readonly name = 'NERVA';
  readonly description = 'Code analysis and optimization specialist';

  async process(message: string, context?: Record<string, any>): Promise<AgentResponse> {
    const code = context?.code as string | undefined;
    
    if (!code) {
      return {
        content: 'Please provide code for me to analyze.',
      };
    }

    // Analyze code for issues
    const issues = this.analyzeCode(code);
    const optimizations = this.suggestOptimizations(code);

    return {
      content: `I've analyzed your code. Found ${issues.length} potential issues and ${optimizations.length} optimization opportunities.`,
      actions: [
        {
          type: 'validate',
          target: 'code',
          parameters: { issues, optimizations },
        },
      ],
    };
  }

  canHandle(intent: string): boolean {
    return ['analyze', 'optimize', 'validate', 'review'].includes(intent);
  }

  private analyzeCode(code: string): Array<{ line: number; issue: string; severity: 'error' | 'warning' }> {
    const issues: Array<{ line: number; issue: string; severity: 'error' | 'warning' }> = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // Check for common issues
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          line: index + 1,
          issue: 'Unresolved TODO/FIXME',
          severity: 'warning',
        });
      }

      if (line.length > 120) {
        issues.push({
          line: index + 1,
          issue: 'Line exceeds 120 characters',
          severity: 'warning',
        });
      }
    });

    return issues;
  }

  private suggestOptimizations(code: string): string[] {
    const optimizations: string[] = [];

    // Check for optimization opportunities
    if (code.includes('for (') && code.includes('.length')) {
      optimizations.push('Consider caching array length in loops');
    }

    if (code.includes('console.log')) {
      optimizations.push('Remove debug console.log statements');
    }

    return optimizations;
  }
}

/**
 * Engine-Specific Agent Base
 */
abstract class EngineAgent implements Agent {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly engine: string;

  async process(message: string, context?: Record<string, any>): Promise<AgentResponse> {
    const intent = this.detectIntent(message);

    if (intent === 'generate') {
      return {
        content: `I'll help you generate ${this.engine} code.`,
        actions: [{
          type: 'generate',
          target: this.engine,
          parameters: { prompt: message },
        }],
      };
    }

    return {
      content: `I'm specialized in ${this.engine} development. How can I help?`,
    };
  }

  canHandle(intent: string): boolean {
    return ['generate', 'validate', 'refactor'].includes(intent);
  }

  protected detectIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('generate') || lower.includes('create')) return 'generate';
    if (lower.includes('validate') || lower.includes('check')) return 'validate';
    if (lower.includes('refactor') || lower.includes('improve')) return 'refactor';
    return 'general';
  }
}

/**
 * Unity Agent
 */
export class UnityAgent extends EngineAgent {
  readonly id = 'unity';
  readonly name = 'Unity Specialist';
  readonly description = 'Unity C# code generation and optimization';
  readonly engine = 'unity';
}

/**
 * Godot Agent
 */
export class GodotAgent extends EngineAgent {
  readonly id = 'godot';
  readonly name = 'Godot Specialist';
  readonly description = 'Godot GDScript code generation';
  readonly engine = 'godot';
}

/**
 * PICO-8 Agent
 */
export class PICO8Agent extends EngineAgent {
  readonly id = 'pico8';
  readonly name = 'PICO-8 Specialist';
  readonly description = 'PICO-8 Lua code generation';
  readonly engine = 'pico8';
}

/**
 * Agent Router
 */
class AgentRouter {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    // Register agents
    this.register(new LUNAAgent());
    this.register(new NERVAAgent());
    this.register(new UnityAgent());
    this.register(new GodotAgent());
    this.register(new PICO8Agent());
    // Add other engine agents as needed
  }

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  /**
   * Route message to appropriate agent
   */
  async route(message: string, context?: {
    engine?: string;
    intent?: string;
    preferredAgent?: string;
  }): Promise<AgentResponse> {
    // Use preferred agent if specified
    if (context?.preferredAgent) {
      const agent = this.agents.get(context.preferredAgent);
      if (agent) {
        return agent.process(message, context);
      }
    }

    // Route by engine
    if (context?.engine) {
      const agent = this.agents.get(context.engine);
      if (agent) {
        return agent.process(message, context);
      }
    }

    // Detect intent and route
    const intent = this.detectIntent(message);
    
    // Try NERVA for analysis/optimization
    if (['analyze', 'optimize', 'validate', 'review'].includes(intent)) {
      const nerva = this.agents.get('nerva');
      if (nerva && nerva.canHandle(intent)) {
        return nerva.process(message, context);
      }
    }

    // Default to LUNA
    const luna = this.agents.get('luna');
    if (luna) {
      return luna.process(message, context);
    }

    // Fallback
    return {
      content: 'I couldn\'t find an appropriate agent to handle your request.',
    };
  }

  private detectIntent(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes('analyze') || lower.includes('review')) return 'analyze';
    if (lower.includes('optimize') || lower.includes('improve')) return 'optimize';
    if (lower.includes('validate') || lower.includes('check')) return 'validate';
    if (lower.includes('generate') || lower.includes('create')) return 'generate';
    return 'general';
  }

  /**
   * Get available agents
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | null {
    return this.agents.get(id) || null;
  }
}

// Singleton instance
let routerInstance: AgentRouter | null = null;

/**
 * Get the global agent router
 */
export function getAgentRouter(): AgentRouter {
  if (!routerInstance) {
    routerInstance = new AgentRouter();
  }
  return routerInstance;
}

