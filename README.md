# Goodbye Startup

A bilingual educational startup simulator. Six stages cover 180 **simulated** days in about 15 real minutes. AI proposes assumptions; deterministic TypeScript calculates cash, paying customers, revenue, morale, runway and the outcome. No live market research or success prediction is implied.

- Repository: [liuyewang/goodbye-startup](https://github.com/liuyewang/goodbye-startup)
- Production site: [goodbye.help](https://goodbye.help)
- Local checkout: `/Users/guan/Documents/ChatGPT/创业模拟器(Goodbye)`
- Production source branch: `main`; [refactor PR #1](https://github.com/liuyewang/goodbye-startup/pull/1) was merged. Production cutover is tracked in [the release report](docs/production-release-2026-11-09.md).
- Isolated [Workers/D1 preview](https://goodbye-startup-preview.indie-utility-lab.workers.dev) is deployed. Its 20-request evaluation is complete and AI calls are paused at budget zero. See [preview validation](docs/preview-validation-2026-11-09.md). The formal site now runs the refactored production Worker with isolated D1 and a daily cap of 60 attempted model calls; the legacy Pages artifact is retained privately for controlled recovery. See [infrastructure cleanup](docs/configuration-cleanup-2026-11-09.md).

## Start locally without paid inference

Use Node 26 (the installed and verified runtime is 26.5.0), npm and the committed lockfile.

```sh
npm ci
npm run setup:local
npm run db:migrate:local
npm run dev
```

Open `http://127.0.0.1:5173`. The local demo uses deterministic fixtures and shows a visible mock-mode notice. `setup:local` preserves an existing `.dev.vars`. Never commit this file.

For an intentional real-provider evaluation, set `AI_MODE=deepseek` and `DEEPSEEK_API_KEY` in the ignored `.dev.vars`; leave `APP_ENV=local`. The previously configured `.env.local` remains ignored, but Cloudflare bindings use `.dev.vars`, not that legacy file. Do not paste secrets into issues, logs or source. Real requests incur provider usage; the default checks never make them.

## Engineering checks

All checks, browser tests, builds and deployments run locally. GitHub stores code only: repository Actions are disabled and workflow files have been removed. Local Playwright browser binaries are test dependencies; they are not uploaded with the website. Publishing uses the local Cloudflare Wrangler CLI and existing local credentials.

```sh
npm run check                 # generated types, typecheck, lint, format, tests, build, secret scan
npx playwright install chromium firefox webkit
npm run test:e2e               # local mock only; starts dev server when needed
node scripts/smoke-worker.mjs  # with dev server running
node scripts/audit-pages.ts    # with dev server running
npm audit --audit-level=moderate
```

Production runtime preview:

```sh
npm run build
npm run preview               # http://127.0.0.1:4173
TEST_BASE_URL=http://127.0.0.1:4173 node scripts/audit-pages.ts
TEST_BASE_URL=http://127.0.0.1:4173 node scripts/smoke-worker.mjs
```

Apply migrations locally before the preview. The preview script explicitly pins `--persist-to .wrangler/state`, so Wrangler and Vite share the migrated local database. Without that flag the generated config would resolve a different state directory under `dist/server`. The Worker default configuration fails closed with daily AI budget `0`; local `.dev.vars` overrides it for mock tests. A real deployment needs an actual D1 ID and secrets; see [deployment](docs/deployment.md).

Stop and restart the preview after a new build: a running Wrangler asset snapshot can become stale when the build replaces `dist/client`. To verify retention locally, start `npm run preview -- --test-scheduled` and run `TEST_BASE_URL=http://127.0.0.1:4173 TEST_SCHEDULED=1 node scripts/smoke-worker.mjs`.

## Source map

| Path                      | Responsibility                                                             |
| ------------------------- | -------------------------------------------------------------------------- |
| `app/`                    | Stable public URLs, metadata and thin REST routes                          |
| `src/domain/simulation/`  | Validated assumptions and deterministic financial rules                    |
| `src/server/storage/`     | D1 ownership, reservations, quota and retention                            |
| `src/server/ai/`          | Versioned prompt, one bounded DeepSeek call, output validation             |
| `src/server/http/`        | Signed cookie, origin/body checks, error envelopes and rate limits         |
| `src/features/simulator/` | Complete user flow and browser-only transcript recovery                    |
| `src/i18n/`               | Typed bilingual copy and hydration-safe shared language state              |
| `src/content/`            | Public route/article registry, metadata, RSS and Markdown                  |
| `migrations/`             | Reviewed SQL migrations; no ORM                                            |
| `worker.ts`               | vinext fetch handler plus daily retention cleanup                          |
| `tests/`                  | Domain, D1 concurrency, provider boundaries, content and browser scenarios |

## Product and privacy boundaries

No accounts, real checkout, subscriptions, paid entitlement or server-side transcripts. One anonymous allocation is used on its first successful AI response; failures still consume attempts, up to 10. Six successful calls normally finish a run. Clearing cookies or changing devices can create a new anonymous identity; this is not person-level enforcement.

Numerical saves expire 30 days after a successful turn (drafts from creation). Used quota expires 180 days after first success. Expired records cannot be imported back into authority from the browser. Text stays locally and is sent to DeepSeek for inference. The server stores numerical snapshots and bounded operational metadata, not ideas, decisions, AI prose, raw IPs or prompts. DeepSeek and Cloudflare apply their own service policies.

See [architecture](docs/tech-stack.md), [product contract](docs/PRD.md), [AI evaluation](docs/ai-evaluation.md), [security](SECURITY.md), [contributing](CONTRIBUTING.md), [handoff](HANDOFF.md), [current progress](docs/refactor-progress-2026-11-09.md), and [acceptance and review](docs/release-review-2026-11-09.md). Historical documents live under `docs/archive/` and are not execution instructions.
