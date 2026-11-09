import type { Usage } from "../ai/provider";
import {
  SimulationStateSchema,
  type SimulationState,
} from "../../domain/simulation/schema";

const DAY = 86_400_000;
const RUN_TTL = 30 * DAY;
const SESSION_TTL = 180 * DAY;
type Result = { meta: { changes: number } };
type Statement = {
  bind(...values: (string | number | null)[]): Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<Result>;
};
export type Database = {
  prepare(sql: string): Statement;
  batch(statements: Statement[]): Promise<Result[]>;
};
type Row = {
  id: string;
  session_hash: string;
  state_json: string | null;
  version: number;
  expires_at: number;
};
type OperationRow = {
  status: string;
  token: string;
  expected_version: number;
  state_json: string | null;
  session_hash: string;
  run_id: string;
  error_code: string | null;
};
export type Run = { id: string; state: SimulationState; expiresAt: number };
export type Reservation = {
  runId: string;
  sessionHash: string;
  requestId: string;
  token: string;
  expectedVersion: number;
  replay?: SimulationState;
};
export type Session = {
  used: boolean;
  attempts: number;
  runId: string | null;
  expired: boolean;
  eligibleAt: number | null;
};

/** All writes are parameterized. Batch guards make zero-row contention safe. */
export class Repository {
  constructor(private readonly db: Database) {}
  private q(sql: string, ...values: (string | number | null)[]): Statement {
    return this.db.prepare(sql).bind(...values);
  }
  /** Purges numerical saves at 30 days; retains only quota metadata until 180 days. */
  async cleanup(now: number): Promise<void> {
    await this.db.batch([
      this.q("DELETE FROM sessions WHERE expires_at <= ?", now),
      this.q(
        "UPDATE runs SET state_json = NULL WHERE expires_at <= ? AND state_json IS NOT NULL",
        now,
      ),
      this.q(
        "DELETE FROM operations WHERE run_id IN (SELECT id FROM runs WHERE expires_at <= ?)",
        now,
      ),
      this.q(
        "DELETE FROM daily_budget WHERE day < ?",
        new Date(now - 2 * DAY).toISOString().slice(0, 10),
      ),
    ]);
  }
  async getSession(hash: string, now: number): Promise<Session> {
    await this.cleanup(now);
    const s = await this.q(
      "SELECT used_at, attempts, expires_at FROM sessions WHERE session_hash = ?",
      hash,
    ).first<{ used_at: number | null; attempts: number; expires_at: number }>();
    const r = await this.q(
      "SELECT id, expires_at FROM runs WHERE session_hash = ?",
      hash,
    ).first<{ id: string; expires_at: number }>();
    return {
      used: s?.used_at != null,
      attempts: s?.attempts ?? 0,
      runId: r?.id ?? null,
      expired: !!r && r.expires_at <= now,
      eligibleAt: s?.used_at == null ? null : s.expires_at,
    };
  }
  async createRun(
    hash: string,
    state: SimulationState,
    now: number,
  ): Promise<Run> {
    await this.cleanup(now);
    await this.q(
      "INSERT INTO sessions(session_hash,created_at,expires_at) VALUES(?,?,?) ON CONFLICT DO NOTHING",
      hash,
      now,
      now + SESSION_TTL,
    ).run();
    const session = await this.getSession(hash, now);
    if (session.runId && !session.expired)
      return this.getRun(hash, session.runId, now);
    if (session.used) throw new Error("FREE_LIMIT");
    if (session.attempts >= 10) throw new Error("ATTEMPTS_EXHAUSTED");
    if (session.expired && session.runId)
      await this.deleteRun(hash, session.runId, now);
    const id = crypto.randomUUID();
    await this.q(
      "INSERT INTO runs(id,session_hash,state_json,created_at,expires_at) VALUES(?,?,?,?,?) ON CONFLICT(session_hash) DO NOTHING",
      id,
      hash,
      JSON.stringify(SimulationStateSchema.parse(state)),
      now,
      now + RUN_TTL,
    ).run();
    const row = await this.q(
      "SELECT * FROM runs WHERE session_hash = ?",
      hash,
    ).first<Row>();
    if (!row) throw new Error("SERVICE_UNAVAILABLE");
    return this.getRun(hash, row.id, now);
  }
  async getRun(hash: string, id: string, now: number): Promise<Run> {
    const r = await this.q(
      "SELECT * FROM runs WHERE id = ? AND session_hash = ?",
      id,
      hash,
    ).first<Row>();
    if (!r) throw new Error("RUN_NOT_FOUND");
    if (r.expires_at <= now || !r.state_json) throw new Error("RUN_EXPIRED");
    return {
      id: r.id,
      state: SimulationStateSchema.parse(JSON.parse(r.state_json)),
      expiresAt: r.expires_at,
    };
  }
  async reserveTurn(
    hash: string,
    id: string,
    requestId: string,
    version: number,
    now: number,
    limit: number,
  ): Promise<Reservation> {
    if (!Number.isSafeInteger(limit) || limit <= 0)
      throw new Error("SERVICE_UNAVAILABLE");
    const run = await this.getRun(hash, id, now);
    const prior = await this.q(
      "SELECT * FROM operations WHERE request_id = ?",
      requestId,
    ).first<OperationRow>();
    if (prior) {
      if (
        prior.session_hash !== hash ||
        prior.run_id !== id ||
        prior.expected_version !== version
      )
        throw new Error("REQUEST_CONFLICT");
      if (prior.status === "succeeded" && prior.state_json)
        return {
          runId: id,
          sessionHash: hash,
          requestId,
          token: prior.token,
          expectedVersion: version,
          replay: SimulationStateSchema.parse(JSON.parse(prior.state_json)),
        };
      throw new Error(
        prior.status === "pending"
          ? "REQUEST_PENDING"
          : (prior.error_code ?? "REQUEST_FAILED"),
      );
    }
    if (run.state.status === "completed") throw new Error("RUN_COMPLETED");
    if (run.state.version !== version) throw new Error("VERSION_CONFLICT");
    const token = crypto.randomUUID();
    const day = new Date(now).toISOString().slice(0, 10);
    const results = await this.db.batch([
      this.q(
        "UPDATE operations SET status='failed', error_code='REQUEST_EXPIRED' WHERE run_id=? AND status='pending' AND lease_until<=?",
        id,
        now,
      ),
      this.q(
        "INSERT INTO daily_budget(day,calls) VALUES(?,0) ON CONFLICT DO NOTHING",
        day,
      ),
      this.q(
        `INSERT INTO operations(request_id,run_id,session_hash,expected_version,token,status,lease_until,created_at)
        SELECT ?,r.id,?,? ,?,'pending',?,? FROM runs r JOIN sessions s ON s.session_hash=r.session_hash
        WHERE r.id=? AND r.session_hash=? AND r.version=? AND r.expires_at>? AND s.attempts<10
        AND (SELECT calls FROM daily_budget WHERE day=?)<?
        AND NOT EXISTS(SELECT 1 FROM operations WHERE run_id=r.id AND status='pending') ON CONFLICT DO NOTHING`,
        requestId,
        hash,
        version,
        token,
        now + 60_000,
        now,
        id,
        hash,
        version,
        now,
        day,
        limit,
      ),
      this.q(
        "UPDATE sessions SET attempts=attempts+1 WHERE session_hash=? AND EXISTS(SELECT 1 FROM operations WHERE token=?)",
        hash,
        token,
      ),
      this.q(
        "UPDATE daily_budget SET calls=calls+1 WHERE day=? AND EXISTS(SELECT 1 FROM operations WHERE token=?)",
        day,
        token,
      ),
    ]);
    if (results[2].meta.changes !== 1) {
      const s = await this.getSession(hash, now);
      if (s.attempts >= 10) throw new Error("ATTEMPTS_EXHAUSTED");
      const budget = await this.q(
        "SELECT calls FROM daily_budget WHERE day=?",
        day,
      ).first<{ calls: number }>();
      if ((budget?.calls ?? 0) >= limit) throw new Error("DAILY_LIMIT");
      throw new Error("REQUEST_CONFLICT");
    }
    return {
      runId: id,
      sessionHash: hash,
      requestId,
      token,
      expectedVersion: version,
    };
  }
  async commitTurn(
    op: Reservation,
    state: SimulationState,
    now: number,
    usage?: Usage,
  ): Promise<void> {
    const parsed = SimulationStateSchema.parse(state);
    if (parsed.version !== op.expectedVersion + 1)
      throw new Error("VERSION_CONFLICT");
    const json = JSON.stringify(parsed);
    const result = await this.db.batch([
      this.q(
        `UPDATE runs SET state_json=?,version=?,last_token=?,expires_at=? WHERE id=? AND session_hash=? AND version=? AND expires_at>?
        AND EXISTS(SELECT 1 FROM operations WHERE token=? AND status='pending' AND lease_until>?)`,
        json,
        parsed.version,
        op.token,
        now + RUN_TTL,
        op.runId,
        op.sessionHash,
        op.expectedVersion,
        now,
        op.token,
        now,
      ),
      this.q(
        "UPDATE operations SET status='succeeded',state_json=?,prompt_version=?,model=?,input_tokens=?,output_tokens=? WHERE token=? AND status='pending' AND EXISTS(SELECT 1 FROM runs WHERE id=? AND last_token=?)",
        json,
        usage?.promptVersion ?? null,
        usage?.model ?? null,
        usage?.inputTokens ?? null,
        usage?.outputTokens ?? null,
        op.token,
        op.runId,
        op.token,
      ),
      this.q(
        "UPDATE sessions SET expires_at=CASE WHEN used_at IS NULL THEN ? ELSE expires_at END,used_at=COALESCE(used_at,?) WHERE session_hash=? AND EXISTS(SELECT 1 FROM operations WHERE token=? AND status='succeeded')",
        now + SESSION_TTL,
        now,
        op.sessionHash,
        op.token,
      ),
    ]);
    if (result[0].meta.changes !== 1) throw new Error("STALE_REQUEST");
  }
  async failTurn(op: Reservation, code: string): Promise<void> {
    await this.q(
      "UPDATE operations SET status='failed',error_code=? WHERE token=? AND status='pending'",
      code,
      op.token,
    ).run();
  }
  async deleteRun(hash: string, id: string, now: number): Promise<void> {
    await this.q(
      "DELETE FROM runs WHERE id=? AND session_hash=?",
      id,
      hash,
    ).run();
    await this.cleanup(now);
  }
}
