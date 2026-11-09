# Goodbye Startup Full Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver the approved complete simulator refactor with trustworthy state, bounded AI inference, honest product behavior and reproducible engineering.
**Architecture:** One TypeScript application on Cloudflare Workers; pure simulation domain; thin REST routes; D1 anonymous state and metering; browser-only transcripts. Retain existing public URLs and content, with shared metadata and a reactive bilingual UI.
**Tech Stack:** React 19, compatible Next/vinext or documented OpenNext fallback, Tailwind 3.4, Zod, D1, npm, Vitest/Node tests and Playwright.
**Spec:** `docs/superpowers/specs/2026-11-09-full-project-refactor-design.md`

## Global Constraints

- User approved the complete design and execution on 2026-11-09; continue implementation without another routine plan approval.
- Reuse the approved checkout on `codex/full-project-refactor`; baseline `ee0d2f0` preserves prior edits.
- No UI/animation/form/state/i18n library; no accounts, real payments or stored transcripts.
- 180 simulated days, approximately 15 minutes actual experience; simulation terminology throughout.
- Provider response never controls authoritative totals, timeline, entitlement or configuration.
- 6 normal provider calls / at most 10 attempts per anonymous allocation; no unbounded retries.
- Restore period 30 days since successful progression; anonymous eligibility period 180 days.
- Do not push/deploy, create paid services, or alter production domain until a verified release is reviewable.

## Review Focus

- Lost/duplicate/late requests must not double-charge the application budget or overwrite a newer state (Tasks 2–4).
- Missing cookies, storage denial/corruption and legacy saves must not erase conversation history or grant authoritative imported state (Tasks 3,5).
- AI valid JSON with invalid economics or injected instructions must fail without state progression (Tasks 2,4).
- CJK input composition, small screens and language hydration must preserve form input and accessibility (Task 5).
- Expired, deleted, abandoned and failed runs must have explicit quota/recovery outcomes, including provider attempts exhausted (Tasks 3,5).

## Task 1: Reproducible runtime and checks

