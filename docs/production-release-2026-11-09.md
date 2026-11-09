# Production release — 2026-11-09

## Authorization and target

The user approved replacing the legacy Pages deployment flow, validating Workers production, merging `codex/full-project-refactor` into `main`, and switching the formal site. The user then explicitly chose **local Wrangler CLI deployment instead of GitHub Actions deployment**. The user further clarified that GitHub must not run tests either. All testing, builds and publishing run locally; GitHub stores code only. Repository Actions are disabled and workflow files are removed. No new CI token or Actions secret is needed. Cloudflare must remain Free. The user approved a production cap of **60 attempted DeepSeek calls per UTC day** and **at most six additional real inference attempts for this release acceptance**. The earlier 20-call evaluation is exhausted and is not reopened. Preview inference remains closed.

First principles: the production branch, deployment artifact and live site must agree. A merge must not trigger the obsolete Pages build. Only passing source revisions may reach the production Worker, and production storage/secrets must remain separate from preview. Keep the legacy Pages artifact available for rollback.

Adversarial review: the existing Cloudflare token is source-IP restricted, so deployment uses the already-verified local IPv4 path; a production custom domain can conflict with the current Pages binding; daily limits do not enforce the separate six-attempt acceptance authorization; a successful build does not establish deployed behavior. Verify local credentials before merge, stage the Worker before routing, keep a durable acceptance ledger, and verify live APIs plus redirects after cutover. **存活**, subject to local token permissions and domain preflight; request only a demonstrated missing permission.

## Plan and progress

- [x] Read current Git/PR, Pages deployment and preview status; confirm the user-approved release scope.
- [x] Prepare explicit production Wrangler environment, isolated D1 and secrets; validate candidate on its temporary Workers endpoint without consuming model calls.
- [x] Disable repository Actions and remove workflows after the user clarified the local-only requirement; do not configure any GitHub runners or deployment secrets.
- [x] Review deployment/configuration changes, run relevant checks and push the release changes to the existing PR.
- [x] Disable obsolete Pages production and preview Git builds before merging reviewed PR #1 into main as `794d7fd`.
- [x] Verify the local-only main revision and publish that exact revision with local Wrangler.
- [x] Switch goodbye.help to the verified Worker; preserve www/startup redirects and leave wise.goodbye.help untouched. Verify public pages, metadata, cookies, state, retention and at most six real model calls.
- [x] Record final versions, branch/check/deployment correspondence and rollback steps; synchronize handoff documents.

## Baseline and recovery

- Repository: `liuyewang/goodbye-startup`; refactor head `329ef70`; main `a47c007`.
- Original production Pages artifact: deployment `b52ed56c-2790-4cab-8c67-d5aead5ee71c`, containing the preserved mobile changes from `ee0d2f0`. Keep it and the Pages project available.
- Existing preview Worker version: `0d37fba4-37e3-4d3d-8d76-3120a7a3a622`; D1 `aba5dbef-6d2a-4b86-a335-b3b5e8e6c400`. Do not reuse its database or session signing secret in production.
- Before this release, Pages production auto-deploy was enabled on main with `npx @cloudflare/next-on-pages`. It is now disabled; Pages preview Git builds are also disabled.
- GitHub initially had no repository Actions secrets or variables. Two non-secret release variables were briefly added during CI preparation, then removed because the user chose CLI deployment; readback confirms no repository Actions secrets or variables. Existing Cloudflare credentials remain private local environment variables, never copied into documentation or logs.

## Evidence and decisions

Release complete. PR #1 was merged as `794d7fd`; local-only cleanup was committed as `7cec1a7`. The formal domain now serves that verified main application revision. Subsequent documentation commits record this release and do not alter its application artifact.

### User-directed deployment change

The earlier interpretation retained the `Verify` workflow for automatic tests. The user clarified that this was not wanted. Repository Actions now reads `enabled: false`, there are no running GitHub jobs, and `.github/workflows/ci.yml` is deleted. The workflow had downloaded test browsers onto a GitHub runner; all subsequent browser testing uses the local machine. GitHub stores code only. Production is explicitly published by local Wrangler after local verification of the exact main revision.

### Preparation evidence

- Production D1 `goodbye-startup-production` created in WNAM, ID `68f019ae-d303-4f2e-8374-e24a761515c2`; migration `0001_simulation.sql` applied successfully. Preview storage remains separate.
- Explicit `env.production` added with daily limit 60, official model `deepseek-flash`, canonical origin `https://goodbye.help` and a separately provisioned session secret. It was initially staged without a domain route at a temporary workers.dev endpoint; the final reviewed source binds only the apex and disables workers.dev.
- Local `npm run check` passed: 41 core/D1/provider tests, generated types, lint, formatting, build and secret scan. Production build and dry-run also passed; Worker gzip is 413.06 KiB.
- The deployment guard rejects the default environment/placeholder and accepts the generated production configuration. It checks the exact D1, origin, budget, runtime compatibility and allowed domain scope.
- Private rollback snapshots of Pages source/build settings, original deployment, apex CNAME and redirect rules are stored outside Git. All MX/TXT records and unrelated hostnames are outside the cutover scope.

