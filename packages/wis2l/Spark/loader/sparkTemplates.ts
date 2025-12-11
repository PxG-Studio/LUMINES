/**
 * Spark Template Definitions
 * All initial templates available in Spark gallery
 */

export type SparkTemplate = {
  id: string;
  label: string;
  description: string;
  files: Record<string, string>;
  entry: string; // e.g., "src/main.ts"
  icon?: string;
};

export const SparkTemplates: SparkTemplate[] = [
  {
    id: "blank-ts",
    label: "Blank TypeScript",
    description: "Minimal TS starter with an empty main() entry.",
    entry: "src/main.ts",
    icon: "📝",
    files: {
      "src/main.ts": `console.log("Hello from WISSIL!");`.trim(),
      "index.html": `<!DOCTYPE html>
<html>
  <body>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>`.trim()
    }
  },
  {
    id: "p5js",
    label: "p5.js Starter",
    description: "A simple p5.js sketch with setup() and draw().",
    entry: "src/sketch.js",
    icon: "🎨",
    files: {
      "src/sketch.js": `import p5 from "https://cdn.jsdelivr.net/npm/p5@1.6.0/+esm";

new p5((sk) => {
  sk.setup = () => {
    sk.createCanvas(400, 400);
  };

  sk.draw = () => {
    sk.background(220);
    sk.circle(200, 200, 80);
  };
});`.trim(),
      "index.html": `<!DOCTYPE html>
<html>
  <body style="margin:0;">
    <script type="module" src="./src/sketch.js"></script>
  </body>
</html>`.trim()
    }
  },
  {
    id: "unity-webgl",
    label: "Unity WebGL Template",
    description: "Loads Unity WebGL player in Ignis.",
    entry: "src/main.ts",
    icon: "🎮",
    files: {
      "src/main.ts": `console.log("Unity WebGL preview active.");
// Unity handled via Ignis panel, nothing to initialize here.`.trim()
    }
  }
];

