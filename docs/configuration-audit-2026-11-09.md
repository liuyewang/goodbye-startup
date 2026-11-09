# GitHub / Cloudflare configuration audit — 2026-11-09

Historical audit snapshot, taken before cleanup. See [cleanup results](configuration-cleanup-2026-11-09.md) for the current state.

Status: complete, read-only remote audit. No provider inference, credential rotation, deletion or remote configuration change was performed. Secret names/types only were collected. Official Wrangler guidance was consulted. This report supersedes older infrastructure descriptions where they conflict.

First principles: retain one controlled production path, isolated test state and an explicit recovery path. Inventory actual remote configuration before removing anything. Adversarial conclusion: **需修改** — the new Worker is bounded, but the retained public legacy API may bypass those controls; rollback retention must not retain uncontrolled provider access.

## GitHub

Repository `liuyewang/goodbye-startup` is public; default branch main. Current main is `1691cca` (release documentation), while the deployed application was built from main `7cec1a7`. PR #1 is merged. The other remote branch is `codex/full-project-refactor`. Neither branch is protected and no rulesets exist. Automatic deletion of merged branches is off.

Repository Actions is disabled, with no tracked workflows, repository Actions secrets/variables, deployment environments, webhooks or deploy keys. This does not inventory personal account SSH/PAT credentials or prove the Cloudflare GitHub App is uninstalled. The old Pages project still declares a GitHub source. No Actions artifacts remain; three dependency caches total 763,879,992 bytes (about 729 MiB). Historical runs are records, not active machines.

Suggested cleanup: remove obsolete merged refactor branch; clear unused Actions caches if desired. Consider protecting main against force push/deletion without requiring Actions checks. Keep local verification as the release gate.

## Cloudflare resources

| Resource                            | Purpose / observed state                                                                                                                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Worker `goodbye-startup-production` | Formal application and REST APIs, custom domain goodbye.help. Version `86bdd727-9abe-4d3b-b1c9-7b64b373a053` receives 100% traffic. workers.dev and version preview URLs disabled.                                                                                  |
| D1 `goodbye-startup-production`     | ID `68f019ae-d303-4f2e-8374-e24a761515c2`; numerical runs, anonymous sessions, operation leases/idempotency and daily cost counter. No conversation body storage.                                                                                                   |
| Worker `goodbye-startup-preview`    | Isolated test application on workers.dev; no formal domain. Real inference budget zero.                                                                                                                                                                             |
| D1 `goodbye-startup-preview`        | ID `aba5dbef-6d2a-4b86-a335-b3b5e8e6c400`; isolated test state, never merge into production.                                                                                                                                                                        |
| Pages `goodbye-startup`             | Legacy rollback application on pages.dev, retained deployment `b52ed56c-2790-4cab-8c67-d5aead5ee71c`. No formal custom domain. Production and preview Git builds disabled. GitHub source configuration still present; obsolete next-on-pages build command remains. |
| Rate limit bindings                 | Production namespace 1001, preview 1002, 6 requests/60 seconds per hashed IP/action key per location; approximate burst protection.                                                                                                                                 |
| Static asset binding ASSETS         | Built JS/CSS/images/public files, deployed with Worker; no separate R2 bucket required.                                                                                                                                                                             |
| Cron, both Workers                  | `0 3 * * *`: 03:00 UTC / 11:00 Singapore and Beijing time, purges expired numerical state/quota metadata.                                                                                                                                                           |
| Observability, both Workers         | Invocation logs enabled and persisted, sampling rate 1; traces disabled. Query-string redaction currently false.                                                                                                                                                    |

No other goodbye-named Worker or D1 was returned. The application has no KV, R2, Durable Object, Queue or Workers AI binding; this is not an inventory of unrelated account projects. Top-level `goodbye-startup-refactor` and all-zero D1 ID in wrangler.jsonc are local/default safeguards, not provisioned resources.

## Variables and credentials

