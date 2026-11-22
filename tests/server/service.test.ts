import { it, expect, vi } from "vitest";
import { submitTurn } from "../../src/server/simulation/service";
import {
  createSimulation,
  settleTurn,
} from "../../src/domain/simulation/engine";
import { generateProposal } from "../../src/server/ai/provider";
import type {
  Repository,
  Reservation,
} from "../../src/server/storage/repository";
it("reads the authoritative snapshot after acquiring the reservation", async () => {
  const baseline = createSimulation({
    cashCents: 1000000,
    monthlyCostCents: 10000,
    teamSize: 1,
    employment: "part-time",
  });
  const config = { mode: "mock", allowMock: true, model: "fixture" };
  const input = {
    idea: "test",
    decision: "test",
    history: [],
    language: "en" as const,
  };
  const p = (await generateProposal({ ...input, state: baseline }, config))
    .proposal;
  const state = settleTurn(baseline, p);
  let reserved = false;
  let committed = 0;
  const concurrentNext = settleTurn(settleTurn(state, p), p);
  const repo = {
    getRun: async () => ({
      id: "run",
      state: committed ? concurrentNext : reserved ? state : baseline,
      expiresAt: Date.now() + 100000,
    }),
    reserveTurn: async () => {
      reserved = true;
      return {
        runId: "run",
        sessionHash: "owner",
        requestId: "id",
        token: "t",
        expectedVersion: 1,
      };
    },
    commitTurn: async (op: Reservation, s: typeof state, now: number) => {
      expect(s.version).toBe(op.expectedVersion + 1);
      committed++;
      return { id: op.runId, state: s, expiresAt: now + 30 * 86_400_000 };
    },
    failTurn: async () => {},
  } as unknown as Repository;
  const result = await submitTurn(
    repo,
    "owner",
    "run",
    { ...input, requestId: crypto.randomUUID(), expectedVersion: 1 },
    config,
    100,
  );
  expect(committed).toBe(1);
  expect(result).toMatchObject({
    run: { state: { version: 2, day: 5 } },
    replayed: false,
  });
});

it.each([
  [401, "provider_auth", "AI_UNAVAILABLE"],
  [429, "provider_rate_limited", "AI_UNAVAILABLE"],
  [503, "provider_http_error", "AI_UNAVAILABLE"],
  [200, "invalid_response", "AI_INVALID_RESPONSE"],
] as const)(
  "records one redacted attempt for provider status %s",
  async (status, outcome, code) => {
    const state = createSimulation({
      cashCents: 1_000_000,
      monthlyCostCents: 50_000,
      teamSize: 1,
      employment: "part-time",
    });
    const reservation = {
      runId: "private-run",
      sessionHash: "private-session",
      requestId: "private-operation",
      token: "private-lease",
      expectedVersion: 0,
    };
    const input = {
      idea: "private-idea",
      decision: "private-decision",
      history: [{ role: "user" as const, content: "private-history" }],
      language: "en" as const,
      requestId: reservation.requestId,
      expectedVersion: 0,
    };
    const config = {
      mode: "deepseek",
      allowMock: false,
      model: "deepseek-flash",
      apiKey: "private-credential",
    };
    const failTurn = vi.fn(async () => {});
    const repo = {
      reserveTurn: async () => reservation,
      getRun: async () => ({
        id: reservation.runId,
        state,
        expiresAt: Date.now() + 100_000,
      }),
      failTurn,
    } as unknown as Repository;
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const outgoing = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      status === 200
        ? Response.json({
            choices: [
              {
                finish_reason: "length",
                message: { content: "private-upstream" },
              },
            ],
            usage: { prompt_tokens: 23 },
          })
        : new Response("private-upstream", { status }),
    );
    try {
      await expect(
        submitTurn(
          repo,
          reservation.sessionHash,
          reservation.runId,
          input,
          config,
          300,
        ),
      ).rejects.toThrow(code);
      expect(outgoing).toHaveBeenCalledTimes(1);
      expect(failTurn).toHaveBeenCalledWith(reservation, code);
      expect(log).toHaveBeenCalledTimes(1);
      const entry = log.mock.calls[0]?.[0];
      expect(JSON.stringify(entry)).not.toContain("private-");
      expect(entry).toEqual({
        event: "simulation_attempt",
        outcome,
        elapsedMs: expect.any(Number),
        model: "deepseek-flash",
        promptVersion: "startup-assumptions-v2",
        ...(status === 200 ? { inputTokens: 23 } : {}),
      });
    } finally {
      outgoing.mockRestore();
      log.mockRestore();
    }
  },
);

it("emits known token counts when a turn commits and no new event on replay", async () => {
  let state = createSimulation({
    cashCents: 1_000_000,
    monthlyCostCents: 50_000,
    teamSize: 1,
    employment: "part-time",
  });
  const config = {
    mode: "deepseek",
    allowMock: false,
    model: "deepseek-flash",
    apiKey: "fixture-only",
  };
  const input = {
    idea: "private idea",
    decision: "private decision",
    language: "en" as const,
    history: [],
    requestId: crypto.randomUUID(),
    expectedVersion: 0,
  };
  const proposal = (
    await generateProposal(
      { ...input, state },
      { ...config, mode: "mock", allowMock: true },
    )
  ).proposal;
  const run = () => ({ id: "run", state, expiresAt: Date.now() + 100_000 });
  const repo = {
    getRun: async () => run(),
    reserveTurn: async () => ({
      requestId: input.requestId,
      runId: "run",
      expectedVersion: 0,
      sessionHash: "owner",
      token: "lease",
      replay: state.version === 0 ? undefined : state,
    }),
    commitTurn: async (_op: Reservation, next: typeof state) => {
      state = next;
      return run();
    },
  } as unknown as Repository;
  const log = vi.spyOn(console, "info").mockImplementation(() => {});
  const outgoing = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({
      choices: [
        {
          finish_reason: "stop",
          message: { content: JSON.stringify(proposal) },
        },
      ],
      usage: { prompt_tokens: 31, completion_tokens: 17 },
    }),
  );
  try {
    const turn = () => submitTurn(repo, "owner", "run", input, config, 300);
    expect(await turn()).toMatchObject({ replayed: false });
    expect(await turn()).toMatchObject({ replayed: true });
    expect(outgoing).toHaveBeenCalledTimes(1);
    expect(log.mock.calls).toEqual([
      [
        {
          event: "simulation_attempt",
          outcome: "committed",
          elapsedMs: expect.any(Number),
          model: "deepseek-flash",
          promptVersion: "startup-assumptions-v2",
          inputTokens: 31,
          outputTokens: 17,
        },
      ],
    ]);
  } finally {
    outgoing.mockRestore();
    log.mockRestore();
  }
});
