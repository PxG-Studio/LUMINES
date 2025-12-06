/**
 * SPARK Unity Engine Handlers (Production)
 *
 * Real implementations for Unity script generation, prefab creation, and builds
 * Integrates with SLATE's Unity runtime and preview systems
 */

import { generateUnityScript as generateViaAPI } from "@/app/spark/actions/generate";
import { validateFunctionArgs } from "../schemas";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

/**
 * Generate Unity C# script
 */
export async function handleGenerateUnityScript(args: any): Promise<{
  success: boolean;
  script?: string;
  scriptName?: string;
  error?: string;
  tokensUsed?: number;
}> {
  try {
    // Validate arguments
    const validated = validateFunctionArgs("generateUnityScript", args);

    // Generate script via existing SPARK generation pipeline
    const result = await generateViaAPI(validated.prompt, {
      provider: "claude",
      claudeModel: "claude-sonnet-3-5-20241022",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Generation failed",
      };
    }

    // Store generated script in database
    if (result.code && result.scriptName) {
      const tokensUsed = result.tokensUsed || 0;
      await supabase.from("spark_generated_scripts").insert({
        script_name: result.scriptName,
        script_content: result.code,
        prompt: validated.prompt,
        class_name: validated.className,
        namespace: validated.namespace,
        base_class: validated.baseClass,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString(),
      });
    }

    return {
      success: true,
      script: result.code,
      scriptName: result.scriptName,
      tokensUsed: result.tokensUsed || 0,
    };
  } catch (error) {
    console.error("Unity script generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Apply code patch to existing Unity script
 */
export async function handleApplyCodePatch(args: any): Promise<{
  success: boolean;
  newContent?: string;
  error?: string;
}> {
  try {
    const validated = validateFunctionArgs("applyCodePatch", args);

    // Fetch current file content
    const { data: file } = await supabase
      .from("spark_files")
      .select("content, version")
      .eq("path", validated.filePath)
      .maybeSingle();

    if (!file) {
      return {
        success: false,
        error: `File not found: ${validated.filePath}`,
      };
    }

    let newContent = file.content;

    // Apply patch based on type
    switch (validated.patchType) {
      case "replace":
        if (!validated.oldContent) {
          return { success: false, error: "oldContent required for replace" };
        }
        newContent = newContent.replace(validated.oldContent, validated.newContent);
        break;

      case "insert":
        if (typeof validated.lineNumber !== "number") {
          return { success: false, error: "lineNumber required for insert" };
        }
        const lines = newContent.split("\n");
        lines.splice(validated.lineNumber - 1, 0, validated.newContent);
        newContent = lines.join("\n");
        break;

      case "delete":
        if (!validated.oldContent) {
          return { success: false, error: "oldContent required for delete" };
        }
        newContent = newContent.replace(validated.oldContent, "");
        break;

      case "append":
        newContent += "\n" + validated.newContent;
        break;
    }

    // Validate C# syntax if requested
    if (validated.validate) {
      const validationResult = await validateCSharpSyntax(newContent);
      if (!validationResult.valid) {
        return {
          success: false,
          error: `Syntax error: ${validationResult.error}`,
        };
      }
    }

    // Update file in database
    await supabase
      .from("spark_files")
      .update({
        content: newContent,
        version: file.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("path", validated.filePath);

    return {
      success: true,
      newContent,
    };
  } catch (error) {
    console.error("Code patch error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create Unity prefab
 */
export async function handleCreateUnityPrefab(args: {
  prefabName: string;
  components: Array<{ type: string; properties: Record<string, any> }>;
  children?: Array<{ name: string; components: any[] }>;
}): Promise<{
  success: boolean;
  prefabId?: string;
  prefabYaml?: string;
  error?: string;
}> {
  try {
    // Generate Unity prefab YAML
    const prefabYaml = generateUnityPrefabYAML(args.prefabName, args.components, args.children);

    // Store prefab in database
    const { data: prefab, error } = await supabase
      .from("spark_unity_prefabs")
      .insert({
        prefab_name: args.prefabName,
        prefab_content: prefabYaml,
        components: args.components,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      prefabId: prefab.id,
      prefabYaml,
    };
  } catch (error) {
    console.error("Prefab creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create Unity material
 */
export async function handleCreateUnityMaterial(args: {
  materialName: string;
  shader: string;
  properties: Record<string, any>;
}): Promise<{
  success: boolean;
  materialId?: string;
  materialYaml?: string;
  error?: string;
}> {
  try {
    // Generate Unity material YAML
    const materialYaml = generateUnityMaterialYAML(args.materialName, args.shader, args.properties);

    // Store material in database
    const { data: material, error } = await supabase
      .from("spark_unity_materials")
      .insert({
        material_name: args.materialName,
        material_content: materialYaml,
        shader: args.shader,
        properties: args.properties,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      materialId: material.id,
      materialYaml,
    };
  } catch (error) {
    console.error("Material creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Run Unity build
 */
export async function handleRunBuild(args: {
  buildTarget: "WebGL" | "Windows" | "Mac" | "Linux" | "Android" | "iOS";
  buildPath: string;
  development?: boolean;
}): Promise<{
  success: boolean;
  buildId?: string;
  status?: string;
  error?: string;
}> {
  try {
    // Create build job in database
    const { data: buildJob, error } = await supabase
      .from("spark_build_jobs")
      .insert({
        build_target: args.buildTarget,
        build_path: args.buildPath,
        development: args.development || false,
        status: "queued",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // Trigger build via SLATE's build service (192.168.86.114)
    // For MVP, we queue it and return immediately
    // A background worker will pick it up and execute

    return {
      success: true,
      buildId: buildJob.id,
      status: "queued",
    };
  } catch (error) {
    console.error("Build creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper: Validate C# syntax
async function validateCSharpSyntax(code: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Basic syntax checks (can be enhanced with Roslyn API)
    const errors: string[] = [];

    // Check for unmatched braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push("Unmatched braces");
    }

    // Check for unmatched parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Unmatched parentheses");
    }

    // Check for basic C# keywords
    if (!/class\s+\w+/.test(code)) {
      errors.push("No class declaration found");
    }

    return {
      valid: errors.length === 0,
      error: errors.join("; "),
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper: Generate Unity prefab YAML
function generateUnityPrefabYAML(
  name: string,
  components: Array<{ type: string; properties: Record<string, any> }>,
  children?: Array<{ name: string; components: any[] }>
): string {
  const yaml = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!1 &${generateFileId()}
GameObject:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  serializedVersion: 6
  m_Component:
${components.map((c, i) => `  - component: {fileID: ${generateFileId()}}\n    type: ${c.type}`).join("\n")}
  m_Layer: 0
  m_Name: ${name}
  m_TagString: Untagged
  m_Icon: {fileID: 0}
  m_NavMeshLayer: 0
  m_StaticEditorFlags: 0
  m_IsActive: 1
${children?.map(child => `--- !u!1 &${generateFileId()}\nGameObject:\n  m_Name: ${child.name}\n  m_Father: {fileID: ${generateFileId()}}`).join("\n") || ""}`;

  return yaml;
}

// Helper: Generate Unity material YAML
function generateUnityMaterialYAML(
  name: string,
  shader: string,
  properties: Record<string, any>
): string {
  const yaml = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!21 &${generateFileId()}
Material:
  serializedVersion: 6
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: ${name}
  m_Shader: {fileID: 46, guid: 0000000000000000f000000000000000, type: 0}
  m_ShaderKeywords: ${shader}
  m_LightmapFlags: 4
  m_EnableInstancingVariants: 0
  m_DoubleSidedGI: 0
  m_CustomRenderQueue: -1
  stringTagMap: {}
  disabledShaderPasses: []
  m_SavedProperties:
    serializedVersion: 3
    m_TexEnvs: []
    m_Floats:
${Object.entries(properties).map(([key, value]) => `    ${key}: ${value}`).join("\n")}`;

  return yaml;
}

// Helper: Generate Unity file ID
function generateFileId(): string {
  return Math.floor(Math.random() * 1000000000).toString();
}
