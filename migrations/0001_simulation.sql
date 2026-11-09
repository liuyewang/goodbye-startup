CREATE TABLE sessions (session_hash TEXT PRIMARY KEY, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, used_at INTEGER, attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts BETWEEN 0 AND 10));
CREATE TABLE runs (id TEXT PRIMARY KEY, session_hash TEXT NOT NULL UNIQUE REFERENCES sessions(session_hash) ON DELETE CASCADE, state_json TEXT, version INTEGER NOT NULL DEFAULT 0, last_token TEXT, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE operations (request_id TEXT PRIMARY KEY, run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE, session_hash TEXT NOT NULL, expected_version INTEGER NOT NULL, token TEXT NOT NULL UNIQUE, status TEXT NOT NULL CHECK(status IN ('pending','succeeded','failed')), lease_until INTEGER NOT NULL, created_at INTEGER NOT NULL, state_json TEXT, error_code TEXT, prompt_version TEXT, model TEXT, input_tokens INTEGER, output_tokens INTEGER);
CREATE INDEX operations_run_status ON operations(run_id,status);
CREATE TABLE daily_budget (day TEXT PRIMARY KEY, calls INTEGER NOT NULL DEFAULT 0 CHECK(calls >= 0));
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE INDEX runs_expiry ON runs(expires_at);
