# Contributing

Read README, AGENTS and the current PRD before editing. Keep the app small: add a layer only for a real boundary, growth requirement or risk. Use the approved plan/progress documents for multi-step work and record decisions as evidence changes.

Run `npm run setup:local` and local migrations. Use mock mode for normal work. Add a failing behavioral test before changing core state, persistence, trust boundaries or recovery. Do not write tests that merely repeat trivial implementation. Use real D1 tests for SQL semantics; never substitute a transaction mock for concurrency acceptance.

Keep pure domain code free of React, Workers and provider dependencies. HTTP routes delegate to server use cases. Do not render untrusted HTML, trust browser balances or let model fields control quotas/timeline. Stable request IDs and server versions are part of the public protocol.

All user-facing copy is bilingual and follows the translation contract; generated AI text is not retroactively translated. Use “一次模拟”. Explain that stage days are simulated and actual use takes about 15 minutes. Public content needs honest evidence labels. Preserve old URL slugs when correcting article titles.

Use Conventional Commits. Before review run `npm run check`, browser tests and relevant runtime audits. Run `npm run format` to apply formatting. Regenerate public assets with `npm run content:generate`; do not edit generated Markdown/RSS by hand. Do not commit local environment files, raw GSC data, reports, traces with real inputs or credentials.

A clean local branch is not a deployment. Routine website releases have standing user authorization under AGENTS.md (2026-11-10): after checks and code review, complete necessary commits/pushes/normal integration, deploy and verify the live site without another approval prompt. Domain changes, new paid resources, destructive operations and paid evaluations retain their separate existing authorization boundaries. GitHub stores code only; Actions are disabled. Run checks, browser tests, builds and Wrangler deployments locally. Do not introduce a GitHub workflow or runner without an explicit user request.
