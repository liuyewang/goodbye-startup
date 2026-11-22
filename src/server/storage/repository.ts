import { quotaWindow, validTimeZone } from "./quota-time";
import type { Usage } from "../ai/provider";
import {
  StoredSimulationStateSchema,
  type SimulationState,
  type StoredSimulationState,
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
  creation_key: string | null;
  expires_at: number;
};
type SessionRow = {
  used_at: number | null;
  used_until: number;
  attempts: number;
  attempt_day: number;
  time_zone: string | null;
  run_version: number | null;
  run_id: string | null;
  state_json: string | null;
  run_expires_at: number | null;
};
type OperationRow = {
  status: string;
  token: string;
  expected_version: number;
  state_json: string | null;
  session_hash: string;
  run_id: string;
  error_code: string | null;
  lease_until: number;
};
type PublicRun = { id: string; state: SimulationState; expiresAt: number };
export type Run = PublicRun & { state: StoredSimulationState };

export function publicRun(run: Run): PublicRun {
  const state = { ...run.state };
  delete state.settlementVersion;
  return { id: run.id, state, expiresAt: run.expiresAt };
}
export type Reservation = {
  runId: string;
  sessionHash: string;
  requestId: string;
  token: string;
  expectedVersion: number;
  replay?: StoredSimulationState;
};
export type Session = {
  used: boolean;
  attempts: number;
  runId: string | null;
  expired: boolean;
  eligibleAt: number | null;
  timeZone: string;
};
type SessionSnapshot = { session: Session; run: Run | null };
const TURN_FAILURE_CODES = new Set([
  "AI_UNAVAILABLE",
  "AI_INVALID_RESPONSE",
  "AI_TIMEOUT",
  "RUN_NOT_FOUND",
  "RUN_EXPIRED",
  "STALE_REQUEST",
  "VERSION_CONFLICT",
]);

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
  private async selectTimeZone(
    hash: string,
    now: number,
    requested?: string,
  ): Promise<string> {
    const requestedZone =
      requested === undefined ? undefined : validTimeZone(requested);
    const existing = await this.q(
      "SELECT time_zone,used_at FROM sessions WHERE session_hash=?",
      hash,
    ).first<{ time_zone: string | null; used_at: number | null }>();
    const zone = requestedZone ?? existing?.time_zone ?? "UTC";
    if (existing?.time_zone !== zone) {
      const legacyEnd =
        existing?.used_at == null ? 0 : quotaWindow(existing.used_at, zone).end;
      await this.q(
        `UPDATE sessions SET used_until=CASE WHEN time_zone IS NULL THEN ? ELSE used_until END,
         timezone_locked_until=CASE WHEN time_zone IS NULL THEN MAX(timezone_locked_until,?) ELSE timezone_locked_until END,
         time_zone=? WHERE session_hash=?
         AND (time_zone IS NULL OR timezone_locked_until<=?)
         AND NOT EXISTS(SELECT 1 FROM operations WHERE session_hash=? AND status='pending' AND lease_until>?)`,
        legacyEnd,
        legacyEnd,
        zone,
        hash,
        now,
        hash,
        now,
      ).run();
    }
    const row = await this.q(
      "SELECT time_zone FROM sessions WHERE session_hash=?",
      hash,
    ).first<{ time_zone: string | null }>();
    return row?.time_zone ?? zone ?? "UTC";
  }
  async getSession(
    hash: string,
    now: number,
    timeZone?: string,
  ): Promise<SessionSnapshot> {
    await this.cleanup(now);
    const zone = await this.selectTimeZone(hash, now, timeZone);
    return this.readSession(hash, now, zone);
  }
  private async readSession(
    hash: string,
    now: number,
    fallbackZone = "UTC",
  ): Promise<SessionSnapshot> {
    const row = await this.q(
      `SELECT s.used_at, s.used_until, s.attempts, s.attempt_day, s.time_zone, r.version AS run_version,
        r.id AS run_id, r.expires_at AS run_expires_at, r.state_json
        FROM sessions s LEFT JOIN runs r ON r.session_hash = s.session_hash
        WHERE s.session_hash = ?`,
      hash,
    ).first<SessionRow>();
    const expired = row?.run_expires_at != null && row.run_expires_at <= now;
    const timeZone = row?.time_zone ?? fallbackZone;
    const { start: day, end } = quotaWindow(now, timeZone);
    const used = (row?.used_until ?? 0) > now;
    const renew =
      row &&
      !used &&
      row.attempt_day < day &&
      (!row.run_id || expired || row.run_version === 0);
    const attempts = renew ? 0 : (row?.attempts ?? 0);
    return {
      session: {
        used,
        attempts,
        runId: row?.run_id ?? null,
        expired,
        eligibleAt: used
          ? row!.used_until
          : attempts >= 10 && (row?.attempt_day ?? 0) >= day
            ? end
            : null,
        timeZone,
      },
      run:
        row?.run_id && row.run_expires_at !== null && !expired
          ? this.decodeRun(
              {
                id: row.run_id,
                expires_at: row.run_expires_at,
                state_json: row.state_json,
              },
              now,
            )
          : null,
    };
  }
  async createRun(
    hash: string,
    state: StoredSimulationState,
    now: number,
    replaceRunId?: string,
    timeZone?: string,
    creationRequestId?: string,
  ): Promise<Run> {
    const json = JSON.stringify(StoredSimulationStateSchema.parse(state));
    const creationKey =
      replaceRunId && creationRequestId
        ? `${replaceRunId}:${creationRequestId}`
        : null;
    const requestedZone =
      timeZone === undefined ? undefined : validTimeZone(timeZone);
    await this.cleanup(now);
    await this.q(
      "INSERT INTO sessions(session_hash,created_at,expires_at,attempt_day,time_zone) VALUES(?,?,?,?,?) ON CONFLICT DO NOTHING",
      hash,
      now,
      now + SESSION_TTL,
      now,
      requestedZone ?? "UTC",
    ).run();
    const zone = await this.selectTimeZone(hash, now, requestedZone);
    const { start: day } = quotaWindow(now, zone);
    const { session, run } = await this.readSession(hash, now);
    if (
      replaceRunId &&
      (run?.id !== replaceRunId || run.state.status !== "completed")
    ) {
      if (creationKey && run) {
        const prior = await this.q(
          "SELECT creation_key FROM runs WHERE id=? AND session_hash=?",
          run.id,
          hash,
        ).first<{ creation_key: string | null }>();
        if (
          prior?.creation_key === creationKey &&
          JSON.stringify(run.state.setup) === JSON.stringify(state.setup)
        )
          return run;
      }
      throw new Error("VERSION_CONFLICT");
    }
    if (run && !replaceRunId) return run;
    if (session.used) throw new Error("FREE_LIMIT");
    if (session.eligibleAt !== null) throw new Error("ATTEMPTS_EXHAUSTED");
    const id = crypto.randomUUID();
    const results = await this.db.batch([
      this.q(
        `UPDATE sessions SET attempts=0,attempt_day=?,expires_at=?
         WHERE session_hash=? AND attempt_day<? AND used_until<=? AND COALESCE(time_zone,'UTC')=?
         AND NOT EXISTS(SELECT 1 FROM runs WHERE session_hash=? AND expires_at>? AND id<>?)`,
        day,
        now + SESSION_TTL,
        hash,
        day,
        now,
        zone,
        hash,
        now,
        replaceRunId ?? "",
      ),
      this.q(
        `DELETE FROM runs WHERE session_hash=? AND
         (expires_at<=? OR (id=? AND json_extract(state_json,'$.status')='completed'))
         AND EXISTS(SELECT 1 FROM sessions WHERE session_hash=? AND used_until<=? AND attempts<10 AND COALESCE(time_zone,'UTC')=?)
         AND NOT EXISTS(SELECT 1 FROM operations WHERE run_id=runs.id AND status='pending' AND lease_until>?)`,
        hash,
        now,
        replaceRunId ?? "",
        hash,
        now,
        zone,
        now,
      ),
      this.q(
        `INSERT INTO runs(id,session_hash,state_json,created_at,expires_at,creation_key)
         SELECT ?,session_hash,?,?,?,? FROM sessions WHERE session_hash=?
         AND used_until<=? AND attempts<10 AND COALESCE(time_zone,'UTC')=? AND (? IS NULL OR changes()=1)
         ON CONFLICT(session_hash) DO NOTHING`,
        id,
        json,
        now,
        now + RUN_TTL,
        creationKey,
        hash,
        now,
        zone,
        replaceRunId ?? null,
      ),
    ]);
    const row = await this.q(
      "SELECT * FROM runs WHERE session_hash = ?",
      hash,
    ).first<Row>();
    if (replaceRunId && results[2].meta.changes !== 1) {
      if (row && creationKey && row.creation_key === creationKey) {
        const replay = this.decodeRun(row, now);
        if (JSON.stringify(replay.state.setup) === JSON.stringify(state.setup))
          return replay;
      }
      throw new Error("VERSION_CONFLICT");
    }
    if (!row) {
      const current = await this.readSession(hash, now);
      if (current.session.used) throw new Error("FREE_LIMIT");
      if (current.session.eligibleAt !== null)
        throw new Error("ATTEMPTS_EXHAUSTED");
      throw new Error("REQUEST_CONFLICT");
    }
    return this.decodeRun(row, now);
  }
  async getRun(hash: string, id: string, now: number): Promise<Run> {
    const r = await this.q(
      "SELECT * FROM runs WHERE id = ? AND session_hash = ?",
      id,
      hash,
    ).first<Row>();
    if (!r) throw new Error("RUN_NOT_FOUND");
    return this.decodeRun(r, now);
  }
  private decodeRun(
    r: Pick<Row, "id" | "expires_at" | "state_json">,
    now: number,
  ): Run {
    if (r.expires_at <= now || !r.state_json) throw new Error("RUN_EXPIRED");
    return {
      id: r.id,
      state: StoredSimulationStateSchema.parse(JSON.parse(r.state_json)),
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
    const replay = await this.checkPriorOperation(
      hash,
      id,
      requestId,
      version,
      now,
    );
    if (replay) return replay;
    if (run.state.status === "completed") throw new Error("RUN_COMPLETED");
    if (run.state.version !== version) throw new Error("VERSION_CONFLICT");
    const zone = await this.selectTimeZone(hash, now);
    const { start: localDay, end: localEnd } = quotaWindow(now, zone);
    const token = crypto.randomUUID();
    const day = new Date(now).toISOString().slice(0, 10);
    const results = await this.db.batch([
      this.q(
        `UPDATE sessions SET attempts=0,attempt_day=? WHERE session_hash=? AND attempt_day<?
         AND used_until<=? AND COALESCE(time_zone,'UTC')=?
         AND EXISTS(SELECT 1 FROM runs WHERE id=? AND session_hash=? AND version=0 AND expires_at>?)
         AND NOT EXISTS(SELECT 1 FROM operations WHERE run_id=? AND status='pending' AND lease_until>?)`,
        localDay,
        hash,
        localDay,
        now,
        zone,
        id,
        hash,
        now,
        id,
        now,
      ),
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
        AND COALESCE(s.time_zone,'UTC')=? AND (r.version>0 OR s.used_until<=?)
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
        zone,
        now,
        day,
        limit,
      ),
      this.q(
        "UPDATE sessions SET attempts=attempts+1,timezone_locked_until=MAX(timezone_locked_until,?) WHERE session_hash=? AND EXISTS(SELECT 1 FROM operations WHERE token=?)",
        localEnd,
        hash,
        token,
      ),
      this.q(
        "UPDATE daily_budget SET calls=calls+1 WHERE day=? AND EXISTS(SELECT 1 FROM operations WHERE token=?)",
        day,
        token,
      ),
    ]);
    if (results[3].meta.changes !== 1) {
      const { session } = await this.readSession(hash, now);
      const budget = await this.q(
        "SELECT calls FROM daily_budget WHERE day=?",
        day,
      ).first<{ calls: number }>();
      // Recheck after both counters: another request with this ID may have
      // reserved one of those attempts since the first lookup.
      const replay = await this.checkPriorOperation(
        hash,
        id,
        requestId,
        version,
        now,
      );
      if (replay) return replay;
      if (version === 0 && session.used) throw new Error("FREE_LIMIT");
      if (session.attempts >= 10) throw new Error("ATTEMPTS_EXHAUSTED");
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
  private async checkPriorOperation(
    hash: string,
    id: string,
    requestId: string,
    version: number,
    now: number,
  ): Promise<Reservation | null> {
    let prior = await this.q(
      "SELECT * FROM operations WHERE request_id = ?",
      requestId,
    ).first<OperationRow>();
    if (!prior) return null;
    if (
      prior.session_hash !== hash ||
      prior.run_id !== id ||
      prior.expected_version !== version
    )
      throw new Error("REQUEST_CONFLICT");
    if (prior.status === "pending" && prior.lease_until <= now) {
      const expired = await this.q(
        "UPDATE operations SET status='failed',error_code='REQUEST_EXPIRED' WHERE token=? AND status='pending' AND lease_until<=?",
        prior.token,
        now,
      ).run();
      if (expired.meta.changes === 1) throw new Error("REQUEST_EXPIRED");
      // The original operation may have settled since the first read.
      prior = await this.q(
        "SELECT * FROM operations WHERE token = ?",
        prior.token,
      ).first<OperationRow>();
      if (!prior) throw new Error("REQUEST_EXPIRED");
    }
    if (prior.status === "succeeded" && prior.state_json)
      return {
        runId: id,
        sessionHash: hash,
        requestId,
        token: prior.token,
        expectedVersion: version,
        replay: StoredSimulationStateSchema.parse(JSON.parse(prior.state_json)),
      };
    if (prior.status === "pending") throw new Error("REQUEST_PENDING");
    const code = prior.error_code;
    throw new Error(
      code && (code === "REQUEST_EXPIRED" || TURN_FAILURE_CODES.has(code))
        ? code
        : "REQUEST_FAILED",
    );
  }
  async commitTurn(
    op: Reservation,
    state: StoredSimulationState,
    now: number,
    usage?: Usage,
  ): Promise<Run> {
    const parsed = StoredSimulationStateSchema.parse(state);
    if (parsed.version !== op.expectedVersion + 1)
      throw new Error("VERSION_CONFLICT");
    const json = JSON.stringify(parsed);
    const { end } = quotaWindow(
      now,
      await this.selectTimeZone(op.sessionHash, now),
    );
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
        "UPDATE sessions SET expires_at=?,used_at=?,used_until=?,timezone_locked_until=MAX(timezone_locked_until,?) WHERE session_hash=? AND EXISTS(SELECT 1 FROM operations WHERE token=? AND status='succeeded' AND expected_version=0)",
        now + SESSION_TTL,
        now,
        end,
        end,
        op.sessionHash,
        op.token,
      ),
    ]);
    if (result[0].meta.changes !== 1) throw new Error("STALE_REQUEST");
    return { id: op.runId, state: parsed, expiresAt: now + RUN_TTL };
  }
  async failTurn(op: Reservation, code: string): Promise<void> {
    await this.q(
      "UPDATE operations SET status='failed',error_code=? WHERE token=? AND status='pending'",
      TURN_FAILURE_CODES.has(code) ? code : "REQUEST_FAILED",
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
