/**
 * Contract Tests for Unity Zod Schemas
 *
 * Validates schema enforcement and rejection of invalid payloads
 */

import { describe, it, expect } from "vitest";
import {
  zUnityGenerateScript,
  zUnityApplyPatch,
  zUnityRenderPreview,
  zUnityIngestAsset,
  zUnityDeconstructAsset,
  zUnityRunBuild,
  zUnityGetBuildStatus,
} from "../../lib/engines/unitySchemas";

describe("Unity Schema Contracts", () => {
  describe("zUnityGenerateScript", () => {
    it("should accept valid script generation args", () => {
      const valid = {
        name: "PlayerController",
        code: "using UnityEngine;\npublic class PlayerController {}",
        path: "Assets/Scripts/PlayerController.cs",
      };

      expect(() => zUnityGenerateScript.parse(valid)).not.toThrow();
    });

    it("should reject empty name", () => {
      const invalid = {
        name: "",
        code: "valid code",
      };

      expect(() => zUnityGenerateScript.parse(invalid)).toThrow();
    });

    it("should reject code over 200KB", () => {
      const invalid = {
        name: "Test",
        code: "x".repeat(200_001),
      };

      expect(() => zUnityGenerateScript.parse(invalid)).toThrow();
    });

    it("should reject paths not under Assets/", () => {
      const invalid = {
        name: "Test",
        code: "valid code",
        path: "Packages/Test.cs",
      };

      expect(() => zUnityGenerateScript.parse(invalid)).toThrow();
    });
  });

  describe("zUnityApplyPatch", () => {
    it("should accept valid patch args", () => {
      const valid = {
        path: "Assets/Scripts/Test.cs",
        patch: "@@ -1 +1 @@\n-old\n+new",
      };

      expect(() => zUnityApplyPatch.parse(valid)).not.toThrow();
    });

    it("should reject patch over 200KB", () => {
      const invalid = {
        path: "Assets/Test.cs",
        patch: "x".repeat(200_001),
      };

      expect(() => zUnityApplyPatch.parse(invalid)).toThrow();
    });

    it("should reject paths not under Assets/", () => {
      const invalid = {
        path: "Library/Test.cs",
        patch: "valid",
      };

      expect(() => zUnityApplyPatch.parse(invalid)).toThrow();
    });
  });

  describe("zUnityRenderPreview", () => {
    it("should accept valid preview args", () => {
      const valid = {
        scenePath: "Assets/Scenes/Main.unity",
        gameObject: "Player",
        width: 800,
        height: 600,
      };

      expect(() => zUnityRenderPreview.parse(valid)).not.toThrow();
    });

    it("should accept minimal args", () => {
      const valid = {};
      expect(() => zUnityRenderPreview.parse(valid)).not.toThrow();
    });

    it("should reject width over 4096", () => {
      const invalid = { width: 5000 };
      expect(() => zUnityRenderPreview.parse(invalid)).toThrow();
    });

    it("should reject negative dimensions", () => {
      const invalid = { width: -100 };
      expect(() => zUnityRenderPreview.parse(invalid)).toThrow();
    });
  });

  describe("zUnityIngestAsset", () => {
    it("should accept valid asset path", () => {
      const valid = { path: "Assets/Sprites/Player.png" };
      expect(() => zUnityIngestAsset.parse(valid)).not.toThrow();
    });

    it("should reject paths not under Assets/", () => {
      const invalid = { path: "ProjectSettings/Test.asset" };
      expect(() => zUnityIngestAsset.parse(invalid)).toThrow();
    });
  });

  describe("zUnityRunBuild", () => {
    it("should accept valid build args", () => {
      const valid = { target: "WebGL", development: false };
      expect(() => zUnityRunBuild.parse(valid)).not.toThrow();
    });

    it("should accept minimal args", () => {
      const valid = { target: "Windows" };
      expect(() => zUnityRunBuild.parse(valid)).not.toThrow();
    });

    it("should reject empty target", () => {
      const invalid = { target: "" };
      expect(() => zUnityRunBuild.parse(invalid)).toThrow();
    });
  });

  describe("zUnityGetBuildStatus", () => {
    it("should accept valid UUID", () => {
      const valid = { jobId: "550e8400-e29b-41d4-a716-446655440000" };
      expect(() => zUnityGetBuildStatus.parse(valid)).not.toThrow();
    });

    it("should reject non-UUID strings", () => {
      const invalid = { jobId: "not-a-uuid" };
      expect(() => zUnityGetBuildStatus.parse(invalid)).toThrow();
    });

    it("should reject missing jobId", () => {
      const invalid = {};
      expect(() => zUnityGetBuildStatus.parse(invalid as any)).toThrow();
    });
  });
});
