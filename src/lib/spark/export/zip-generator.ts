import JSZip from "jszip";

export interface ZipExportOptions {
  code: string;
  scriptName: string;
}

export async function generateUnityZip(options: ZipExportOptions): Promise<Blob> {
  const { code, scriptName } = options;

  const zip = new JSZip();

  // Create Unity project structure
  const assetsFolder = zip.folder("Assets");
  if (!assetsFolder) {
    throw new Error("Failed to create Assets folder");
  }

  const scriptsFolder = assetsFolder.folder("Scripts");
  if (!scriptsFolder) {
    throw new Error("Failed to create Scripts folder");
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
  return await zip.generateAsync({ type: "blob" });
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
  return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, () => {
    return ((Math.random() * 16) | 0).toString(16);
  });
}
