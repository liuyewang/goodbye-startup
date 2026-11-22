import { settleTurn } from "../../domain/simulation/engine";
import { PROMPT_VERSION } from "../ai/prompt";
import {
  generateProposal,
  ProviderError,
  type AiConfig,
  type Usage,
} from "../ai/provider";
import type { TurnInput } from "../http/validation";
import { publicRun, type Repository } from "../storage/repository";
/** Reserves budget before inference; commits only under the original live lease. */
export async function submitTurn(
  repo: Repository,
  hash: string,
  id: string,
  input: TurnInput,
  config: AiConfig,
  limit: number,
): Promise<unknown> {
  const now = Date.now();
  const op = await repo.reserveTurn(
    hash,
    id,
    input.requestId,
    input.expectedVersion,
    now,
    limit,
  );
  if (op.replay)
    return {
      run: publicRun(await repo.getRun(hash, id, Date.now())),
      proposal: null,
      replayed: true,
    };
  const startedAt = performance.now();
  let outcome: ProviderError["outcome"] | "committed" | "state_error" =
    "state_error";
  let usage: Usage | undefined;
  try {
    const run = await repo.getRun(hash, id, Date.now());
    const result = await generateProposal(
      {
        idea: input.idea,
        decision: input.decision,
        history: input.history,
        language: input.language,
        state: publicRun(run).state,
      },
      config,
    );
    usage = result.usage;
    const state = settleTurn(run.state, result.proposal);
    const committed = await repo.commitTurn(
      op,
      state,
      Date.now(),
      result.usage,
    );
    outcome = "committed";
    return {
      run: publicRun(committed),
      proposal: result.proposal,
      replayed: false,
    };
  } catch (error) {
    if (error instanceof ProviderError) {
      outcome = error.outcome;
      usage = error.usage;
    }
    await repo.failTurn(
      op,
      error instanceof Error ? error.message : "AI_UNAVAILABLE",
    );
    throw error;
  } finally {
    if (!config.allowMock) {
      console.info({
        event: "simulation_attempt",
        outcome,
        elapsedMs: Math.round(performance.now() - startedAt),
        model: config.model,
        promptVersion: PROMPT_VERSION,
        ...(usage?.inputTokens == null
          ? {}
          : { inputTokens: usage.inputTokens }),
        ...(usage?.outputTokens == null
          ? {}
          : { outputTokens: usage.outputTokens }),
      });
    }
  }
}
