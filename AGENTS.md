# Goodbye Startup — agent instructions

Updated 2026-11-14. Shared collaboration, bug-review, CLI, browser and GSC rules live in the user-level `/Users/guan/.codex/AGENTS.md`; read it for this machine instead of duplicating it here. This file owns project-specific constraints and authorization. On other machines, load the applicable user rules explicitly; this local path does not synchronize them. Historical Next 14/Gemini/Pages instructions in `docs/archive/` are inactive.

## Source of truth

Read README → `docs/PRD.md` → `docs/tech-stack.md` → `docs/deployment.md`. Follow the approved plan and `docs/refactor-progress-2026-11-09.md`; preserve user edits and keep Conventional Commits. Use the Superpowers design/plan/execution/verification/review workflow when applicable. Do not restart approved design gates merely because context compacted.

Resume from `HANDOFF.md`, then reconcile Git and the relevant task report before acting. Reusable lessons are indexed by module/problem in [release review](docs/release-review-2026-11-09.md#reusable-lessons-by-area); consult the relevant entry before related changes and update its existing evidence rather than creating a second log. Historical reports record their dated scope, not current release permission or status. GSC binding is `goodbye` → `sc-domain:goodbye.help`; its evidence/checkpoint is `docs/search-evidence-2026-11-09.md`.

Actual stack: strict TypeScript, React 19, Next 16 compatible App Router through vinext, Vite, Tailwind 3.4, Cloudflare Workers/D1 and DeepSeek. The formal site now runs the production Worker; legacy Pages online deployments are retired, with a verified private artifact retained for controlled recovery. See `docs/configuration-cleanup-2026-11-09.md`; do not restore the unrestricted old API. No UI component, animation, form, state-management or i18n library may be added without explicit approval. No ORM, agent framework or new service without a concrete need.

## Trust boundaries

- Pure model in `src/domain/simulation`, provider in `src/server/ai`, D1 in `src/server/storage`, thin REST routes in `app/api`.
- Keep domain code free of React, Workers and provider dependencies. Stable request IDs and server versions are part of the public protocol.
- Browser text and model outputs are untrusted. Validate both; never import local cash/versions/entitlement into server authority.
- Server controls `[0,5,90,120,150,180]`, numeric settlement and outcome. First AI reply initializes Day 0 without charging costs. Money is integer cents; finite bounds live in schemas.
- A signed HttpOnly cookie identifies an anonymous allocation, not a natural person. One free simulation is available each device-local day, consumed on first success; maximum 10 provider attempts per started simulation. Unstarted drafts renew failed-attempt allowance each local day. The server validates the device time zone, owns the clock and defers zone changes until the current allowance period ends. Atomic D1 reservation and lease/version commit are mandatory. No automatic provider retry.
- Production has a global 300-attempt cap per UTC day, including failed provider attempts; preview cap is zero and inference is closed. Both finite real-model evaluation allowances (20 + 6) are exhausted; new real-model tests require explicit budget authorization.
- Numerical saves expire after 30 days; quota metadata after 180 days from the latest allocation renewal or first success. Daily eligibility resets at the device’s local midnight. Daily scheduled cleanup plus opportunistic cleanup removes expired data. Deleting/abandoning/expiry does not refund that day’s used eligibility.
- No accounts or real payments. Paid plans are unavailable; do not invent checkout, billing, refunds or person-level limits.
- Never persist/log ideas, user decisions, AI prose, prompts or raw IPs. Secrets stay in runtime bindings. Never commit `.env.local`, `.dev.vars`, raw GSC reports or credentials.
- Request body 32KiB; idea/decision 2000 characters; history 12 messages/12000 characters; upstream body 128KiB; 4096 output tokens; 45-second timeout. Fail closed if production configuration is missing.
- Success envelope `{data, requestId}`, error `{error, code, requestId}`. Do not expose upstream payloads or stack traces.

## UI and content

- Default English SSR; read persisted/browser language after hydration. Use shared React context, no reload or erased forms on language changes. All UI copy must be bilingual; typed dictionaries/registry are the content source. Generated AI text is not retroactively translated.
- Say “一次模拟”, never “一次对话”. Where 工作原理 shows stage days, explain “天数是模拟内的，真实只需约 15 分钟”.
- AI proposals are assumptions, not researched facts. Display authoritative metrics separately. Do not claim real-time market retrieval or predictive accuracy.
- React safely renders text. No untrusted HTML. JSON-LD uses `safeJsonLd` escaping.
- Use function components, default component/page exports, `type` object shapes, `unknown` instead of `any`, explicit exported signatures. Interface augmentation for generated Cloudflare bindings is an exception.
- Tailwind/custom CSS only; no inline styles. Keep mobile scrolling and keyboard/IME behavior usable. Do not lock the body to hide substantive content.
- Preserve 15 public URLs, including existing slugs when correcting article titles. `src/content/registry.ts` owns metadata, sitemap, RSS and public Markdown. Title ≤60, description ≤155, self canonical and distinct OG URL. Root slash normalization is URL-equivalent.
- Keep static RSS `public/blog/feed.xml`, raster OG `public/og.png`, permitted public AI crawlers. Public exports never include API/session content. FAQ schema and visible text share the same copy.

## Commands and release boundary

```sh
npm ci
npm run setup:local
npm run db:migrate:local
npm run dev
npm run check
npm run test:e2e
```

Normal checks use local mock mode and do not spend provider credits. Workers uses ignored `.dev.vars`; legacy `.env.local` is not the binding source. Keep pinned compatibility date `2025-09-01` and `nodejs_compat` until separately verified.

Run behavioral tests for state/persistence/trust/recovery changes, real D1 integration for SQL, browser scenarios for UX, production build + runtime smoke before claiming completion. Keep external provider evaluation distinct from deterministic fixture success. Archive stale docs instead of leaving contradictory active instructions.

用户于 2026-11-10 明确持续授权本项目的常规网站部署：在现有 Cloudflare 环境和正式域名内，完成检查与代码审阅后直接提交、推送、必要的常规合并并发布，无需逐次询问或等待再次授权；发布后必须实际读回正式站并记录版本。此条取代本项目旧的逐次部署批准要求。新增付费资源、真实模型测试预算、破坏性操作、生产域名变更及其他服务不包含在常规部署授权内，沿用各自现有边界。 Existing `www` redirect → apex and `startup.goodbye.help` → `/simulator` remain; `wise.goodbye.help` is a separate service and must not be touched. GitHub stores code only: repository Actions are disabled and there are no workflow files. Run all checks, browser tests, builds and Wrangler deployments locally. Do not add GitHub runners or re-enable Actions without an explicit user request. Legacy Pages Git builds are also disabled.
