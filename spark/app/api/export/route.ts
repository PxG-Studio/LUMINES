import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { code, scriptName } = await request.json();

    if (!code || !scriptName) {
      return NextResponse.json(
        { error: "Missing code or scriptName" },
        { status: 400 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();

    // Create Unity project structure
    const assetsFolder = zip.folder("Assets");
    if (!assetsFolder) {
      return NextResponse.json(
        { error: "Failed to create Assets folder" },
        { status: 500 }
      );
    }

    const scriptsFolder = assetsFolder.folder("Scripts");
    if (!scriptsFolder) {
      return NextResponse.json(
        { error: "Failed to create Scripts folder" },
        { status: 500 }
      );
    }

    // Add the C# script
    scriptsFolder.file(`${scriptName}.cs`, code);

    // Generate .meta file for the script
    const metaContent = generateMetaFile(scriptName);
    scriptsFolder.file(`${scriptName}.cs.meta`, metaContent);

    // Generate .meta files for folders
    assetsFolder.file("Assets.meta", generateFolderMeta("Assets"));
    scriptsFolder.file("Scripts.meta", generateFolderMeta("Scripts"));

    // Generate the ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Return as downloadable file
    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${scriptName}.zip"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
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
  // Generate a simple GUID-like string
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
}
