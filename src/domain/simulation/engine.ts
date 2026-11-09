import { ProposalSchema, SetupSchema, SimulationStateSchema, type Proposal, type Setup, type SimulationState, type Snapshot, type Verdict } from './schema';

export const TIMELINE = [0, 5, 90, 120, 150, 180] as const;
const MAX_CASH_CENTS = 1_000_000_000;
function runway(cash: number, revenue: number, cost: number): number | null {
  return cost <= revenue ? null : cash / (cost - revenue);
}
/** Creates an authoritative baseline without spending future funds. */
export function createSimulation(input: Setup): SimulationState {
  const setup = SetupSchema.parse(input);
  return { schemaVersion: 1, version: 0, status: 'running', setup, day: 0, cashCents: setup.cashCents, customers: 0, revenueCents: 0, monthlyCostCents: setup.monthlyCostCents, morale: 80, runwayMonths: runway(setup.cashCents, 0, setup.monthlyCostCents), history: [] };
}
/** Settles bounded assumptions with deterministic, versioned economic rules. */
export function settleTurn(input: SimulationState, candidate: Proposal): SimulationState {
  const state = SimulationStateSchema.parse(input);
  const proposal = ProposalSchema.parse(candidate);
  if (state.status !== 'running' || state.version >= TIMELINE.length) throw new Error('RUN_COMPLETED');
  const day = TIMELINE[state.version];
  let snapshot: Snapshot;
  if (state.version === 0) {
    const { cashCents, customers, revenueCents, monthlyCostCents, morale, runwayMonths } = state;
    snapshot = { day, cashCents, customers, revenueCents, monthlyCostCents, morale, runwayMonths };
  } else {
    const months = (day - state.day) / 30;
    const customers = Math.floor(state.customers * (1 - proposal.monthlyChurn) ** months) + Math.floor(proposal.visits * proposal.signupRate * proposal.paidRate);
    const revenueCents = customers * proposal.priceCents;
    const cashCents = Math.min(MAX_CASH_CENTS, Math.max(0, state.cashCents + Math.round((revenueCents - proposal.monthlyCostCents) * months) - proposal.oneTimeCostCents));
    snapshot = { day, customers, revenueCents, cashCents, monthlyCostCents: proposal.monthlyCostCents, morale: Math.min(100, Math.max(0, state.morale + proposal.moraleDelta)), runwayMonths: runway(cashCents, revenueCents, proposal.monthlyCostCents) };
  }
  return SimulationStateSchema.parse({ ...state, ...snapshot, version: state.version + 1, status: day === 180 || snapshot.cashCents === 0 ? 'completed' : 'running', history: [...state.history, snapshot] });
}
/** Provides a scenario verdict, not a prediction of real business success. */
export function getVerdict(state: SimulationState): Verdict | null {
  if (state.status !== 'completed') return null;
  if (state.cashCents <= 0) return 'abandon';
  return state.revenueCents >= state.monthlyCostCents ? 'viable' : 'revise';
}
