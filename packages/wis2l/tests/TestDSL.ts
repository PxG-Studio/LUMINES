/**
 * Test Scenario DSL (Domain-Specific Language)
 * Simple test language for card game simulation
 * Parses test scripts into executable steps
 */

export type TestStep =
  | { type: "play"; card: string; tile: number; player?: string }
  | { type: "expect"; condition: string; message?: string }
  | { type: "wait"; duration: number }
  | { type: "end" }
  | { type: "comment"; text: string };

export interface ParsedTestScript {
  steps: TestStep[];
  metadata?: {
    name?: string;
    description?: string;
    author?: string;
  };
}

/**
 * Test DSL Parser
 * Parses test scripts into executable steps
 */
export class TestDSL {
  /**
   * Parse test script into steps
   */
  static parse(script: string): ParsedTestScript {
    const lines = script.split("\n").map((l) => l.trim());
    const steps: TestStep[] = [];
    const metadata: any = {};

    for (const line of lines) {
      if (!line || line.length === 0) continue;

      // Comments
      if (line.startsWith("#") || line.startsWith("//")) {
        steps.push({
          type: "comment",
          text: line.replace(/^[#/]+\s*/, "")
        });
        continue;
      }

      // Metadata
      if (line.startsWith("@")) {
        const match = line.match(/@(\w+):\s*(.+)/);
        if (match) {
          metadata[match[1]] = match[2];
        }
        continue;
      }

      // Play command
      if (line.startsWith("play")) {
        const playStep = this.parsePlay(line);
        if (playStep) steps.push(playStep);
        continue;
      }

      // Expect command
      if (line.startsWith("expect")) {
        const expectStep = this.parseExpect(line);
        if (expectStep) steps.push(expectStep);
        continue;
      }

      // Wait command
      if (line.startsWith("wait")) {
        const waitStep = this.parseWait(line);
        if (waitStep) steps.push(waitStep);
        continue;
      }

      // End command
      if (line === "end" || line === "END") {
        steps.push({ type: "end" });
        continue;
      }
    }

    return {
      steps,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    };
  }

  /**
   * Parse play command
   * Format: play Card[A] at Tile[3] [by Player1]
   */
  static parsePlay(line: string): TestStep | null {
    // play Card[A] at Tile[3]
    // play Card[A] at Tile[3] by Player1
    const match = line.match(/play\s+Card\[([^\]]+)\]\s+at\s+Tile\[(\d+)\](?:\s+by\s+(\w+))?/i);
    if (match) {
      return {
        type: "play",
        card: match[1],
        tile: parseInt(match[2], 10),
        player: match[3] || undefined
      };
    }

    // Alternative format: play A at 3
    const simpleMatch = line.match(/play\s+(\w+)\s+at\s+(\d+)(?:\s+by\s+(\w+))?/i);
    if (simpleMatch) {
      return {
        type: "play",
        card: simpleMatch[1],
        tile: parseInt(simpleMatch[2], 10),
        player: simpleMatch[3] || undefined
      };
    }

    return null;
  }

  /**
   * Parse expect command
   * Format: expect capture Card[B]
   * Format: expect score Player1 > Player2
   */
  static parseExpect(line: string): TestStep | null {
    const condition = line.replace(/^expect\s+/i, "").trim();
    if (!condition) return null;

    return {
      type: "expect",
      condition,
      message: condition
    };
  }

  /**
   * Parse wait command
   * Format: wait 500
   */
  static parseWait(line: string): TestStep | null {
    const match = line.match(/wait\s+(\d+)/i);
    if (match) {
      return {
        type: "wait",
        duration: parseInt(match[1], 10)
      };
    }
    return null;
  }

  /**
   * Serialize test script to string
   */
  static serialize(script: ParsedTestScript): string {
    const lines: string[] = [];

    // Metadata
    if (script.metadata) {
      if (script.metadata.name) {
        lines.push(`@name: ${script.metadata.name}`);
      }
      if (script.metadata.description) {
        lines.push(`@description: ${script.metadata.description}`);
      }
      if (script.metadata.author) {
        lines.push(`@author: ${script.metadata.author}`);
      }
      if (Object.keys(script.metadata).length > 0) {
        lines.push("");
      }
    }

    // Steps
    for (const step of script.steps) {
      switch (step.type) {
        case "comment":
          lines.push(`# ${step.text}`);
          break;
        case "play":
          const playerPart = step.player ? ` by ${step.player}` : "";
          lines.push(`play Card[${step.card}] at Tile[${step.tile}]${playerPart}`);
          break;
        case "expect":
          lines.push(`expect ${step.condition}`);
          break;
        case "wait":
          lines.push(`wait ${step.duration}`);
          break;
        case "end":
          lines.push("end");
          break;
      }
    }

    return lines.join("\n");
  }
}

