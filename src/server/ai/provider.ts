import { z } from "zod";
import {
  ProposalSchema,
  type Proposal,
  type SimulationState,
} from "../../domain/simulation/schema";
import { TIMELINE } from "../../domain/simulation/engine";
import { readBounded } from "../http/validation";
import { PROMPT_VERSION, SYSTEM_PROMPT } from "./prompt";
export type AiInput = {
  idea: string;
  decision: string;
  history: { role: "user" | "assistant"; content: string }[];
  language: "en" | "zh";
  state: SimulationState;
};
export type AiConfig = {
  mode: string;
  apiKey?: string;
  model: string;
  allowMock: boolean;
};
export type Usage = {
  promptVersion: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
};
export type GeneratedProposal = { proposal: Proposal; usage: Usage };
export class ProviderError extends Error {
  constructor(
    code:
      | "AI_UNAVAILABLE"
      | "AI_TIMEOUT"
      | "AI_INVALID_RESPONSE"
      | "SERVICE_UNAVAILABLE",
    readonly outcome:
      | "provider_config"
      | "provider_auth"
      | "provider_rate_limited"
      | "provider_http_error"
      | "provider_network_error"
      | "provider_timeout"
      | "invalid_response",
    readonly usage?: Usage,
  ) {
    super(code);
  }
}
const TokenCountSchema = z.number().int().nonnegative();
const UsageEnvelopeSchema = z.object({ usage: z.unknown().optional() });
const ReportedUsageSchema = z.object({
  prompt_tokens: TokenCountSchema.optional().catch(undefined),
  completion_tokens: TokenCountSchema.optional().catch(undefined),
});
const ValidUsageSchema = z
  .object({
    prompt_tokens: TokenCountSchema,
    completion_tokens: TokenCountSchema,
  })
  .optional();
const ChoiceEnvelopeSchema = z.object({
  choices: z
    .array(
      z.object({
        finish_reason: z.literal("stop"),
        message: z.object({ content: z.string().min(1) }),
      }),
    )
    .min(1),
});
/** Local deterministic fixture. Production cannot enable this path. */
function mock(input: AiInput): GeneratedProposal {
  const zh = input.language === "zh";
  return {
    proposal: ProposalSchema.parse({
      visits: 1000 + input.state.version * 400,
      signupRate: 0.1,
      paidRate: 0.1,
      monthlyChurn: 0.05,
      priceCents: 2000,
      monthlyCostCents: input.state.setup.monthlyCostCents,
      oneTimeCostCents: 0,
      moraleDelta: -2,
      scenario: zh
        ? "早期用户愿意尝试，但付费意愿仍需验证。"
        : "Early users are curious, but willingness to pay still needs testing.",
      insights: [
        {
          text: zh
            ? "通过访谈验证最紧迫的需求。"
            : "Interview customers to test their most urgent need.",
          metric: "customers",
        },
      ],
      choices: zh
        ? ["访谈潜在用户", "改善首次使用体验", "减少固定支出"]
        : [
            "Interview potential customers",
            "Improve onboarding",
            "Reduce fixed costs",
          ],
    }),
    usage: {
      promptVersion: PROMPT_VERSION,
      model: "local-fixture",
      inputTokens: 0,
      outputTokens: 0,
    },
  };
}
/** One bounded provider call. Invalid output never advances the simulation. */
export async function generateProposal(
  input: AiInput,
  config: AiConfig,
  fetcher: typeof fetch = fetch,
  timeoutMs = 45_000,
): Promise<GeneratedProposal> {
  if (config.mode === "mock") {
    if (!config.allowMock)
      throw new ProviderError("SERVICE_UNAVAILABLE", "provider_config");
    return mock(input);
  }
  if (config.mode !== "deepseek" || !config.apiKey || !config.model)
    throw new ProviderError("SERVICE_UNAVAILABLE", "provider_config");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.model,
          response_format: { type: "json_object" },
          max_tokens: 4096,
          stream: false,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: JSON.stringify({
                ...input,
                nextDay: TIMELINE[input.state.version],
                promptVersion: PROMPT_VERSION,
              }),
            },
          ],
        }),
      },
    );
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      const outcome =
        response.status === 401 || response.status === 403
          ? "provider_auth"
          : response.status === 429
            ? "provider_rate_limited"
            : "provider_http_error";
      throw new ProviderError("AI_UNAVAILABLE", outcome);
    }
    let usage: Usage | undefined;
    try {
      const raw: unknown = JSON.parse(await readBounded(response.body, 131072));
      const rawUsage = UsageEnvelopeSchema.parse(raw).usage;
      const measured = ReportedUsageSchema.safeParse(rawUsage).data;
      usage = {
        promptVersion: PROMPT_VERSION,
        model: config.model,
        inputTokens: measured?.prompt_tokens ?? null,
        outputTokens: measured?.completion_tokens ?? null,
      };
      ValidUsageSchema.parse(rawUsage);
      const parsed = ChoiceEnvelopeSchema.parse(raw);
      return {
        proposal: ProposalSchema.parse(
          JSON.parse(parsed.choices[0].message.content),
        ),
        usage,
      };
    } catch {
      throw new ProviderError("AI_INVALID_RESPONSE", "invalid_response", usage);
    }
  } catch (error) {
    if (controller.signal.aborted)
      throw new ProviderError("AI_TIMEOUT", "provider_timeout");
    if (error instanceof ProviderError) throw error;
    throw new ProviderError("AI_UNAVAILABLE", "provider_network_error");
  } finally {
    clearTimeout(timer);
  }
}
