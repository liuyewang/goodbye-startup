# Preview release and real-model validation

## Authorization and acceptance

On 2026-11-09 the user authorized pushing `codex/full-project-refactor`, creating an isolated preview Worker/D1, and at most **20 real model requests**. No plan upgrade or production-domain cutover is authorized. Existing Pages production and unrelated Workers remain untouched.

First principles: mock tests establish mechanics, not deployed bindings or model quality. Validate these independently, retain the original deployment, and count every attempted real inference before issuing it. A retry is another attempt. Do not leave a public preview with an open-ended inference budget after testing.

Adversarial review: public traffic could consume an enabled preview budget; local success could hide remote permissions/runtime defects; daily limits reset and are not lifetime evaluation limits. Keep production configuration fail-closed, use an explicit evaluation ledger and close inference after the authorized exercise. **存活** with the remote permission gate below; do not describe an inaccessible preview as deployed.

## Progress

- [x] Verified local branch is clean at `c9c8974` before this release phase.
- [x] Verified GitHub login/repository and Cloudflare Workers/Pages read access.
- [ ] Push branch, open draft PR, inspect final CI result.
- [ ] Prepare isolated preview configuration, provision D1, migrate and deploy.
- [ ] Verify remote routes, cookies/origin, state/limits and retention.
- [ ] Real-model evaluation with durable attempt accounting; current usage **0/20**.
- [ ] Record results, close unused inference exposure and provide preview/PR links.

## Current external constraints

The current Cloudflare environment token can read Workers scripts, the Workers subdomain and the existing Pages project. D1 list and account subscription queries return `Authentication error [code: 10000]` (HTTP 403 for subscriptions). No alternative Wrangler OAuth login is present. No scope expansion, resource creation, subscription modification or inference request has occurred at this checkpoint.

Preview target: separate Worker under the existing `indie-utility-lab.workers.dev` namespace and separate D1. Production branch remains `main`. Official environment selection is at build time via `CLOUDFLARE_ENV`; see [Cloudflare Vite environments](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/).
