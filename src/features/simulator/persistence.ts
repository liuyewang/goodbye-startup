import { z } from "zod";
import { ProposalSchema } from "../../domain/simulation/schema";
const PendingSchema = z.object({
  requestId: z.string(),
  expectedVersion: z.number().int().min(0).max(5),
  decision: z.string().max(2000),
});
const TurnSchema = z.object({
  version: z.number().int().min(1).max(6),
  day: z.number().int().min(0).max(180),
  decision: z.string().max(2000),
  proposal: ProposalSchema.nullable(),
});
export const TranscriptSchema = z.object({
  schemaVersion: z.literal(1),
  runId: z.string(),
  idea: z.string().max(2000),
  turns: z.array(TurnSchema).max(6),
  pending: PendingSchema.nullable(),
});
export type Transcript = z.infer<typeof TranscriptSchema>;
type StoragePort = Pick<Storage, "getItem" | "setItem">;
const key = (id: string) => "gs_transcript_v1_" + id;
const recoveryKey = (id: string) => "gs_transcript_recovery_" + id;
const recoveryArchiveKey = (id: string) => "gs_transcript_recovery_v2_" + id;
const turnKey = (id: string, version: number) => `${key(id)}_turn_${version}`;
/** Merge only text: this function never reconstructs authoritative game state. */
export function mergeTranscripts(
  existing: Transcript | null,
  incoming: Transcript,
  clearedRequestId?: string,
): Transcript {
  if (existing?.runId !== incoming.runId) existing = null;
  const turns = new Map<number, Transcript["turns"][number]>();
  for (const turn of [...incoming.turns, ...(existing?.turns ?? [])]) {
    const prior = turns.get(turn.version);
    if (!prior?.proposal || turn.proposal) turns.set(turn.version, turn);
  }
  const ordered = [...turns.values()]
    .sort((a, b) => a.version - b.version)
    .slice(-6);
  const pending = incoming.pending ?? existing?.pending ?? null;
  return {
    ...incoming,
    idea: incoming.idea || existing?.idea || "",
    turns: ordered,
    pending:
      pending &&
      pending.requestId !== clearedRequestId &&
      pending.expectedVersion >= (ordered.at(-1)?.version ?? 0)
        ? pending
        : null,
  };
}
/** Full proposals and replay-only decisions use separate immutable slots. */
export function loadTranscript(
  id: string,
  storage: StoragePort,
): {
  data: Transcript | null;
  warning: boolean;
  recovery: string[];
  damaged: boolean;
} {
  let warning = false;
  let damaged = false;
  let data: Transcript | null = null;
  const recovery = new Set<string>();
  try {
    const raw = storage.getItem(key(id));
    if (raw !== null) {
      try {
        if (raw.length > 100000) throw Error("too large");
        data = TranscriptSchema.parse(JSON.parse(raw));
        if (data.runId !== id) throw Error("wrong run");
      } catch {
        data = null;
        recovery.add(raw);
        damaged = true;
        warning = true;
      }
    }
    const previous = storage.getItem(recoveryKey(id));
    if (previous !== null) recovery.add(previous);
    const archive = storage.getItem(recoveryArchiveKey(id));
    if (archive !== null) {
      try {
        for (const copy of z.array(z.string()).parse(JSON.parse(archive)))
          recovery.add(copy);
      } catch {
        recovery.add(archive);
        warning = true;
      }
    }
    for (let version = 1; version <= 6; version++) {
      const slot = turnKey(id, version);
      for (const candidate of [slot, slot + "_decision"]) {
        const rawTurn = storage.getItem(candidate);
        if (rawTurn === null) continue;
        try {
          if (rawTurn.length > 20000) throw Error("too large");
          const turn = TurnSchema.parse(JSON.parse(rawTurn));
          if (turn.version !== version) throw Error("wrong version");
          const base = data ?? {
            schemaVersion: 1 as const,
            runId: id,
            idea: "",
            turns: [],
            pending: null,
          };
          data = mergeTranscripts(base, { ...base, turns: [turn] });
          break;
        } catch {
          warning = true;
        }
      }
    }
  } catch {
    warning = true;
  }
  return { data, warning, recovery: [...recovery], damaged };
}
/** Index identifies the last local record independently of cookies or a deleted server row. */
export function readLastRun(storage: StoragePort): string | null {
  try {
    const id = storage.getItem("gs_transcript_last_run");
    return id && id.length <= 100 ? id : null;
  } catch {
    return null;
  }
}
/** Immutable per-version slots protect text even if two tab metadata writes interleave. */
export function saveTranscript(
  data: Transcript,
  storage: StoragePort,
  clearedRequestId?: string,
): boolean {
  try {
    const prior = loadTranscript(data.runId, storage);
    if (prior.damaged)
      storage.setItem(
        recoveryArchiveKey(data.runId),
        JSON.stringify(prior.recovery),
      );
    const merged = TranscriptSchema.parse(
      mergeTranscripts(prior.data, data, clearedRequestId),
    );
    for (const turn of merged.turns) {
      const slot =
        turnKey(data.runId, turn.version) + (turn.proposal ? "" : "_decision");
      if (storage.getItem(slot) === null)
        storage.setItem(slot, JSON.stringify(turn));
    }
    storage.setItem(key(data.runId), JSON.stringify(merged));
    storage.setItem("gs_transcript_last_run", data.runId);
    return true;
  } catch {
    return false;
  }
}
/** Legacy saves are export-only and remain untouched. */
export function readLegacy(storage: StoragePort): string | null {
  try {
    return (
      storage.getItem("gs_game_state") ??
      storage.getItem("goodbye-startup-state")
    );
  } catch {
    return null;
  }
}
/** Download locally without uploading the transcript. */
export function downloadRecord(value: unknown, name: string): void {
  downloadFile(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    name,
  );
}

/** Export local text verbatim, including malformed saves. */
export function downloadText(text: string, name: string): void {
  downloadFile(new Blob([text], { type: "text/plain;charset=utf-8" }), name);
}

function downloadFile(file: Blob, name: string): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