- Production candidate deployed without a domain route, then private provider/session secrets were provisioned. All 15 public pages and robots/sitemap/RSS/llms/Markdown passed. Health and D1-backed session reads pass with secure cookie flags.
- The staging origin check correctly rejects writes even when the request carries the apex Origin header, because it also checks the actual request URL. The first live-check script incorrectly expected 400; the remote 403 reproduced the mistake. The script was corrected to expect staging rejection and reserve canonical input-validation checks for after cutover. Application security was not weakened.
- Independent release review found no blocking issues. Its minor suggestion was applied: the production artifact guard now checks `preview_urls=false` and requires workers.dev to be closed once the apex domain is configured.
- Cloudflare domain changeset preflight succeeded for only `goodbye.help`; the subsequent controlled cutover is recorded below.

The candidate was validated with a temporary endpoint. After local main checks passed, its final apex custom-domain route and `workers_dev=false` configuration were applied during the cutover below.

### Local-only verification

After removing the workflow, `npm run check` passed all 41 tests, types, lint, formatting, build and client secret scan. `npm run test:e2e` passed all 32 cases locally across Chromium, Firefox, WebKit and a mobile viewport (1.1 minutes). No GitHub runner was used and these checks made no provider calls. Repository Actions readback remains disabled; the previous main run had already completed and no jobs were active.

## Final release evidence

| Item               | Verified result                                                                         |
| ------------------ | --------------------------------------------------------------------------------------- |
| Production URL     | `https://goodbye.help`                                                                  |
| Application source | `main@7cec1a77ac88739eaea1847de5446d144828b880`                                         |
| Worker             | `goodbye-startup-production`                                                            |
| Active version     | `86bdd727-9abe-4d3b-b1c9-7b64b373a053`, 100% traffic                                    |
| Production D1      | `68f019ae-d303-4f2e-8374-e24a761515c2`                                                  |
| Production budget  | 60 attempted DeepSeek calls per UTC day                                                 |
| Release acceptance | Exactly 6/6 attempts; all HTTP 200; stages 0, 5, 90, 120, 150, 180                      |
| Preview budget     | 0; earlier 20-call authorization remains exhausted                                      |
| Automation policy  | GitHub Actions disabled; workflow removed; Pages Git production/preview builds disabled |
| Publish path       | Local Wrangler CLI with existing local credentials; no CI token added                   |
| Plan               | Cloudflare Free; no upgrade                                                             |

The generated production artifact guard, secret scan and deployment dry-run passed (Worker gzip 413.08 KiB). Local HEAD equaled origin/main and the checkout was clean at upload. `wrangler versions upload` recorded the full main SHA, then `wrangler versions deploy` activated the exact version. Readiness and D1-backed sessions were checked on the temporary endpoint before transferring the apex.

Only the old apex CNAME and its Pages custom-domain attachment were removed. Local `wrangler triggers deploy` bound the apex to the production Worker. Remote readback confirms the domain is enabled, workers.dev and version previews are disabled, and daily cleanup is scheduled at `0 3 * * *`. The entire redirect ruleset and every unrelated DNS record match their private pre-cutover snapshots, including wise and apex MX/TXT. The retained Pages deployment ID is unchanged.

Formal-site checks passed for health, no-store API responses, Secure/HttpOnly/SameSite cookies, origin rejection, invalid setup validation, all 15 HTML pages, titles/canonical/OG/JSON-LD, static RSS, robots, sitemap, llms.txt and public Markdown. The simulator is indexable. Both www-to-apex and startup-to-simulator redirects return the expected 301 destinations. The retired `/api/chat` returns 410. Browser language switching preserved entered form text; mobile layout was reviewed locally without starting an extra simulation.

The six real attempts completed on 2026-11-09 at 13:03 UTC. The first three responses were English and the last three Chinese. Manual content inspection found consistent tutor-product context, bounded assumptions and uncertainty language; schema/timeline checks passed and Day 0 did not deduct cash. This small acceptance confirms the live path, not predictive accuracy or all possible model outputs. The synthetic run was deleted; session eligibility remained used. D1 readback shows six daily calls, one used session with six attempts, and zero remaining synthetic runs/operations. The durable ledger and synthetic responses stay outside Git with private permissions. No automatic provider retry occurred and no further release inference is authorized.

## Rollback and remaining limits

The old Pages project and deployment `b52ed56c-2790-4cab-8c67-d5aead5ee71c` remain available at their pages.dev address. For an application-only Worker rollback, select a compatible retained version and deploy it with local Wrangler. Do not down-migrate or erase production D1. If a full Pages rollback is required, remove only the apex Worker custom-domain binding, reattach `goodbye.help` to the retained Pages project, and restore its proxied apex CNAME from the private snapshot. Pages reactivation may take time; verify readiness and both redirects before declaring recovery. Keep Git auto-builds disabled. Pages cannot interpret new D1 saves.

The production cron configuration is verified, while its first scheduled production execution has not yet been observed. The same handler has passed local execution and prior isolated preview execution; this is not a claim of a production cron run. Anonymous browser quotas remain bypassable by a new identity and are bounded by the global budget. No account/payments or live market research was added. Search impact is unmeasured. The vinext beta compatibility tradeoff remains documented in architecture/review.

Final adversarial conclusion: **存活**. Local and formal-site acceptance pass; source, deployment version, account limits and local-only publishing policy are recorded. The finite real-model acceptance budget is exhausted and the loop stops without additional inference.
