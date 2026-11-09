# Security and data boundaries

Report suspected vulnerabilities privately to the repository owner using an available private GitHub security channel. Do not include secrets or user transcripts in public issues. No unverified security email address is advertised.

Secrets are server bindings. `.env.local` and `.dev.vars` are ignored; committed examples contain no keys. `npm run secrets:check` scans tracked text and client build assets for common private-key/API-key patterns; it is a useful guard, not a complete secret detector. Rotate an exposed real secret through its provider; encrypted Cloudflare secrets cannot be read back.

Anonymous identity is a random signed HttpOnly cookie. Server storage uses HMAC hashes; there are no accounts or authenticated natural-person quotas. Same-origin mutation validation is mandatory. Zod validates requests and model responses; React text rendering prevents model HTML execution. JSON-LD escapes `<` before script embedding.

D1 reservations enforce per-allocation attempt and global daily limits before inference. Short-window edge limits are approximate. Clearing cookies or rotating IPs remains possible; the global budget is the final application cost guard. Daily calls bound attempts, not exact monetary cost. Missing production budget/secrets/bindings fail closed.

No ideas, decisions, prompts, model prose or raw IPs are persisted in application tables or logs. Numerical state/request snapshots expire after 30 days, quota metadata after 180 days; daily scheduled and opportunistic cleanup enforce removal. Physical purge may lag by up to one daily interval. Provider/platform operational retention is outside this application's database and follows their policies.

No real payments, accounts, inbound webhooks, arbitrary outbound URLs or agent tools are implemented. Dependency changes require lockfile review, audit and runtime checks. CI has read-only repository permission and never deploys. Existing production Pages and the unrelated `wise.goodbye.help` service are outside this refactor's deployment scope.
