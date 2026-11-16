# Show HN draft and demo

Prepared 2026-11-16. Reviewable material only: not submitted, no distribution or conversion result yet. Author should verify the statements against their own experience and be available to answer questions. Check actual production availability and remaining capacity before posting.

## Submission

Title: Show HN: Practice 180 days of startup cash decisions in 15 minutes

URL: https://goodbye.help/simulator

Suggested first comment (edit into the founder's own voice):

I built Goodbye Startup to explore a simple question: having paying customers is encouraging, but does the business actually cover its costs?

You start with cash, monthly costs and an idea, then make decisions across six stages covering 180 simulated days in about 15 real minutes. DeepSeek proposes scenarios and numerical assumptions; validated TypeScript rules settle cash, customers and revenue. You can inspect the assumptions, compare the settled stage snapshots and download your record. A separate local calculator lets you change price or cost while holding customers fixed.

This is practice, not market research or a success prediction. Deterministic arithmetic doesn't make the AI's conversion/churn assumptions true. The model doesn't handle inventory, receivables, taxes or detailed working capital, so a small recurring-revenue product is a better teaching example than a restaurant or retailer.

One anonymous-browser simulation is free without registration, and there is no checkout. Public inference has a shared limit of 300 attempts per UTC day plus short-window limits, so a burst of visitors may exhaust it. Local mock mode in the repository uses fixtures and no model calls. Text remains in the browser and is sent to DeepSeek for inference; our application stores anonymous numerical state and quota metadata, not the transcript.

I'd value feedback on two things: can you tell which numbers came from assumptions versus settlement, and did the recap suggest a concrete customer test you would actually do next?

Code: https://github.com/liuyewang/goodbye-startup
Method and limitations: https://goodbye.help/how-it-works

## Two-minute demonstration script

1. Open the homepage's explicitly fictional tutor-tool example: $10/month, 22 paying customers, $220 monthly revenue, $1,500 monthly cost. The $1,280 monthly gap needs 128 more paying customers at that unchanged price. This is a teaching calculation, not an actual user's measured business or a promised simulation output.
2. For a full live run, let the viewer enter their own idea and decisions. Don't promise the generated outcome will match the fictional example. A live run spends provider attempts; this document does not authorize an agent to run it. For a recorded demo use local mock mode, keep its fixture banner visible and label it as a mock demonstration.
3. At each stage show settled cash separately from optional AI assumptions. On completion show the historical stage points and open a decision/assumption entry. Missing local text is unavailable, not reconstructed from server numbers.
4. Show the break-even gap and next real-world action. Change only price, then only cost in the local comparison; explain that customers stay fixed and the three-month paths are arithmetic rather than predictions. Export the JSON/text review.
5. End with: which assumption would you test with five potential customers next week?

## Distribution experiment and acceptance

Official [Show HN guidance](https://news.ycombinator.com/showhn.html), checked 2026-11-16: submit a working, personally developed product that people can try, minimize signup barriers, explain it and participate in discussion. Do not solicit votes or comments. This is a launch of the project, not an announcement of a minor update. The author should decide whether the project meets these requirements before posting.

For a first small experiment, post once after final review and availability check, then record date, URL, replies and concrete usability objections. No automated cross-posting, vote solicitation or account creation. HN audience fit and traffic are hypotheses, not guaranteed outcomes. Do not describe missing search hits as proof there have never been prior submissions.

Without new analytics, referrer tracking or application events, starts/completions/comparison rates and HN-attributed conversions are unavailable. Ask willing testers for completion feedback and the single variable they wanted to change; report counts and limitations. Do not infer a completion funnel from request counts, and never collect their business text or export by default. Any later analytics design must preserve the project's privacy contract.

## Pricing experiment proposal — not a sale

The existing full simulation and JSON/text exports stay free. Do not relabel these as a newly paid report. A possible future purchase would need additional defined value, such as a bounded bundle of alternative scenarios with a side-by-side report; historical local comparison alone is already free.

Ask a small set of actual completers what comparison they wanted, why and what they use instead. Only then test an explicit one-time bundle/price hypothesis; record sample size, exact offer and behavior separately from hypothetical willingness to pay. Do not promise a $9–19 price, unlimited runs, PDF delivery or lifetime access. A $5 monthly plan is a subscription. No checkout, entitlement, refund or account change is authorized by this draft. Actual purchasing behavior remains unmeasured.
