import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import {
  ExportTemplate,
  DEFAULT_TEMPLATE,
  PACKAGE_TEMPLATE,
  ORGANIZED_TEMPLATE,
  generateReadme,
  generateAssemblyDefinition,
  generatePackageManifest,
} from "@/lib/export/templates";

interface ScriptData {
  code: string;
  scriptName: string;
}

interface ExportBatchRequest {
  scripts: ScriptData[];
  template?: "default" | "package" | "organized";
  packageName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { scripts, template = "default", packageName = "SparkGenerated" }: ExportBatchRequest = await request.json();

    if (!scripts || scripts.length === 0) {
      return NextResponse.json(
        { error: "No scripts provided" },
        { status: 400 }
      );
    }

    let exportTemplate: ExportTemplate;
    switch (template) {
      case "package":
        exportTemplate = PACKAGE_TEMPLATE;
        break;
      case "organized":
        exportTemplate = ORGANIZED_TEMPLATE;
        break;
      default:
        exportTemplate = DEFAULT_TEMPLATE;
    }

    const zip = new JSZip();
    let currentFolder = zip;

    for (const folderName of exportTemplate.folderStructure) {
      const newFolder = currentFolder.folder(folderName);
      if (!newFolder) {
        return NextResponse.json(
          { error: `Failed to create folder: ${folderName}` },
          { status: 500 }
        );
      }

      const folderMeta = generateFolderMeta(folderName);
      newFolder.file(`${folderName}.meta`, folderMeta);

      currentFolder = newFolder;
    }

    for (const script of scripts) {
      currentFolder.file(`${script.scriptName}.cs`, script.code);
      const metaContent = generateMetaFile(script.scriptName);
      currentFolder.file(`${script.scriptName}.cs.meta`, metaContent);
    }

    if (exportTemplate.includeReadme) {
      const readme = generateReadme(scripts.map(s => s.scriptName));
      zip.file("README.md", readme);
    }

    if (exportTemplate.includeAssemblyDefinition) {
      const asmdef = generateAssemblyDefinition(packageName);
      currentFolder.file(`${packageName}.asmdef`, asmdef);
      const asmdefMeta = generateMetaFile(packageName);
      currentFolder.file(`${packageName}.asmdef.meta`, asmdefMeta);
    }

    if (exportTemplate.includePackageManifest) {
      const manifest = generatePackageManifest(packageName, scripts.map(s => s.scriptName));
      zip.file("package.json", manifest);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${packageName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Batch export error:", error);
    return NextResponse.json(
      { error: "Failed to generate batch export" },
      { status: 500 }
    );
  }
}

function generateMetaFile(scriptName: string): string {
  const guid = generateGUID();
  return `fileFormatVersion: 2
guid: ${guid}
MonoImporter:
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData:
  assetBundleName:
  assetBundleVariant:
`;
}

function generateFolderMeta(folderName: string): string {
  const guid = generateGUID();
  return `fileFormatVersion: 2
guid: ${guid}
folderAsset: yes
DefaultImporter:
  externalObjects: {}
  userData:
  assetBundleName:
  assetBundleVariant:
`;
}

function generateGUID(): string {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
}
