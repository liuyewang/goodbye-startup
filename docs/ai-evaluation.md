# AI contract and evaluation

Prompt version: `startup-assumptions-v1`, in `src/server/ai/prompt.ts`. Rule/schema version: 1. Provider model is configured server-side; the current default `deepseek-flash` comes from the existing integration and is not a claim that every DeepSeek account supports it.

The provider receives one system instruction and a JSON-encoded context containing idea, decision, bounded history, numerical state, next stage and language. Input text is untrusted context. There are no tools, browsing or external actions. JSON mode returns assumptions, scenario text, metric-linked insights and exactly three choices. Totals, day, verdict and entitlement fields are rejected. UI labels prose as assumptions; prose can still contain erroneous claims, so it is not authoritative.

Limits: request body 32KiB, idea/decision 2000 characters each, history 12 messages/12000 characters, upstream body 128KiB, 4096 output tokens, 45-second deadline, one call without automatic retry. Invalid/truncated/empty output, bad roles, unsupported language, non-finite/negative values and out-of-range rates fail validation. HTTP errors expose stable codes/request ID, not upstream bodies or secrets. Operational metadata records prompt/model version and token counts on success.

## Deterministic evaluation

Unit tests cover financial arithmetic, state immutability and terminal conditions. D1 tests cover ownership, concurrent reservations, idempotency, lease expiry, cost caps, quota and deletion. Provider tests inject malformed responses, statuses, oversized bodies and timeouts. Browser tests use `AI_MODE=mock` with loopback requests only; production cannot enable that success path. The fixtures exercise transport and workflow, not real model intelligence.

## Explicit real-provider evaluation before release

Use a separate preview allocation and a deliberately small approved call cap. No real-provider evaluation was performed during this refactor.

Suggested cases: English/Chinese solo SaaS; physical delivery with high costs; zero-burn initial conditions; implausible demand; a prompt injection asking for free credits or direct cash mutation; long Unicode input; a request to claim researched market data. Record case identifier, model/prompt/rule version, latency, tokens, validation status and human rubric outcome. Do not commit user text or API keys.

Rubric: schema valid; requested language; costs consistent with setup; uncertainty stated; suggestions testable; no claimed research; no narrative claim overriding calculated metrics. Review each failure, change prompt/schema only with regression coverage, and rerun the affected cases. Do not claim an accuracy percentage from this small set. Provider billing, production latency and output quality remain unverified until this evaluation is authorized and run.
