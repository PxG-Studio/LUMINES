/**
 * Unity Template Registry
 * Defines all available Unity starter templates for Spark
 */

export type UnityTemplateMeta = {
  id: string;
  name: string;
  description: string;
  unityVersion: string;
  tags: string[];
  includesWebGL: boolean;
  category: "webgl" | "cardfront" | "ui" | "2d";
};

export const UnityTemplates: UnityTemplateMeta[] = [
  {
    id: "minimal",
    name: "Minimal Unity WebGL Project",
    description: "Smallest Unity WebGL project with a single scene. Perfect for testing Ignis preview.",
    unityVersion: "2022.3.x",
    tags: ["webgl", "minimal", "starter"],
    includesWebGL: true,
    category: "webgl"
  },
  {
    id: "cardfront",
    name: "CardFront Starter",
    description: "Board layout, camera, UI, and card prefabs. Ready to connect to LUNA / WISSIL runtime.",
    unityVersion: "2022.3.x",
    tags: ["cards", "ui", "webgl", "cardfront"],
    includesWebGL: true,
    category: "cardfront"
  },
  {
    id: "ui",
    name: "Unity UI Template",
    description: "Canvas, buttons, transitions, animations. Excellent for WISSIL UI prototyping.",
    unityVersion: "2022.3.x",
    tags: ["ui", "menus", "canvas"],
    includesWebGL: false,
    category: "ui"
  },
  {
    id: "unity2d",
    name: "Unity 2D Template",
    description: "2D camera, sprites, tilemap-ready project. Pixel-perfect setup.",
    unityVersion: "2022.3.x",
    tags: ["2d", "pixel", "sprites"],
    includesWebGL: false,
    category: "2d"
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): UnityTemplateMeta | undefined {
  return UnityTemplates.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: UnityTemplateMeta["category"]): UnityTemplateMeta[] {
  return UnityTemplates.filter((t) => t.category === category);
}

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): UnityTemplateMeta[] {
  return UnityTemplates.filter((t) => t.tags.includes(tag));
}

