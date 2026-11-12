import { expect, it } from "vitest";
import {
  assessSnapshot,
  projectCash,
} from "../../src/domain/simulation/review";
const state = {
  day: 180,
  cashCents: 161700,
  customers: 22,
  revenueCents: 22000,
  monthlyCostCents: 150000,
  morale: 50,
  runwayMonths: 161700 / 128000,
};
it("derives the review from 22 settled customers, not a stale narrative", () => {
  expect(assessSnapshot(state, 1000)).toEqual({
    targetCustomers: 150,
    customerGap: 128,
    monthlyNetCents: -128000,
    runwayMonths: 161700 / 128000,
  });
});
it("changes only price while keeping the authoritative snapshot untouched", () => {
  const before = structuredClone(state);
  expect(assessSnapshot(state, 2000)).toMatchObject({
    targetCustomers: 75,
    customerGap: 53,
    monthlyNetCents: -106000,
  });
  expect(state).toEqual(before);
});
it("handles free pricing, zero costs, surplus and invalid prices", () => {
  expect(assessSnapshot(state, 0).targetCustomers).toBeNull();
  expect(assessSnapshot({ ...state, monthlyCostCents: 0 }, 0)).toMatchObject({
    targetCustomers: 0,
    customerGap: 0,
    runwayMonths: null,
  });
  expect(
    assessSnapshot({ ...state, monthlyCostCents: 10000 }, 1000).customerGap,
  ).toBe(0);
  for (const price of [NaN, Infinity, -1, 0.5, 1000001])
    expect(() => assessSnapshot(state, price)).toThrow("INVALID_PRICE");
});
it("never projects negative cash and labels a fixed monthly arithmetic horizon", () => {
  expect(projectCash(161700, -128000)).toEqual([161700, 33700, 0, 0]);
  expect(projectCash(0, 100)).toEqual([0, 100, 200, 300]);
});
