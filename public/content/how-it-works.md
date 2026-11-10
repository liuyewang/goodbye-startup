# How It Works

Canonical: https://goodbye.help/how-it-works
Updated: 2026-11-10

How It Works

Six stages, one simulation. All days are simulated; real use takes about 15 minutes.

All days are simulated; real use takes about 15 minutes.

01

Establish the baseline

Simulated Day 0. All days are simulated; real use takes about 15 minutes.

Enter idea, cash, monthly costs, team and commitment. The first AI reply introduces the scenario without charging future costs.

02

Test demand

Simulated Day 5. All days are simulated; real use takes about 15 minutes.

Choose a demand experiment; code settles cash and customer changes for the interval.

03

Explore launch

Simulated Day 90. All days are simulated; real use takes about 15 minutes.

AI proposes visits, conversion, price and costs. These are assumptions, not research findings.

04

Observe retention

Simulated Day 120. All days are simulated; real use takes about 15 minutes.

Retention compounds monthly churn; visits and conversion assumptions determine new paying customers.

05

Adjust spending

Simulated Day 150. All days are simulated; real use takes about 15 minutes.

Compare monthly revenue and cost, then choose an action. Bankruptcy ends the scenario early.

06

Review the outcome

Simulated Day 180. All days are simulated; real use takes about 15 minutes.

Review a rule-based outcome, inspect the timeline and export it. It cannot predict real success.

What the model calculates

AI proposes assumptions; code controls settlement and termination.

Time and initialization

Stages are simulated Days 0, 5, 90, 120, 150 and 180; real use takes about 15 minutes. The first successful AI reply initializes Day 0 without charging costs or acquiring customers. Later interval months = (new day − previous day) / 30.

Paying customers and retention

Retained customers = floor(previous customers × (1 − monthly churn)^interval months). New paying customers = floor(interval visits × signup rate × paid conversion rate). Add these two integers; visits are an interval total, not a monthly rate.

Revenue and cash, in integer cents

Monthly revenue = paying customers × price per month. Cash = clamp(previous cash + Math.round((monthly revenue − monthly cost) × interval months) − one-time cost, 0, 1,000,000,000 cents). Retention is applied first; the new monthly revenue is treated as constant across the whole interval. This is a simplification, not accounting.

Runway and scenario outcome

Runway months = cash / (monthly cost − monthly revenue) when net burn is positive; otherwise the UI shows no net burn. Cash reaching zero ends the simulation early. At Day 180, positive cash with revenue covering cost is viable within the model; positive cash below break-even means revise. Zero cash means abandon the simulated scenario, not a recommendation about a real business.

A reproducible Day 5 example

Hypothetical inputs: $10,000 starting cash, $1,500 monthly cost, zero customers; after Day 0 use 1,000 interval visits, 10% signup, 10% paid conversion, 10% monthly churn, $10 monthly price and no one-time cost. The five-day interval is 1/6 month. Paying customers = 10; monthly revenue = $100; cash = $9,766.67; runway is about 6.98 months. The calculation uses JavaScript Math.round for integer cents (exact half-cent ties round toward positive infinity). These are invented inputs, not observed conversion benchmarks.

Scope and limitations

AI proposes assumptions; validated code settles them. The model omits taxes, receivables, financing, uncertainty distributions and live market research. It approximates interval revenue and retention, and does not simulate customer-by-customer billing. Team size and commitment provide AI context rather than directly changing arithmetic. Test demand outside the simulator.

Calculation source and revision

https://github.com/liuyewang/goodbye-startup/blob/d07cd6e19a38dd54728af6a5b3a69269b89e2a07/src/domain/simulation/engine.ts

Method reviewed: 2026-11-10. Worked examples are hypothetical, not customer results.

Turn the scenario’s critical assumptions into real-world tests before committing resources.
