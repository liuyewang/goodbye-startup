# Configuration cleanup — 2026-11-09

User authorized executing the configuration audit recommendations. Work remains CLI-first, Cloudflare Free, with no additional model calls or GitHub Actions.

First principles: one production inference path, no credential-bearing public legacy deployments, isolated preview data, and recoverable source/artifacts. A project-level secret removal alone does not close immutable historic deployment URLs.

Adversarial conclusion: **存活**, provided a private rollback artifact is verified before replacing/removing legacy deployments. Retain source in Git and a private complete artifact backup for at least 30 days (through 2026-12-09); this is a retention policy, not an automatic deletion schedule. No application database is to be deleted.

- [x] Verify and privately archive the preserved legacy artifact and deployment metadata.
- [x] Replace Pages with a credential-free retirement endpoint; remove legacy public deployments/aliases and stored provider secret. Keep project Git builds disabled.
- [x] Remove preview provider secret and disable its public endpoints; retain D1/session identity.
- [x] Enable query-string log redaction in configuration and remote settings, retaining error diagnostics and existing sampling.
- [x] Protect main from force push/deletion, delete the merged refactor branch and obsolete Actions caches.
- [x] Verify formal site, all known old URLs, remote settings and GitHub readback; synchronize documents and commit/push.

## Execution evidence

- GitHub main protection is enabled, including administrators: force push and branch deletion are blocked. Required status checks remain null; no GitHub Actions requirement was added. Only main remains as a remote branch. All three Actions caches were deleted and readback count is zero. Repository Actions remains disabled.
- The legacy complete Pages artifact was archived under the private configuration-cleanup directory outside Git, with a per-file SHA-256 manifest and archive verification. Keep at least through 2026-12-09. Source baseline ee0d2f0 remains in Git history. No database was removed.
- Pages production DEEPSEEK_API_KEY was deleted using Wrangler. Production and preview environment secret lists are empty. Git deployment processing, production builds, preview builds and PR comments are disabled. The obsolete integration remains only as disabled project metadata; its GitHub App was not uninstalled at account level because it may serve other projects.
- Pages now has exactly one credential-free retirement deployment, 18576aa0-024e-45ca-aba5-b16e4fe40d85. GET requests redirect to the formal website, while every /api path returns 410 LEGACY_RETIRED without provider access. The preceding retirement deployment was also removed.
- All 80 original deployment records were deleted, including old production, preview, failed/idle builds and the head branch alias. Merely changing the project secret was insufficient; removing historical versions closed their captured runtime bindings. Old deployment IDs in the production release report are historical evidence and no longer valid online rollback targets.
- Preview DEEPSEEK_API_KEY was deleted with Wrangler. SESSION_SECRET and D1 are retained to avoid unnecessary identity/data resets. Both its workers.dev and version-preview endpoints are disabled; the inference cap remains zero.
- Both Workers now have observability.redact_query_string=true, verified remotely. Existing logging, sampling and error diagnostics remain enabled. Source wrangler.jsonc records redaction and the closed preview endpoint so future deployments preserve the policy. The production application version and daily 60-call limit remain in place.
- Production build, explicit artifact guard and secret scan passed after configuration edits. Public checks perform no real inference; the prior six-call release allowance remains exhausted.

## Recovery policy

The old Pages online deployments were deliberately retired because they retained uncontrolled AI access. The former one-click Pages rollback instructions are superseded. To recover the old implementation, verify and extract the private legacy-pages-artifact.tar.gz, review its missing modern protections, and provision credentials only in an explicitly controlled deployment. Do not route public traffic to its old unrestricted API. Prefer a compatible retained production Worker version for ordinary rollback; preserve production D1 and its SESSION_SECRET.

The retained Pages project is only a safe retirement endpoint; it holds no provider secret and has no formal domain. Its continued existence avoids reviving old public URLs. No automatic deletion or paid service was scheduled. The local management token was not revoked or broadened; exact policy narrowing still requires reviewing its ownership and other project uses.

## Final verification

All 81 unique historical deployment/alias URLs returned 404 for the old API path. Both the project Pages address and the sole remaining retirement deployment returned 410 LEGACY_RETIRED; its homepage redirected to goodbye.help. Formal health/readiness, D1-backed session, cookie flags, invalid-origin rejection and invalid-input rejection passed. No provider call was made. Final conclusion: **存活** — exposed legacy inference paths are closed and the local-only release policy remains intact.

## Authorized daily budget update

The user subsequently approved increasing the production global attempted-model-call cap from 60 to 300 per UTC day. Preview remains zero. Per-session attempt limits and the 6-per-60-second burst guard are unchanged; existing daily counters are not reset. Plan verdict: **存活** — this changes the explicit provider usage budget only, without adding services or changing the Cloudflare plan. Source config, artifact guard and current operating docs are updated together. Published from main@f88a3c0 via local Wrangler as version e1ae43bf-96e4-4c17-a509-902a14dce0f0. Remote settings readback confirms production 300 and preview 0; active version and live readiness/session/input checks passed without model inference. Types, lint, production build, artifact guard and secret scan passed.
