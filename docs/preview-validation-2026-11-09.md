# Preview release and real-model validation

## Final status

The isolated [preview](https://goodbye-startup-preview.indie-utility-lab.workers.dev) is deployed. [PR #1](https://github.com/liuyewang/goodbye-startup/pull/1) remains a draft on `codex/full-project-refactor`; it is not merged. **20/20 real inference attempts are consumed. Preview inference is closed (`AI_DAILY_CALL_LIMIT=0`), so pages can be reviewed but new AI simulations are intentionally unavailable.** A new key does not reset this authorization.

The account remains on the user-confirmed Free plan. No production-domain cutover or plan upgrade occurred. Production still runs the original Pages application; a separately authorized credential refresh is recorded below.

## Authorization and acceptance

On 2026-11-09 the user authorized pushing the refactor branch, creating an isolated preview Worker/D1 and at most 20 real model requests. The user later approved syncing the replacement DeepSeek secret to production Pages and republishing the original version. This does not authorize merging the refactor or migrating the production domain.

First principles: mock tests establish mechanics, not deployed bindings or model quality. Validate these independently, preserve the original deployment and count every attempted real inference. A retry is another attempt. Do not leave a public preview with an open-ended inference budget after testing.

Adversarial review: public traffic can consume a preview budget; daily limits reset and are not lifetime limits; a Git SHA can omit local modifications from an earlier manual deployment. Reconcile local attempts against remote reservations, close inference after evaluation and verify original artifacts before republishing production. **存活**: the bounded preview acceptance is complete; production migration remains a separate decision.

## Deployment and access

- Worker: `goodbye-startup-preview`; final version `0d37fba4-37e3-4d3d-8d76-3120a7a3a622`.
- D1: `goodbye-startup-preview`, `aba5dbef-6d2a-4b86-a335-b3b5e8e6c400`, WNAM. Migration `0001_simulation.sql` applied remotely. Production DB placeholder remains unchanged.
- Preview has its own origin, D1 and rate-limit namespace, no production routes, `X-Robots-Tag: noindex, nofollow` on HTML and static content. `SESSION_SECRET` was generated privately; it was not rotated during the provider-key change.
- Build selection uses `CLOUDFLARE_ENV=preview npm run build`, followed by deployment of `dist/server/wrangler.json`. The final deployed daily AI cap is zero and the cleanup schedule is `0 3 * * *` (UTC).
- Initially D1 returned `Authentication error [code: 10000]`. The user added D1 permission. Existing macOS proxy access then worked; the user subsequently allowed the direct IP. Direct IPv4 Wrangler calls now succeed with `NODE_OPTIONS='--dns-result-order=ipv4first --no-network-family-autoselection'`. Direct IPv6 still hits the source-IP restriction (9109); no policy expansion was made by the agent.
- The obsolete Pages Git preview build failed for this refactor branch. Only its preview branch filter changed: custom includes `*`, excludes `codex/full-project-refactor`. Production remains `main` with its existing build settings; other branches retain their preview behavior. The refactor preview uses Workers rather than that Pages build.

## Verification evidence

- Local `npm run check`: generated types, TypeScript, lint, format, 41 tests across seven files, build and secret-pattern scan passed after the prompt/config changes. Browser regression: 32 cases across Chromium, Firefox, WebKit and mobile Chromium passed.
- GitHub push and PR checks both passed on implementation commit `c033360`: [push run](https://github.com/liuyewang/goodbye-startup/actions/runs/42606727747), [PR run](https://github.com/liuyewang/goodbye-startup/actions/runs/42606736622). Documentation follow-up is checked again by the same workflow.
- Remote preview: all 15 public pages plus robots, sitemap, RSS, llms.txt and public Markdown passed the route/metadata audit. Preview noindex headers were checked on HTML and static content.
- Remote API: Secure/HttpOnly/SameSite=Lax cookie, no-store, origin rejection (403), invalid setup (400), successful real first turn, idempotent replay without another provider call and global daily-cap rejection (429) verified. The short-window limiter returned 429/RATE_LIMIT with Retry-After using invalid setup requests, without invoking a model.
- Remote browser: hydration, English/Chinese switching, mobile menu and 390px layout checked; no horizontal overflow and no console errors/warnings. Local screenshot is under ignored `output/playwright/preview-mobile.png`.
- Remote scheduled execution was observed through Wrangler tail with `outcome: ok` while temporarily using a one-minute schedule. An expired synthetic record was removed; opportunistic cleanup also exists, so that deletion alone is not attributed exclusively to cron. The daily schedule was restored and confirmed by the final deployment.

## Real-model accounting and findings

| Scope                       | Provider attempts | Result                                    |
| --------------------------- | ----------------: | ----------------------------------------- |
| Local controlled evaluation |                16 | One schema rejection; 15 valid results    |
| Remote preview              |                 4 | Four successful operations recorded in D1 |
| Total authorized usage      |       **20 / 20** | No remaining requests                     |

One remote success came from the harness; three successful operations belonged to another preview session outside the harness. They are included in the total, without inferring who initiated them. A later harness HTTP request was rejected by DAILY_LIMIT before inference and is not counted as a provider attempt. The local runner refuses further calls after ledger reconciliation. Private fixtures, responses, cookies and the durable ledger are excluded from Git.

The first `startup-assumptions-v1` reply had a 1008-character scenario and correctly failed the 1000-character schema boundary. Prompt v2 asks for 2–3 short sentences with substantial margin; the schema was not relaxed. Its next 15 controlled replies all validated: a six-stage English SaaS simulation, a six-stage Chinese simulation, zero fixed cost, high-cost physical delivery and a combined long-Unicode/prompt-injection/unsupported-research case. Both complete runs reached Day 180. The injection reply did not grant credits, override cash or claim web research; Day 0 cash stayed unchanged.

Latency for the 15 valid local replies was 3.37–8.77 seconds (median 5.13). Across all 20 provider attempts, reported usage totals 18,581 input and 12,668 output tokens (31,249 combined). This includes the initial rejected response. The sample is acceptance evidence, not a reliability percentage, accuracy estimate or verified monetary bill. Remote requests outside the harness have operational/schema evidence, not a human review of their text.

## Replacement key and original production refresh

The replacement key was written to ignored local `.env.local` with mode 0600, the preview Worker secret and the production Pages `DEEPSEEK_API_KEY` secret. Local normal development still uses mock `.dev.vars`; `.env.local` is not automatically a Cloudflare runtime binding. The replacement key authenticated successfully against DeepSeek GET `/models` and listed `deepseek-flash`, without making another inference request. Secrets are not reproduced in this report or Git.

The old production deployment `044d6044-c708-46ed-8155-07a5182970f4` was a manual deployment of `a47c007` with uncommitted UI modifications. An initial Pages retry (`23e67a05-9005-45d4-ae94-80dc1c80a5a9`) rebuilt the clean Git revision and dropped mobile styles. Final verification caught the difference. The original `.vercel/output/static` artifact still existed in the earlier local checkout; its layout/page JavaScript and CSS matched the old deployed assets byte for byte, and all nine modified source files matched preserved baseline `ee0d2f0`.

That original artifact was republished with the updated production secret using Wrangler Pages deploy. Final production deployment: `b52ed56c-2790-4cab-8c67-d5aead5ee71c`, [immutable deployment URL](https://b52ed56c.goodbye-startup.pages.dev). Pages canonical-deployment readback and the live domain both confirm it. Home, simulator, how-it-works and pricing return 200 with the preserved mobile viewport; the live layout/page scripts and CSS again match the original deployment byte for byte. This preserves the original application and UI; it is not a deployment of the refactor. New-key inference was not exercised because the 20-call evaluation authorization is exhausted.

## Remaining release decisions

No action is needed to complete credential synchronization or the bounded preview exercise. Additional interactive AI evaluation needs an explicitly increased request budget. Production migration still needs review and authorization for routing, production D1/secrets and operational limits. Paid checkout/accounts remain outside this refactor, and vinext's beta status remains a documented runtime tradeoff.

Official references: [Cloudflare Vite environment selection](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/), [static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/), [Pages retry API](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/retry/).
