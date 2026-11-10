# Validate Your Startup Idea

Canonical: https://goodbye.help/guides/startup-idea-validation
Updated: 2026-11-10

A useful validation plan asks what evidence would change your decision. Simulation helps organize assumptions; it cannot prove that people will buy.

## What simulation can and cannot validate

A startup simulator can expose how assumptions interact; it cannot establish that customers want a product. Use it before an interview, prototype or clearly described offer to decide what evidence to collect. The following invented cases use the public engine, not customer observations. All cover simulated Day 0 to Day 5 (1/6 month); real use of the six-stage simulator takes about 15 minutes. Day 0 preserves setup cash and zero customers. Every case uses one part-time founder, 10% signup, 10% paid conversion, 10% monthly churn, $10 monthly price, $1,500 monthly cost and zero morale change. There are initially no customers to retain. Visits are totals for the five-day interval. Money is calculated in cents with JavaScript Math.round; the displayed balances are rounded to two dollar decimals.

## Case 1: Weak demand

Starting cash: $10,000. Interval visits: 100. One-time cost: $0. Paying customers: 1. Monthly revenue: $10. Cash after Day 5: $9,751.67. Calculation: floor(100 × 0.10 × 0.10) = 1 customer; 1,000,000 + round((1,000 − 150,000) / 6) = 975,167 cents. This is low acquisition under chosen assumptions, not proof of weak real demand. Next experiment: ask a narrowly defined customer group about a recent problem and its current workaround, then offer a transparent prototype or commitment request. Before starting, define the group, observation window, budget and decision threshold; record behavior and refusals. Replace conversion guesses with observed denominators.

## Case 2: Expensive acquisition

Starting cash: $10,000. Interval visits: 1,000. One-time cost: $3,000, assumed entirely to be acquisition spending. Paying customers: 10. Monthly revenue: $100. Cash after Day 5: $6,766.67. Calculation: floor(1,000 × 0.10 × 0.10) = 10 customers; 1,000,000 + round((10,000 − 150,000) / 6) − 300,000 = 676,667 cents. Hypothetical acquisition cost is $3,000 / 10 = $300 per new paying customer. Price alone cannot establish payback or lifetime value: margin and retention still matter. Next experiment: measure one channel with a predefined spending ceiling and attribution window; distinguish visits, signups and new paying customers. Include labor and other acquisition costs in the real calculation rather than treating every signup as a sale.

## Case 3: Cash exhausted early

Starting cash: $100. Interval visits: 0. One-time cost: $0. Paying customers: 0. Monthly revenue: $0. Cash after Day 5: $0.00. Calculation: max(0, 10,000 + round((0 − 150,000) / 6)) = 0 cents. The engine completes the scenario at the Day 5 checkpoint and does not simulate a precise insolvency date within that interval. No later stage is reached. This is not a real financial forecast. Next experiment: list dated cash obligations and verified available cash, test a lower-cost prototype, and define a stop condition before committing funds. Add taxes, payment delays, personal obligations and other omitted items to a real budget; do not assume simulated funding exists.

## Define customer, problem and alternative

Describe a narrow customer group, a recent problem and how it is solved today. Ask about actual behavior rather than whether someone likes your idea.

## Choose one falsifiable assumption

It might be willingness to pay, access to a channel or repeat use. Define your test, observation window and stopping condition before running it. Thresholds should fit your context, not a generic signup target.

## Run the smallest informative test

An interview, transparent landing page or prototype can test different questions. Explain what exists today. Measure commitments and behavior rather than treating every email signup as a future customer.

## Use the simulation as preparation

One run covers 180 simulated days in about 15 real minutes. Record the assumptions that drive its outcome, then test those outside the simulator.

## Sources

- [SBA: Plan your business](https://www.sba.gov/counseling/plan-your-business/)

- [Goodbye Startup: versioned calculation rules (hypothetical examples)](https://github.com/liuyewang/goodbye-startup/blob/d07cd6e19a38dd54728af6a5b3a69269b89e2a07/src/domain/simulation/engine.ts)
