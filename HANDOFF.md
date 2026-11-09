# Handoff — 2026-11-09 refactor

Start with README, `docs/PRD.md`, `docs/tech-stack.md`, and `docs/refactor-progress-2026-11-09.md`.

- Checkout: `/Users/guan/Documents/ChatGPT/创业模拟器(Goodbye)`.
- Remote: `git@github.com:liuyewang/goodbye-startup.git`; current branch `main`. PR #1 was merged as `794d7fd`; current production release work is in `docs/production-release-2026-11-09.md`.
- Baseline `ee0d2f0` preserved the previous visual changes/handoff; design `2451174` was approved. Implementation commits are separate by task.
- Actual runtime: React 19 / Next 16 compatible vinext / Workers / D1 / DeepSeek, strict TypeScript. No UI, animation, state, form or i18n library.
- `npm ci && npm run setup:local && npm run db:migrate:local`, then `npm run dev`. Mock mode does not spend provider credits. Real inference needs `DEEPSEEK_API_KEY` in ignored `.dev.vars`; the old `.env.local` remains ignored, never copied into docs/Git.
- The model proposes assumptions. The server controls numerical totals, timeline, quotas and terminal outcome. Text is browser-only; legacy saves export without importing authority.
- Keep `compatibility_date=2025-09-01` and `nodejs_compat`. Static RSS is generated under `public/blog/feed.xml`. Route metadata/RSS/Markdown share `src/content/registry.ts`.
- Preserve “一次模拟” and simulated-time/15-minute copy. Language switching must not reload or erase forms.
- Isolated Workers/D1 preview is deployed. All 20 authorized real-model requests are consumed and preview AI budget is zero. Changing the key does not reset that budget. See `docs/preview-validation-2026-11-09.md` for URLs and historical remote verification.
- Production `goodbye.help` now runs Worker `goodbye-startup-production`, version `e1ae43bf-96e4-4c17-a509-902a14dce0f0`, from `main@f88a3c0`. Its isolated D1 ID is recorded in `env.production`. Daily cap is 300 attempted model calls per UTC day. All six additional release acceptance calls succeeded and that finite allowance is exhausted; preview remains closed. Cloudflare remains Free. Original Pages online deployments have been retired after verified offline artifact backup; do not use the old deployment ID for rollback. See `docs/configuration-cleanup-2026-11-09.md`. Follow `docs/deployment.md`; do not touch `wise.goodbye.help`.
- GitHub stores code only: Actions are disabled and workflow files removed. All testing, builds and deployments run locally through CLI. Legacy Pages automatic Git builds are disabled. Use the existing local Cloudflare token; do not request a CI token or re-enable GitHub runners.
- GSC binding is `goodbye` → `sc-domain:goodbye.help`, read-only. Use `gsc-insights`, `gsc doctor`, and private report storage. Do not commit raw search data.

Final validation counts and review findings are recorded in the progress/release report; rerun checks after any change instead of relying on this handoff as proof.

Infrastructure cleanup is complete: main protection enabled; merged branch/caches removed; preview provider secret and public endpoint closed; log query strings redacted. Pages holds one credential-free retirement endpoint (API 410), all 80 historical deployments removed. Private rollback artifact retained at least through 2026-12-09. Do not restore the old unrestricted API publicly.
