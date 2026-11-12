import type { Snapshot } from "./schema";

/** Fixed-customer sensitivity only; never mutates simulation authority. */
export function assessSnapshot(
  state: Snapshot,
  priceCents: number,
): {
  targetCustomers: number | null;
  customerGap: number | null;
  monthlyNetCents: number;
  runwayMonths: number | null;
} {
  if (
    !Number.isSafeInteger(priceCents) ||
    priceCents < 0 ||
    priceCents > 1_000_000
  )
    throw new Error("INVALID_PRICE");
  const targetCustomers =
    state.monthlyCostCents === 0
      ? 0
      : priceCents === 0
        ? null
        : Math.ceil(state.monthlyCostCents / priceCents);
  const monthlyNetCents = state.customers * priceCents - state.monthlyCostCents;
  return {
    targetCustomers,
    customerGap:
      targetCustomers === null
        ? null
        : Math.max(0, targetCustomers - state.customers),
    monthlyNetCents,
    runwayMonths:
      monthlyNetCents >= 0 ? null : state.cashCents / -monthlyNetCents,
  };
}

/** Three months at fixed customers, price and cost; no acquisition or churn model. */
export function projectCash(
  cashCents: number,
  monthlyNetCents: number,
): number[] {
  return [0, 1, 2, 3].map((month) =>
    Math.max(0, cashCents + month * monthlyNetCents),
  );
}
