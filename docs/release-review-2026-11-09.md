# Refactor acceptance and independent review

Scope: local release candidate on `codex/full-project-refactor`, based on preserved baseline `ee0d2f0`. Production Pages, remote resources and paid inference were not changed. The complete project location/remote/previous status are in `project-audit-2026-11-09.md`; current implementation instructions are in the root README.

## Independent review

One fresh whole-branch reviewer inspected `ee0d2f0..21037c3` across domain, D1, HTTP/AI, browser recovery, i18n, content and release configuration. It identified four important recovery defects. Each was reproduced before the fix, then verified by behavioral regression:

| Finding                                 | Root cause and fix                                                                                                                                                                | Evidence                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Stale tab erases newer AI text          | Whole-record overwrite from stale React state. Successful turns now have independent immutable run/version keys; reads and writes merge committed turns.                          | Two-tab browser test failed then passed; independent slot survives a deliberately stale metadata overwrite. |
| Expired pending ID loops forever        | Duplicate-ID branch ran before lease cleanup. The same expired pending operation now atomically fails with REQUEST_EXPIRED, preserving attempts; explicit retry may use a new ID. | Real D1 same-ID expiry test failed then passed, attempt count remains 1 until replacement.                  |
| Cookie loss/deletion hides local export | Discovery depended solely on server runId. A browser last-run index now discovers text independently, without restoring authority.                                                | Delete/reload and clear-cookie browser tests failed then passed.                                            |
| Refresh discards unsaved memory         | Disk state replaced a newer in-memory transcript after quota failure. Refresh merges same-run memory, disk and independent turn slots.                                            | Browser storage-write failure followed by in-app refresh failed then passed.                                |

Additional self-review fixes: read numeric state after reservation rather than before it; trim multi-byte history by UTF-8 bytes as well as characters; pin the built preview's persistence path to the migrated local DB. A genuinely lost successful response is replay-tested without another AI attempt.

The reviewer did not independently validate real DeepSeek quality/account support, remote deployment/billing or the parent's preview-path investigation. These are accepted boundaries: deterministic tests do not establish provider quality; no remote acceptance is claimed. The preview-path defect was separately reproduced and verified locally. No minor findings were deferred.

## Verification scope

- 41 tests across domain, real local D1, provider/HTTP boundaries, persistence, service race, byte bounds and public content.
- Eight browser scenarios across Chromium desktop, Firefox, WebKit and Chromium mobile (32 cases). Includes full six-stage flow, reload/export, used eligibility, language/IME, provider failure, delete/cookie loss, stale tabs, storage failure and true lost response.
- TypeScript, ESLint, Prettier, production build and tracked/client-bundle secret-pattern scan.
- Fifteen public HTML routes: status, title budget, canonical, OG URL, JSON-LD and security header checks; robots, sitemap, static RSS, llms.txt and Markdown.
- Built local Worker REST smoke: origin rejection, schemas, signed session, setup, six turns, idempotent replay, quota and delete. Local scheduled retention invocation is checked separately from deployed cron.
- `npm audit` reports zero known vulnerabilities in the installed lockfile. The final `wrangler deploy --dry-run` packages 66 static assets and a 1390.11 KiB Worker (412.89 KiB gzip) without deploying.

Build warnings from upstream vinext/Vite concern sourcemap mapping and chunk placement. They are recorded rather than hidden. A beta adapter still requires remote preview validation. GitHub CI is configured with pinned official action SHAs and read-only permission, but no remote workflow run occurred because the branch was not pushed.

The final browser run passed all 32 cases in 54.9 seconds. After rebuilding, restart the local preview before auditing: an already-running Wrangler process retained a stale asset snapshot and returned RSS 404, while a fresh process served every audited asset successfully. The fresh built Worker also passed the six-stage REST smoke and scheduled retention invocation.

## Decisions and tradeoffs

1. Reused the approved checkout with a baseline commit instead of creating another worktree. Cost if wrong: concurrent external edits need careful reconciliation; none were overwritten.
2. Implemented inline with test gates and one fresh final reviewer. Cost: fewer independent eyes during each intermediate task; final review found and repaired recovery gaps.
3. Used official vinext Wrangler setup with stable Vite plugin v1, preserving the compatibility date. Cost: adapter beta limitations remain; remote preview is a release gate. A minimal Worker entry was added only for scheduled cleanup, preserving the official fetch handler.
4. Used ESLint 10/TypeScript/React Hooks rules instead of the incompatible Next preset. Cost: fewer preset accessibility checks; keyboard/IME/mobile browser scenarios and review supplement them.
5. Rewrote inaccurate/unverifiable claims into sourced definitions and hypothetical arithmetic while preserving URLs and topics. Cost: wording changes may affect search behavior; GSC evidence is too sparse to predict that effect.
6. Normalized root URL trailing-slash equivalence in audits. Cost: this intentionally accepts equivalent root serialization while still requiring correct canonical path on every other page.

## Release boundary

Local acceptance can be completed independently. Still required for a real release: authorize/provision preview D1 and Worker, supply private secrets, approve a small real-model evaluation, verify remote bindings/limits/cleanup, then separately review production routing and rollback. Do not change `wise.goodbye.help`. Anonymous identity can be reset by clearing cookies; this is documented, not person-level enforcement. No checkout or subscriptions exist.

Disposition: **存活** as a locally verified reference implementation with explicit remote/model release gates. Do not describe it as already deployed or empirically predictive.

Implementation and final recovery fixes end at commit `03e2347`. The last full `npm run check` on that commit passed all seven test files / 41 cases and every other included gate. The branch is retained locally as agreed; no merge or push was performed. Later documentation-only completion updates do not change the verified implementation.
