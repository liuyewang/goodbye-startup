import { it, expect, vi } from "vitest";
import { z } from "zod";
import { api, fitTurnHistory } from "../../src/features/simulator/api";

it.each([
  [
    "an HTML gateway response",
    () => new Response("<html>Unavailable</html>", { status: 502 }),
  ],
  [
    "an incomplete JSON error envelope",
    () => Response.json({ message: "upstream unavailable" }, { status: 503 }),
  ],
  [
    "an invalid success payload",
    () => Response.json({ data: {}, requestId: "test" }),
  ],
] as const)("keeps the outcome unknown after %s", async (_label, response) => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async () => response());
  try {
    await expect(
      api(
        "/api/simulations/run/turn",
        z.object({ run: z.string() }),
        "POST",
        {},
      ),
    ).rejects.toMatchObject({ code: "NETWORK" });
  } finally {
    fetch.mockRestore();
  }
});
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
