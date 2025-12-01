/**
 * API Contracts
 * 
 * Interfaces and contracts for cross-subsystem communication
 */

// Ignis API
export interface IgnisAPI {
  createGraph(name: string): Promise<string>;
  loadGraph(graphId: string): Promise<any>;
  saveGraph(graphId: string, graph: any): Promise<void>;
  executeGraph(graphId: string): Promise<void>;
  generateCSharp(graphId: string): Promise<string>;
}

// Unity Tools API
export interface UnityToolsAPI {
  selectObject(objectId: string): Promise<void>;
  getSceneGraph(): Promise<any>;
  updatePrefab(prefabId: string, data: any): Promise<void>;
  updateShader(shaderId: string, params: any): Promise<void>;
}

// Spark API
export interface SparkAPI {
  listTemplates(): Promise<any[]>;
  loadTemplate(templateId: string): Promise<any>;
  createTemplate(name: string, graph: any): Promise<string>;
}

// Ignition API
export interface IgnitionAPI {
  startBuild(config: any): Promise<string>;
  getBuildStatus(buildId: string): Promise<any>;
  getRuntimeLogs(sessionId: string): Promise<any[]>;
}

// Waypoint API
export interface WaypointAPI {
  askQuestion(question: string, context?: any): Promise<string>;
  generateGraph(prompt: string): Promise<any>;
  explainGraph(graphId: string): Promise<string>;
  fixGraph(graphId: string, issues: string[]): Promise<any>;
}

