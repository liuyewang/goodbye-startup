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
  expect(s.getItem("gs_transcript_recovery_run")).toBe("broken");
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
