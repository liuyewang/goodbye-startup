# Preview release and real-model validation

## Authorization and acceptance

On 2026-11-09 the user authorized pushing `codex/full-project-refactor`, creating an isolated preview Worker/D1, and at most **20 real model requests**. No plan upgrade or production-domain cutover is authorized. Existing Pages production and unrelated Workers remain untouched.

First principles: mock tests establish mechanics, not deployed bindings or model quality. Validate these independently, retain the original deployment, and count every attempted real inference before issuing it. A retry is another attempt. Do not leave a public preview with an open-ended inference budget after testing.

Adversarial review: public traffic could consume an enabled preview budget; local success could hide remote permissions/runtime defects; daily limits reset and are not lifetime evaluation limits. Keep production configuration fail-closed, use an explicit evaluation ledger and close inference after the authorized exercise. **存活** with the remote permission gate below; do not describe an inaccessible preview as deployed.

## Progress

- [x] Verified local branch is clean at `c9c8974` before this release phase.
- [x] Verified GitHub login/repository and Cloudflare Workers/Pages read access.
- [x] Push branch, open draft PR, inspect initial CI result: [PR #1](https://github.com/liuyewang/goodbye-startup/pull/1), both GitHub runs passed on `0cf2307`. Recheck after release fixes.
- [ ] Prepare isolated preview configuration, provision D1, migrate and deploy.
- [ ] Verify remote routes, cookies/origin, state/limits and retention.
- [x] Local real-model evaluation with durable attempt accounting; current usage **16/20**, leaving four attempts for remote testing.
- [ ] Record results, close unused inference exposure and provide preview/PR links.

## Current external constraints

Initially, D1 list and subscription queries returned `Authentication error [code: 10000]`. The user added D1 permission and confirmed the account is **Free**. D1 reads then succeeded through the existing macOS proxy; Wrangler direct requests still hit the token's source-IP restriction (code 9109). Reusing that already-configured proxy via `HTTPS_PROXY`/`HTTP_PROXY` resolved CLI access without changing token policies or plans. No alternative OAuth login or billing write access was requested.

D1 `goodbye-startup-preview` was created in WNAM: `aba5dbef-6d2a-4b86-a335-b3b5e8e6c400`. The production placeholder and existing Pages deployment remain separate. The old Pages Git integration attempted its obsolete `next-on-pages` build for this branch and failed; this is distinct from the passing GitHub CI and the new Workers release path.

## Real-model findings so far

One initial `startup-assumptions-v1` reply had a 1008-character scenario and correctly failed the 1000-character schema boundary. Prompt v2 asks for 2–3 short sentences with substantial margin; the schema was not relaxed. Its next 15 responses all validated: six-stage English SaaS, six-stage Chinese SaaS, zero fixed cost, high-cost physical delivery, and a combined long-Unicode/prompt-injection/unsupported-research case. Both full simulations reached Day 180. The injection reply did not grant credits, override cash or claim web research; Day 0 cash stayed unchanged.

Valid-response latency was 3.37–8.77 seconds (median 5.13 seconds); those 15 responses used 14,863 input and 9,575 output tokens. This is a small acceptance sample, not an accuracy estimate or a billing statement. The initial rejected request also consumed provider tokens. Private synthetic fixtures, raw responses and the attempt ledger are outside the repository under the user's local application-data directory.

Preview target: separate Worker under the existing `indie-utility-lab.workers.dev` namespace and separate D1. Production branch remains `main`. Official environment selection is at build time via `CLOUDFLARE_ENV`; see [Cloudflare Vite environments](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/).
