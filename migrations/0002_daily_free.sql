ALTER TABLE sessions ADD COLUMN attempt_day INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sessions ADD COLUMN time_zone TEXT;
ALTER TABLE sessions ADD COLUMN timezone_locked_until INTEGER NOT NULL DEFAULT 0;
UPDATE sessions SET attempt_day = COALESCE((SELECT MAX(created_at) FROM operations WHERE session_hash=sessions.session_hash), used_at, CASE WHEN attempts>0 THEN unixepoch()*1000 ELSE created_at END);
ALTER TABLE sessions ADD COLUMN used_until INTEGER NOT NULL DEFAULT 0;
UPDATE sessions SET used_until = CASE WHEN used_at IS NULL THEN 0 ELSE (CAST(used_at / 86400000 AS INTEGER) + 1) * 86400000 END;
ALTER TABLE runs ADD COLUMN creation_key TEXT;
