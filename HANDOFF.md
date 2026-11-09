# Handoff — 2026-11-09 refactor

Start with README, `docs/PRD.md`, `docs/tech-stack.md`, and `docs/refactor-progress-2026-11-09.md`.

- Checkout: `/Users/guan/Documents/ChatGPT/创业模拟器(Goodbye)`.
- Remote: `git@github.com:liuyewang/goodbye-startup.git`; current branch `codex/full-project-refactor`.
- Baseline `ee0d2f0` preserved the previous visual changes/handoff; design `2451174` was approved. Implementation commits are separate by task.
- Actual runtime: React 19 / Next 16 compatible vinext / Workers / D1 / DeepSeek, strict TypeScript. No UI, animation, state, form or i18n library.
- `npm ci && npm run setup:local && npm run db:migrate:local`, then `npm run dev`. Mock mode does not spend provider credits. Real inference needs `DEEPSEEK_API_KEY` in ignored `.dev.vars`; the old `.env.local` remains ignored, never copied into docs/Git.
- The model proposes assumptions. The server controls numerical totals, timeline, quotas and terminal outcome. Text is browser-only; legacy saves export without importing authority.
- Keep `compatibility_date=2025-09-01` and `nodejs_compat`. Static RSS is generated under `public/blog/feed.xml`. Route metadata/RSS/Markdown share `src/content/registry.ts`.
- Preserve “一次模拟” and simulated-time/15-minute copy. Language switching must not reload or erase forms.
- Existing live production is still Pages. No remote D1, paid provider evaluation, production deployment or domain change is implied. Follow `docs/deployment.md`; do not touch `wise.goodbye.help`.
- GSC binding is `goodbye` → `sc-domain:goodbye.help`, read-only. Use `gsc-insights`, `gsc doctor`, and private report storage. Do not commit raw search data.

Final validation counts and review findings are recorded in the progress/release report; rerun checks after any change instead of relying on this handoff as proof.
