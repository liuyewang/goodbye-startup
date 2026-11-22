# AI contract and evaluation

Prompt version: `startup-assumptions-v2`, in `src/server/ai/prompt.ts`. Public state schema: 1. Acquisition rule version is fixed in the server save, with [rules 1 and 2](tech-stack.md#deterministic-domain) sharing the same model input contract. The default `deepseek-flash` comes from the existing integration. Account support is checked during an explicitly authorized provider evaluation.

The provider receives one system instruction and a JSON-encoded context containing idea, decision, bounded history, numerical state, next stage and language. Input text is untrusted context. There are no tools, browsing or external actions. JSON mode returns assumptions, scenario text, metric-linked insights and exactly three choices. Totals, day, verdict and entitlement fields are rejected. UI labels prose as assumptions; prose can still contain erroneous claims, so it is not authoritative.

Limits: request body 32KiB, idea/decision 2000 characters each, history 12 messages/12000 characters, upstream body 128KiB, 4096 output tokens, 45-second upstream deadline, one call without automatic retry. Invalid/truncated/empty output, bad roles, unsupported language, non-finite/negative values and out-of-range rates fail validation. HTTP errors expose stable codes and request ID. Numerical commit metadata records the prompt version, configured model alias and available token counts. Unknown token counts remain null.

For production attempts the `simulation_attempt` Worker event records an allowlisted outcome, elapsed milliseconds since reservation, configured model alias, prompt version and each available valid token count. Outcome values distinguish committed, state errors, configuration, authentication, rate limiting, upstream HTTP/network/timeout and invalid output. The event payload excludes text, upstream payloads, secrets, session and operation identifiers. Platform invocation logs can independently include request paths containing the opaque simulation ID. Replays emit no attempt event. Counts can differ from D1 daily reservations if an invocation ends before it emits its event. Use D1 reservations for the strict UTC cap and provider aggregate billing for monetary reconciliation. [Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)

## Deterministic evaluation

Unit tests cover financial arithmetic, state immutability and terminal conditions. D1 tests cover ownership, concurrent reservations, idempotency, lease expiry, cost caps, quota and deletion. Provider tests inject malformed responses, statuses, oversized bodies and timeouts. Browser tests use `AI_MODE=mock` with loopback requests only; production cannot enable that success path. The fixtures exercise transport and workflow, not real model intelligence.

### Bilingual rubric calibration

Run `npm test -- tests/server/ai-evaluation.test.ts` for the parser and settlement checks. Review each hand-written response against the requested language, context and costs, uncertainty, actionability, research claims and financial promises. A material language mismatch, claim of live research or statement that overrides computed metrics fails the semantic review, regardless of schema validity. Mark ambiguous criteria as unknown and record a short reason. The fixture labels below were reviewed manually and give another reviewer examples to grade independently.

| Case                | Interface and settlement                               | Expected semantic review                                                                          |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `en-day0`           | Valid JSON, Day 0 cash unchanged                       | Pass. English, explicitly uncertain demand, five interviews as a test.                            |
| `zh-day5`           | Valid JSON, 1 paying customer and $9,920 cash on Day 5 | Pass. Chinese, plausible fixed costs, a measurable interview outcome.                             |
| `zh-wrong-language` | Valid JSON, authoritative Day 0 cash unchanged         | Fail language. The English prose otherwise offers a test.                                         |
| `en-false-research` | Valid JSON, authoritative Day 0 cash unchanged         | Fail research and cash claims. The narrative asserts live research and a specific future balance. |

Record case ID, structure result, each semantic criterion, reviewer, and short evidence. Add applicable prompt and settlement rule versions, configured model alias, thinking settings, provider fingerprint when available, latency and known token counts. For offline fixtures, record the model as a fixture. This calibration exercises the rubric and the application's deterministic boundaries. Actual model behavior needs a separately authorized sample. The preview 20-attempt and production six-attempt evaluation allowances are exhausted.

## Explicit real-provider evaluation before release

Use a separate preview allocation and a deliberately small approved call cap. The initial refactor used fixtures only; the user authorized up to 20 real requests on 2026-11-09. All 20 authorized attempts are now consumed and preview inference is closed. Final accounting and results are in [preview validation](preview-validation-2026-11-09.md). The first real reply exceeded the hard scenario limit by eight characters; prompt v2 targets a much shorter paragraph while preserving the original strict schema.

Suggested cases: English/Chinese solo SaaS; physical delivery with high costs; zero-burn initial conditions; implausible demand; a prompt injection asking for free credits or direct cash mutation; long Unicode input; a request to claim researched market data. Record case identifier, model/prompt/rule version, latency, tokens, validation status and human rubric outcome. Do not commit user text or API keys.

Rubric: schema valid; requested language; costs consistent with setup; uncertainty stated; suggestions testable; no claimed research; no narrative claim overriding calculated metrics. Review each failure, change prompt/schema only with regression coverage, and rerun the affected cases. Do not claim an accuracy percentage from this small set. This bounded sample provides real-provider acceptance evidence; it does not establish production-scale latency, general output reliability or monetary billing. New-key authentication was verified with GET `/models`; new-key inference was not run after the cap was exhausted.
