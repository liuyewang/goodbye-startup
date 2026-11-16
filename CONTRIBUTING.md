# Contributing

Read [AGENTS.md](AGENTS.md) for project constraints, authorization and source-of-truth entrypoints. Resume from the existing checkpoint; consult the relevant [module lessons](docs/release-review-2026-11-09.md#reusable-lessons-by-area) before related work.

Run `npm run setup:local` and local migrations. Use mock mode for normal work. Add a failing behavioral test before changing core state, persistence, trust boundaries or recovery. Do not write tests that merely repeat trivial implementation. Use real D1 tests for SQL semantics; never substitute a transaction mock for concurrency acceptance.

Use Conventional Commits. Before review run `npm run check`, browser tests and relevant runtime audits. Run `npm run format` to apply formatting. Regenerate public assets with `npm run content:generate`; do not edit generated Markdown/RSS by hand. Do not commit local environment files, raw GSC data, reports, traces with real inputs or credentials.

A clean local branch is not a deployment. Follow [the local release procedure](docs/deployment.md#production-releases-via-local-wrangler) and AGENTS.md's standing release authorization and separate boundaries. GitHub stores code only; all checks and publishing run locally, with Actions disabled. Documentation-only updates do not require rebuilding or republishing the Worker.
