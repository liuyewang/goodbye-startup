import { z } from "zod";
import {
  ProposalSchema,
  SimulationStateSchema,
} from "../../domain/simulation/schema";
export const RunSchema = z.object({
  id: z.string(),
  state: SimulationStateSchema,
  expiresAt: z.number(),
});
export const SessionSchema = z.object({
  used: z.boolean(),
  attempts: z.number(),
  runId: z.string().nullable(),
  expired: z.boolean(),
  eligibleAt: z.number().nullable(),
  timeZone: z.string().optional(),
});
export const BootstrapSchema = z.object({
  session: SessionSchema,
  run: RunSchema.nullable(),
  ready: z.boolean(),
  mode: z.string(),
});
export const TurnResultSchema = z.object({
  run: RunSchema,
  proposal: ProposalSchema.nullable(),
  replayed: z.boolean(),
});
export type Run = z.infer<typeof RunSchema>;
export type Bootstrap = z.infer<typeof BootstrapSchema>;
export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly requestId?: string,
  ) {
    super(code);
  }
}
const ErrorEnvelope = z.object({
  code: z.string().min(1),
  requestId: z.string().optional(),
});
const SuccessEnvelope = z.object({ data: z.unknown() });

/** Validates server envelopes; a network error keeps the operation ID for safe replay. */
export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  method = "GET",
  body?: unknown,
  timeoutMs = 15_000,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  let payload: unknown;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    payload = await response.json();
  } catch {
    throw new ApiError(
      controller.signal.aborted ? "CLIENT_TIMEOUT" : "NETWORK",
    );
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    const error = ErrorEnvelope.safeParse(payload);
    if (!error.success) throw new ApiError("NETWORK");
    throw new ApiError(error.data.code, error.data.requestId);
  }
  const envelope = SuccessEnvelope.safeParse(payload);
  const result = envelope.success && schema.safeParse(envelope.data.data);
  if (!result || !result.success) throw new ApiError("NETWORK");
  return result.data;
}

/** Trim oldest context by both characters and UTF-8 bytes; preserve the latest decision. */
export function fitTurnHistory(
  input: import("../../server/http/validation").TurnInput,
): import("../../server/http/validation").TurnInput {
  const result = { ...input, history: input.history.slice(-12) };
  while (
    result.history.length &&
    (result.history.reduce((n, m) => n + m.content.length, 0) > 12000 ||
      new TextEncoder().encode(JSON.stringify(result)).byteLength > 32768)
  )
    result.history.shift();
  return result;
}

/** The device supplies only its named zone; the server supplies time and entitlement. */
export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
export function sessionPath(): string {
  return `/api/session?timeZone=${encodeURIComponent(deviceTimeZone())}`;
}
