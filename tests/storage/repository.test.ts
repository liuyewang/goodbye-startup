import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile } from "node:fs/promises";
import { Repository } from "../../src/server/storage/repository";
import {
  createSimulation,
  settleTurn,
} from "../../src/domain/simulation/engine";
import type { Proposal } from "../../src/domain/simulation/schema";

const now = 1_800_000_000_000;
const setup = {
  cashCents: 1000000,
  monthlyCostCents: 150000,
  teamSize: 1,
  employment: "part-time" as const,
};
const p: Proposal = {
  visits: 100,
  signupRate: 0.1,
  paidRate: 0.1,
  monthlyChurn: 0.1,
  priceCents: 1000,
  monthlyCostCents: 150000,
  oneTimeCostCents: 0,
  moraleDelta: 0,
  scenario: "test",
  insights: [{ text: "test", metric: "cash" }],
  choices: ["a", "b", "c"],
};
let mf: Miniflare;
let repo: Repository;
beforeEach(async () => {
  mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: 'export default { fetch() { return new Response("OK") } }',
      d1Databases: ["DB"],
    }),
  );
  const db = await mf.getD1Database("DB");
  const sql = await readFile("migrations/0001_simulation.sql", "utf8");
  await db.exec(sql.replace(/\n/g, " "));
  repo = new Repository(db);
});
afterEach(async () => {
  await mf?.dispose();
});
async function run() {
  return repo.createRun("owner", createSimulation(setup), now);
}
function reserve(
  id: string,
  requestId: string,
  version = 0,
  time = now,
  limit = 100,
) {
  return repo.reserveTurn("owner", id, requestId, version, time, limit);
}
describe("D1 authority and reservations", () => {
  it("creates only one anonymous allocation and rejects other owners", async () => {
    const r = await run();
    expect((await run()).id).toBe(r.id);
    await expect(repo.getRun("other", r.id, now)).rejects.toThrow(
      "RUN_NOT_FOUND",
    );
  });
  it("does not consume free eligibility until successful settlement", async () => {
    const r = await run();
    const op = await reserve(r.id, "req1");
    expect((await repo.getSession("owner", now)).used).toBe(false);
    await repo.commitTurn(op, settleTurn(r.state, p), now + 100);
    expect((await repo.getSession("owner", now)).used).toBe(true);
  });
  it("replays successful requests without another allocation", async () => {
    const r = await run();
    const op = await reserve(r.id, "req1");
    await repo.commitTurn(op, settleTurn(r.state, p), now + 100);
    const replay = await reserve(r.id, "req1");
    expect(replay.replay?.version).toBe(1);
    expect((await repo.getSession("owner", now)).attempts).toBe(1);
  });
  it("only allows one concurrent reservation per version", async () => {
    const r = await run();
    const results = await Promise.allSettled([
      reserve(r.id, "a"),
      reserve(r.id, "b"),
    ]);
    expect(results.filter((x) => x.status === "fulfilled")).toHaveLength(1);
    expect((await repo.getSession("owner", now)).attempts).toBe(1);
  });
  it("rejects late results after a lease expires and is replaced", async () => {
    const r = await run();
    const old = await reserve(r.id, "old");
    await reserve(r.id, "new", 0, now + 61_000);
    await expect(
      repo.commitTurn(old, settleTurn(r.state, p), now + 62_000),
    ).rejects.toThrow("STALE_REQUEST");
  });
  it("counts failed attempts and never resets them by deleting a draft", async () => {
    const r = await run();
    for (let i = 0; i < 10; i++) {
      const op = await reserve(r.id, "r" + i);
      await repo.failTurn(op, "AI_UNAVAILABLE");
    }
    await repo.deleteRun("owner", r.id, now);
    await expect(run()).rejects.toThrow("ATTEMPTS_EXHAUSTED");
  });
  it("enforces the daily global budget across anonymous sessions", async () => {
    const r = await run();
    await reserve(r.id, "a", 0, now, 1);
    const r2 = await repo.createRun("owner2", createSimulation(setup), now);
    await expect(
      repo.reserveTurn("owner2", r2.id, "b", 0, now, 1),
    ).rejects.toThrow("DAILY_LIMIT");
  });
  it("deleting a used run does not restore free eligibility", async () => {
    const r = await run();
    const op = await reserve(r.id, "a");
    await repo.commitTurn(op, settleTurn(r.state, p), now);
    await repo.deleteRun("owner", r.id, now);
    await expect(run()).rejects.toThrow("FREE_LIMIT");
  });
  it("expires saves after 30 days and retains the used quota", async () => {
    const r = await run();
    const op = await reserve(r.id, "a");
    await repo.commitTurn(op, settleTurn(r.state, p), now);
    await expect(
      repo.getRun("owner", r.id, now + 31 * 86400000),
    ).rejects.toThrow("RUN_EXPIRED");
    expect((await repo.getSession("owner", now + 31 * 86400000)).used).toBe(
      true,
    );
  });
  it("fails closed when the global budget is missing or zero", async () => {
    const r = await run();
    await expect(reserve(r.id, "a", 0, now, 0)).rejects.toThrow(
      "SERVICE_UNAVAILABLE",
    );
    expect((await repo.getSession("owner", now)).attempts).toBe(0);
  });
});
it("purges expired state and operation snapshots while retaining quota", async () => {
  const r = await run();
  const op = await reserve(r.id, "cleanup");
  await repo.commitTurn(op, settleTurn(r.state, p), now);
  await repo.cleanup(now + 31 * 86400000);
  const db = await mf.getD1Database("DB");
  const row = await db
    .prepare("SELECT state_json FROM runs WHERE id=?")
    .bind(r.id)
    .first<{ state_json: string | null }>();
  expect(row?.state_json).toBeNull();
  expect(
    await db
      .prepare("SELECT request_id FROM operations WHERE run_id=?")
      .bind(r.id)
      .first(),
  ).toBeNull();
  expect((await repo.getSession("owner", now + 31 * 86400000)).used).toBe(true);
  expect((await repo.getSession("owner", now + 181 * 86400000)).used).toBe(
    false,
  );
});
it("expires the same request ID without charging another attempt", async () => {
  const r = await run();
  await reserve(r.id, "crashed");
  await expect(reserve(r.id, "crashed", 0, now + 61000)).rejects.toThrow(
    "REQUEST_EXPIRED",
  );
  expect((await repo.getSession("owner", now + 61000)).attempts).toBe(1);
  await reserve(r.id, "replacement", 0, now + 61000);
  expect((await repo.getSession("owner", now + 61000)).attempts).toBe(2);
});
