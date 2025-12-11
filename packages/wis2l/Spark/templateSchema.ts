/**
 * Spark Template Schema
 * Starter project metadata and filesystem definitions
 */

export type SparkTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  fs: Record<string, any>; // mock filesystem injection
};

export const SparkTemplates: SparkTemplate[] = [
  {
    id: "empty",
    name: "Empty Project",
    description: "A clean Slate project with a basic main.ts entry.",
    icon: "📝",
    fs: {
      src: {
        "main.ts": `console.log("Hello world");`
      },
      "README.md": "# Empty Project"
    }
  },
  {
    id: "unity-starter",
    name: "Unity WebGL Starter",
    description: "Basic WebGL integration stub for Ignis preview.",
    icon: "🎮",
    fs: {
      public: {
        "index.html": "<!-- Unity WebGL mount here -->"
      },
      src: {
        "unity-wrapper.ts": "// Wrapper coming in Phase 4."
      }
    }
  },
  {
    id: "typescript",
    name: "TypeScript Starter",
    description: "A minimal TS project using Vite.",
    icon: "📘",
    fs: {
      src: {
        "main.ts": `export const hello = () => console.log("Hello TS");`
      },
      "README.md": "# TypeScript Starter"
    }
  }
];

