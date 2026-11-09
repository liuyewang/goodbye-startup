import { it, expect } from "vitest";
import { fitTurnHistory } from "../../src/features/simulator/api";
it("fits multibyte history inside the HTTP body limit while retaining latest context", () => {
  const input = {
    requestId: crypto.randomUUID(),
    expectedVersion: 4,
    idea: "想".repeat(2000),
    decision: "选".repeat(2000),
    language: "zh" as const,
    history: Array.from({ length: 6 }, (_, i) => ({
      role: "user" as const,
      content: String(i) + "中".repeat(1999),
    })),
  };
  const fitted = fitTurnHistory(input);
  expect(
    new TextEncoder().encode(JSON.stringify(fitted)).byteLength,
  ).toBeLessThanOrEqual(32768);
  expect(fitted.history.at(-1)?.content[0]).toBe("5");
  expect(input.history).toHaveLength(6);
});
