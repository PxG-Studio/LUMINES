/**
 * Spark Actions
 * Functions called from Spark UI components
 */

import { SparkTemplates } from "./sparkTemplates";
import { loadSparkTemplate } from "./sparkLoader";

/**
 * Start a template by ID
 */
export function startTemplateById(id: string): void {
  const template = SparkTemplates.find((t) => t.id === id);
  if (template) {
    loadSparkTemplate(template);
  } else {
    console.warn(`Template with id "${id}" not found`);
  }
}

/**
 * Get all available templates
 */
export function getAllTemplates() {
  return SparkTemplates;
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string) {
  return SparkTemplates.find((t) => t.id === id);
}

