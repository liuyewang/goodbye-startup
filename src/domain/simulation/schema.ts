import { z } from "zod";

const money = z.number().int().min(0).max(1_000_000_000);
const rate = z.number().min(0).max(1);
export const SetupSchema = z.strictObject({
  cashCents: money.min(100),
  monthlyCostCents: money.max(100_000_000),
  teamSize: z.number().int().min(1).max(50),
  employment: z.enum(["full-time", "part-time"]),
});
export const MetricSchema = z.enum([
  "cash",
  "customers",
  "revenue",
  "cost",
  "runway",
  "morale",
]);
// Model output is an assumption proposal, never an authoritative state.
export const ProposalSchema = z.strictObject({
  visits: z.number().int().min(0).max(1_000_000),
  signupRate: rate,
  paidRate: rate,
  monthlyChurn: rate,
  priceCents: money.max(1_000_000),
  monthlyCostCents: money.max(100_000_000),
  oneTimeCostCents: money.max(100_000_000),
  moraleDelta: z.number().int().min(-20).max(20),
  scenario: z.string().trim().min(1).max(1000),
  insights: z
    .array(
      z.strictObject({
        text: z.string().trim().min(1).max(500),
        metric: MetricSchema,
      }),
    )
    .min(1)
    .max(4),
  choices: z.array(z.string().trim().min(1).max(200)).length(3),
});
export const SnapshotSchema = z.strictObject({
  day: z.number().int().min(0).max(180),
  cashCents: money,
  customers: z.number().int().min(0).max(6_000_000),
  revenueCents: z.number().int().min(0).max(6_000_000_000_000),
  monthlyCostCents: money.max(100_000_000),
  morale: z.number().int().min(0).max(100),
  runwayMonths: z.number().nonnegative().nullable(),
});
export const SimulationStateSchema = SnapshotSchema.extend({
  schemaVersion: z.literal(1),
  version: z.number().int().min(0).max(6),
  status: z.enum(["running", "completed"]),
  setup: SetupSchema,
  history: z.array(SnapshotSchema).max(6),
});
export type Setup = z.infer<typeof SetupSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type Snapshot = z.infer<typeof SnapshotSchema>;
export type SimulationState = z.infer<typeof SimulationStateSchema>;
export type Verdict = "viable" | "revise" | "abandon";