**Files:** package.json/lock, tsconfig.json, vite/open-next config, wrangler.jsonc, .gitignore, eslint config, test config, .nvmrc, .env.example, scripts and CI.
**Interfaces:** Produces `npm run dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `check`; generated Worker Env with DB/limits/provider settings.

- [x] Run vinext compatibility check on preserved source and inspect adapter official files.
- [x] Install one compatible exact-pinned runtime/toolchain; remove next-on-pages and output patching; configure local Worker/D1.
- [x] Verify development, production build, runtime HTML/API/assets and independent type/lint commands; record concrete fallback reasons if any.
- [x] Commit `chore: establish supported Workers runtime and quality checks`.

## Task 2: Deterministic simulation domain

**Files:** `src/domain/simulation/{schema,engine,errors}.ts`, `tests/domain/simulation.test.ts`.
**Interfaces:** `SetupSchema`, `ProposalSchema`, `SimulationStateSchema`; `createSimulation(setup): SimulationState`; `settleTurn(state, proposal): SimulationState`; `getVerdict(state): Verdict | null`. Money uses integer cents. Timeline [0,5,90,120,150,180], next index is server-owned.

Formula contract: each step after Day0 spans deltaDays/30 months. Retained customers = floor(previous customers * (1-monthlyChurn)^(deltaDays/30)); acquired customers = floor(visits*signupRate*paidRate); revenue cents = customers * price cents; step operating cash change = round((revenue-monthlyCost)*months)-oneTimeCost; cash clamps at 0; runway null when profitable, otherwise cash/(cost-revenue). Bound input percentages, integer counts and amounts. Day0 only establishes baseline. Bankruptcy or Day180 terminates; verdict viable iff terminal and profitable, revise iff terminal positive cash but unprofitable, otherwise abandon.

- [x] Write tests for a hand-calculated scenario, no initial cash mutation, late-stage progression, bankruptcy, zero burn, invalid percentages/non-finite/negative totals, no progression after terminal; run RED.
- [x] Implement schema and pure functions; structured outputs contain only assumptions/insights/choices, never authoritative totals.
- [x] Run domain suite GREEN and typecheck; commit `feat: implement deterministic simulation model`.

## Task 3: Anonymous state, quota and transactional requests

**Files:** `migrations/0001_simulation.sql`, `src/server/storage/*`, `src/server/simulation/service.ts`, `tests/storage/*`.
**Interfaces:** Repository `createRun`, `getRun`, `reserveTurn`, `commitTurn`, `failTurn`, `deleteRun`, `getSession`; use-case inputs include sessionHash, expectedVersion, requestId, now. Runtime state retains only numeric setup/state, choice identifiers and bounded operation metadata, never idea/message/model text.

- [x] Integration tests against SQLite-compatible actual SQL: foreign session rejection, single allocation, 10-attempt cap, daily cap, duplicate ID, concurrent version, stale lease, successful replay, 30-day expiry, delete without quota reset; run RED.
- [x] Implement D1 prepared statements/batch with atomic guards and uniqueness. Reservation consumes a budget before provider access; late attempts cannot commit after lease change. TTL cleanup is explicit and tested.
- [x] Confirm first successful commit consumes eligibility, failed first response does not mark used but does spend attempts; legacy imports cannot affect authority.
- [x] Run suite GREEN; commit `feat: persist anonymous runs and bounded inference reservations`.

## Task 4: Validated AI and HTTP boundaries

**Files:** `src/server/ai/*`, `src/server/http/*`, `app/api/{session,simulations,health}/**/route.ts`, route/provider tests.
**Interfaces:** `generateProposal({idea,decision,history,state,language}, config, fetcher): Promise<Proposal>`; service orchestration reserves, calls provider, validates, settles, commits; all errors use stable `code`, public error text and requestId.

- [x] Write contract tests for 32KiB body, 2000-char message/idea, history max12/12000 chars, Origin, cookie ownership, language and role validation; malformed/empty/truncated JSON, upstream401/429, timeout, oversized response; run RED.
- [x] Implement JSON-mode DeepSeek adapter, bounded reader, 45s abort, max4096 output tokens, no auto-retry, explicit prompt version. Preserve diagnostic code/status without disclosing upstream payloads.
- [x] Use Web Crypto cookie IDs/HMAC, same-origin mutation protection, generated bindings, short-window limiter plus strict D1 allocation/global cap; fail closed on absent production budget/secret/binding.
- [x] Provide local/test deterministic provider guarded against production enablement. Request bodies and provider text are never logged.
- [x] Run unit + local Worker API suite GREEN; remove old unprotected `/api/chat` or return a documented retired status; commit `feat: enforce AI and HTTP trust boundaries`.

## Task 5: Complete bilingual user flow

**Files:** `src/features/simulator/*`, `src/i18n/*`, components/layout, app/simulator, persistence tests and browser spec.
**Interfaces:** `LanguageProvider/useI18n`; versioned local transcript store (load/save/export/migrate); explicit setup/running/submitting/completed/expired/unavailable/quota/error UI states.

- [x] Write failing browser scenarios for setup → 6 turns → terminal → next run quota, reload recovery, local transcript export, provider failure retry, IME Enter, Chinese toggle and corrupted storage.
- [x] Implement accessible setup, live numerical dashboard, safe text/structured response rendering, final recap, restart/abandon/delete/expired behaviors and privacy boundaries. Never derive authoritative state from browser localStorage.
- [x] Replace language reload with subscribed context and hydration-safe initialization; typed copy for all controls/errors/units. Preserve prior mobile styling while removing locked-body/hidden guide behavior.
- [x] Run browser scenarios in deterministic local runtime and core tests; commit `feat: rebuild complete accessible bilingual simulator`.

## Task 6: Public content, SEO and truthful marketing

**Files:** `src/content/*`, public route layouts/pages, metadata helpers, sitemap/robots/RSS generation, llms.txt/Markdown export, content tests.
**Interfaces:** typed route registry of 15 existing HTML URLs plus article content records with dates/sources; shared title/description/canonical/OG and schema builders.

- [x] Content-output tests: titles<=60, descriptions<=155, unique canonical, all 15 routes, RSS4 entries, matching visible FAQ/schema, no private data in public machine-readable output; run RED.
- [x] Normalize pricing to free + honestly unavailable future plans; remove unsupported billing/refund/real-time-data claims. Update privacy to actual provider/retention.
- [x] Correct simulation/15-minute copy and data-source labels; replace duplicated metadata/RSS sources, add llms.txt and public Markdown output.
- [x] Run generated-output/live-local checks; commit `refactor: unify public content metadata and product promises`.

## Task 7: Verification, reference documentation and review

**Files:** README, AGENTS, HANDOFF, current BRD/PRD/architecture, security/contributing/deployment/ADR docs, CI and test scenarios.
**Interfaces:** one documented quickstart and `npm run check`, local mock mode, environment contract, preview/release checklist and rollback.

- [ ] Complete docs and archive/supersede old instructions without erasing history. Include current folder, remote, architecture decisions, prompts/versioning/evaluation, data boundary, budget limits, deployment and recovery.
- [ ] Run full tests, typecheck, lint/format, production build, local Worker smoke, browser tests, audit and secret scan; record exact results and external limits.
- [ ] Fresh independent whole-branch review; fix important findings with reproducing tests, rerun affected checks and full regression.
- [ ] Commit verified release candidate; leave production and paid verification actions explicit and reviewable. No success claim for unexecuted checks.
