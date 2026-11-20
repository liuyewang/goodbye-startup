import { it, expect } from "vitest";
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
