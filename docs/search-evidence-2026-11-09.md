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

The refactor was subsequently deployed and all 15 public pages passed the live metadata audit; see the production release report. This proves deployed output only. No newer GSC measurement was taken during cutover and no improvement in search visibility is claimed.

## GSC-driven optimization task (current)

User requested final-data 28-day comparison, indexing/sitemap diagnosis and evidence-backed improvements. Binding verified by `gsc doctor`: goodbye → sc-domain:goodbye.help, existing webmasters.readonly scope. Doctor alone does not verify live access. Raw reports remain in the user-level private directory.

First principles: repair verified discovery/indexing/content defects; do not infer keyword demand from missing rows or claim ranking gains from a deploy. Reuse fresh reports and stable URLs. Adversarial verdict: **存活**, with sparse-data limitations; no new service, model call, scope expansion or automated follow-up is needed.

- [x] Verify project binding and current code/Git baseline.
- [x] Preserve and interpret current/previous-period totals, coverage, page/query opportunities and missing data.
- [x] Inspect sitemap and a selected important URL set; compare stored Google evidence with current HTML/code.
- [ ] Implement only justified changes, then run local checks and authorized publication/readback as applicable.
- [x] Record remaining limits and 14/28-day follow-up metrics; distinguish implementation from search outcomes.

### Baseline and interpretation

- Immutable private broad baseline: `/Users/guan/.local/share/gsc-tools/reports/goodbye/20261109T154354-b40a819fc0f3.json`. Index baseline: `20261109T154538-e887019aa34c.json` in the same private directory. Pre-change source HEAD: `6c17d836c481a7a16f8167a12a47e0f50c9750a5`. No raw report is copied into Git.
- Property sc-domain:goodbye.help, web search, final, no filters, dates America/Los_Angeles. Latest complete boundary determined via firstIncompleteDate. Current 2026-10-11–11-07 versus previous 2026-09-13–10-10. Both return 28 date rows out of 28, so no date-row gap in these responses. Dates after 11-07 are outside this finalized comparison. Query suppression/omission remains separate from date coverage.
- Report generation at 15:43:54 UTC / 23:43:54 Singapore on 2026-11-09 does not renew its source fetches. Underlying fetches span 10:13:37–15:43:54 UTC, oldest age about 5.51 hours at generation. Reused 14 cached responses and made 2 API requests; no unnecessary refresh. The subsequent selected index report used 7 API requests and 2 cached responses. Scope remains readonly.

| Property-level metric | Previous 28 days | Current 28 days | Interpretation                                                                 |
| --------------------- | ---------------- | --------------- | ------------------------------------------------------------------------------ |
| Clicks                | 0                | 0               | No percentage growth defined from zero baseline                                |
| Impressions           | 4                | 4               | Unchanged, far too sparse for a trend claim                                    |
| CTR                   | 0%               | 0%              | Difference 0 percentage points                                                 |
| Average position      | 7.25             | 5.25            | Delta -2 positions (numerically better), not evidence of a stable ranking gain |

Page rows are a different aggregation: home 4→3 impressions (-1, descriptive -25%), 0 clicks in both periods, position 7.25→5.67; pricing returns 2 impressions/0 clicks/position 3 only in current rows. Its absent previous row is unknown, not zero or proof of growth. Current page impressions sum to 5 while property total is 4; do not sum page rows into property totals. No paired page reaches the collection screening threshold of 20 impressions per period. No statistically meaningful high-impression/low-CTR opportunity is established.

Query and query-page datasets return no rows in current data, and previous query rows are absent too. This does not establish zero queries or keyword demand. No keyword growth/decline ranking, keyword stuffing or demand-driven title rewrite is justified. Current device rows: desktop 3 impressions, mobile 1; countries: USA 3, Russia 1, all with zero clicks. Samples do not justify device/country-specific changes. No /blog/ or /guides/ page rows are returned; directory traffic is unknown, so further filtered segmentation is deferred rather than treating it as zero.

### Selected indexing and sitemap diagnosis

Checked exactly 8 of 15 public URLs: /, /simulator, /pricing, /how-it-works, /blog, /blog/customer-acquisition-cost-benchmarks, /guides, /guides/startup-idea-validation. This is not a whole-site indexing count. Seven are stored as Submitted and indexed, with robots allowed, fetch successful, indexing allowed and Google/user canonical matching. /blog alone is URL is unknown to Google, with no stored crawl/canonical and unspecified fetch/robots state. Missing canonical is unknown, not a confirmed canonical mismatch. Stored crawls range from 2026-11-07 to 11-09 and several predate the refactor release; they are not live validation of new HTML.

