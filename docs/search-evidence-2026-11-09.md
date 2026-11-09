# Search evidence for this refactor

Collected 2026-11-09 through the registered `goodbye` project, property `sc-domain:goodbye.help`, existing `webmasters.readonly` scope. No scope, scheduler, sitemap submission or search configuration was changed. Raw reports and credentials remain outside the repository in the CLI's private data directory.

Window: 2026-10-11 through 2026-11-07, 28 returned date rows, web search, final data, America/Los_Angeles dates. Property-level totals: 0 clicks and 4 impressions. Query rows were unavailable; do not infer that no queries existed. Page-level rows appeared for home and pricing, but page aggregates are not property totals. The small sample does not support keyword prioritization, growth claims or a statistically meaningful ranking comparison.

Homepage inspection reports PASS / submitted and indexed, with Google's stored canonical matching `https://goodbye.help/`. Stored crawl time: 2026-11-09T02:34:01Z. This only describes the indexed homepage, not all 15 routes or the new branch. Sitemap status is pending; no index count is inferred from deprecated fields. GSC does not measure AI citations, all visitors, conversions or real-user performance here.

| Priority | Evidence and target                                               | Change                                                               | Acceptance                                                                       |
| -------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| P0       | Code audit: inaccurate promises in `/pricing` and `/`             | Make free flow work and mark future plans unavailable                | Public HTML matches actual product; browser CTA test passes                      |
| P1       | Code/runtime audit: repeated/overlong titles and inherited OG URL | Shared metadata for all 15 URLs                                      | Titles ≤60, descriptions ≤155, self canonical/OG; local and later deployed audit |
| P1       | Article audit: CAC arithmetic, unsupported universal benchmarks   | Correct formulas and label hypothetical examples, preserve slugs     | Bilingual content tests and source review                                        |
| P2       | GSC has only four property impressions and no query rows          | Preserve URLs and revisit finalized data after an authorized release | Compare a later adequate window without treating sparse data as causal evidence  |

Local metadata tests prove code behavior only. No improvement in search visibility is claimed, and the refactor has not been deployed.
