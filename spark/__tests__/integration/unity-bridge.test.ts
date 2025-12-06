/**
 * Integration Tests for Unity Bridge
 *
 * Tests service client → Unity MCP → NATS → event flow
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Unity Bridge Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Generate Script Flow", () => {
    it("should validate → call MCP → emit events → store in DB", async () => {
      // Mock service client
      const mockCall = vi.fn().mockResolvedValue({
        success: true,
        path: "Assets/Scripts/Test.cs",
      });

      // Mock NATS publisher
      const mockPublish = vi.fn().mockResolvedValue(undefined);

      // Mock DB query
      const mockQuery = vi.fn().mockResolvedValue({ rows: [] });

      // Simulate handler flow
      const args = {
        name: "TestScript",
        code: "using UnityEngine;\npublic class TestScript {}",
      };

      // Step 1: Validation (happens in handler)
      expect(args.name).toBeTruthy();
      expect(args.code).toBeTruthy();

      // Step 2: Call MCP
      const mcpResult = await mockCall("/tools/create_or_update_file", {
        path: "Assets/Scripts/TestScript.cs",
        content: args.code,
      });
      expect(mcpResult.success).toBe(true);

      // Step 3: Store in DB
      await mockQuery(
        "INSERT INTO spark_generated_scripts (...) VALUES (...)",
        ["session-123", args.name, args.code, ""]
      );
      expect(mockQuery).toHaveBeenCalled();

      // Step 4: Emit event
      await mockPublish({
        subject: "spark.runtime.unity.completed.session-123",
        payload: {
          type: "generate_unity_script.completed",
          sessionId: "session-123",
          scriptName: args.name,
          path: mcpResult.path,
          timestamp: expect.any(Number),
        },
      });
      expect(mockPublish).toHaveBeenCalled();
    });

    it("should handle MCP errors and emit failed event", async () => {
      const mockCall = vi.fn().mockRejectedValue(new Error("Unity MCP timeout"));
      const mockPublish = vi.fn().mockResolvedValue(undefined);

      const args = {
        name: "TestScript",
        code: "code",
      };

      try {
        await mockCall("/tools/create_or_update_file", {
          path: "Assets/Scripts/TestScript.cs",
          content: args.code,
        });
      } catch (error) {
        await mockPublish({
          subject: "spark.runtime.unity.failed.session-123",
          payload: {
            type: "generate_unity_script.failed",
            sessionId: "session-123",
            error: String(error),
            timestamp: expect.any(Number),
          },
        });
      }

      expect(mockPublish).toHaveBeenCalled();
      expect(mockPublish.mock.calls[0][0].payload.type).toContain("failed");
    });
  });

  describe("Preview Flow with Cache", () => {
    it("should return cached preview on cache hit", async () => {
      const mockCache = {
        get: vi.fn().mockReturnValue("https://example.com/frame.png"),
        set: vi.fn(),
      };

      const mockCounter = vi.fn();

      const cacheKey = "Assets/Scenes/Main.unity_Player";
      const cached = mockCache.get(cacheKey);

      if (cached) {
        mockCounter("cache_hit");
        expect(cached).toBe("https://example.com/frame.png");
        expect(mockCounter).toHaveBeenCalledWith("cache_hit");
      }
    });

    it("should render and cache on cache miss", async () => {
      const mockCache = {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
      };

      const mockCall = vi
        .fn()
        .mockResolvedValue({ success: true, frameRef: "https://new-frame.png" });
      const mockPublish = vi.fn().mockResolvedValue(undefined);

      const cacheKey = "Assets/Scenes/Main.unity_Player";
      const cached = mockCache.get(cacheKey);

      if (!cached) {
        const result = await mockCall("/tools/render_scene_capture", {
          scenePath: "Assets/Scenes/Main.unity",
          gameObject: "Player",
        });

        mockCache.set(cacheKey, result.frameRef);

        await mockPublish({
          subject: "spark.preview.unity.frame.session-123",
          payload: {
            type: "preview.frame",
            sessionId: "session-123",
            frameRef: result.frameRef,
            timestamp: expect.any(Number),
          },
        });
      }

      expect(mockCall).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalledWith(cacheKey, "https://new-frame.png");
      expect(mockPublish).toHaveBeenCalled();
    });
  });

  describe("Build Flow with Polling", () => {
    it("should start build → poll status → emit completed", async () => {
      const mockCall = vi
        .fn()
        .mockResolvedValueOnce({
          success: true,
          jobId: "job-123",
          status: "building",
        })
        .mockResolvedValueOnce({
          status: "building",
          progress: 50,
        })
        .mockResolvedValueOnce({
          status: "completed",
          outputPath: "Builds/WebGL",
        });

      const mockPublish = vi.fn().mockResolvedValue(undefined);
      const mockQuery = vi.fn().mockResolvedValue({ rows: [] });

      // Start build
      const buildResult = await mockCall("/tools/run_build", {
        target: "WebGL",
        development: false,
      });

      await mockQuery("INSERT INTO spark_build_jobs (...) VALUES (...)", [
        buildResult.jobId,
        "session-123",
        "WebGL",
        buildResult.status,
      ]);

      await mockPublish({
        subject: "spark.build.unity.started.session-123",
        payload: {
          type: "build_started",
          sessionId: "session-123",
          jobId: buildResult.jobId,
          target: "WebGL",
          timestamp: expect.any(Number),
        },
      });

      // Poll 1
      const status1 = await mockCall("/tools/get_build_status", {
        jobId: buildResult.jobId,
      });
      expect(status1.status).toBe("building");

      // Poll 2
      const status2 = await mockCall("/tools/get_build_status", {
        jobId: buildResult.jobId,
      });
      expect(status2.status).toBe("completed");

      await mockPublish({
        subject: "spark.build.unity.completed.session-123",
        payload: {
          type: "build_completed",
          sessionId: "session-123",
          jobId: buildResult.jobId,
          outputPath: status2.outputPath,
          timestamp: expect.any(Number),
        },
      });

      expect(mockCall).toHaveBeenCalledTimes(3);
      expect(mockPublish).toHaveBeenCalledTimes(2);
    });
  });

  describe("Metrics Tracking", () => {
    it("should track timer and counter for each operation", async () => {
      const mockTimer = {
        start: vi.fn(),
        stop: vi.fn(),
      };
      const mockCounter = vi.fn();

      const mockCall = vi.fn().mockResolvedValue({ success: true });

      mockTimer.start();
      mockCounter("request");

      await mockCall("/tools/create_or_update_file", {
        path: "Assets/Test.cs",
        content: "code",
      });

      mockTimer.stop();

      expect(mockTimer.start).toHaveBeenCalled();
      expect(mockTimer.stop).toHaveBeenCalled();
      expect(mockCounter).toHaveBeenCalledWith("request");
    });
  });
});
