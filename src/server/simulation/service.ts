import { settleTurn } from "../../domain/simulation/engine";
import { generateProposal, type AiConfig } from "../ai/provider";
import type { TurnInput } from "../http/validation";
import { Repository } from "../storage/repository";
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
  const run = await repo.getRun(hash, id, Date.now());
  if (op.replay) return { run, proposal: null, replayed: true };
  try {
    const result = await generateProposal(
      { ...input, state: run.state },
      config,
    );
    const state = settleTurn(run.state, result.proposal);
    await repo.commitTurn(op, state, Date.now(), result.usage);
    return {
      run: await repo.getRun(hash, id, Date.now()),
      proposal: result.proposal,
      replayed: false,
    };
  } catch (error) {
    await repo.failTurn(
      op,
      error instanceof Error ? error.message : "AI_UNAVAILABLE",
    );
    throw error;
  }
}