All eight return rich-results status not_reported: no positive evidence of an issue or eligibility, and no guarantee of display. Current HTML JSON-LD parsing is a separate technical check. Do not introduce FAQ/Product promises solely to chase rich results.

One submitted sitemap, https://goodbye.help/sitemap.xml: pending, submitted 2026-11-09T06:11:30.731Z, last download unreported, 0 reported errors/warnings, submitted/indexed counts unknown. Live XML returns 200/application/xml and contains all 15 absolute canonical public URLs. robots.txt returns 200, allows crawling and points to the same sitemap. No confirmed sitemap syntax/access defect justifies changing or repeatedly resubmitting it. GSC readonly authorization cannot submit sitemaps or request indexing.

### Evidence-backed action register

| Priority | Evidence / target                                                                                     | Specific action                                                                                                    | Acceptance / status                                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | /blog unknown to Google; live/source footer lacks /blog and /guides; home links /blog but not /guides | Add descriptive bilingual links to both hubs in shared footer, bringing both hubs one click from every public page | Every one of 15 server-rendered pages contains both footer hrefs; both destinations return 200 and retain self canonical. Indexing gain remains unverified. |
| P1       | Discovery navigation can regress independently of metadata                                            | Extend existing audit-pages script to check actual rendered footer links                                           | Production-runtime and deployed audits pass for all 15 URLs                                                                                                 |
| P2       | Sitemap pending without reported syntax errors                                                        | Preserve current valid map and crawl permissions; revisit stored download status later                             | Record last download/pending/errors at follow-up; no artificial lastmod churn or new submission scope                                                       |
| P2       | Home has only 3 impressions, pricing 2, no query details                                              | Preserve titles/URLs and collect future comparable final data                                                      | Reassess only after query/page evidence is available; never convert absent rows to zero                                                                     |
| P2       | Seven inspected pages have matching canonicals; rich results unreported                               | Preserve canonicals and visible/schema consistency; validate current JSON-LD syntax                                | Existing metadata/JSON-LD checks pass; no claim of rich-result eligibility                                                                                  |

Adding discoverable anchor links follows [Google's link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). Sitemap evaluation follows [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Weak internal navigation is a plausible contributing factor, not a Google-confirmed sole cause of /blog's unknown status.

### Follow-up at 14 and 28 days (no automatic schedule)

Use release day 2026-11-09 in Singapore as the intervention marker. Review around 2026-11-23 and 2026-12-07, waiting until the target windows are finalized in Pacific dates. For a complete post-change baseline, use Pacific 2026-11-10–11-23 (14 days) against 10-27–11-09, and 11-10–12-07 (28 days) against 10-13–11-09. Those comparison windows include the intervention day, so also preserve the immutable pre-change 28-day report above; comparisons do not prove causality.

At each review: record actual date rows/missing days, property totals, clicks, impressions, CTR percentage-point delta, position delta, returned query/page coverage and API truncation. Recheck /blog stored discovery/indexing/crawl time, sitemap pending/last download/errors and the same 8 canonical URLs. Inspect whether /blog and guides produce returned rows, without declaring missing rows zero. Compare paired queries/pages only with adequate samples; 20 impressions is a screening threshold, not significance. Track technical acceptance (15/15 hub links, healthy XML, canonical consistency) separately from outcomes (Google discovery, impressions/clicks/CTR). GSC cannot establish simulator conversions, all visitors, or AI citations. No model evaluation or scheduled job is created.

### Verification and publication checkpoint

Local npm run check passed 41 tests, types, lint, formatting, build and secret scan. Targeted browser regression passed four projects (Chromium, Firefox, WebKit and mobile) for bilingual state preservation/IME handling. The built Worker at localhost:4173 passed all 15 public pages, both hub links in rendered footers, canonical/OG/JSON-LD syntax, sitemap canonical URL completeness/uniqueness and robots sitemap discovery. Initial server startup was blocked by sandbox EPERM on Wrangler's user-level development registry; rerunning with approved local tool access resolved it. No application fix or provider request was needed for that environment issue. Publication/readback pending.
