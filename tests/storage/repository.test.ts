import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile, readdir } from "node:fs/promises";
import { Repository, type Database } from "../../src/server/storage/repository";
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
  for (const file of (await readdir("migrations"))
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    const sql = await readFile(`migrations/${file}`, "utf8");
    await db.exec(sql.replace(/\n/g, " "));
  }
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
    expect(await repo.getSession("owner", now)).toMatchObject({
      session: { used: false, runId: r.id },
      run: r,
    });
    await repo.commitTurn(op, settleTurn(r.state, p), now + 100);
    expect(await repo.getSession("owner", now + 100)).toMatchObject({
      session: { used: true, runId: r.id },
      run: { id: r.id, state: { version: 1 } },
    });
  });
  it("replays successful requests without another allocation", async () => {
    const r = await run();
    const op = await reserve(r.id, "req1");
    await repo.commitTurn(op, settleTurn(r.state, p), now + 100);
    const replay = await reserve(r.id, "req1");
    expect(replay.replay?.version).toBe(1);
    expect((await repo.getSession("owner", now)).session.attempts).toBe(1);
  });
  it("replays a commit that wins between the expiry read and update", async () => {
    const r = await run();
    const op = await reserve(r.id, "racing-expiry", 0, now, 1);
    const settled = settleTurn(r.state, p);
    const db = await mf.getD1Database("DB");
    const beforeExpiryUpdate = (
      statement: D1PreparedStatement,
    ): ReturnType<Database["prepare"]> => ({
      bind: (...values) => beforeExpiryUpdate(statement.bind(...values)),
      first: statement.first.bind(statement),
      async run() {
        // The commit captured its timestamp before the lease deadline but
        // reaches D1 after the retry has read the still-pending row.
        await repo.commitTurn(op, settled, now + 59_999);
        return statement.run();
      },
    });
    const retryRepo = new Repository({
      batch: db.batch.bind(db),
      prepare(sql) {
        const statement = db.prepare(sql);
        return sql.includes(
          "WHERE token=? AND status='pending' AND lease_until<=?",
        )
          ? beforeExpiryUpdate(statement)
          : statement;
      },
    });

    await expect(
      retryRepo.reserveTurn("owner", r.id, op.requestId, 0, now + 60_000, 1),
    ).resolves.toEqual({ ...op, replay: settled });
    expect(
      (await repo.getSession("owner", now + 60_000)).session,
    ).toMatchObject({
      used: true,
      attempts: 1,
    });
    const day = new Date(now).toISOString().slice(0, 10);
    expect(
      await db
        .prepare("SELECT calls FROM daily_budget WHERE day = ?")
        .bind(day)
        .first("calls"),
    ).toBe(1);
  });
  it("keeps the chosen rule in saved runs and replay snapshots", async () => {
    const old = await run();
    const exactSetup = createSimulation(setup, 2);
    const reused = await repo.createRun("owner", exactSetup, now);
    expect(reused).toEqual(old);
    expect(reused.state).not.toHaveProperty("settlementVersion");
    const exact = await repo.createRun("exact-owner", exactSetup, now);
    const initialized = settleTurn(exact.state, p);
    const first = await repo.reserveTurn(
      "exact-owner",
      exact.id,
      "exact-0",
      0,
      now,
      100,
    );
    await repo.commitTurn(first, initialized, now);
    const resumed = (await repo.getSession("exact-owner", now)).run!;
    const result = settleTurn(resumed.state, {
      ...p,
      visits: 100,
      signupRate: 0.29,
      paidRate: 1,
    });
    expect(result.customers).toBe(29);
    const second = await repo.reserveTurn(
      "exact-owner",
      exact.id,
      "exact-1",
      1,
      now,
      100,
    );
    await repo.commitTurn(second, result, now);
    const replay = await repo.reserveTurn(
      "exact-owner",
      exact.id,
      "exact-1",
      1,
      now,
      100,
    );
    expect(replay.replay).toMatchObject({
      settlementVersion: 2,
      customers: 29,
    });
    expect((await repo.getSession("exact-owner", now)).session.attempts).toBe(
      2,
    );
  });
  it("only allows one concurrent reservation per version", async () => {
    const r = await run();
    const results = await Promise.allSettled([
      reserve(r.id, "a"),
      reserve(r.id, "b"),
    ]);
    expect(results.filter((x) => x.status === "fulfilled")).toHaveLength(1);
    expect((await repo.getSession("owner", now)).session.attempts).toBe(1);
  });
  it("reports a concurrent duplicate as pending even at the daily limit", async () => {
    const r = await run();
    const results = await Promise.allSettled([
      reserve(r.id, "same", 0, now, 1),
      reserve(r.id, "same", 0, now, 1),
    ]);
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    const duplicate = results.find((result) => result.status === "rejected");
    expect(duplicate?.reason).toMatchObject({ message: "REQUEST_PENDING" });
    expect((await repo.getSession("owner", now)).session.attempts).toBe(1);
  });
  it("persists only a bounded failure code for unexpected errors", async () => {
    const r = await run();
    const op = await reserve(r.id, "failed");
    await repo.failTurn(
      op,
      "unexpected database diagnostic with private context",
    );
    await expect(reserve(r.id, "failed")).rejects.toThrow("REQUEST_FAILED");
    expect((await repo.getSession("owner", now)).session.attempts).toBe(1);
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
  it("expires saves after 30 days while daily eligibility has renewed", async () => {
    const r = await run();
    const op = await reserve(r.id, "a");
    await repo.commitTurn(op, settleTurn(r.state, p), now);
    await expect(
      repo.getRun("owner", r.id, now + 31 * 86400000),
    ).rejects.toThrow("RUN_EXPIRED");
    expect(
      (await repo.getSession("owner", now + 31 * 86400000)).session.used,
    ).toBe(false);
  });
  it("fails closed when the global budget is missing or zero", async () => {
    const r = await run();
    await expect(reserve(r.id, "a", 0, now, 0)).rejects.toThrow(
      "SERVICE_UNAVAILABLE",
    );
    expect((await repo.getSession("owner", now)).session.attempts).toBe(0);
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
  expect(
    (await repo.getSession("owner", now + 31 * 86400000)).session.used,
  ).toBe(false);
  expect(
    (await repo.getSession("owner", now + 181 * 86400000)).session.used,
  ).toBe(false);
});
it("expires the same request ID without charging another attempt", async () => {
  const r = await run();
  await reserve(r.id, "crashed");
  await expect(reserve(r.id, "crashed", 0, now + 61000)).rejects.toThrow(
    "REQUEST_EXPIRED",
  );
  expect((await repo.getSession("owner", now + 61000)).session.attempts).toBe(
    1,
  );
  await reserve(r.id, "replacement", 0, now + 61000);
  expect((await repo.getSession("owner", now + 61000)).session.attempts).toBe(
    2,
  );
});

describe("daily free simulations (UTC)", () => {
  const midnight = Date.parse("2026-11-23T00:00:00Z");
  const before = midnight - 1000;
  async function started(time = before) {
    const r = await repo.createRun("owner", createSimulation(setup), time);
    const op = await reserve(r.id, "first", 0, time);
    return repo.commitTurn(op, settleTurn(r.state, p), time);
  }
  async function completed() {
    let r = await started();
    for (let v = 1; v < 6; v++) {
      const op = await reserve(r.id, `stage-${v}`, v, before);
      r = await repo.commitTurn(op, settleTurn(r.state, p), before);
    }
    return r;
  }
  it("restores new-run eligibility at UTC midnight without erasing an active run", async () => {
    const r = await started();
    expect((await repo.getSession("owner", before)).session).toMatchObject({
      used: true,
      eligibleAt: midnight,
    });
    expect(await repo.getSession("owner", midnight)).toMatchObject({
      session: { used: false, eligibleAt: null, attempts: 1 },
      run: { id: r.id },
    });
    const op = await reserve(r.id, "tomorrow-stage", 1, midnight);
    await repo.commitTurn(op, settleTurn(r.state, p), midnight);
    expect((await repo.getSession("owner", midnight)).session.used).toBe(false);
  });
  it("charges the first success to its commit day across midnight", async () => {
    const r = await repo.createRun("owner", createSimulation(setup), before);
    const op = await reserve(r.id, "midnight-first", 0, before);
    await repo.commitTurn(op, settleTurn(r.state, p), midnight);
    expect((await repo.getSession("owner", midnight)).session).toMatchObject({
      used: true,
      eligibleAt: midnight + 86400000,
    });
    await repo.deleteRun("owner", r.id, midnight);
    await expect(
      repo.createRun("owner", createSimulation(setup), midnight),
    ).rejects.toThrow("FREE_LIMIT");
  });
  it("allows a new run after deleting yesterday's used run but never twice today", async () => {
    const old = await started();
    await repo.deleteRun("owner", old.id, midnight);
    const next = await repo.createRun(
      "owner",
      createSimulation(setup),
      midnight,
    );
    expect(next.id).not.toBe(old.id);
    expect((await repo.getSession("owner", midnight)).session.attempts).toBe(0);
    const op = await reserve(next.id, "new-day", 0, midnight);
    await repo.commitTurn(op, settleTurn(next.state, p), midnight);
    await repo.deleteRun("owner", next.id, midnight);
    await expect(
      repo.createRun("owner", createSimulation(setup), midnight),
    ).rejects.toThrow("FREE_LIMIT");
  });
  it("renews failed draft attempts the next day but not after same-day deletion", async () => {
    let r = await repo.createRun("owner", createSimulation(setup), before);
    for (let i = 0; i < 10; i++) {
      const op = await reserve(r.id, `failed-${i}`, 0, before);
      await repo.failTurn(op, "AI_UNAVAILABLE");
    }
    expect((await repo.getSession("owner", before)).session.eligibleAt).toBe(
      midnight,
    );
    await repo.deleteRun("owner", r.id, before);
    await expect(
      repo.createRun("owner", createSimulation(setup), before),
    ).rejects.toThrow("ATTEMPTS_EXHAUSTED");
    r = await repo.createRun("owner", createSimulation(setup), midnight);
    await reserve(r.id, "new-try", 0, midnight);
    expect((await repo.getSession("owner", midnight)).session.attempts).toBe(1);
  });
  it("renews an unstarted draft after midnight without changing its ID", async () => {
    const r = await repo.createRun("owner", createSimulation(setup), before);
    for (let i = 0; i < 10; i++) {
      const op = await reserve(r.id, `draft-${i}`, 0, before);
      await repo.failTurn(op, "AI_UNAVAILABLE");
    }
    await reserve(r.id, "next-day-draft", 0, midnight);
    expect((await repo.getSession("owner", midnight)).session.attempts).toBe(1);
  });
  it("does not renew a started run's ten-attempt cap on a new day", async () => {
    const r = await started();
    for (let i = 1; i < 10; i++) {
      const op = await reserve(r.id, `active-${i}`, 1, before);
      await repo.failTurn(op, "AI_UNAVAILABLE");
    }
    await expect(reserve(r.id, "too-many", 1, midnight)).rejects.toThrow(
      "ATTEMPTS_EXHAUSTED",
    );
    expect(
      (await repo.getSession("owner", midnight)).session.eligibleAt,
    ).toBeNull();
  });
  it("atomically replaces a completed run next day and rejects a stale replacement", async () => {
    const old = await completed();
    await expect(
      repo.createRun("owner", createSimulation(setup), before, old.id),
    ).rejects.toThrow("FREE_LIMIT");
    const results = await Promise.allSettled([
      repo.createRun("owner", createSimulation(setup), midnight, old.id),
      repo.createRun("owner", createSimulation(setup), midnight, old.id),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((r) => r.status === "rejected")[0]).toMatchObject({
      reason: { message: "VERSION_CONFLICT" },
    });
    const snapshot = await repo.getSession("owner", midnight);
    expect(snapshot.run?.id).not.toBe(old.id);
    expect(snapshot.session.attempts).toBe(0);
    await repo.deleteRun("owner", old.id, midnight);
    expect((await repo.getSession("owner", midnight)).run?.id).toBe(
      snapshot.run?.id,
    );
  });
  it("refuses to replace an unfinished run or one belonging to another browser", async () => {
    const old = await started();
    await expect(
      repo.createRun("owner", createSimulation(setup), midnight, old.id),
    ).rejects.toThrow("VERSION_CONFLICT");
    await expect(
      repo.createRun("other", createSimulation(setup), midnight, old.id),
    ).rejects.toThrow("VERSION_CONFLICT");
    expect((await repo.getSession("owner", midnight)).run?.id).toBe(old.id);
  });
});

describe("device time zone daily eligibility", () => {
  it.each([
    ["Asia/Shanghai", "2026-11-22T15:59:59Z", "2026-11-22T16:00:00Z"],
    ["Asia/Kathmandu", "2026-11-22T18:14:59Z", "2026-11-22T18:15:00Z"],
  ])("resets at local midnight in %s (%s)", async (zone, start, end) => {
    const time = Date.parse(start);
    const next = Date.parse(end);
    const r = await repo.createRun(
      "owner",
      createSimulation(setup),
      time,
      undefined,
      zone,
    );
    const op = await reserve(r.id, "local-first", 0, time);
    await repo.commitTurn(op, settleTurn(r.state, p), time);
    expect(
      (await repo.getSession("owner", time, zone)).session.eligibleAt,
    ).toBe(next);
    expect((await repo.getSession("owner", next - 1, zone)).session.used).toBe(
      true,
    );
    expect((await repo.getSession("owner", next, zone)).session.used).toBe(
      false,
    );
  });
  it("does not grant another free run immediately after changing device zone", async () => {
    const time = Date.parse("2026-11-22T15:00:00Z");
    const r = await repo.createRun(
      "owner",
      createSimulation(setup),
      time,
      undefined,
      "America/Los_Angeles",
    );
    const op = await reserve(r.id, "zone-first", 0, time);
    await repo.commitTurn(op, settleTurn(r.state, p), time);
    const switched = await repo.getSession(
      "owner",
      time + 3600000,
      "Asia/Tokyo",
    );
    expect(switched.session).toMatchObject({
      used: true,
      timeZone: "America/Los_Angeles",
      eligibleAt: Date.parse("2026-11-23T08:00:00Z"),
    });
    const after = await repo.getSession(
      "owner",
      Date.parse("2026-11-23T08:00:00Z"),
      "Asia/Tokyo",
    );
    expect(after.session).toMatchObject({
      used: false,
      timeZone: "Asia/Tokyo",
    });
  });
  it("rejects invalid zones without creating a run", async () => {
    await expect(
      repo.createRun(
        "owner",
        createSimulation(setup),
        now,
        undefined,
        "fake/timezone",
      ),
    ).rejects.toThrow("INVALID_INPUT");
    expect((await repo.getSession("owner", now)).run).toBeNull();
  });
});

it("migrates used and failed legacy allocations without losing today's limits", async () => {
  const db = await mf.getD1Database("DB");
  await db.exec(
    "ALTER TABLE sessions DROP COLUMN attempt_day; ALTER TABLE sessions DROP COLUMN time_zone; ALTER TABLE sessions DROP COLUMN timezone_locked_until; ALTER TABLE sessions DROP COLUMN used_until; ALTER TABLE runs DROP COLUMN creation_key;",
  );
  const time = Date.now();
  const day = Math.floor(time / 86400000) * 86400000;
  for (const [hash, used, attempts] of [
    ["today", time, 1],
    ["yesterday", day - 1, 6],
    ["failed", null, 10],
  ] as const) {
    await db
      .prepare(
        "INSERT INTO sessions(session_hash,created_at,expires_at,used_at,attempts) VALUES(?,?,?,?,?)",
      )
      .bind(hash, time - 86400000, time + 180 * 86400000, used, attempts)
      .run();
  }
  await db.exec(
    (await readFile("migrations/0002_daily_free.sql", "utf8")).replace(
      /\n/g,
      " ",
    ),
  );
  expect((await repo.getSession("today", time, "UTC")).session.used).toBe(true);
  expect((await repo.getSession("yesterday", time, "UTC")).session.used).toBe(
    false,
  );
  await expect(
    repo.createRun("failed", createSimulation(setup), time),
  ).rejects.toThrow("ATTEMPTS_EXHAUSTED");
  await expect(
    repo.createRun("failed", createSimulation(setup), day + 86400000),
  ).resolves.toHaveProperty("id");
});

it("does not create a replacement if the selected completed run disappears before its transaction", async () => {
  let r = await run();
  for (let version = 0; version < 6; version++) {
    const op = await reserve(r.id, `replace-race-${version}`, version);
    r = await repo.commitTurn(op, settleTurn(r.state, p), now);
  }
  const db = await mf.getD1Database("DB");
  let batches = 0;
  const racing = new Repository({
    prepare: db.prepare.bind(db),
    async batch(statements) {
      // createRun's first batch is cleanup, the second replaces the run.
      if (++batches === 2)
        await db.prepare("DELETE FROM runs WHERE id=?").bind(r.id).run();
      return db.batch(statements as D1PreparedStatement[]);
    },
  });
  await expect(
    racing.createRun("owner", createSimulation(setup), now + 86400000, r.id),
  ).rejects.toThrow("VERSION_CONFLICT");
  expect((await repo.getSession("owner", now + 86400000)).run).toBeNull();
});

it("replays the same replacement creation after a lost response without accepting a different request", async () => {
  let r = await run();
  for (let version = 0; version < 6; version++) {
    const op = await reserve(r.id, `create-replay-${version}`, version);
    r = await repo.commitTurn(op, settleTurn(r.state, p), now);
  }
  const key = crypto.randomUUID();
  const next = await repo.createRun(
    "owner",
    createSimulation(setup),
    now + 86400000,
    r.id,
    "UTC",
    key,
  );
  await expect(
    repo.createRun(
      "owner",
      createSimulation(setup),
      now + 86400000,
      r.id,
      "UTC",
      key,
    ),
  ).resolves.toEqual(next);
  await expect(
    repo.createRun(
      "owner",
      createSimulation(setup),
      now + 86400000,
      r.id,
      "UTC",
      crypto.randomUUID(),
    ),
  ).rejects.toThrow("VERSION_CONFLICT");
  expect(
    (await repo.getSession("owner", now + 86400000)).session.attempts,
  ).toBe(0);
});

it("does not reset attempts when a competing request changes the quota time zone", async () => {
  const midnight = Date.parse("2026-11-23T00:00:00Z");
  const r = await repo.createRun(
    "owner",
    createSimulation(setup),
    midnight - 1000,
  );
  const first = await reserve(r.id, "old-failure", 0, midnight - 1000);
  await repo.failTurn(first, "AI_UNAVAILABLE");
  const db = await mf.getD1Database("DB");
  const staleZone = new Repository({
    prepare: db.prepare.bind(db),
    async batch(statements) {
      await repo.getSession("owner", midnight, "Asia/Singapore");
      const op = await reserve(r.id, "new-zone-failure", 0, midnight);
      await repo.failTurn(op, "AI_UNAVAILABLE");
      return db.batch(statements as D1PreparedStatement[]);
    },
  });
  await expect(
    staleZone.reserveTurn("owner", r.id, "stale-zone", 0, midnight, 100),
  ).rejects.toThrow("REQUEST_CONFLICT");
  expect((await repo.getSession("owner", midnight)).session.attempts).toBe(2);
});

it("concurrent identical replacement requests return the same created draft", async () => {
  let r = await run();
  for (let v = 0; v < 6; v++) {
    const op = await reserve(r.id, `concurrent-create-${v}`, v);
    r = await repo.commitTurn(op, settleTurn(r.state, p), now);
  }
  const key = crypto.randomUUID();
  const [a, b] = await Promise.all([
    repo.createRun(
      "owner",
      createSimulation(setup),
      now + 86400000,
      r.id,
      "UTC",
      key,
    ),
    repo.createRun(
      "owner",
      createSimulation(setup),
      now + 86400000,
      r.id,
      "UTC",
      key,
    ),
  ]);
  expect(a.id).toBe(b.id);
});