| Name                                                | Purpose / location                                                                                                                                                                                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| DEEPSEEK_API_KEY                                    | Runtime secret authorizing provider inference. Present on production Worker, preview Worker and legacy Pages production. Secret plaintext was not read or compared; equality cannot be proven from write-only remote secrets.                                      |
| SESSION_SECRET                                      | Independent production/preview runtime secrets for signed anonymous cookies and HMAC identifier/IP separation. Rotating invalidates identities and can affect quota continuity.                                                                                    |
| CLOUDFLARE_API_TOKEN                                | Private local management credential used by Wrangler/Cloudflare API; token verification returned active. Not an application runtime key or GitHub secret. Exact policy/scope inventory was not available in this audit; do not claim least privilege was verified. |
| APP_ENV                                             | production / preview; selects readiness and environment protections.                                                                                                                                                                                               |
| AI_MODE                                             | deepseek on both remote Workers; local mock is only for development.                                                                                                                                                                                               |
| DEEPSEEK_MODEL                                      | deepseek-flash, provider model identifier.                                                                                                                                                                                                                         |
| AI_DAILY_CALL_LIMIT                                 | Production 60, preview 0. Counts attempted provider calls per UTC day, including failed attempts. D1 enforces the global budget, distinct from the approximate short-window limiter.                                                                               |
| SITE_ORIGIN                                         | Canonical mutation origin: https://goodbye.help or the isolated preview hostname.                                                                                                                                                                                  |
| DB / ASSETS / AI_RATE_LIMITER                       | Runtime binding names, not passwords.                                                                                                                                                                                                                              |
| Account / zone / database / namespace / version IDs | Resource identifiers, not authentication secrets.                                                                                                                                                                                                                  |

Legacy Pages currently exposes only DEEPSEEK_API_KEY in its production env_vars list. GEMINI_API_KEY and NEXT_PUBLIC_SITE_URL are not present there. Local ignored .dev.vars is the current Workers development binding source; .env.local is legacy. No local credential file contents were collected.

The local management credential has previously required an allowed IPv4 egress path. Operational capabilities used include Workers scripts/secrets/deployments, D1, domain routing, DNS and retained Pages management. A dedicated project-scoped credential and removal of unnecessary legacy Pages access are sensible once rollback policy is decided; do not revoke a shared credential blindly.

## Domain and DNS

- goodbye.help: Worker custom domain enabled; proxied AAAA 100:: is the originless Worker DNS record, not a stale Pages origin. Preserve it.
- www.goodbye.help: proxied placeholder A plus 301 redirect to apex; path and query retained.
- startup.goodbye.help: proxied placeholder A plus 301 redirect to /simulator; query discarded by existing policy.
- Three apex MX records point to Aliyun corporate mail. TXT records include default._domainkey and _dmarc plus two apex TXT records. Preserve these mail/verification records unless separately audited by purpose; values were omitted.
- SSL Full (strict), certificate active.
- wise.goodbye.help appears in historical instructions as a separate payment service, but this audit returned no corresponding record in the current zone list. This does not establish whether that service is retired; clarify independently before touching related infrastructure.

## Priority findings

1. **High: legacy provider access remains reachable.** Both goodbye-startup.pages.dev/api/chat and b52ed56c.goodbye-startup.pages.dev/api/chat returned the old API's 400 Invalid messages format for an empty request. This performed no inference. Retained source ee0d2f0 forwards accepted messages to DeepSeek without the new D1 daily cap/origin control. The legacy project still has a provider secret. Valid inference was deliberately not attempted, so actual provider success is unverified; nevertheless this is an exposed path outside the new global budget. Disable legacy inference across project, deployment-hash and branch aliases while retaining rollback artifacts. Merely removing the apex binding or changing a project variable does not prove historical deployments are closed. Verify all retained URLs before declaring the risk resolved.
2. **Medium: preview credential/access can be reduced.** Budget zero currently fails closed. If real evaluation is not planned, remove the preview provider secret and close/restrict the public preview endpoint; preserve D1 if useful for future regression. A future authorized evaluation can restore credentials deliberately.
3. **Medium: protect main without Actions.** Block force push/deletion; do not reintroduce required GitHub-run tests. This complements the local release gate.
4. **Low: operational simplification.** Define the legacy rollback retention window, then retire obsolete Pages Git integration/build settings/resources as one reviewed change. Clear the merged branch and unused 729 MiB caches. No immediate paid-plan or new-service need was found.
5. **Low: log minimization.** Enable query-string redaction and consider lower normal invocation sampling when traffic warrants it; preserve necessary error diagnostics. The current raw IP/body handling was not re-audited here.

No destructive cleanup was performed. Any legacy retirement must preserve the approved recovery artifact and explicitly address the secret-bearing historical deployments. The daily 60-attempt limit applies to the new production Worker, not automatically to every use of the provider credential.

Official references: [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [rate limiter semantics](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
