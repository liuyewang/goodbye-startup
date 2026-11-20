import type { FullConfig } from "@playwright/test";
import { z } from "zod";

const MockHealth = z.object({
  data: z.object({ ready: z.literal(true), mode: z.literal("mock") }),
});

/** Refuse to exercise paid inference when a running local server uses real credentials. */
export default async function requireMock(config: FullConfig): Promise<void> {
  for (const baseURL of new Set(
    config.projects.map((project) => project.use.baseURL),
  )) {
    if (!baseURL || new URL(baseURL).hostname !== "127.0.0.1")
      throw new Error("Browser tests require a loopback mock server.");
    const response = await fetch(new URL("/api/health", baseURL), {
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok || !MockHealth.safeParse(await response.json()).success)
      throw new Error(
        "Browser tests require a ready local mock server. Check APP_ENV and AI_MODE in .dev.vars.",
      );
  }
}
