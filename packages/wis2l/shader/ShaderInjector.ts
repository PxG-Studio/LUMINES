/**
 * Hot Shader Injector
 * Injects compiled shaders into Unity WebGL runtime
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useEditorState } from "@/state/editorState";

/**
 * Shader Injector
 * Hot reloads shaders into Unity WebGL runtime
 */
export class ShaderInjector {
  /**
   * Inject shader code into Unity
   */
  static inject(shaderText: string, shaderName?: string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[ShaderInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("shader/update", {
      text: shaderText,
      name: shaderName || "WISSIL/GeneratedShader"
    });

    const pushMessage = useEditorState.getState().pushMessage;
    pushMessage(`[Shader] Injected shader: ${shaderName || "GeneratedShader"}`);
  }

  /**
   * Compile and inject shader graph
   */
  static injectGraph(graph: any, shaderName?: string): void {
    try {
      const { ShaderGraphCompiler } = require("./ShaderGraphCompiler");
      const { UnityShaderGenerator } = require("./UnityShaderGenerator");

      // Compile graph to GLSL
      const glslCode = ShaderGraphCompiler.compileFunction(graph);
      
      // Convert to Unity ShaderLab
      const shaderLabCode = UnityShaderGenerator.wrap(glslCode, shaderName);

      // Inject into Unity
      this.inject(shaderLabCode, shaderName);
    } catch (error: any) {
      const pushMessage = useEditorState.getState().pushMessage;
      pushMessage(`[Shader] Error compiling graph: ${error.message}`);
    }
  }
}

