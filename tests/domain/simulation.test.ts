import { describe, expect, it } from "vitest";
import {
  createSimulation,
  settleTurn,
  getVerdict,
} from "../../src/domain/simulation/engine";
import {
  ProposalSchema,
  SetupSchema,
} from "../../src/domain/simulation/schema";

const setup = {
  cashCents: 1000000,
  monthlyCostCents: 150000,
  teamSize: 1,
  employment: "part-time" as const,
};
const proposal = {
  visits: 1000,
  signupRate: 0.1,
  paidRate: 0.1,
  monthlyChurn: 0.1,
  priceCents: 1000,
  monthlyCostCents: 150000,
  oneTimeCostCents: 0,
  moraleDelta: -5,
  scenario: "A cautious launch",
  insights: [
    { text: "Test the willingness to pay", metric: "customers" as const },
  ],
  choices: [
    "Interview potential customers",
    "Improve onboarding",
    "Reduce costs",
  ],
};

describe("authoritative simulation", () => {
  it("creates Day 0 without charging future costs", () => {
    const s = createSimulation(setup);
    expect(s.day).toBe(0);
    expect(s.cashCents).toBe(1000000);
    expect(s.runwayMonths).toBeCloseTo(6.6667, 3);
    expect(s.version).toBe(0);
  });
  it("initializes the mentor without secretly advancing the clock", () => {
    const s = settleTurn(createSimulation(setup), proposal);
    expect(s.day).toBe(0);
    expect(s.cashCents).toBe(1000000);
    expect(s.customers).toBe(0);
    expect(s.version).toBe(1);
  });
  it("calculates the first interval independently of model narration", () => {
    const s = settleTurn(
      settleTurn(createSimulation(setup), proposal),
      proposal,
    );
    expect(s.day).toBe(5);
    expect(s.customers).toBe(10);
    expect(s.revenueCents).toBe(10000);
    expect(s.cashCents).toBe(976667);
    expect(s.morale).toBe(75);
  });
  it("ends at day 180 and rejects any additional settlement", () => {
    let s = createSimulation({ ...setup, monthlyCostCents: 0 });
    for (let i = 0; i < 6; i++)
      s = settleTurn(s, { ...proposal, monthlyCostCents: 0 });
    expect(s.day).toBe(180);
    expect(s.status).toBe("completed");
    expect(getVerdict(s)).toBe("viable");
    expect(() => settleTurn(s, proposal)).toThrow();
  });
  it("ends insolvent simulations early without negative cash", () => {
    let s = settleTurn(
      createSimulation({ ...setup, cashCents: 100 }),
      proposal,
    );
    s = settleTurn(s, proposal);
    expect(s.cashCents).toBe(0);
    expect(s.status).toBe("completed");
    expect(getVerdict(s)).toBe("abandon");
  });
  it("represents a non-burning runway as null, never Infinity", () => {
    expect(
      createSimulation({ ...setup, monthlyCostCents: 0 }).runwayMonths,
    ).toBeNull();
  });
  it("rejects hostile or impossible economic inputs", () => {
    for (const change of [
      { signupRate: 2 },
      { monthlyChurn: -0.1 },
      { visits: Infinity },
      { priceCents: -1 },
      { moraleDelta: 999 },
      { cashCents: 999999 },
    ]) {
      expect(ProposalSchema.safeParse({ ...proposal, ...change }).success).toBe(
        false,
      );
    }
    expect(SetupSchema.safeParse({ ...setup, cashCents: NaN }).success).toBe(
      false,
    );
  });
  it("does not mutate prior committed snapshots", () => {
    const original = createSimulation(setup);
    settleTurn(original, proposal);
    expect(original.version).toBe(0);
    expect(original.history).toEqual([]);
  });
});
