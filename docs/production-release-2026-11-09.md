# Production release — 2026-11-09

## Authorization and target

The user approved replacing the legacy Pages deployment flow, validating Workers production, merging `codex/full-project-refactor` into `main`, and switching the formal site. The user then explicitly chose **local Wrangler CLI deployment instead of GitHub Actions deployment**. GitHub Actions remains verification-only; no new CI token or Actions secret is needed. Cloudflare must remain Free. The user approved a production cap of **60 attempted DeepSeek calls per UTC day** and **at most six additional real inference attempts for this release acceptance**. The earlier 20-call evaluation is exhausted and is not reopened. Preview inference remains closed.

First principles: the production branch, deployment artifact and live site must agree. A merge must not trigger the obsolete Pages build. Only passing source revisions may reach the production Worker, and production storage/secrets must remain separate from preview. Keep the legacy Pages artifact available for rollback.

Adversarial review: the existing Cloudflare token is source-IP restricted, so deployment uses the already-verified local IPv4 path; a production custom domain can conflict with the current Pages binding; daily limits do not enforce the separate six-attempt acceptance authorization; a successful build does not establish deployed behavior. Verify local credentials before merge, stage the Worker before routing, keep a durable acceptance ledger, and verify live APIs plus redirects after cutover. **存活**, subject to local token permissions and domain preflight; request only a demonstrated missing permission.

## Plan and progress

- [x] Read current Git/PR, Pages deployment and preview status; confirm the user-approved release scope.
- [x] Prepare explicit production Wrangler environment, isolated D1 and secrets; validate candidate on its temporary Workers endpoint without consuming model calls.
- [x] Restore verification-only GitHub Actions after the user chose local CLI deployment; do not configure any Actions deployment secret.
- [ ] Review deployment/configuration changes, run relevant checks and push the release changes to the existing PR.
- [ ] Disable the obsolete Pages production auto-build before merge; merge the reviewed refactor into main after passing checks and deploy that exact revision with local Wrangler.
- [ ] Switch goodbye.help to the verified Worker; preserve www/startup redirects and leave wise.goodbye.help untouched. Verify public pages, metadata, cookies, state, retention and at most six real model calls.
- [ ] Record final versions, branch/check/deployment correspondence and rollback steps; synchronize handoff documents.

## Baseline and recovery

- Repository: `liuyewang/goodbye-startup`; refactor head `329ef70`; main `a47c007`.
- Original production Pages artifact: deployment `b52ed56c-2790-4cab-8c67-d5aead5ee71c`, containing the preserved mobile changes from `ee0d2f0`. Keep it and the Pages project available.
- Existing preview Worker version: `0d37fba4-37e3-4d3d-8d76-3120a7a3a622`; D1 `aba5dbef-6d2a-4b86-a335-b3b5e8e6c400`. Do not reuse its database or session signing secret in production.
- Existing Pages production auto-deploy is enabled on main with `npx @cloudflare/next-on-pages`; the refactor branch is excluded from Pages previews.
- GitHub initially had no repository Actions secrets or variables. Two non-secret release variables were briefly added during CI preparation, then removed because the user chose CLI deployment; readback confirms no repository Actions secrets or variables. Existing Cloudflare credentials remain private local environment variables, never copied into documentation or logs.

## Evidence and decisions

Release work is in progress. No production migration or merge has occurred in this phase yet.

### User-directed deployment change

The GitHub deployment/access jobs were removed before pushing. Existing `Verify` continues to run tests/builds only. Production will be explicitly published by local Wrangler after verifying the exact main revision. No automatic deployment on Git push is promised.

### Preparation evidence

- Production D1 `goodbye-startup-production` created in WNAM, ID `68f019ae-d303-4f2e-8374-e24a761515c2`; migration `0001_simulation.sql` applied successfully. Preview storage remains separate.
- Explicit `env.production` added with daily limit 60, official model `deepseek-flash`, canonical origin `https://goodbye.help` and a separate session secret to be provisioned. It was initially staged without a domain route at a temporary workers.dev endpoint; the final reviewed source binds only the apex and disables workers.dev.
- Local `npm run check` passed: 41 core/D1/provider tests, generated types, lint, formatting, build and secret scan. Production build and dry-run also passed; Worker gzip is 413.06 KiB.
- The deployment guard rejects the default environment/placeholder and accepts the generated production configuration. It checks the exact D1, origin, budget, runtime compatibility and allowed domain scope.
- Private rollback snapshots of Pages source/build settings, original deployment, apex CNAME and redirect rules are stored outside Git. All MX/TXT records and unrelated hostnames are outside the cutover scope.

- Production candidate deployed without a domain route, then private provider/session secrets were provisioned. All 15 public pages and robots/sitemap/RSS/llms/Markdown passed. Health and D1-backed session reads pass with secure cookie flags.
- The staging origin check correctly rejects writes even when the request carries the apex Origin header, because it also checks the actual request URL. The first live-check script incorrectly expected 400; the remote 403 reproduced the mistake. The script was corrected to expect staging rejection and reserve canonical input-validation checks for after cutover. Application security was not weakened.
- Independent release review found no blocking issues. Its minor suggestion was applied: the production artifact guard now checks `preview_urls=false` and requires workers.dev to be closed once the apex domain is configured.
- Cloudflare domain changeset preflight succeeded for only `goodbye.help`; no DNS or domain mutation has occurred yet.

The candidate was validated with a temporary endpoint. The reviewed source now contains the final apex custom-domain route and `workers_dev=false`; applying this final configuration is deferred until main checks pass and the old Pages domain binding is ready to transfer.
