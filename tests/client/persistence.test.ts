import { it, expect } from "vitest";
import {
  loadTranscript,
  saveTranscript,
  readLegacy,
} from "../../src/features/simulator/persistence";
function memory() {
  const values = new Map<string, string>();
  return {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
  };
}
it("preserves corrupt data before replacement", () => {
  const s = memory();
  s.setItem("gs_transcript_v1_run", "broken");
  expect(loadTranscript("run", s).warning).toBe(true);
  const data = {
    schemaVersion: 1 as const,
    runId: "run",
    idea: "idea",
    turns: [],
    pending: null,
  };
  expect(saveTranscript(data, s)).toBe(true);
  expect(loadTranscript("run", s).recovery).toEqual(["broken"]);
});
it("handles denied storage without throwing", () => {
  const s = {
    getItem: () => {
      throw Error("denied");
    },
    setItem: () => {
      throw Error("denied");
    },
  };
  expect(loadTranscript("run", s).warning).toBe(true);
  expect(
    saveTranscript(
      {
        schemaVersion: 1,
        runId: "run",
        idea: "idea",
        turns: [],
        pending: null,
      },
      s,
    ),
  ).toBe(false);
});
it("does not import a legacy balance as authoritative state", () => {
  const s = memory();
  s.setItem("gs_game_state", '{"cash":9999999999}');
  expect(readLegacy(s)).toContain("9999999999");
  expect(loadTranscript("run", s).data).toBeNull();
});

it("preserves committed slots after a stale metadata overwrite", () => {
  const s = memory();
  const old = {
    schemaVersion: 1 as const,
    runId: "run",
    idea: "idea",
    turns: [],
    pending: null,
  };
  const latest = {
    ...old,
    turns: [{ version: 1, day: 0, decision: "keep me", proposal: null }],
  };
  saveTranscript(latest, s);
  s.setItem("gs_transcript_v1_run", JSON.stringify(old));
  expect(loadTranscript("run", s).data?.turns[0].decision).toBe("keep me");
});

it("preserves each distinct damaged transcript, including an empty value", () => {
  const s = memory();
  const data = {
    schemaVersion: 1 as const,
    runId: "run",
    idea: "idea",
    turns: [],
    pending: null,
  };
  s.setItem("gs_transcript_recovery_run", "an older damaged record");
  for (const raw of ["{newer damage", ""]) {
    s.setItem("gs_transcript_v1_run", raw);
    expect(loadTranscript("run", s).recovery).toContain(raw);
    expect(saveTranscript(data, s)).toBe(true);
  }
  expect(new Set(loadTranscript("run", s).recovery)).toEqual(
    new Set(["an older damaged record", "{newer damage", ""]),
  );
});

it("restores the later full proposal when a replay saved the decision first", () => {
  const s = memory();
  const partial = {
    schemaVersion: 1 as const,
    runId: "run",
    idea: "idea",
    pending: null,
    turns: [{ version: 1, day: 0, decision: "replayed", proposal: null }],
  };
  const proposal = {
    visits: 100,
    signupRate: 0.29,
    paidRate: 1,
    monthlyChurn: 0,
    priceCents: 1000,
    monthlyCostCents: 50000,
    oneTimeCostCents: 0,
    moraleDelta: 0,
    scenario: "Full response received in another tab",
    insights: [{ metric: "cash" as const, text: "Watch cash" }],
    choices: ["Test", "Continue", "Pause"],
  };
  expect(saveTranscript(partial, s)).toBe(true);
  expect(
    saveTranscript(
      { ...partial, turns: [{ ...partial.turns[0], proposal }] },
      s,
    ),
  ).toBe(true);
  s.setItem("gs_transcript_v1_run", "{damaged");
  expect(loadTranscript("run", s).data?.turns[0].proposal).toEqual(proposal);
});
