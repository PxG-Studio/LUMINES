import { expect, test, describe } from "vitest";
import { slateTokens } from "@/tokens/slate.tokens";

describe("Slate Token Tests", () => {
  test("color tokens exist", () => {
    expect(slateTokens.colors.primary).toBeDefined();
    expect(slateTokens.colors.surface).toBeDefined();
    expect(slateTokens.colors.accent).toBeDefined();
  });

  test("spacing tokens are numeric", () => {
    expect(typeof slateTokens.spacing.xs).toBe("number");
    expect(typeof slateTokens.spacing.sm).toBe("number");
    expect(typeof slateTokens.spacing.md).toBe("number");
    expect(typeof slateTokens.spacing.lg).toBe("number");
  });

  test("typography tokens defined", () => {
    expect(slateTokens.typography.fontSizes).toBeDefined();
    expect(slateTokens.typography.fontWeights).toBeDefined();
    expect(slateTokens.typography.fontFamilies).toBeDefined();
  });

  test("shadow tokens exist", () => {
    expect(slateTokens.shadows.sm).toBeDefined();
    expect(slateTokens.shadows.md).toBeDefined();
    expect(slateTokens.shadows.lg).toBeDefined();
  });

  test("wire color tokens exist for blueprint editor", () => {
    expect(slateTokens.colors.wireExec).toBeDefined();
    expect(slateTokens.colors.wireNumber).toBeDefined();
    expect(slateTokens.colors.wireString).toBeDefined();
    expect(slateTokens.colors.wireBool).toBeDefined();
    expect(slateTokens.colors.wireVector).toBeDefined();
  });
});

