/**
 * Unity Shader Generator
 * Converts GLSL code → Unity ShaderLab shader
 */

/**
 * Unity Shader Generator
 * Generates Unity ShaderLab-compatible shader code
 */
export class UnityShaderGenerator {
  /**
   * Wrap GLSL code in Unity ShaderLab format
   */
  static wrap(glslCode: string, shaderName: string = "WISSIL/GeneratedShader"): string {
    // Convert GLSL types to HLSL/CG types
    const hlslCode = glslCode
      .replace(/vec2/g, "float2")
      .replace(/vec3/g, "float3")
      .replace(/vec4/g, "float4")
      .replace(/texture2D\(/g, "tex2D(")
      .replace(/mix\(/g, "lerp(");

    return `
Shader "${shaderName}" {
  Properties {
    _MainTex ("Texture", 2D) = "white" {}
    _Color ("Color", Color) = (1,1,1,1)
  }

  SubShader {
    Tags { "RenderType"="Opaque" }
    LOD 100

    Pass {
      CGPROGRAM
      #pragma vertex vert
      #pragma fragment frag
      #include "UnityCG.cginc"

      struct appdata {
        float4 vertex : POSITION;
        float2 uv : TEXCOORD0;
      };

      struct v2f {
        float2 uv : TEXCOORD0;
        float4 vertex : SV_POSITION;
      };

      sampler2D _MainTex;
      float4 _MainTex_ST;
      float4 _Color;

      v2f vert (appdata v) {
        v2f o;
        o.vertex = UnityObjectToClipPos(v.vertex);
        o.uv = TRANSFORM_TEX(v.uv, _MainTex);
        return o;
      }

      float4 frag (v2f i) : SV_Target {
        ${hlslCode.replace(/return\s+/, "")}
      }
      ENDCG
    }
  }
  FallBack "Diffuse"
}
    `.trim();
  }

  /**
   * Generate shader with custom properties
   */
  static generate(
    glslCode: string,
    shaderName: string,
    properties: Array<{ name: string; type: string; defaultValue?: string }> = []
  ): string {
    let propertiesBlock = "";
    if (properties.length > 0) {
      propertiesBlock = properties
        .map((prop) => {
          const defaultValue = prop.defaultValue || this.getDefaultValue(prop.type);
          return `    ${prop.name} ("${prop.name}", ${prop.type}) = ${defaultValue}`;
        })
        .join("\n");
    }

    const hlslCode = glslCode
      .replace(/vec2/g, "float2")
      .replace(/vec3/g, "float3")
      .replace(/vec4/g, "float4")
      .replace(/texture2D\(/g, "tex2D(")
      .replace(/mix\(/g, "lerp(");

    return `
Shader "${shaderName}" {
  Properties {
${propertiesBlock}
  }

  SubShader {
    Tags { "RenderType"="Opaque" }
    LOD 100

    Pass {
      CGPROGRAM
      #pragma vertex vert
      #pragma fragment frag
      #include "UnityCG.cginc"

      struct appdata {
        float4 vertex : POSITION;
        float2 uv : TEXCOORD0;
      };

      struct v2f {
        float2 uv : TEXCOORD0;
        float4 vertex : SV_POSITION;
      };

      sampler2D _MainTex;
      float4 _MainTex_ST;

      v2f vert (appdata v) {
        v2f o;
        o.vertex = UnityObjectToClipPos(v.vertex);
        o.uv = TRANSFORM_TEX(v.uv, _MainTex);
        return o;
      }

      float4 frag (v2f i) : SV_Target {
        return ${hlslCode};
      }
      ENDCG
    }
  }
  FallBack "Diffuse"
}
    `.trim();
  }

  private static getDefaultValue(type: string): string {
    switch (type) {
      case "2D":
        return '"white" {}';
      case "Color":
        return "(1,1,1,1)";
      case "Float":
      case "Range(0,1)":
        return "0";
      default:
        return "0";
    }
  }
}

