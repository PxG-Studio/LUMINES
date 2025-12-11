/**
 * Export Templates Bridge
 * 
 * Re-exports export templates from SPARK module
 * This allows the main app to use SPARK's export template functionality
 */

export {
  DEFAULT_TEMPLATE,
  PACKAGE_TEMPLATE,
  ORGANIZED_TEMPLATE,
  generateReadme,
  generateAssemblyDefinition,
  generatePackageManifest,
} from '@/lib/spark/export/templates';

export type { ExportTemplate } from '@/lib/spark/export/templates';

