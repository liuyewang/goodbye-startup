# Goodbye Startup — agent instructions

Updated 2026-11-09 after the user-approved full refactor. This file replaces the old Next 14/Gemini/Pages/browser-authority instructions. Historical copies are in `docs/archive/` and are not active requirements.

## 全局用户规则

- 复杂任务主动检查、诊断、修复、验证、复审，在授权内持续推进；达到验收标准、无已知关键问题后停止有边界的 loop。
- 优先核对适用的官方方法，不为追新增加无必要复杂度。多步骤任务维护进度文档，持续报告发现、证据及限制。
- CLI 优先；权限、付费、不可逆操作或外部依赖需要明确边界。先完成可独立推进的工作，不伪造部署、模型质量或搜索效果。
- Firecrawl 默认不用；普通搜索/读取足够即停止。付费批量抓取前说明用途/规模并取得授权，不自动扩张。

<!-- BEGIN GSC-INSIGHTS -->

## GSC 网站搜索优化

- 对网站的SEO、自然搜索表现、索引诊断或内容优先级任务，使用用户级 `gsc-insights` skill：`~/.agents/skills/gsc-insights/SKILL.md`。命令为 `gsc`，找不到时用 `~/.local/bin/gsc`。
- 先运行 `gsc doctor` 确认当前项目绑定；绑定来自用户级注册表或项目 `.gsc.json`。没有绑定不猜测域名。只读取当前项目或用户明确指定的站点；普通代码/样式修改无需强制取数。
- 复用已有只读授权和适用的新鲜报告；原始数据与凭据留在仓库外。分析注明日期、覆盖天数、口径和缺失，优化任务附证据、优先级与验收标准。
- 工具跨项目使用不改变各项目的协作、编辑或发布授权。遇授权失效再说明；不自动扩大scope、创建定时任务或启用付费服务。新站可按已授权范围接入，未上线/无数据不报成零流量。

<!-- END GSC-INSIGHTS -->

## Source of truth

Read README → `docs/PRD.md` → `docs/tech-stack.md` → `docs/deployment.md`. Follow the approved plan and `docs/refactor-progress-2026-11-09.md`; preserve user edits and keep Conventional Commits. Use the Superpowers design/plan/execution/verification/review workflow when applicable. Do not restart approved design gates merely because context compacted.

Actual stack: strict TypeScript, React 19, Next 16 compatible App Router through vinext, Vite, Tailwind 3.4, Cloudflare Workers/D1 and DeepSeek. The formal site now runs the production Worker; legacy Pages online deployments are retired, with a verified private artifact retained for controlled recovery. See `docs/configuration-cleanup-2026-11-09.md`; do not restore the unrestricted old API. No UI component, animation, form, state-management or i18n library may be added without explicit approval. No ORM, agent framework or new service without a concrete need.

## Trust boundaries

- Pure model in `src/domain/simulation`, provider in `src/server/ai`, D1 in `src/server/storage`, thin REST routes in `app/api`.
- Browser text and model outputs are untrusted. Validate both; never import local cash/versions/entitlement into server authority.
- Server controls `[0,5,90,120,150,180]`, numeric settlement and outcome. First AI reply initializes Day 0 without charging costs. Money is integer cents; finite bounds live in schemas.
- A signed HttpOnly cookie identifies an anonymous allocation, not a natural person. One free eligibility is used on first success; maximum 10 provider attempts. Atomic D1 reservation and lease/version commit are mandatory. No automatic provider retry.
- Numerical saves expire after 30 days; used quota after 180 days. Daily scheduled cleanup plus opportunistic cleanup removes expired data. Deleting/abandoning/expiry does not refund used eligibility.
- No accounts or real payments. Paid plans are unavailable; do not invent checkout, billing, refunds or person-level limits.
- Never persist/log ideas, user decisions, AI prose, prompts or raw IPs. Secrets stay in runtime bindings. Never commit `.env.local`, `.dev.vars`, raw GSC reports or credentials.
- Request body 32KiB; idea/decision 2000 characters; history 12 messages/12000 characters; upstream body 128KiB; 4096 output tokens; 45-second timeout. Fail closed if production configuration is missing.
- Success envelope `{data, requestId}`, error `{error, code, requestId}`. Do not expose upstream payloads or stack traces.

## UI and content

- Default English SSR; read persisted/browser language after hydration. Use shared React context, no reload on language changes. All copy must be bilingual; typed dictionaries/registry are the content source.
- Say “一次模拟”, never “一次对话”. Where 工作原理 shows stage days, explain “天数是模拟内的，真实只需约 15 分钟”.
- AI proposals are assumptions, not researched facts. Display authoritative metrics separately. Do not claim real-time market retrieval or predictive accuracy.
- React safely renders text. No untrusted HTML. JSON-LD uses `safeJsonLd` escaping.
- Use function components, default component/page exports, `type` object shapes, `unknown` instead of `any`, explicit exported signatures. Interface augmentation for generated Cloudflare bindings is an exception.
- Tailwind/custom CSS only; no inline styles. Keep mobile scrolling and keyboard/IME behavior usable. Do not lock the body to hide substantive content.
- Preserve 15 public URLs. `src/content/registry.ts` owns metadata, sitemap, RSS and public Markdown. Title ≤60, description ≤155, self canonical and distinct OG URL. Root slash normalization is URL-equivalent.
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

Do not push/deploy/provision paid resources/change production domains without existing authorization or a concrete final review. Existing `www` redirect → apex and `startup.goodbye.help` → `/simulator` remain; `wise.goodbye.help` is a separate service and must not be touched. GitHub stores code only: repository Actions are disabled and there are no workflow files. Run all checks, browser tests, builds and Wrangler deployments locally. Do not add GitHub runners or re-enable Actions without an explicit user request. Legacy Pages Git builds are also disabled.
