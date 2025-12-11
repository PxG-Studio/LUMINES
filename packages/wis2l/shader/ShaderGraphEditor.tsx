/**
 * Shader Graph Editor
 * Main UI component for node-based shader editor
 * Simplified version that works without react-flow
 */

'use client';

import React, { useState, useCallback } from "react";
import { useShaderGraphStore } from "./ShaderGraphStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { NodeDefinitions, getCategories } from "./nodes/NodeDefinitions";
import { ShaderGraphCompiler } from "./ShaderGraphCompiler";
import { UnityShaderGenerator } from "./UnityShaderGenerator";
import { ShaderInjector } from "./ShaderInjector";
import { LunaShaderAssistant } from "../luna/LunaShaderAssistant";
import { Button } from "@/design-system/primitives/Button";
import { Card } from "@/design-system/primitives/Card";

export function ShaderGraphEditor() {
  const theme = useTheme();
  const graph = useShaderGraphStore((state) => state.graph);
  const addNode = useShaderGraphStore((state) => state.addNode);
  const deleteNode = useShaderGraphStore((state) => state.deleteNode);
  const setOutputNode = useShaderGraphStore((state) => state.setOutputNode);
  const selectNode = useShaderGraphStore((state) => state.selectNode);
  const selectedNode = useShaderGraphStore((state) => state.selectedNode);

  const [previewCode, setPreviewCode] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleAddNode = (nodeType: string) => {
    const def = NodeDefinitions[nodeType];
    if (!def) return;

    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: nodeType,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: def.default || {}
    };

    addNode(newNode);
  };

  const handleCompile = () => {
    try {
      const glslCode = ShaderGraphCompiler.compileFunction(graph);
      setPreviewCode(glslCode);
    } catch (error: any) {
      setPreviewCode(`// Error: ${error.message}`);
    }
  };

  const handleGenerateShaderLab = () => {
    try {
      const glslCode = ShaderGraphCompiler.compileFunction(graph);
      const shaderLabCode = UnityShaderGenerator.wrap(glslCode, "WISSIL/GeneratedShader");
      setPreviewCode(shaderLabCode);
    } catch (error: any) {
      setPreviewCode(`// Error: ${error.message}`);
    }
  };

  const handleInject = () => {
    try {
      const glslCode = ShaderGraphCompiler.compileFunction(graph);
      const shaderLabCode = UnityShaderGenerator.wrap(glslCode, "WISSIL/GeneratedShader");
      ShaderInjector.inject(shaderLabCode, "WISSIL/GeneratedShader");
    } catch (error: any) {
      console.error("Error injecting shader:", error);
    }
  };

  const handleAnalyze = () => {
    const suggs = LunaShaderAssistant.suggest(graph);
    setSuggestions(suggs);
  };

  const categories = getCategories();

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.bg0,
        overflow: "hidden"
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1,
          display: "flex",
          gap: theme.spacing.sm,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <Button variant="accent" onClick={handleCompile} style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}` }}>
          Compile GLSL
        </Button>
        <Button variant="ghost" onClick={handleGenerateShaderLab} style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}` }}>
          Generate ShaderLab
        </Button>
        <Button variant="ghost" onClick={handleInject} style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}` }}>
          Inject to Unity
        </Button>
        <Button variant="ghost" onClick={handleAnalyze} style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}` }}>
          Analyze
        </Button>
        <div style={{ marginLeft: "auto", fontSize: theme.typography.size.sm, color: theme.colors.text2 }}>
          {graph.nodes.length} nodes, {graph.edges.length} edges
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Node Palette */}
        <div
          style={{
            width: 200,
            borderRight: `1px solid ${theme.colors.border}`,
            background: theme.colors.bg1,
            overflow: "auto",
            padding: theme.spacing.md
          }}
        >
          <div
            style={{
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0,
              marginBottom: theme.spacing.md
            }}
          >
            Nodes
          </div>
          {categories.map((category) => (
            <div key={category} style={{ marginBottom: theme.spacing.md }}>
              <div
                style={{
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text1,
                  marginBottom: theme.spacing.xs,
                  textTransform: "uppercase"
                }}
              >
                {category}
              </div>
              {Object.values(NodeDefinitions)
                .filter((def) => def.category === category)
                .map((def) => (
                  <Button
                    key={def.id}
                    variant="ghost"
                    onClick={() => handleAddNode(def.id)}
                    style={{
                      width: "100%",
                      marginBottom: theme.spacing.xs,
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      fontSize: theme.typography.size.xs,
                      justifyContent: "flex-start"
                    }}
                  >
                    {def.label}
                  </Button>
                ))}
            </div>
          ))}
        </div>

        {/* Graph Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: theme.colors.bg0,
            overflow: "auto"
          }}
        >
          {graph.nodes.length === 0 ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: theme.colors.text2
              }}
            >
              <div style={{ fontSize: theme.typography.size.lg, marginBottom: theme.spacing.sm }}>
                Shader Graph Editor
              </div>
              <div style={{ fontSize: theme.typography.size.sm }}>
                Add nodes from the palette to start building your shader
              </div>
            </div>
          ) : (
            <div style={{ padding: theme.spacing.md }}>
              {graph.nodes.map((node) => {
                const def = NodeDefinitions[node.type];
                return (
                  <Card
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    style={{
                      position: "absolute",
                      left: node.position.x,
                      top: node.position.y,
                      padding: theme.spacing.sm,
                      background: selectedNode === node.id ? theme.colors.bg2 : theme.colors.bg1,
                      border: `2px solid ${selectedNode === node.id ? theme.colors.accent : theme.colors.border}`,
                      cursor: "pointer",
                      minWidth: 150
                    }}
                  >
                    <div
                      style={{
                        fontSize: theme.typography.size.sm,
                        fontWeight: theme.typography.weight.semibold,
                        color: theme.colors.text0,
                        marginBottom: theme.spacing.xs
                      }}
                    >
                      {def?.label || node.type}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.size.xs,
                        color: theme.colors.text2
                      }}
                    >
                      {graph.outputNode === node.id && "⭐ Output"}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOutputNode(node.id);
                      }}
                      style={{
                        marginTop: theme.spacing.xs,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                    >
                      Set Output
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                      style={{
                        marginTop: theme.spacing.xs,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        fontSize: theme.typography.size.xs
                      }}
                    >
                      Delete
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview/Suggestions Panel */}
        <div
          style={{
            width: 400,
            borderLeft: `1px solid ${theme.colors.border}`,
            background: theme.colors.bg1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {suggestions.length > 0 && (
            <Card style={{ padding: theme.spacing.md, margin: theme.spacing.md }}>
              <div
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0,
                  marginBottom: theme.spacing.sm
                }}
              >
                LUNA Suggestions
              </div>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: theme.spacing.sm,
                    marginBottom: theme.spacing.xs,
                    background: theme.colors.bg2,
                    borderRadius: theme.radii.sm,
                    fontSize: theme.typography.size.xs
                  }}
                >
                  <div style={{ color: theme.colors.text0, marginBottom: theme.spacing.xs }}>
                    [{s.severity.toUpperCase()}] {s.message}
                  </div>
                  <div style={{ color: theme.colors.text2 }}>💡 {s.suggestion}</div>
                </div>
              ))}
            </Card>
          )}

          {previewCode && (
            <Card style={{ padding: theme.spacing.md, margin: theme.spacing.md }}>
              <div
                style={{
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.semibold,
                  color: theme.colors.text0,
                  marginBottom: theme.spacing.sm
                }}
              >
                Generated Code
              </div>
              <pre
                style={{
                  fontSize: theme.typography.size.xs,
                  fontFamily: "monospace",
                  background: theme.colors.bg2,
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.sm,
                  overflow: "auto",
                  maxHeight: 400,
                  color: theme.colors.text0
                }}
              >
                {previewCode}
              </pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

